import {
  map
} from './map.js';
import {
  animSequences
} from './animations.js';
import {
  scriptedActions,
  gameScript,
} from './scripts.js';

// constants
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const lateralPadding = 400;
const offscreenWidth = lateralPadding + 1200;
const offscreenHeight = 600;
const zPositionLimit = Math.min(offscreenWidth / screenWidth, offscreenHeight / screenHeight);
const tileWidth = 50;
const tileHeight = 50;
const tilesPerHeight = parseInt(screenHeight / tileHeight);
const tilesPerScreenWidth = parseInt(screenWidth / tileWidth);
const tilesPerOffscreenWidth = parseInt(offscreenWidth / tileWidth);
const tilesPerOffscreenHeight = (offscreenHeight / tileHeight);
const shipFrameWidth = 150;
const shipFrameHeight = 150;

// game parameters
const maxBullets = 500;
const fireDelay = 50;
const framePeriod = 1000.0 / 12;
const maxAssets = 3;
const renderPeriod = 1000.0 / 50;
const logicPeriod = 1000.0 / 50;
const HUDPeriod = 1000.0 / 5;
const collisionCheckPeriod = 1000 / 10;
const collisionScale = 0.2;
const maxEnergy = 100;


// low level interfaces
let mapRenderCanvas;
let entityRenderCanvas;
let HUDRenderCanvas;
let debugRenderCanvas;
let entitiesCtx;
let mapCtx;
let HUDCtx;
const mapCanvases = new Array(2);
const mapCtxes = new Array(2);
let requestUpdate;
const debugLines = [];
let debugEnabled = false;
let debugDestination;
let debugCtx;
let effectsRenderCanvas;
let effectsCtx;

// game state
let scriptCursor = 0;
let currentScripts;
let mapPosition;
let zPosition;
let keys;
let fireOnNext;
let lastFire;
let lastCollisionCheck;
let loaded;
let lastRender;
let lastLogic;
let lastHUD;
let lastFrameChange;
let images;
let mapLength;
let ship;
let enemies;
let sideOffset;
let paused;
let bottomOffscreen;
let offscreensPositions;
let enemySectors;
let friendlySectors;
let idCounter = 0;
let localPhase = 0;

// debug
let debugTopOffscreen;
let debugBottomOffscreen;

// init
function initState() {
  zPosition = 1;
  currentScripts = [];
  mapPosition = (screenHeight * zPosition) / 2;
  fireOnNext = false;
  lastFire = null;
  lastCollisionCheck = null;
  loaded = 0;
  lastRender = null;
  lastLogic = null;
  lastHUD = null;
  lastFrameChange = null;
  images = {};
  mapLength = map.length * tileHeight;
  enemies = [];
  sideOffset = 0;
  paused = false;
  bottomOffscreen = 0;
  offscreensPositions = null;
  enemySectors = initSectors();
  friendlySectors = initSectors();
}

function initSectors() {
  let sectors = [];
  for(let i = 0 ; i < 10 ; i ++) {
    sectors[i] = []
    for(let j = 0 ; j < 10 ; j++) {
      sectors[i][j] = {};
    }
  }
  return sectors;
}

function reset() {
  // debug
  debugTopOffscreen = document.getElementById('top-offscreen');
  debugBottomOffscreen = document.getElementById('bottom-offscreen');
  debugTopOffscreen.width = offscreenWidth / 8;
  debugTopOffscreen.height = offscreenHeight / 8;
  debugBottomOffscreen.width = offscreenWidth / 8;
  debugBottomOffscreen.height = offscreenHeight / 8;
  debugTopOffscreen = debugTopOffscreen.getContext('2d');
  debugBottomOffscreen = debugBottomOffscreen.getContext('2d');
  debugTopOffscreen.fillStyle = '#000';
  debugBottomOffscreen.fillStyle = '#000';
  debugTopOffscreen.strokeStyle = '#f00';
  debugBottomOffscreen.strokeStyle = '#aaf';

  debugDestination = document.getElementById('destination');
  debugDestination.width = screenWidth / 4;
  debugDestination.height = screenHeight / 4;
  debugDestination = debugDestination.getContext('2d');
  debugDestination.fillStyle = '#000';

  // low level stuff
  keys = {};
  mapRenderCanvas = document.getElementById('map-render');
  mapRenderCanvas.width = screenWidth;
  mapRenderCanvas.height = screenHeight;
  mapCtx = mapRenderCanvas.getContext('2d');
  mapCtx.font = 'normal 12pt Helvetica';

  HUDRenderCanvas = document.getElementById('HUD-render');
  HUDRenderCanvas.width = 400;
  HUDRenderCanvas.height = 10;
  HUDCtx = HUDRenderCanvas.getContext('2d');

  debugRenderCanvas = document.getElementById('debug-render');
  debugRenderCanvas.width = screenWidth * 0.2;
  debugRenderCanvas.height = screenHeight;
  debugCtx = debugRenderCanvas.getContext('2d');
  debugCtx.font = 'normal 12pt Helvetica';

  entityRenderCanvas = document.getElementById('entities-render');
  entityRenderCanvas.width = screenWidth;
  entityRenderCanvas.height = screenHeight;
  entitiesCtx = entityRenderCanvas.getContext('2d');

  effectsRenderCanvas = document.getElementById('effects-render');
  effectsRenderCanvas.width = screenWidth;
  effectsRenderCanvas.height = screenHeight;
  effectsCtx = effectsRenderCanvas.getContext('2d');
  effectsCtx.fillStyle = '#f00';

  for(let i = 0 ; i < 2 ; i++) {
    mapCanvases[i] = document.createElement('canvas');
    mapCanvases[i].width = offscreenWidth;
    mapCanvases[i].height = offscreenHeight;
    mapCtxes[i] = mapCanvases[i].getContext('2d');
  }

  requestUpdate = (function() {
    return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      ((callback) => {
        window.setTimeout(callback, 1000 / 60);
      });
    })();
  setEventListeners();

  ship = createPlayerShip();
  for(let i = 0 ; i < ship.bullets.length ; i++) {
    ship.bullets[i] = {
      life: null
    };
  }
  initAutoCruise();
  initState();
  preloadAssets(launchGame);
}


function getDebugMap(width, height) {
  const mapCanvas = document.createElement('canvas');
  const tilePerMapWidth = width / tileWidth;
  const tilePerMapHeight = height / tileHeight;
  mapCanvas.width = width;
  mapCanvas.height = height;
  const mapCtx = mapCanvas.getContext('2d');
  for(let i = 0 ; i < tilePerMapWidth ; i++) {
    for(j = 0 ; j < tilePerMapHeight ; j++) {
      if(i % 2) {
        mapCtx.fillStyle = '#00a';
      }
      else {
        mapCtx.fillStyle = '#080';
      }
      mapCtx.fillRect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);

      mapCtx.fillStyle = '#fff';
      mapCtx.font = 'bold 20pt Helvetica';
      mapCtx.textAlign = 'center';
      mapCtx.fillText(
        '' + (i + j * tilesPerOffscreenWidth),
        i * tileWidth + tileWidth / 2,
        j * tileHeight + tileHeight / 2 + 10
      );
    }
  }
  return mapCanvas;
}

function preloadAssets(callback) {
  function imageLoaded() {
    loaded++;
    if(loaded === maxAssets) {
      callback();
    }
  }
  images.map = new Image();
  images.map.onload = imageLoaded;
  images.map.src = 'images/map.png';
  images.ship = new Image();
  images.ship.onload = imageLoaded;
  images.ship.src = 'images/ship.png';
  images.enemy = new Image();
  images.enemy.onload = imageLoaded;
  images.enemy.src = 'images/enemy.png';
}

function setEventListeners() {
  document.addEventListener('keydown', (event) => {
    keys[event.keyCode] = true;
    if(event.keyCode == 66) {
      genEnemies();
    }
    if(event.keyCode == 68) {
      debugEnabled = !debugEnabled;
      if(debugEnabled) {
        debugRenderCanvas.style.visibility = 'visible';
        debugTopOffscreen.canvas.style.visibility = 'visible';
        debugBottomOffscreen.canvas.style.visibility = 'visible';
        debugDestination.canvas.style.visibility = 'visible';
      }
      else {
        debugRenderCanvas.style.visibility = 'hidden';
        debugTopOffscreen.canvas.style.visibility = 'hidden';
        debugBottomOffscreen.canvas.style.visibility = 'hidden';
        debugDestination.canvas.style.visibility = 'hidden';
      }
    }
    if(event.keyCode == 82) {
      mapPosition = 0;
      enemies = [];
      ship.lives = 4;
    }
    if(event.keyCode == 27) {
      paused = !paused;
      if(!paused) {
        lastLogic = (new Date()).getTime();
      }
    }
    return false;
  });
  document.addEventListener('keyup', (event) => {
    keys[event.keyCode] = false;
    return false;
  });
}

function getNewId() {
  return idCounter++;
}
function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

function getiMin(entity) {
  return clamp(0, 9, Math.floor(entity.x * (10 / screenWidth)));
}
function getiMax(entity) {
  return clamp(0, 9, Math.floor((entity.x + entity.width) * (10 / screenWidth)));
}
function getjMin(entity) {
  return clamp(0, 9, Math.floor(entity.y * (10 / screenHeight)));
}
function getjMax(entity) {
  return clamp(0, 9, Math.floor((entity.y + entity.height) * (10 / screenHeight)));
}

function addEntityToSectors(entity, sectors) {
  const iMin = getiMin(entity);
  const jMin = getjMin(entity);
  const iMax = getiMax(entity);
  const jMax = getjMax(entity);
  for(let i = iMin ; i <= iMax ; i++) {
    for(let j = jMin ; j <= jMax ; j++) {
      sectors[i][j][entity.id] = entity;
    }
  }
}

function removeFromSectors(entity, sectors) {
  const iMin = getiMin(entity);
  const jMin = getjMin(entity);
  const iMax = getiMax(entity);
  const jMax = getjMax(entity);
  for(let i = iMin ; i <= iMax ; i++) {
    for(let j = jMin ; j <= jMax ; j++) {
      delete sectors[i][j][entity.id];
    }
  }
}

function moveEntityInSectors(entity, dx, dy, sectors) {
  const iMin = getiMin(entity);
  const jMin = getjMin(entity);
  const iMax = getiMax(entity);
  const jMax = getjMax(entity);
  const diMin = clamp(0, 9, Math.floor((entity.x + dx) * (10 / screenWidth)));
  const djMin = clamp(0, 9, Math.floor((entity.y + dy) * (10 / screenHeight)));
  const diMax = clamp(0, 9, Math.floor((entity.x + dx + entity.width) * (10 / screenWidth)));
  const djMax = clamp(0, 9, Math.floor((entity.y + dy + entity.height) * (10 / screenHeight)));
  for(let i = iMin ; i <= iMax ; i++) {
    for(let j = jMin ; j <= jMax ; j++) {
      delete sectors[i][j][entity.id] ;
    }
  }
  for(let i = diMin ; i <= diMax ; i++) {
    for(let j = djMin ; j <= djMax ; j++) {
      sectors[i][j][entity.id] = entity;
    }
  }
}

function createBasicEnemy() {
  const newEnemy = {
    type: 'basic',
    life: 0,
    x: 0,
    y: 0,
    // x: screenWidth/2,
    // y: screenHeight/2,
    dx: 0,
    dy: 0,
    width: tileWidth,
    height: tileHeight,
    state: 'idle'
  };
  newEnemy.id = getNewId();
  addEntityToSectors(newEnemy, enemySectors);
  return enemies.push(newEnemy) - 1;
}

function createPlayerShip() {
  return {
    x: 0,
    y: 50,
    dx: 0,
    dy: 0,
    width: 50,
    height: 50,
    bullets: new Array(maxBullets),
    bulletCursor: 0,
    invincible: false,
    autoCruise: true,
    lives: 4,
    energy: maxEnergy,
    animState: 'ship.idle',
    animCursor: 0
  };
}

function genEnemies() {
  for(let i = 0 ; i < 100 ; i++) {
    createBasicEnemy();
  }
}

//    helpers
function ord(string) {
  return string.charCodeAt(0);
}

function debug(line, text) {
  debugLines[line] = text;
}

function drawDebug(targetCtx) {
  targetCtx.fillStyle = '#fff';
  for(let i = 0 ; i < debugLines.length ; i++) {
    targetCtx.fillText(debugLines[i], 10, 20 * i)
  }
}


function fire(ship) {
  ship.bullets[ship.bulletCursor] = {
    x: ship.x,
    y: ship.y - 90,
    width: tileWidth,
    height: tileHeight,
    dx: 0,
    dy: Math.min(ship.dy, 0) - 20,
    life: 0,
    type: 'baseBullet'
  };
  ship.bullets[ship.bulletCursor].id = idCounter++;
  addEntityToSectors(ship.bullets[ship.bulletCursor], friendlySectors);
  ship.bulletCursor = (ship.bulletCursor + 1) % maxBullets;
}

function inputs(dt) {
  const unit = 4;
  const damping = .8;
  if(keys['X'.charCodeAt()]) {
    if(!ship.autoCruise) {
      fireOnNext = true;
    }
  }

  if(keys[37]) {
    ship.dx = -unit ;
    setState(ship, 'ship.turningLeft');
  }
  else if(keys[39]) {
    ship.dx = unit ;
    setState(ship, 'ship.turningRight');
  }
  else if(Math.abs(ship.dx) > 0.1) {
    ship.dx *= damping;
    if(ship.dx > 0) {
      setState(ship, 'ship.backFromRight');
    }
    else {
      setState(ship, 'ship.backFromLeft');
    }
  }
  else {
    ship.dx = 0;
  }
  if(keys[38]) {
    ship.dy = -unit ;
  }
  else if(keys[40]) {
    ship.dy = unit ;
  }
  else if(Math.abs(ship.dy) > 0.1) {
    ship.dy *= damping;
  }
  else {
    ship.dy = 0;
  }
}

function initAutoCruise() {
  ship.autoCruise = true;
  ship.x = entityRenderCanvas.width / 2;
  ship.y = entityRenderCanvas.height + 50;
  ship.dx = 0;
  ship.invincible = true;
}

function die() {
  ship.lives--;
  if(ship.lives > 0) {
    ship.energy = maxEnergy;
    initAutoCruise();
  }
}

function setState(ship, state) {
  if(ship.animState !== state) {
    ship.animCursor = 0;
    ship.animState = state;
  }
}

function getCoordsFromFrame(frame) {
  return {
    x: frame * shipFrameWidth,
    y: 0,
  };
}

function getAnimFrame(ship) {
  let state = ship.animState;
  if(ship.invincible) {
    state += '.invincible';
  }
  const cursor = ship.animCursor;
  let frame;
  if(ship.animCursor < animSequences[state].frames.length) {
    frame = animSequences[state].frames[cursor];
  }
  else {
    frame = animSequences[state].loop[cursor - animSequences[state].frames.length];
  }
  return getCoordsFromFrame(frame);
}

function getMapMovement(dt) {
  return 2 * dt;
}

//    update
function updateEnemies(dt) {
  for(let i = 0 ; i < enemies.length ; i++) {
    const dx = dt * enemies[i].dx;
    const dy = dt * enemies[i].dy;
    moveEntityInSectors(enemies[i], dx, dy, enemySectors);
    enemies[i].x += dx;
    enemies[i].y += dy;
    if(enemies[i].y > entityRenderCanvas.height || enemies[i].x < 0 || enemies[i].x > entityRenderCanvas.width) {
      enemies[i].life = null;
      removeFromSectors(enemies[i], enemySectors);
    }
    if(enemies[i].life === null) {
      enemies.splice(i, 1);
    }
  }
}

function updateAutoCruise(playerData, dt) {
  playerData.y -= 5;
  if(playerData.y < (entityRenderCanvas.height - 100)) {
    playerData.autoCruise = false;
    setTimeout(function() {
      playerData.invincible = false;
    }, 2000);
  }
}

function aabbCollision(a, b) {
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
  );
}

function checkPlayerCollisions(playerData) {
  let isColliding = false;
  for(let i = getiMin(playerData) ; i <= getiMax(playerData) ; i++) {
    for(let j = getjMin(playerData) ; j <= getjMax(playerData) ; j++) {
      for(let entityId in enemySectors[i][j]) {
        if(aabbCollision(playerData, enemySectors[i][j][entityId])) {
          return true;
        }
      }
    }
  }
}

function updatePlayer(playerData, dt) {
  if(checkPlayerCollisions(playerData)) {
    playerData.energy--;
  }
  if(playerData.energy === 0) {
    die();
  }
  const newX = playerData.x + playerData.dx * dt;
  const newY = playerData.y + playerData.dy * dt;
  if(newX > 0 &&
    newX < entityRenderCanvas.width
  ) {
    playerData.x = newX;
  }
  if(newY > 0 && newY < entityRenderCanvas.height) {
    playerData.y = newY;
  }
}

function updateBullets(playerData, dt) {
  for(let i = 0 ; i < playerData.bullets.length ; i++) {
    if(playerData.bullets[i] && playerData.bullets[i].life !== null && playerData.bullets[i].y > 0) {
      const dx = dt * playerData.bullets[i].dx;
      const dy = dt * playerData.bullets[i].dy;
      moveEntityInSectors(playerData.bullets[i], dx, dy, friendlySectors);
      playerData.bullets[i].x += dx;
      playerData.bullets[i].y += dy;
      playerData.bullets[i].life += 1;
    }
    else if(playerData.bullets[i]) {
      removeFromSectors(playerData.bullets[i], friendlySectors);
      playerData.bullets.splice(i, 1);
    }
  }
}

function updateOffscreens() {
  if(offscreensPositions === null) {
    drawInitialMapOffscreens();
  }
  else {
    if(
      (mapPosition - (screenHeight / 2) * zPosition) > (offscreensPositions[bottomOffscreen] + offscreenHeight)
    ) {
      fillOffscreen(bottomOffscreen, offscreensPositions[bottomOffscreen] + 2 * offscreenHeight);
      bottomOffscreen = (bottomOffscreen + 1) % 2;
    }
  }
  debug(1, 'bottomOffscreen : ' + bottomOffscreen);
}

function updateMapPosition(dt) {
  const increment = getMapMovement(dt);
  zPosition = Math.min(zPositionLimit, zPosition + dt * 0.005);
  debug(5, 'zPosition: ' + zPosition);
  const maxMapPosition = (map.length - tilesPerOffscreenHeight) * tileHeight;
  mapPosition = Math.min(mapPosition + increment, maxMapPosition);
  updateOffscreens();
}

function updateFrames() {
  const sequence = animSequences[ship.animState];
  if(sequence.loop) {
    if(ship.animCursor >= sequence.frames.length - 1) {
      ship.animCursor -= sequence.frames.length;
      ship.animCursor = (ship.animCursor + 1) % sequence.loop.length;
      ship.animCursor += sequence.frames.length;
    }
    else {
      ship.animCursor += 1;
    }
  }
  else {
    ship.animCursor = Math.min(ship.animCursor + 1, sequence.frames.length - 1);
  }
}

function debugSectors() {
  const width = screenWidth / 10;
  const height = screenHeight / 10;
  for(let i = 0 ; i < 10; i++) {
    for(let j = 0 ; j < 10 ; j++) {
      const nbEnemies = Object.keys(enemySectors[i][j]).length;
      const nbFriends = Object.keys(friendlySectors[i][j]).length;
      mapCtx.fillStyle = 'rgba(' + nbEnemies + ', 0, 0, 0.5)';
      mapCtx.fillRect(i * width, j* height, width / 2, height / 2);
      mapCtx.fillStyle = 'rgba(0, 0, ' + nbFriends + ', 0.5)';
      mapCtx.fillRect((i + 0.5) * width, (j + 0.5) * height, width / 2, height / 2);
      mapCtx.fillStyle = 'rgb(255, 0, 0)';
      mapCtx.fillText(nbEnemies, i * width, j* height);
      mapCtx.fillStyle = 'rgb(0, 0, 255)';
      mapCtx.fillText(nbFriends, (i + 0.5) * width, (j + 0.5) * height);
      mapCtx.strokeStyle = 'rgb(0, 0, 0)';
      mapCtx.strokeRect(i * width, j* height, width, height);
    }
  }
}

function updateSideOffset(dt) {
  // calculating lateral speed
  let delta = 0;
  const speed = 2;
  if(ship.x < screenWidth / 3) {
    delta = -speed * dt;
  } else if(ship.x > (2 * screenWidth) / 3) {
    delta = speed * dt;
  } else {
      if(sideOffset > 0 && ship.x < screenWidth / 2) {
          delta = -speed / 2 * dt;
      }
      else if(sideOffset < 0 && ship.x > screenWidth / 2) {
          delta = speed / 2 * dt;
      }
  }
  // applying lateral speed
  sideOffset += delta;
  const absoluteOffsetLimit = lateralPadding / 2;
  sideOffset = Math.min(sideOffset, absoluteOffsetLimit);
  sideOffset = Math.max(sideOffset, -absoluteOffsetLimit);
}

function updateDebug() {
  let position = String(mapPosition);
  position = position.substr(0, position.indexOf('.'));
  debug(2, 'position:' + position);
  debug(3, 'bullets:' + ship.bullets.length);
  debug(4, 'enemies:' + enemies.length);
}

function updateScript(dt) {
  // get new stuff
  while(scriptCursor < gameScript.length && mapPosition > gameScript[scriptCursor]) {
    const scriptInfo = scriptedActions[gameScript[scriptCursor + 1]];
    const newSequence = {
      life: 0,
      step: 0,
      sequence: scriptInfo
    };
    newSequence.entity = createBasicEnemy();
    currentScripts.push(newSequence);
    scriptCursor += 2;
  }
  // process current stuff
  let i = 0;
  while(i < currentScripts.length) {
    let currentScript = currentScripts[i];
    if(currentScript.step >= currentScript.sequence.length) {
      currentScripts.splice(i, 1);
    }
    else {
      while(currentScript.step < currentScript.sequence.length &&
        currentScript.life > currentScript.sequence[currentScript.step].time) {
        const currentStep = currentScript.sequence[currentScript.step];
        const setterProperties = Object.keys(currentScript.sequence[currentScript.step].setters);
        if(enemies[currentScript.entity]) {
          for(let j = 0 ; j < setterProperties.length ; j++) {
            const property = setterProperties[j];
            const value = currentStep.setters[property];
            enemies[currentScript.entity][property] = value;
          }
        }
        currentScript.step++;
      }
      currentScript.life += getMapMovement(dt);
      i++;
    }
  }
}

function update(currentTime) {
  if(paused) {
    return;
  }
  checkEnemiesCollisions();
  if(lastLogic === null) {
    lastLogic = currentTime;
    lastFire = lastLogic;
    lastFrameChange = lastLogic;
    return;
  }
  const dt = (currentTime - lastLogic) / (1000 / 60);

  updateScript(dt);

  // fire timer
  if(fireOnNext) {
    if((currentTime - lastFire) > fireDelay) {
      fire(ship);
      fireOnNext = false;
      lastFire = currentTime;
    }
  }

  // frame timer
  if((currentTime - lastFrameChange) > framePeriod) {
    updateFrames()
    lastFrameChange = currentTime;
  }
  
  inputs(dt);
  lastLogic = currentTime;
  if(ship.autoCruise) {
    updateAutoCruise(ship, dt);
  }
  else {
    updatePlayer(ship, dt);
  }
  
  updateBullets(ship, dt);
  updateEnemies(dt);
  updateMapPosition(dt);
  updateSideOffset(dt);
  updateDebug();
}


// drawing

function fillOffscreen(offscreenIndex, position) {
  offscreensPositions[offscreenIndex] = position;
  const verticalOffset = parseInt(position / offscreenHeight) * parseInt(tilesPerOffscreenHeight);

  mapCtxes[offscreenIndex].fillStyle = 'f8f';
  mapCtxes[offscreenIndex].fillRect(0, 0, offscreenWidth, offscreenHeight);
  let tileIndex;
  let tileX;
  let tileY;
  for(let i = 0 ; i < tilesPerOffscreenWidth ; i++) {
    for(let j = 0 ; j < tilesPerOffscreenHeight ; j++) {
      tileIndex = map[j + verticalOffset][i];
      if(tileIndex !== null) {
        tileX = (tileIndex % tilesPerOffscreenWidth) * tileWidth;
        tileY = parseInt(tileIndex / tilesPerOffscreenHeight) * tileHeight;
        mapCtxes[offscreenIndex].drawImage(images.map, tileX, tileY, tileWidth, tileHeight,
        i * tileWidth, j * tileHeight, tileWidth, tileHeight);
      }
    }
  }
}

function drawInitialMapOffscreens() {
  offscreensPositions = [
    null,
    null
  ];
  for(let k = 0 ; k < 2 ; k++) {
    fillOffscreen(k, k * offscreenHeight);
  }
}

function drawMap(targetCtx, debug) {
  targetCtx.save();
  localPhase = parseInt(mapPosition - (screenHeight / 2) * zPosition) % offscreenHeight;
  const visibleRegion = {
    x: (offscreenWidth / 2) + sideOffset - (screenWidth / 2) * zPosition,
    y: localPhase,
    width: screenWidth * zPosition,
    height: screenHeight * zPosition
  };

  const sourceBottom = {
    x: visibleRegion.x,
    y: Math.max(0, offscreenHeight - (visibleRegion.y + visibleRegion.height)),
    width: visibleRegion.width,
  };
  const topHeight = Math.max(0, visibleRegion.y + visibleRegion.height - offscreenHeight);
  sourceBottom.height = visibleRegion.height - topHeight;

  let sourceTop = null;
  if(topHeight !== 0) {
    sourceTop = {
        x: sourceBottom.x,
        width: sourceBottom.width,
        height: topHeight
    };
    sourceTop.y = offscreenHeight - sourceTop.height;
  }
  if (debug) {
    debugTopOffscreen.fillRect(0, 0, debugTopOffscreen.canvas.width, debugTopOffscreen.canvas.height);
    debugBottomOffscreen.fillRect(0, 0, debugBottomOffscreen.canvas.width, debugBottomOffscreen.canvas.height);
    debugBottomOffscreen.drawImage(mapCanvases[bottomOffscreen],
        0, 0, mapCanvases[bottomOffscreen].width, mapCanvases[bottomOffscreen].height,
        0, 0, debugTopOffscreen.canvas.width, debugTopOffscreen.canvas.height);
    debugTopOffscreen.drawImage(mapCanvases[(bottomOffscreen + 1) % 2],
        0, 0, mapCanvases[(bottomOffscreen + 1) % 2].width, mapCanvases[bottomOffscreen].height,
        0, 0, debugBottomOffscreen.canvas.width, debugBottomOffscreen.canvas.height);
  }
  if(sourceTop !== null) {
    let offscreenIndex = bottomOffscreen;
    const topScreenPart = parseInt((sourceTop.height / (sourceTop.height + sourceBottom.height)) * screenHeight);
    targetCtx.drawImage(mapCanvases[offscreenIndex], sourceBottom.x, sourceBottom.y, sourceBottom.width, sourceBottom.height,
        0, topScreenPart, screenWidth, (screenHeight - topScreenPart));

    offscreenIndex = (offscreenIndex + 1) % 2;
    targetCtx.drawImage(mapCanvases[offscreenIndex], sourceTop.x, sourceTop.y, sourceTop.width, sourceTop.height,
        0, 0, screenWidth, topScreenPart);
    if (debug) {
      debugBottomOffscreen.drawImage(mapCanvases[bottomOffscreen],
          sourceTop.x, sourceTop.y, sourceTop.width, sourceTop.height,
          sourceTop.x * .125, sourceTop.y * .125, sourceTop.width * .125, sourceTop.height * .125);
      debugTopOffscreen.drawImage(mapCanvases[(bottomOffscreen + 1) % 2],
          sourceBottom.x, sourceBottom.y, sourceBottom.width, sourceBottom.height,
          sourceBottom.x * .125, sourceBottom.y * .125, sourceBottom.width * .125, sourceBottom.height * .125);

      debugTopOffscreen.strokeRect(sourceTop.x * .125, sourceTop.y * .125, sourceTop.width * .125, sourceTop.height * .125);
      debugBottomOffscreen.strokeRect(sourceBottom.x * .125, sourceBottom.y * .125, sourceBottom.width * .125, sourceBottom.height * .125);

      debugDestination.fillStyle = '#000';
      debugDestination.fillRect(0, 0, screenWidth * .25, screenHeight * .25);
      debugDestination.fillStyle = 'rgba(200, 200, 255, 1)';
      debugDestination.fillRect(0, topScreenPart * .25, screenWidth * .25, (screenHeight - topScreenPart) * .25);
      debugDestination.fillStyle = 'rgba(255, 0, 0, 1)';
      debugDestination.fillRect(0, 0, screenWidth * .25, topScreenPart * .25);
    }
  }
  else {
    targetCtx.drawImage(mapCanvases[bottomOffscreen], sourceBottom.x, sourceBottom.y, sourceBottom.width, sourceBottom.height,
        0, 0, screenWidth, screenHeight);
    if (debug) {
      debugBottomOffscreen.strokeRect(sourceBottom.x * .125, sourceBottom.y * .125, sourceBottom.width * .125, sourceBottom.height * .125);

      debugDestination.fillStyle = '#000';
      debugDestination.fillRect(0, 0, screenWidth * .25, screenHeight * .25);
      debugDestination.fillStyle = 'rgba(200, 200, 255, 0.5)';
      debugDestination.fillRect(0, 0, screenWidth * .25, screenHeight * .25);
    }
  }

  targetCtx.restore();
  if (debug) {
    debugSectors();
  }
}

function drawEnemies(targetCtx) {
  for(let i = 0 ; i < enemies.length ; i++) {
    const enemy = enemies[i];
    targetCtx.save();
    targetCtx.translate(enemy.x, enemy.y);
    if(enemy.state === 'spinning') {
      targetCtx.rotate(mapPosition);
    }
    targetCtx.drawImage(images.enemy, (-images.enemy.width / 2), (-images.enemy.height / 2), images.enemy.width, images.enemy.height);
    targetCtx.restore();
  }
}

function drawEnemyBullets() {
}

function drawFire(fire, targetCtx) {
  if(fire && fire.life !== null) {
    const frameLoop = animSequences[fire.type].loop;
    const coords = {x:0,y:0};
    targetCtx.save();
    targetCtx.translate(fire.x - tileWidth / 2, fire.y - tileHeight / 2);

    targetCtx.drawImage(images.map, coords.x, coords.y, tileWidth, tileHeight,
        0, 0, tileWidth, tileHeight);
    targetCtx.restore();
  }
}

function drawPlayer(targetCtx) {
  const playerFrame = getAnimFrame(ship);
  targetCtx.drawImage(images.ship, playerFrame.x, playerFrame.y, shipFrameWidth, shipFrameHeight,
      (ship.x - shipFrameWidth / 2), (ship.y - shipFrameHeight / 2), shipFrameWidth, shipFrameHeight);
}

function drawPlayerBullets(targetCtx) {
  for(let i = 0 ; i < ship.bullets.length; i++) {
      drawFire(ship.bullets[i], targetCtx);
  }
}

function draw() {            
  drawMap(mapCtx, debugEnabled);
  drawEnemies(mapCtx);
  drawPlayer(mapCtx);
  drawPlayerBullets(mapCtx);
  if(debugEnabled) {
      debugCtx.clearRect(0, 0, debugRenderCanvas.width, debugRenderCanvas.height);
      drawDebug(debugCtx);
  }
}

function checkEnemiesCollisions() {
  enemies.forEach(function(enemy) {
    for(let i = getiMin(enemy) ; i <= getiMax(enemy) ; i++) {
      for(let j = getjMin(enemy) ; j <= getjMax(enemy) ; j++) {
        for(let entityId in friendlySectors[i][j]) {
          if(aabbCollision(enemy, friendlySectors[i][j][entityId])) {
            enemy.state = 'spinning';
          }
        }
      }
    }
  });
}

function drawHUD() {
  HUDCtx.clearRect(0, 0, screenWidth, screenHeight);
  HUDCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  HUDCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  HUDCtx.fillRect(10, 0, ship.energy, 10);
  HUDCtx.strokeRect(10, 0, ship.energy, 10);
  HUDCtx.fillStyle = 'rgb(255, 255, 255)';
  HUDCtx.font = 'bold 10pt Helvetica';
  HUDCtx.fillText('lives : ' + ship.lives, 150, 10);
  if(paused) {
    HUDCtx.fillStyle = 'rgb(255, 255, 255)';
    HUDCtx.font = 'bold 72pt Helvetica';
    HUDCtx.fillText('Paused', screenWidth / 2, screenHeight / 2);
  }
}

function loop(frameTime) {
  if(lastRender === null) {
    lastRender = frameTime;
    lastCollisionCheck = frameTime;
    lastHUD = frameTime;
  }

  update(frameTime);
  lastRender = frameTime;
  
  draw();

  if((frameTime - lastHUD) > HUDPeriod) {
    drawHUD();
    lastHUD = frameTime;
  }

  requestUpdate(loop);
}

function launchGame() {
  requestUpdate(loop);
}

reset();

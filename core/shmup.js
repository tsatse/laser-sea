(function() {
    window.onload = function() {
        // constants
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        var lateralPadding = 400;
        var offscreenWidth = lateralPadding + 1200;
        var offscreenHeight = 600;
        var zPositionLimit = Math.min(offscreenWidth / screenWidth, offscreenHeight / screenHeight);
        var tileWidth = 50;
        var tileHeight = 50;
        var tilesPerHeight = parseInt(screenHeight / tileHeight);
        var tilesPerScreenWidth = parseInt(screenWidth / tileWidth);
        var tilesPerOffscreenWidth = parseInt(offscreenWidth / tileWidth);
        var tilesPerOffscreenHeight = (offscreenHeight / tileHeight);
        var shipFrameWidth = 150;
        var shipFrameHeight = 150;

        // assets
        var map = [
            [1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,     0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 1],
            [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0,     0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
            [3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0,     0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3],
            [4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0,     0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],
            [5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0,     0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5],
            [6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0,     0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6, 0, 6],
            [7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0,     0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7, 0, 7],
            [8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0,     0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8, 0, 8],
            [9, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,     0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 9],
            [9, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,     0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 9],
            [9, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,     0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 9],
            [9, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0,     0, 9, 0, 8, 0, 7, 0, 6, 0, 5, 0, 4, 0, 3, 0, 2, 0, 9],

            [1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,     1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 1],
            [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,     1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
            [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1,     1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3],
            [4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1,     1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4, 1, 4],
            [5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1,     1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5],
            [6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1,     1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6],
            [7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1,     1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7, 1, 7],
            [8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1,     1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8, 1, 8],
            [9, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,     1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 9],
            [9, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,     1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 9],
            [9, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,     1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 9],
            [9, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8, 1, 9, 1,     1, 9, 1, 8, 1, 7, 1, 6, 1, 5, 1, 4, 1, 3, 1, 2, 1, 9],

            [1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,     2, 9, 2, 8, 2, 7, 2, 6, 2, 5, 2, 4, 2, 3, 2, 2, 2, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,     2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2,     2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3],
            [4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2,     2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4],
            [5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2,     2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5, 2, 5],
            [6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2,     2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6],
            [7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2,     2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7, 2, 7],
            [8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2,     2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8, 2, 8],
            [9, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,     2, 9, 2, 8, 2, 7, 2, 6, 2, 5, 2, 4, 2, 3, 2, 2, 2, 9],
            [9, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,     2, 9, 2, 8, 2, 7, 2, 6, 2, 5, 2, 4, 2, 3, 2, 2, 2, 9],
            [9, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,     2, 9, 2, 8, 2, 7, 2, 6, 2, 5, 2, 4, 2, 3, 2, 2, 2, 9],
            [9, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 2, 7, 2, 8, 2, 9, 2,     2, 9, 2, 8, 2, 7, 2, 6, 2, 5, 2, 4, 2, 3, 2, 2, 2, 9],

            [1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3,     3, 9, 3, 8, 3, 7, 3, 6, 3, 5, 3, 4, 3, 3, 3, 2, 3, 1],
            [2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3,     3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,     3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3,     3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
            [5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3,     3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5],
            [6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3,     3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6, 3, 6],
            [7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3,     3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7, 3, 7],
            [8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3,     3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8, 3, 8],
            [9, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3,     3, 9, 3, 8, 3, 7, 3, 6, 3, 5, 3, 4, 3, 3, 3, 2, 3, 9],
            [9, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3,     3, 9, 3, 8, 3, 7, 3, 6, 3, 5, 3, 4, 3, 3, 3, 2, 3, 9],
            [9, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3,     3, 9, 3, 8, 3, 7, 3, 6, 3, 5, 3, 4, 3, 3, 3, 2, 3, 9],
            [9, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 3, 8, 3, 9, 3,     3, 9, 3, 8, 3, 7, 3, 6, 3, 5, 3, 4, 3, 3, 3, 2, 3, 9],

            [1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,     4, 9, 4, 8, 4, 7, 4, 6, 4, 5, 4, 4, 4, 3, 4, 2, 4, 1],
            [2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4,     4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 2],
            [3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4,     4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,     4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4,     4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5],
            [6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4,     4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6, 4, 6],
            [7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4,     4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7, 4, 7],
            [8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4,     4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8, 4, 8],
            [9, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,     4, 9, 4, 8, 4, 7, 4, 6, 4, 5, 4, 4, 4, 3, 4, 2, 4, 9],
            [9, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,     4, 9, 4, 8, 4, 7, 4, 6, 4, 5, 4, 4, 4, 3, 4, 2, 4, 9],
            [9, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,     4, 9, 4, 8, 4, 7, 4, 6, 4, 5, 4, 4, 4, 3, 4, 2, 4, 9],
            [9, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 4, 8, 4, 9, 4,     4, 9, 4, 8, 4, 7, 4, 6, 4, 5, 4, 4, 4, 3, 4, 2, 4, 9]
        ];

        var animSequences = {
            'ship.idle': {
                loop: [1, 3],
                frames: []
            },
            'ship.idle.invincible': {
                loop: [0, 2],
                frames: []
            },
            'ship.turningLeft': {
                loop: [9, 10, 11],
                frames: [2, 3, 4, 5, 6]
            },
            'ship.turningLeft.invincible': {
                loop: [25, 26, 27],
                frames: [2, 3, 4, 5, 6]
            },
            'ship.turningRight': {
                loop: [4, 5, 6],
                frames: [7, 8, 9, 10, 11]
            },
            'ship.turningRight.invincible': {
                loop: [22, 23, 24],
                frames: [7, 8, 9, 10, 11]
            },
            'ship.backFromLeft': {
                loop: [1, 0],
                frames: [6, 5, 4, 1, 0]
            },
            'ship.backFromLeft.invincible': {
                loop: [20, 21],
                frames: [6, 5, 4, 1, 0]
            },
            'ship.backFromRight': {
                loop: [1, 0],
                frames: [11, 10, 9, 1, 0]
            },
            'ship.backFromRight.invincible': {
                loop: [20, 21],
                frames: [11, 10, 9, 1, 0]
            },
            'baseBullet': {
                loop: [15, 16],
                frames: []
            }
        };

        var scriptedActions = {
            smallshipFromLeft: [
                {
                    time: 0,
                    setters: {
                        x: 0,
                        y: 50,
                        dx: 10,
                        dy: 10
                    }
                },
                {
                    time: 50,
                    setters: {
                        dy: 0
                    }
                }
            ]
        };

        var gameScript = [
            250, 'smallshipFromLeft',
            450, 'smallshipFromLeft',
            650, 'smallshipFromLeft',
            850, 'smallshipFromLeft'
        ];


        // game parameters
        var maxBullets = 500;
        var fireDelay = 50;
        var framePeriod = 1000.0 / 12;
        var maxAssets = 3;
        var renderPeriod = 1000.0 / 50;
        var logicPeriod = 1000.0 / 50;
        var HUDPeriod = 1000.0 / 5;
        var collisionCheckPeriod = 1000 / 10;
        var collisionScale = 0.2;
        var maxEnergy = 100;


        // low level interfaces
        var mapRenderCanvas;
        var entityRenderCanvas;
        var HUDRenderCanvas;
        var debugRenderCanvas;
        var entitiesCtx;
        var mapCtx;
        var HUDCtx;
        var mapCanvases = new Array(2);
        var mapCtxes = new Array(2);
        var requestUpdate;
        var debugLines = [];
        var debugEnabled = true;

        
        // game state
        var scriptCursor = 0;
        var currentScripts;
        var mapPosition;
        var zPosition;
        var keys;
        var fireOnNext;
        var lastFire;
        var lastCollisionCheck;
        var loaded;
        var lastRender;
        var lastLogic;
        var lastHUD;
        var lastFrameChange;
        var images;
        var mapLength;
        var ship;
        var enemies;
        var sideOffset;
        var paused;
        var bottomOffscreen;
        var offscreensPositions;
        var enemySectors;
        var friendlySectors;
        var idCounter = 0;

        // debug
        //var debugTopOffscreen;
        //var debugBottomOffscreen;


        //    init
        function initState() {
            zPosition = 1;
            currentScripts = [];
            mapPosition = (screenHeight * zPosition) / 2;
            keys;
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
            ship;
            enemies = [];
            sideOffset = 0;
            paused = false;
            bottomOffscreen = 0;
            offscreensPositions = null;
            enemySectors = initSectors();
            friendlySectors = initSectors();
        }

        function initSectors() {
            var sectors = [];
            for(var i = 0 ; i < 10 ; i ++) {
                sectors[i] = []
                for(var j = 0 ; j < 10 ; j++) {
                    sectors[i][j] = {};
                }
            }
            return sectors;
        }

        function reset() {
            // debug
            /*
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
            */

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

            for(var i = 0 ; i < 2 ; i++) {
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
                        function( callback ){
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();
            setEventListeners();

            ship = createPlayerShip();
            for(var i = 0 ; i < ship.bullets.length ; i++) {
                ship.bullets[i] = {
                    life: null
                };
            }
            initAutoCruise();
            initState();
            preloadAssets(launchGame);
        }


        function getDebugMap(width, height) {
            var mapCanvas = document.createElement('canvas');
            var tilePerMapWidth = width / tileWidth;
            var tilePerMapHeight = height / tileHeight;
            mapCanvas.width = width;
            mapCanvas.height = height;
            var mapCtx = mapCanvas.getContext('2d');
            for(var i = 0 ; i < tilePerMapWidth ; i++) {
                for(j = 0 ; j < tilePerMapHeight ; j++) {
                    if(i%2) {
                        mapCtx.fillStyle = '#00a';
                    }
                    else {
                        mapCtx.fillStyle = '#080';
                    }
                    mapCtx.fillRect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);

                    mapCtx.fillStyle = '#fff';
                    mapCtx.font = 'bold 20pt Helvetica';
                    mapCtx.textAlign = 'center';
                    mapCtx.fillText('' + (i + j * tilesPerOffscreenWidth), i * tileWidth + tileWidth / 2, j * tileHeight + tileHeight / 2 + 10);
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
            document.addEventListener('keydown', function(event) {
                    keys[event.keyCode] = true;
                    if(event.keyCode == 66) {
                        genEnemies();
                    }
                    if(event.keyCode == 68) {
                        debugEnabled = !debugEnabled;
                        if(debugEnabled) {
                            debugRenderCanvas.style.visibility = 'visible';
                        }
                        else {
                            debugRenderCanvas.style.visibility = 'hidden';
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
                }, false);
            document.addEventListener('keyup', function(event) {
                    keys[event.keyCode] = false;
                    return false;
                }, false);
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
            var iMin = getiMin(entity);
            var jMin = getjMin(entity);
            var iMax = getiMax(entity);
            var jMax = getjMax(entity);
            for(var i = iMin ; i <= iMax ; i++) {
                for(var j = jMin ; j <= jMax ; j++) {
                    sectors[i][j][entity.id] = entity;
                }
            }
        }

        function removeFromSectors(entity, sectors) {
            var iMin = getiMin(entity);
            var jMin = getjMin(entity);
            var iMax = getiMax(entity);
            var jMax = getjMax(entity);
            for(var i = iMin ; i <= iMax ; i++) {
                for(var j = jMin ; j <= jMax ; j++) {
                    delete sectors[i][j][entity.id];
                }
            }
        }

        function moveEntityInSectors(entity, dx, dy, sectors) {
            var iMin = getiMin(entity);
            var jMin = getjMin(entity);
            var iMax = getiMax(entity);
            var jMax = getjMax(entity);
            var diMin = clamp(0, 9, Math.floor((entity.x + dx) * (10 / screenWidth)));
            var djMin = clamp(0, 9, Math.floor((entity.y + dy) * (10 / screenHeight)));
            var diMax = clamp(0, 9, Math.floor((entity.x + dx + entity.width) * (10 / screenWidth)));
            var djMax = clamp(0, 9, Math.floor((entity.y + dy + entity.height) * (10 / screenHeight)));
            for(var i = iMin ; i <= iMax ; i++) {
                for(var j = jMin ; j <= jMax ; j++) {
                    delete sectors[i][j][entity.id] ;
                }
            }
            for(var i = diMin ; i <= diMax ; i++) {
                for(var j = djMin ; j <= djMax ; j++) {
                    sectors[i][j][entity.id] = entity;
                }
            }
        }

        function createBasicEnemy() {
            var newEnemy = {
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
            for(var i = 0 ; i < 100 ; i++) {
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
            for(var i = 0 ; i < debugLines.length ; i++) {
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
            var unit = 4;
            var damping = .8;
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
            var state = ship.animState;
            if(ship.invincible) {
                state += '.invincible';
            }
            var cursor = ship.animCursor;
            var frame;
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
            for(var i = 0 ; i < enemies.length ; i++) {
                var dx = dt * enemies[i].dx;
                var dy = dt * enemies[i].dy;
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
            var isColliding = false;
            for(var i = getiMin(playerData) ; i <= getiMax(playerData) ; i++) {
                for(var j = getjMin(playerData) ; j <= getjMax(playerData) ; j++) {
                    for(var entityId in enemySectors[i][j]) {
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
            var newX = playerData.x + playerData.dx * dt;
            var newY = playerData.y + playerData.dy * dt;
            if(newX > 0 &&
               newX < entityRenderCanvas.width) {
                playerData.x = newX;
            }
            if(newY > 0 && newY < entityRenderCanvas.height) {
                playerData.y = newY;
            }
        }

        function updateBullets(playerData, dt) {
            for(var i = 0 ; i < playerData.bullets.length ; i++) {
                if(playerData.bullets[i] && playerData.bullets[i].life !== null && playerData.bullets[i].y > 0) {
                    var dx = dt * playerData.bullets[i].dx;
                    var dy = dt * playerData.bullets[i].dy;
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
                if((mapPosition - (screenHeight / 2) * zPosition) > (offscreensPositions[bottomOffscreen] + offscreenHeight)) {
                    fillOffscreen(bottomOffscreen, offscreensPositions[bottomOffscreen] + 2 * offscreenHeight);
                    bottomOffscreen = (bottomOffscreen + 1) % 2;
                }
            }
            debug(1, 'bottomOffscreen : ' + bottomOffscreen);
        }

        function updateMapPosition(dt) {
            var increment = getMapMovement(dt);
            zPosition = Math.min(zPositionLimit, zPosition + dt * 0.005);
            debug(5, 'zPosition: ' + zPosition);
            var maxMapPosition = (map.length - tilesPerOffscreenHeight) * tileHeight;
            mapPosition = Math.min(mapPosition + increment, maxMapPosition);
            updateOffscreens();
        }

        function updateFrames() {
            var sequence = animSequences[ship.animState];
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
            var width = screenWidth / 10;
            var height = screenHeight / 10;
            for(var i = 0 ; i < 10; i++) {
                for(var j = 0 ; j < 10 ; j++) {
                    var nbEnemies = Object.keys(enemySectors[i][j]).length;
                    var nbFriends = Object.keys(friendlySectors[i][j]).length;
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
            var delta = 0;
            var speed = 2;
            if(ship.x < screenWidth / 3) {
                delta = -speed * dt;
            }
            else if(ship.x > (2 * screenWidth) / 3) {
                delta = speed * dt;
            }
            else {
                if(sideOffset > 0 && ship.x < screenWidth / 2) {
                    delta = -speed / 2 * dt;
                }
                else if(sideOffset < 0 && ship.x > screenWidth / 2) {
                    delta = speed / 2 * dt;
                }
            }
            // applying lateral speed
            sideOffset += delta;
            var absoluteOffsetLimit = lateralPadding / 2;
            sideOffset = Math.min(sideOffset, absoluteOffsetLimit);
            sideOffset = Math.max(sideOffset, -absoluteOffsetLimit);
        }

        function updateDebug() {
            var position = String(mapPosition);
            position = position.substr(0, position.indexOf('.'));
            debug(2, 'position:' + position);
            debug(3, 'bullets:' + ship.bullets.length);
            debug(4, 'enemies:' + enemies.length);
        }

        function updateScript(dt) {
            // get new stuff
            while(scriptCursor < gameScript.length && mapPosition > gameScript[scriptCursor]) {
                var scriptInfo = scriptedActions[gameScript[scriptCursor + 1]];
                var newSequence = {
                    life: 0,
                    step: 0,
                    sequence: scriptInfo
                };
                newSequence.entity = createBasicEnemy();
                currentScripts.push(newSequence);
                scriptCursor += 2;
            }
            // process current stuff
            i = 0;
            while(i < currentScripts.length) {
                var currentScript = currentScripts[i];
                if(currentScript.step >= currentScript.sequence.length) {
                    currentScripts.splice(i, 1);
                }
                else {
                    while(currentScript.step < currentScript.sequence.length &&
                        currentScript.life > currentScript.sequence[currentScript.step].time) {
                        var currentStep = currentScript.sequence[currentScript.step];
                        var setterProperties = Object.keys(currentScript.sequence[currentScript.step].setters);
                        if(enemies[currentScript.entity]) {
                            for(var j = 0 ; j < setterProperties.length ; j++) {
                                var property = setterProperties[j];
                                var value = currentStep.setters[property];
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
            var dt = (currentTime - lastLogic) / (1000 / 60);

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


        //    drawing

        function fillOffscreen(offscreenIndex, position) {
            offscreensPositions[offscreenIndex] = position;
            var verticalOffset = parseInt(position / offscreenHeight) * parseInt(tilesPerOffscreenHeight);

            mapCtxes[offscreenIndex].fillStyle = 'f8f';
            mapCtxes[offscreenIndex].fillRect(0, 0, offscreenWidth, offscreenHeight);
            for(var i = 0 ; i < tilesPerOffscreenWidth ; i++) {
                for(var j = 0 ; j < tilesPerOffscreenHeight ; j++) {
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
            var tileIndex = null;
            var tileX = null;
            var tileY = null;
            offscreensPositions = [
                null,
                null
            ];
            for(var k = 0 ; k < 2 ; k++) {
                fillOffscreen(k, k * offscreenHeight);
            }
        }

        function drawMap(targetCtx) {
            targetCtx.save();
            localPhase = parseInt(mapPosition - (screenHeight / 2) * zPosition) % offscreenHeight;
            var visibleRegion = {
                x: (offscreenWidth / 2) + sideOffset - (screenWidth / 2) * zPosition,
                y: localPhase,
                width: screenWidth * zPosition,
                height: screenHeight * zPosition
            };

            var sourceBottom = {
                x: visibleRegion.x,
                y: Math.max(0, offscreenHeight - (visibleRegion.y + visibleRegion.height)),
                width: visibleRegion.width,
            };
            var topHeight = Math.max(0, visibleRegion.y + visibleRegion.height - offscreenHeight);
            sourceBottom.height = visibleRegion.height - topHeight;

            var sourceTop = null;
            if(topHeight !== 0) {
                sourceTop = {
                    x: sourceBottom.x,
                    width: sourceBottom.width,
                    height: topHeight
                };
                sourceTop.y = offscreenHeight - sourceTop.height;
            }

/*
            debugTopOffscreen.fillRect(0, 0, debugTopOffscreen.canvas.width, debugTopOffscreen.canvas.height);
            debugBottomOffscreen.fillRect(0, 0, debugBottomOffscreen.canvas.width, debugBottomOffscreen.canvas.height);
            debugBottomOffscreen.drawImage(mapCanvases[bottomOffscreen],
                0, 0, mapCanvases[bottomOffscreen].width, mapCanvases[bottomOffscreen].height,
                0, 0, debugTopOffscreen.canvas.width, debugTopOffscreen.canvas.height);
            debugTopOffscreen.drawImage(mapCanvases[(bottomOffscreen + 1) % 2],
                0, 0, mapCanvases[(bottomOffscreen + 1) % 2].width, mapCanvases[bottomOffscreen].height,
                0, 0, debugBottomOffscreen.canvas.width, debugBottomOffscreen.canvas.height);
*/
            if(sourceTop !== null) {
                var offscreenIndex = bottomOffscreen;
                var topScreenPart = parseInt((sourceTop.height / (sourceTop.height + sourceBottom.height)) * screenHeight);
                targetCtx.drawImage(mapCanvases[offscreenIndex], sourceBottom.x, sourceBottom.y, sourceBottom.width, sourceBottom.height,
                    0, topScreenPart, screenWidth, (screenHeight - topScreenPart));

                offscreenIndex = (offscreenIndex + 1) % 2;
                targetCtx.drawImage(mapCanvases[offscreenIndex], sourceTop.x, sourceTop.y, sourceTop.width, sourceTop.height,
                    0, 0, screenWidth, topScreenPart);

                /*
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
                */
            }
            else {
                targetCtx.drawImage(mapCanvases[bottomOffscreen], sourceBottom.x, sourceBottom.y, sourceBottom.width, sourceBottom.height,
                    0, 0, screenWidth, screenHeight);

                /*
                debugBottomOffscreen.strokeRect(sourceBottom.x * .125, sourceBottom.y * .125, sourceBottom.width * .125, sourceBottom.height * .125);

                debugDestination.fillStyle = '#000';
                debugDestination.fillRect(0, 0, screenWidth * .25, screenHeight * .25);
                debugDestination.fillStyle = 'rgba(200, 200, 255, 0.5)';
                debugDestination.fillRect(0, 0, screenWidth * .25, screenHeight * .25);
                */
            }

            targetCtx.restore();
            debugSectors();
        }

        function drawEnemies(targetCtx) {
            for(var i = 0 ; i < enemies.length ; i++) {
                var enemy = enemies[i];
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
                var frameLoop = animSequences[fire.type].loop;
                var frame = frameLoop[fire.life % frameLoop.length];
                var coords = {x:0,y:0};
                targetCtx.save();
                targetCtx.translate(fire.x - tileWidth / 2, fire.y - tileHeight / 2);

                targetCtx.drawImage(images.map, coords.x, coords.y, tileWidth, tileHeight,
                    0, 0, tileWidth, tileHeight);
                targetCtx.restore();
            }
        }

        function drawPlayer(targetCtx) {
            var playerFrame = getAnimFrame(ship);
            targetCtx.drawImage(images.ship, playerFrame.x, playerFrame.y, shipFrameWidth, shipFrameHeight,
                (ship.x - shipFrameWidth / 2), (ship.y - shipFrameHeight / 2), shipFrameWidth, shipFrameHeight);
        }

        function drawPlayerBullets(targetCtx) {
            for(var i = 0 ; i < ship.bullets.length; i++) {
                drawFire(ship.bullets[i], targetCtx);
            }
        }

        function draw() {            
            drawMap(mapCtx);
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
                for(var i = getiMin(enemy) ; i <= getiMax(enemy) ; i++) {
                    for(var j = getjMin(enemy) ; j <= getjMax(enemy) ; j++) {
                        for(var entityId in friendlySectors[i][j]) {
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
    }
})();

export const animSequences = {
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
        loop: [9, 10, 11],
        // loop: [25, 26, 27],
        frames: [2, 3, 4, 5, 6]
    },
    'ship.turningRight': {
        loop: [4, 5, 6],
        frames: [7, 8, 9, 10, 11]
    },
    'ship.turningRight.invincible': {
        loop: [4, 5, 6],
        // loop: [22, 23, 24],
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

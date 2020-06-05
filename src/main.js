////////////////////////////////////////////////////////////////////////////////////
// Developed by Nathan Ma, Sam Nguyen, Victor Chung
// Published by Abomination
////////////////////////////////////////////////////////////////////////////////////

"use strict";

// global variables
let cursors;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 30;

let config = {
  type: Phaser.AUTO,
  title: " ",
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 960,
      height: 1024,
  },
  physics: {
    default: 'arcade',
    arcade:{
      fps: 240,
      gravity: {y: 1500},
      debug: true
  },
  pixelArt: true
  },
  scene: [Load, Menu, Option, Pause, Play, GameOver]
};

let game = new Phaser.Game(config);

// reserve some keyboard variables
let keyF, keyX, keyP, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyENTER, keySPACE, keyESC;
let bgMusic;
<<<<<<< HEAD
let songList;
let nextSong;
let volPt = 2;
=======
let volPt = 5;
>>>>>>> parent of d4bb919... Randomize song after each song completes.
let sfxPt = 2
let bg_volume = volPt/10;
let sfx_volume = sfxPt/10;
let collisionDebug = false;
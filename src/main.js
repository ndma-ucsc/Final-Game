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
      debug: false
  },
  pixelArt: true
  },
  scene: [Load, Menu, Option, Play, GameOver, Pause]
};

let game = new Phaser.Game(config);

// reserve some keyboard variables
let keyF, keyP, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyENTER, keySPACE, keyESC;
let bgMusic;
let volPt = 5;
let bg_volume = 0.5;
let collisionDebug = false;
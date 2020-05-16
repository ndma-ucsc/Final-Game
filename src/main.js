////////////////////////////////////////////////////////////////////////////////////
// Developed by Nathan Ma, Sam Nguyen, Victor Chung
// Published by Abomination
////////////////////////////////////////////////////////////////////////////////////

"use strict";

// global variables
let cursors;
let player;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 30;

let config = {
  type: Phaser.AUTO,
  title: " ",
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      //Width and Height are multiples of 64 for tile mapping
      width: 960, 
      height: 1024,
  },
  physics:{
    default: 'arcade',
    arcade:{
      gravity: {y: 1000},
      debug: false
  },
  pixelArt: true
  },
  scene: [Load, Menu, Option, Play, GameOver]
};

let game = new Phaser.Game(config);

// reserve some keyboard variables
let keyF, keyP, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyESC, keySPACE;
let bgMusic;
let volPt = 5;
let bg_volume = 0.5;
let collisionDebug = false;

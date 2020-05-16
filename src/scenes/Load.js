class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
        this.load.path = "./assets/sfx/";
        this.load.audio('jump', 'Jump.wav');
    }

    create() {
        console.log("Inside Load Scene");
        this.scene.start("menuScene");
    }
}
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
    }

    create() {
        console.log("Inside Load Scene");
        
        this.scene.start("menuScene");
    }
}
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        console.log("Inside Menu Scene");
        
        this.scene.start("playScene");
    }

    update(){
    }
}
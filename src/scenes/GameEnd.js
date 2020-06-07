class GameEnd extends Phaser.Scene {
    constructor() {
        super("gameEndScene");
    }

    create() {
        console.log('GAME END');
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.add.text(game.config.width/2, game.config.height/2, "THE END", {fontSize: "80px", color: "#FACADE"}).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start("menuScene");
        }
    }
}
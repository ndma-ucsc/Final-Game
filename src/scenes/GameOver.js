class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        // console.log('GAME OVER');
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.add.text(game.config.width/2, game.config.height/2, "YOU DIED", {fontSize: "80px", color: "#FACADE"}).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start("menuScene");
        }
    }
}
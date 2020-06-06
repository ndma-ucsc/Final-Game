class GameEnd extends Phaser.Scene {
    constructor() {
        super("gameEndScene");
    }

    create() {
        console.log('GAME END');
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.scene.start("menuScene");
        }
    }
}
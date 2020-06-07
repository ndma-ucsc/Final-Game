class Controls extends Phaser.Scene {
    constructor() {
        super("controlScene");
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update(){
        
    }
}
class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        var pauseTextConfig = {
            fontFamily: 'Courier',
            fontSize: '64px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };
        this.pauseText = this.add.text(game.config.width/2 - 100, game.config.height/2, 'Paused', pauseTextConfig).setOrigin(0,0);
    }

    update(){

    }
}
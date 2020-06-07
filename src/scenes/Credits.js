class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create()
    {
        keyESC= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        let optionTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '55px',
            color: '#0D7DB0',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.gameTitle = this.add.text(game.config.width / 2, game.config.height / 2, 'Junk Rat', {fontSize: "80px"}).setOrigin(0.5);
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.cameras.main.fadeOut(2000);
            this.time.delayedCall(2000, () => {this.scene.start("menuScene");});
        }
    }
}
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create()
    {
        console.log("In Credit Scene");
        keyESC= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        let creditsTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '80px',
            color: '#00FFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.gameTitle = this.add.text(game.config.width / 2, game.config.height / 2, 'Junk Rat', creditsTextConfig).setOrigin(0.5);

        creditsTextConfig.color = '#FFC0CB';
        
        let groupArr = ["PROGRAMMING", "Sam Nguyen", "Victor Chung", "Nathan Ma", "", 
                        "LEVEL DESIGN", "Nathan Ma", "", 
                        "SOUND", "Sam Nguyen", "", 
                        "ART", "Victor Chung", "",
                        "ASSETS FROM", "Freesound.org", "Freemusicarchive.org", "",
                        "THANKS FOR PLAYING!!!"
                        ];

        this.groupText = this.add.group();
        
        for (let i = 0; i < groupArr.length; i++){
            if(groupArr[i] != ""){
                let textVar = this.add.text(game.config.width / 2, game.config.height + i * 40, groupArr[i], creditsTextConfig).setOrigin(0.5);
                this.groupText.add(textVar);
            }
        }
        
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => {this.scene.start("menuScene");});
        }
        this.groupText.incY(-2);
    }
}
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create()
    {
        console.log("In Credit Scene");
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        let creditsTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '90px',
            color: '#00FFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };
        this.gameTitle = this.add.text(game.config.width / 2, game.config.height / 2, 'Junk Rat', creditsTextConfig).setOrigin(0.5);
        this.gameTitle.alpha = 0;
        this.moveText = false;

        this.timeline = this.tweens.createTimeline();
        this.timeline.add({
            targets: this.gameTitle,
            alpha: 1,
            duration: 2000,
            ease: 'Linear'
        })
        this.timeline.add({
            targets: this.gameTitle,
            alpha: 0,
            duration: 2000,
            ease: 'Linear'
        })
        this.timeline.play();

        this.time.addEvent({
            delay: 4000,
            callback: ()=> {
                this.moveText = true;
            },
        })

        creditsTextConfig.color = '#FF00FF';
        creditsTextConfig.fontSize = '50px';
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
                let textVar = this.add.text(game.config.width / 2, game.config.height + 30 + i * 50, groupArr[i], creditsTextConfig).setOrigin(0.5);
                this.groupText.add(textVar);
            }
        }
        
        this.groupText.children.iterate((child) => {
            this.childrenDestroyer = this.time.addEvent({
                delay: 100,
                callback: () => {
                    if(child.y < 0)
                    {
                        child.destroy();
                    }
                },
                loop: true
            })
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyESC) || this.groupText.getLength() == 0){
            this.childrenDestroyer.remove();
            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1000, () => {this.scene.start("menuScene");});
        }
        if (this.moveText){
            this.groupText.incY(-2);
        }
    }
}
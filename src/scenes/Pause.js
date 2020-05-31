class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        this.selected = 1;
        let pauseTextConfig = {
            fontFamily: 'Courier',
            fontSize: '64px',
            color: '#FFFFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };
        this.pauseText = this.add.text(game.config.width/2, 40, 'Paused', pauseTextConfig).setOrigin(0.5,0);
        this.optionText = this.add.text(game.config.width/4, 2*game.config.height/5, "Option", {fontSize: "50px"}).setOrigin(0,0.5);
        this.menuText = this.add.text(game.config.width/4, 3*game.config.height/5, "Return to Main Menu", {fontSize: "50px"}).setOrigin(0,0.5);
    }

    update(){
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        if(this.input.keyboard.checkDown(cursors.up, 250)) {
            if(this.selected > 1) {
                this.selected--;
            }
            else {
                this.selected = 2;
            }
        }
        else if(this.input.keyboard.checkDown(cursors.down, 250)){
            if(this.selected < 2) {
                this.selected++;
            }
            else {
                this.selected = 1;
            }
        }

        if(this.selected == 1) {
            this.optionText.setTint(0xABFFA6).setScale(1.3);
            this.menuText.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.optionText.setTint().setScale();
            this.menuText.setTint(0xABFFA6).setScale(1.3);
        }
        
        if(this.selected == 1){
            if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                this.scene.pause();
                this.scene.start("optionScene", {scene: "playScene"});
                keyENTER.reset();
            }
        }

        else if(this.selected == 2){
            if(Phaser.Input.Keyboard.JustDown(keyENTER)){
                this.scene.stop("playScene")
                this.scene.start("menuScene");
            }
        }
    }
}
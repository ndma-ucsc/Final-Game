class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        if(!bgMusic.isPlaying)
        {
            nextSong = Phaser.Math.RND.pick(songList);
            bgMusic = this.sound.add(nextSong);
            bgMusic.volume = volPt / maxVolume;
            bgMusic.play();
            console.log("Now Playing: " + bgMusic.key);
        }

        this.input.keyboard.enabled = false;
        this.cameras.main.fadeIn(1000);
        this.time.delayedCall(1000, () => {this.input.keyboard.enabled = true;});
        this.selected = 1;
        this.start = this.add.text(game.config.width/2, game.config.height/2, "START", {fontSize: "50px", color: "#FFFFFF"}).setOrigin(0.5);
        this.option = this.add.text(game.config.width/2, game.config.height/2 + 60, "OPTIONS", {fontSize: "50px", color: "#FFFFFF"}).setOrigin(0.5);
        this.generateFrameAnimation();
    }

    update(){
        cursors = this.input.keyboard.createCursorKeys();
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        if(this.input.keyboard.checkDown(cursors.up, 250)) {
            if(this.selected > 1) {
                this.selected--;
            }
            else {
                this.selected = 2;
            }
        }
        else if(this.input.keyboard.checkDown(cursors.down, 250)) {
            if(this.selected < 2) {
                this.selected++;
            }
            else {
                this.selected = 1;
            }
        }
        if(this.selected == 1) {
            this.start.setTint(0x135300).setScale(1.3);
            this.option.setTint().setScale();
        }
        else if(this.selected == 2) {
            this.start.setTint().setScale();
            this.option.setTint(0x135300).setScale(1.3);
        }

        if(Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.input.keyboard.enabled = false;
            if(this.selected == 1) {
                this.cameras.main.fadeOut(1500);
                this.time.delayedCall(1500,() => {
                    this.scene.start("playScene", {level: 1, startingPos: game.config.width / 2});
                });
            }
            else if(this.selected == 2) {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500,() => {
                    this.cameras.main.fadeIn(1);
                    this.input.keyboard.enabled = true;
                    this.scene.pause();
                    this.scene.launch("optionScene");
                    keyENTER.reset();
                });
            }
        }
    }

    generateFrameAnimation(){
        // Ninja idle Right
        this.anims.create({
            key: 'idleR',
            frames: this.anims.generateFrameNumbers('idleRight', {start: 0, end: 3, first: 0}),
            frameRate: 4,
            repeat: -1
        });

        // Ninja idle Left
        this.anims.create({
            key: 'idleL',
            frames: this.anims.generateFrameNumbers('idleLeft', {start: 0, end: 3, first: 0}),
            frameRate: 4,
            repeat: -1
        });
        
        // Ninja Run Right
        this.anims.create({
            key: 'runR',
            frames: this.anims.generateFrameNumbers('runRight', {start: 0, end: 7, first: 0}),
            frameRate: 9,
            repeat: -1
        });

        // Ninja Run Left
        this.anims.create({
            key: 'runL',
            frames: this.anims.generateFrameNumbers('runLeft', {start: 0, end: 7, first: 0}),
            frameRate: 9,
            repeat: -1
        });

        // Ninja Jump Right
        this.anims.create({
            key: 'jumpR',
            frames: this.anims.generateFrameNumbers('jumpRight', {start: 0, end: 5, first: 0}),
            frameRate: 9,
            repeat: 0
        });

        // Ninja Jump Left
        this.anims.create({
            key: 'jumpL',
            frames: this.anims.generateFrameNumbers('jumpLeft', {start: 0, end: 5, first: 0}),
            frameRate: 9,
            repeat: 0
        });

        // Ninja Jump Right Recover
        this.anims.create({
            key: 'jumpR_R',
            frames: this.anims.generateFrameNumbers('jumpRight_recover', {start: 6, end: 10, first: 6}),
            frameRate: 12,
            repeat: 0
        });

        // Ninja Jump Left Recover
        this.anims.create({
            key: 'jumpL_R',
            frames: this.anims.generateFrameNumbers('jumpLeft_recover', {start: 6, end: 10, first: 6}),
            frameRate: 12,
            repeat: 0
        });

        // Ninja wallcling left
        this.anims.create({
            key: 'wallclingL',
            frames: this.anims.generateFrameNumbers('wallclingLeft', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: 0
        });

        // Ninja wallcling right
        this.anims.create({
            key: 'wallclingR',
            frames: this.anims.generateFrameNumbers('wallclingRight', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: 0
        });

        // Ninja falling left
        this.anims.create({
            key: 'fallingL',
            frames: this.anims.generateFrameNumbers('jumpLeft', {start: 5, end: 5, first: 5}),
            frameRate: 1,
            repeat: 0
        });

        // Ninja falling right
        this.anims.create({
            key: 'fallingR',
            frames: this.anims.generateFrameNumbers('jumpRight', {start: 5, end: 5, first: 5}),
            frameRate: 1,
            repeat: 0
        });

        // Oil Can spinning
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('oilcan', {start: 0, end: 7, first: 0}),
            frameRate: 5,
            repeat: 0
        });
    }
}
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        this.cameras.main.fadeIn(1500);
        console.log("Inside Menu Scene");

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

        this.scene.start("playScene");
    }

    update(){
    }
}
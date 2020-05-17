class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        console.log("Inside Play Scene");
        this.player = this.add.rectangle(200, 200, 64, 64, 0xfacade);
        this.physics.add.existing(this.player);

        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 400;
        this.jumpVelocity = -700
        this.airSpeed = 300;
        this.fastFall = 3000;
        this.paused = false;
        this.physics.world.gravity.y = 1500;

        this.jump = this.sound.add('jump', {volume: 0.1});
        this.pauseOn = this.sound.add('pauseOn', {volume: 1});
        this.pauseOff = this.sound.add('pauseOff', {volume: 1});

        //Keyboard Inputs
        cursors = this.input.keyboard.createCursorKeys();
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Background
        this.add.tileSprite(0, 0, game.config.width, game.config.height, "background1").setOrigin(0, 0).setDepth(-10);

        //Player will not fall out of the screen
        this.player.body.collideWorldBounds = true;
        this.pause = false;
    }


    update() {
        this.moveUpdate();
        this.slowMoUpdate();
        this.pauseUpdate();
    }

    moveUpdate(){
        //Movement
        if (this.player.body.onFloor()){
            if (cursors.left.isDown) {
                this.player.body.setVelocityX(-this.movementSpeed);
            }
            else if (cursors.right.isDown) {
                this.player.body.setVelocityX(this.movementSpeed);
            }
            else{
                this.player.body.setVelocity(0,0);
                this.player.body.setAcceleration(0,0);
            }
        }
        else if (!this.player.body.onFloor()){
            if (cursors.left.isDown) {
                this.player.body.setAccelerationX(-this.airSpeed);
            }
            else if (cursors.right.isDown) {
                this.player.body.setAccelerationX(this.airSpeed);
            }
            if (cursors.down.isDown){
                this.player.body.setAccelerationY(this.fastFall);
            }
        }
        
        //Jumping
        if (cursors.up.isDown && this.player.body.onFloor()) {
            this.jump.play();
            this.player.body.setVelocityY(this.jumpVelocity);
        }

        //If touching wall
        if (this.player.body.blocked.left && Phaser.Input.Keyboard.JustDown(keySPACE))
        {
            console.log("Left Wall Jump");
            this.player.body.setVelocityX(this.movementSpeed);
            this.player.body.setVelocityY(this.jumpVelocity);
        }
        if (this.player.body.blocked.right && Phaser.Input.Keyboard.JustDown(keySPACE))
        {
            console.log("Right Wall Jump");
            this.player.body.setVelocityX(-this.movementSpeed);
            this.player.body.setVelocityY(this.jumpVelocity);
        }
    }

    slowMoUpdate(){
        //Slow Mo Time
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            if (this.slowMotion == false) {
                console.log("Slow Mo On");this.physi
                this.slowMotion = true;
                this.physics.world.timeScale = this.slowSpeed;
            }
            else if (this.slowMotion == true) {
                console.log("Slow Mo Off");
                this.slowMotion = false;
                this.physics.world.timeScale = 1;
            }
        }
    }

    pauseUpdate(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            if (this.paused == false) {
                console.log("Game Paused");
                this.paused = true;
                this.pauseOn.play();
                this.player.body.enable = false;
                this.scene.launch("pauseScene");
            }
            else if (this.paused == true) {
                console.log("Game Unpaused");
                this.paused = false;
                this.pauseOff.play();
                this.player.body.enable = true;
                this.scene.stop("pauseScene");
            }
        }
    }
}
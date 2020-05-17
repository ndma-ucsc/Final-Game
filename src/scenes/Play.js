class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        console.log("Inside Play Scene");
        this.player = this.add.rectangle(200, 200, 100, 100, 0xfacade);
        this.physics.add.existing(this.player);

        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 500;
        this.paused = false;

        //Keyboard Inputs
        cursors = this.input.keyboard.createCursorKeys();
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //Player will bounce a bit when landing
        this.player.body.bounce.y = 0.2;

        //Player will not fall out of the screen
        this.player.body.collideWorldBounds = true;
        this.pause = false;
    }


    update() {
        //Movement
        if (cursors.left.isDown) {
            this.player.body.setVelocityX(-this.movementSpeed);
        }
        else if (cursors.right.isDown) {
            this.player.body.setVelocityX(this.movementSpeed);
        }
        else {
            this.player.body.setVelocityX(0);
        }

        //Jumping
        if (cursors.up.isDown && this.player.body.onFloor()) {
            this.player.body.setVelocityY(-650);
        }

        //Slow Mo Time
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            if (this.slowMotion == false) {
                console.log("Slow Mo On");
                this.slowMotion = true;
                this.physics.world.timeScale = this.slowMotion;
            }
            else if (this.slowMotion == true) {
                console.log("Slow Mo Off");
                this.slowMotion = false;
                this.physics.world.timeScale = 1;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            if (this.paused == false) {
                console.log("Game Paused");
                this.paused = true;
                this.player.body.enable = false;
            }
            else if (this.paused == true) {
                console.log("Game Unpaused");
                this.paused = false;
                this.player.body.enable = true;
            }
        }
    }
}
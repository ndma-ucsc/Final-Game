class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    create(){
        console.log("Inside Play Scene");
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height, 'player');

        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 400;
        this.jumpVelocity = -700
        this.airSpeed = 500;
        this.fastFall = 2000;
        this.wallCling = false;
        this.paused = false;

        //Sound FX Implemented
        this.jump = this.sound.add('jump', { volume: 0.1 });
        this.pauseOn = this.sound.add('pauseOn', { volume: 1 });
        this.pauseOff = this.sound.add('pauseOff', { volume: 1 });
        this.land = this.sound.add('land', { volume: 1 });
        this.slow = this.sound.add('slow', { volume: 1, loop: true });
        this.wall = this.sound.add('wall', { volume: 0.1 });

        //Keyboard Inputs
        cursors = this.input.keyboard.createCursorKeys();
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //Background
        this.add.image(0, 0, 'background1').setOrigin(0, 0).setDepth(-10);
        this.add.image(0, 0, 'light').setOrigin(0, 0);

        //Player will not fall out of the screen
        this.player.body.collideWorldBounds = true;
        this.pause = false;

        //add a tile map
        const map = this.add.tilemap("platform_map");

        //add a tileset
        const tileset = map.addTilesetImage("level_tileset", "tile1");

        //create static layer
        const groundLayer = map.createStaticLayer("Platforms", tileset, 0, 0);

        //set map collision
        groundLayer.setCollision([1]);

        //create collider
        this.physics.add.collider(this.player, groundLayer)
        
    }

    update(){
        this.moveUpdate();
        this.slowMoUpdate();
        this.pauseUpdate();
        if (this.player.x > 830 || this.player.x < 123){
            this.player.setTint(0x045D57);
        }
        else{
            this.player.setTint();
        }
    }

    moveUpdate(){
        //General Movement
        if (this.player.body.onFloor()){
            if (cursors.left.isDown){
                this.player.body.setVelocityX(-this.movementSpeed);
            }
            else if (cursors.right.isDown){
                this.player.body.setVelocityX(this.movementSpeed);
            }
            else{
                this.player.body.setVelocity(0, 0);
                this.player.body.setAcceleration(0, 0);
            }
            if (!this.isGrounded){
                this.land.play();
                this.isGrounded = true;
            }
        }
        //Directional Input
        else if (!this.player.body.onFloor() && !this.wallCling){
            this.isGrounded = false;
            if (cursors.left.isDown){
                this.player.body.setAccelerationX(-this.airSpeed);
            }
            else if (cursors.right.isDown){
                this.player.body.setAccelerationX(this.airSpeed);
            }
            if (cursors.down.isDown){
                this.player.body.setAccelerationY(this.fastFall);
            }
            else{
                this.player.body.setAccelerationY(0);
            }
        }

        // Wall Cling
        if (cursors.left.isDown && !cursors.right.isDown && !this.player.body.onFloor() && this.player.body.blocked.left && this.player.body.velocity.y > 0){
            this.player.body.setAccelerationX(-10);
            this.slowMotion = true;
            this.physics.world.timeScale = this.slowSpeed;
            this.wallCling = true;
        }
        else if (cursors.right.isDown && !cursors.left.isDown && !this.player.body.onFloor() && this.player.body.blocked.right && this.player.body.velocity.y > 0){
            this.player.body.setAccelerationX(10);
            this.slowMotion = true;
            this.physics.world.timeScale = this.slowSpeed;
            this.wallCling = true;
        }
        else if((!cursors.left.isDown && !cursors.right.isDown)){
            this.wallCling = false;
            this.slowMotion = false;
            this.physics.world.timeScale = 1;
        }
        else{
            this.wallCling = false;
            this.slowMotion = false;
            this.physics.world.timeScale = 1;
        }

        //Jumping
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.paused == false){
            if (this.player.body.onFloor()){ // Normal Jump
                this.jump.play();
                this.player.body.setVelocityY(this.jumpVelocity);
            }

            else if (!this.player.body.onFloor()){ // Wall Jump
                if (this.player.body.blocked.left){
                    console.log("Left Wall Jump");
                    this.wall.play();
                    this.player.body.setVelocityX(this.movementSpeed);
                    this.player.body.setVelocityY(this.jumpVelocity);
                    this.slowMotion = false;
                    this.physics.world.timeScale = 1;
                    
                }
                if (this.player.body.blocked.right){
                    console.log("Right Wall Jump");
                    this.wall.play();
                    this.player.body.setVelocityX(-this.movementSpeed);
                    this.player.body.setVelocityY(this.jumpVelocity);
                    this.slowMotion = false;
                    this.physics.world.timeScale = 1;
                }
            }
        }
    }

    slowMoUpdate(){
        //Slow Mo Time
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            if (this.slowMotion == false){
                console.log("Slow Mo On");
                this.slow.play();
                this.slowMotion = true;
                this.physics.world.timeScale = this.slowSpeed;
            }
            else if (this.slowMotion == true){
                console.log("Slow Mo Off");
                this.slow.stop();
                this.slowMotion = false;
                this.physics.world.timeScale = 1;
            }
        }
    }

    pauseUpdate(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            if (this.paused == false){
                console.log("Game Paused");
                this.paused = true;
                this.pauseOn.play();
                this.player.body.enable = false;
                this.scene.launch("pauseScene");
            }
            else if (this.paused == true){
                console.log("Game Unpaused");
                this.paused = false;
                this.pauseOff.play();
                this.player.body.enable = true;
                this.scene.stop("pauseScene");
            }
        }
    }
}
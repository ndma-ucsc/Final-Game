class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    create(){
        console.log("Inside Play Scene");
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height, 'player');
        this.enemies = this.add.group({
            runChildUpdate: true    //Make sure update runs on group children
        });

        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 400;
        this.jumpVelocity = -700;
        this.airSpeed = 300;
        this.fastFall = 2000;
        this.wallCling = false;
        this.paused = false;
        this.facing = 'left';
        this.jump = false;

        //Sound FX Implemented
        this.jumpSFX = this.sound.add('jump', { volume: 0.1 });
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
        this.spawnEnemies(); 
    }
        
    spawnEnemies(){
        if (!this.paused){
            console.log("Spawned Enemies");
            let enemy = new Enemy(this, game.config.width/2, game.config.height - 800, 'null', -300, 0);
            enemy.setDepth(999);
            this.enemies.add(enemy);
        }
    }

    update(){
        this.pauseUpdate();
        if (!this.paused){
            this.moveUpdate();
            this.slowMoUpdate();
            if (this.player.x > 830 || this.player.x < 123){
                this.player.setTint(0x045D57);
            }
            else{
                this.player.setTint();
            }
            this.anims.resumeAll();
        }
        else if (this.paused){
            this.anims.pauseAll();
        }
    }

    moveUpdate(){
        //General Movement
        if (this.player.body.onFloor()){
            this.player.body.setMaxSpeed();
            if (cursors.left.isDown){
                this.player.body.setVelocityX(-this.movementSpeed);
                this.player.anims.play('runL',true);
                this.facing = 'left';
                this.player.setSize(35,40,false).setOffset(30,20); //setSize(width,height,center or nah) setOffset(x,y) <- Move the hitbox (x,y)
            }
            else if (cursors.right.isDown){
                this.player.body.setVelocityX(this.movementSpeed);
                this.player.anims.play('runR',true);
                this.facing = 'right';
                this.player.setSize(35,40,false).setOffset(35,20);
            }
            else{
                this.player.body.setVelocity(0, 0);
                this.player.body.setAcceleration(0, 0);
                if(this.facing == 'left' && this.jump == false) {
                    this.player.anims.play('idleL',true);
                    this.player.setSize(30,60).setOffset(25,0);
                }
                else if(this.facing == 'right' && this.jump == false) {
                    this.player.anims.play('idleR',true);
                    this.player.setSize(30,60).setOffset(40,0);
                }
                
            }
            if (!this.isGrounded){
                this.land.play();
                if(this.facing == 'left') {
                    this.player.play('jumpL_R',true);
                    this.player.on('animationcomplete', (animation,frame) => {
                        if(animation.key === 'jumpL_R') {
                            this.jump = false;
                        }
                    }, this);
                }
                else if(this.facing == 'right') {
                    this.player.play('jumpR_R',true);
                    this.player.on('animationcomplete', (animation,frame) => {
                        if(animation.key === 'jumpR_R') {
                            this.jump = false;
                        }
                    }, this);
                }
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
            else{
                this.player.body.setAccelerationX(0);
            }
            if (cursors.down.isDown){
                this.player.body.setAccelerationY(this.fastFall);
            }
            else{
                this.player.body.setAccelerationY(0);
            }
        }
        //Wall Cling
        if (cursors.left.isDown && !cursors.right.isDown && !this.player.body.onFloor() && this.player.body.blocked.left && this.player.body.velocity.y > 0){
            this.player.body.setVelocityY(100);
            this.wallCling = true;
        }
        else if (cursors.right.isDown && !cursors.left.isDown && !this.player.body.onFloor() && this.player.body.blocked.right && this.player.body.velocity.y > 0){
            this.player.body.setVelocityY(100);
            this.wallCling = true;
        }
        else if((!cursors.left.isDown && !cursors.right.isDown)){
            this.wallCling = false;
        }
        else{
            this.wallCling = false;
        }

        //Jumping
        if (Phaser.Input.Keyboard.JustDown(keyUP) && this.paused == false){
            this.player.body.setMaxSpeed(this.jumpVelocity);
            if (this.player.body.onFloor()){ // Normal Jump
                this.jump = true;
                this.jumpSFX.play();
                this.player.body.setVelocityY(this.jumpVelocity);
                if(this.facing == 'left') {
                    this.player.play('jumpL',true);
                    this.player.setSize(30,50,false).setOffset(25,10);
                }
                else if(this.facing == 'right') {
                    this.player.play('jumpR',true);
                    this.player.setSize(30,50,false).setOffset(40,10);
                }
            }

            else if (!this.player.body.onFloor()){ // Wall Jump
                if (this.player.body.blocked.left){
                    console.log("Left Wall Jump");
                    this.wall.play();
                    this.player.play('jumpR',true);
                    this.facing = 'right';
                    this.player.setSize(30,50,false).setOffset(40,10);
                    this.player.body.setVelocityX(this.movementSpeed);
                    this.player.body.setVelocityY(this.jumpVelocity);
                }
                if (this.player.body.blocked.right){
                    console.log("Right Wall Jump");
                    this.wall.play();
                    this.player.play('jumpL',true);
                    this.facing = 'left';
                    this.player.setSize(30,50,false).setOffset(25,10);
                    this.player.body.setVelocityX(-this.movementSpeed);
                    this.player.body.setVelocityY(this.jumpVelocity);
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
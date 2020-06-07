"use strict";
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    init (data){
        this.level = data.level;
        this.playerXPos = data.startingPos;
    }

    create(){
        console.log("Current Level: " + this.level);
        this.cameras.main.fadeIn(1000);
        this.input.keyboard.enabled = true;
        this.zawarudo = this.add.image(0, 0,'gray');
        
        //Adding player to scene
        this.player = this.physics.add.sprite(this.playerXPos, game.config.height, 'player');
        this.player.body.collideWorldBounds = true;
        this.player.setImmovable();

        //Flags and other necessary variables
        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 300;
        this.jumpVelocity = -500;
        this.jumpDuration = 200;
        this.airSpeed = 500;
        this.fastFall = 2000;
        this.wallCling = false;
        this.wallJumpSpeedX = 400;
        this.wallJumpSpeedY = -650;
        this.facing = 'left';
        this.jump = false;
        this.falling = false;
        this.jumps;
        this.paused = false;
        this.gameOver = false;
        this.radius = 1;
        this.canDash = true;
        this.initTime = 10;
        this.ranOutOfTime = false;
        this.amount = 100;

        //Sound FX Implemented
        this.jumpSFX = this.sound.add('jump', {volume: sfxPt / maxVolume});
        this.pauseOnSFX = this.sound.add('pauseOn', {volume: sfxPt / maxVolume});
        this.pauseOffSFX = this.sound.add('pauseOff', {volume: sfxPt / maxVolume});
        this.landSFX = this.sound.add('land', {volume: sfxPt / maxVolume * 1.5});
        this.slowSFX = this.sound.add('slow', {volume: sfxPt / maxVolume * 0.2});
        this.wallSFX = this.sound.add('wall', {volume: sfxPt / maxVolume * 0.2});
        this.deathSFX = this.sound.add('death', {volume: sfxPt / maxVolume});
        this.ricochetSFX = this.sound.add('ricochet', {volume: sfxPt / maxVolume * 0.5});
        this.laserSFX = this.sound.add('laser', {volume: sfxPt / maxVolume * 0.5});
        this.dashSFX = this.sound.add('dash', {volume: sfxPt / maxVolume * 1.5});
        this.footstepSFX = this.sound.add('footstep', {volume: sfxPt / maxVolume * 1.2});
        this.electricSFX = this.sound.add('electric', {volume: sfxPt / maxVolume});

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

        //add a tile map
        const map = this.add.tilemap(`level_map_${this.level}`);

        //add a tileset
        const tileset = map.addTilesetImage(`level_tileset_${this.level}`, "tiles");

        //create static layer
        const platformLayer = map.createStaticLayer("Platforms", tileset, 0, 0);

        //set map collision
        platformLayer.setCollision([1,2,3,4,5,6,7,8,9]);

        this.enemies = this.add.group({
            runChildUpdate: true
        });
        this.bullets = this.add.group({
            runChildUpdate: true
        });

        this.slowmoBar = new SlowmoBar(this, 0, 0);

        this.pauseText = this.add.text(game.config.width - 10, 10, "||", {fontSize: "40px"}).setOrigin(1, 0);
        this.add.text(game.config.width - 7, 15, "ESC", {fontSize: "30px"}).setOrigin(1, 0);


        //create collider
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.bullets, platformLayer);
        this.spawnEyeEnemies(this.level); 
        this.dashing();
        this.countdown();
    }

    update(){
        this.zaWarudo();
        this.pauseUpdate();
        if (!this.paused && !this.gameOver){
            this.physics.world.collide(this.player, this.enemies, this.collisionUpdate, null, this);
            this.physics.world.collide(this.player, this.bullets, this.collisionUpdate, null, this);
            
            this.moveUpdate();
            this.slowMoUpdate();
            if (this.player.x > 830 || this.player.x < 124){
                this.player.setTint(0x045D57);
            }
            else{
                this.player.setTint();
            }
        }
        if(!this.gameOver)
        {
            this.musicUpdate();
        }
        this.checkWin();
    }
        
    spawnEyeEnemies(enemyCount){
        if (!this.paused && !this.gameOver){
            for(let i = 0; i < enemyCount; i++)
            {
                let randomHeight = Phaser.Math.Between(0, game.config.height - 800);
                let randomWidth = Phaser.Math.Between(0, game.config.width);
                let randomXSpeed = Phaser.Math.Between(25, 100);
                let randomYSpeed = Phaser.Math.Between(25, 100);
                let enemy = new Enemy(this, randomWidth, randomHeight, 'robot', randomXSpeed, randomYSpeed);
                this.enemies.add(enemy);
            }
        }
        this.enemies.children.iterate((child) => {
            this.time.addEvent({
                delay: Phaser.Math.Between(150, 300) * Phaser.Math.Between(10, 20) * Phaser.Math.Between(2, 4),
                callback: ()=> {
                    if (!this.paused && !this.gameOver){    
                        let verticalError = 100;
                        let horizontalError = 100;
                        let offsetX = this.player.x + Phaser.Math.Between(-horizontalError, horizontalError);
                        let offsetY = this.player.y + Phaser.Math.Between(-verticalError, verticalError);
                        let trajectory = Phaser.Math.Angle.Between(child.x, child.y, offsetX, offsetY);
                        let bullet = new Bullet(this, child.x, child.y, 'ball', 3, trajectory);
                        if (this.slowMotion)
                        {
                            bullet.body.velocity.x /= this.slowSpeed;
                            bullet.body.velocity.y /= this.slowSpeed;
                        }
                        this.laserSFX.play();
                        this.bullets.add(bullet);
                    }
                },
                loop: true
            })
        });
    }

    moveUpdate(){
        let justDownVal = Phaser.Input.Keyboard.JustDown(keySPACE);
        //On ground
        if (this.player.body.onFloor()){
            this.player.body.setMaxSpeed();
            this.jumps = 1;
            if (cursors.left.isDown){
                this.player.body.setVelocityX(-this.movementSpeed);
                this.player.anims.play('runL',true);
                this.facing = 'left';
                this.player.setSize(35,40,false).setOffset(30,20); //setSize(width,height,center or nah) setOffset(x,y) <- Move the hitbox (x,y)
                if(!this.footstepSFX.isPlaying)
                {
                    this.footstepSFX.play();
                }
            }
            else if (cursors.right.isDown){
                this.player.body.setVelocityX(this.movementSpeed);
                this.player.anims.play('runR',true);
                this.facing = 'right';
                this.player.setSize(35,40,false).setOffset(35,20);
                if(!this.footstepSFX.isPlaying)
                {
                    this.footstepSFX.play();
                }
            }
            else if (cursors.down.isDown){
                this.jump = false;
                this.player.body.setVelocity(0, 0);
                this.player.body.setAcceleration(0, 0);
                if(this.facing == 'left') {
                    this.player.anims.play('crouchL',true);
                    this.player.setSize(30,25,false).setOffset(10,5);
                }
                else if(this.facing == 'right') {
                    this.player.anims.play('crouchR',true);
                    this.player.setSize(30,25,false).setOffset(5,5);
                }
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
            
            //While in the air
            if (!this.isGrounded && this.jump) {
                this.landSFX.play();
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
        if (!this.player.body.onFloor() && !this.wallCling){
            
            this.isGrounded = false;
            if (cursors.left.isDown){
                this.player.body.setAccelerationX(-this.airSpeed);
            }
            else if (cursors.right.isDown){
                this.player.body.setAccelerationX(this.airSpeed);
            }
            else{
                this.player.body.setAccelerationX(0);
                // this.falling = true;
                // if(this.facing == 'left' && this.jump == false) {
                //     this.player.play('fallingL',true);
                //     this.player.setSize(30,50,false).setOffset(25,10);
                // }
                // else if(this.facing == 'right' && this.jump == false) {
                //     this.player.play('fallingR',true);
                //     this.player.setSize(30,50,false).setOffset(40,10);
                // }
            }
            if (cursors.down.isDown){
                this.player.body.setAccelerationY(this.fastFall);
            }
            else{
                this.falling = true;
                if(this.facing == 'left' && this.jump == false) {
                    this.player.play('fallingL',true);
                    this.player.setSize(30,50,false).setOffset(25,10);
                }
                else if(this.facing == 'right' && this.jump == false) {
                    this.player.play('fallingR',true);
                    this.player.setSize(30,50,false).setOffset(40,10);
                }
                this.player.body.setAccelerationY(0);
            }
        }

        //Jumping
        if(Phaser.Input.Keyboard.DownDuration(keySPACE, this.jumpDuration) && this.jumps > 0 && this.player.body.velocity.y <= 0) {
            this.player.body.setVelocityY(this.jumpVelocity);
            this.jump = true;
            if(this.facing == 'left') {
                this.player.play('jumpL',true);
                this.player.setSize(30,50,false).setOffset(25,10);
            }
            else if(this.facing == 'right') {
                this.player.play('jumpR',true);
                this.player.setSize(30,50,false).setOffset(40,10);
            }
        }
        else if(Phaser.Input.Keyboard.UpDuration(keySPACE) && this.jump) {
	    	this.jumps--;
        }
        if(justDownVal && this.player.body.onFloor()){
            this.player.body.setAccelerationX(0);
            this.jumpSFX.play();
        }

        //Wall Cling
        if (!this.player.body.onFloor()){
            if (this.player.body.blocked.left){
                if (cursors.left.isDown && !cursors.right.isDown && this.player.body.velocity.y > 0){
                    this.player.body.setVelocityX(-100);
                    this.player.body.setVelocityY(100);
                    this.wallCling = true;
                    this.player.anims.play('wallclingL',true);
                    this.facing = 'right';
                }
                else{
                    if(this.wallCling) {
                        this.player.anims.play('fallingR',true);
                        this.player.setSize(30,50,false).setOffset(40,10);
                    }
                    this.wallCling = false;
                    
                }
                if (justDownVal){ // Wall Jump
                    this.wallSFX.play();
                    this.player.play('jumpR',true);
                    this.facing = 'right';
                    this.player.setSize(30,50,false).setOffset(40,10);
                    this.player.body.setVelocityX(this.wallJumpSpeedX);
                    this.player.body.setVelocityY(this.wallJumpSpeedY);
                    this.wallCling = false;
                }
            }
            else if (this.player.body.blocked.right){
                if (cursors.right.isDown && !cursors.left.isDown && this.player.body.velocity.y > 0){
                    this.player.body.setVelocityX(100)
                    this.player.body.setVelocityY(100);
                    this.wallCling = true;
                    this.player.anims.play('wallclingR',true);
                    this.facing = 'left';
                }
                else{
                    if(this.wallCling) {
                        this.player.anims.play('fallingL',true);
                        this.player.setSize(30,50,false).setOffset(25,10);
                    }
                    this.wallCling = false;
                }
                if (justDownVal){ // Wall Jump
                    this.wallSFX.play();
                    this.player.play('jumpL',true);
                    this.facing = 'left';
                    this.player.setSize(30,50,false).setOffset(40,10);
                    this.player.body.setVelocityX(-this.wallJumpSpeedX);
                    this.player.body.setVelocityY(this.wallJumpSpeedY);
                    this.wallCling = false;
                }
            }
        }
        else{
            this.wallCling = false;
        }
    }

    slowMoUpdate(){
        //Slow Mo Time
        if (Phaser.Input.Keyboard.JustDown(keyF) || this.ranOutOfTime){
            if (this.slowMotion == false && this.initTime != 0){
                console.log("Slow Mo On");
                this.slowSFX.play();
                //Slow down certain sounds when in slow mo
                this.laserSFX.rate = 1/this.slowSpeed;
                this.ricochetSFX.rate = 1/this.slowSpeed;

                this.enemies.children.iterate((child) => {
                    child.body.velocity.x /= this.slowSpeed;
                    child.body.velocity.y /= this.slowSpeed;
                });

                this.bullets.children.iterate((child) => {
                    child.body.velocity.x /= this.slowSpeed;
                    child.body.velocity.y /= this.slowSpeed;
                });
                this.slowMotion = true;
            }
            else if (this.slowMotion == true){
                console.log("Slow Mo Off");
                this.slowSFX.stop();

                //Set sounds back to normal
                this.laserSFX.rate = 1;
                this.ricochetSFX.rate = 1;

                this.enemies.children.iterate((child) => {
                    child.body.velocity.x *= this.slowSpeed;
                    child.body.velocity.y *= this.slowSpeed;
                });

                this.bullets.children.iterate((child) => {
                    child.body.velocity.x *= this.slowSpeed;
                    child.body.velocity.y *= this.slowSpeed;
                });
                this.ranOutOfTime = false;
                this.slowMotion = false;
            }
        }
    }

    pauseUpdate(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            if (!this.gameOver && this.paused == false){
                console.log("Game Paused");
                this.paused = true;
                this.pauseOnSFX.play();
                this.pauseText.text = "▷";
                if(this.slowMotion)
                {
                    this.slowSFX.pause();
                }
                this.player.body.enable = false;
                this.tweens.add({
                    targets: this.cameras.main,
                    alpha: 0.5,
                    duration: 500,
                    ease: 'Linear'
                })
                this.anims.pauseAll();
                this.scene.launch("optionScene");
            }
            else if (!this.gameOver && this.paused == true){
                console.log("Game Unpaused");
                this.paused = false;
                this.pauseOffSFX.play();
                this.pauseText.text = "||";
                if(this.slowMotion)
                {
                    this.slowSFX.resume();
                }
                this.tweens.add({
                    targets: this.cameras.main,
                    alpha: 1,
                    duration: 500,
                    ease: 'Linear'
                })
                this.player.body.enable = true;
                this.anims.resumeAll();
                this.scene.stop("optionScene");
                cursors = this.input.keyboard.createCursorKeys();
                keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
                keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
                keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
                keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
                keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            }
        }
    }

    collisionUpdate(){
        this.player.body.enable = false;
        this.input.keyboard.enabled = false;
        this.gameOver = true; // turn off collision checking
        this.player.alpha = 0;

        // death sequence
        this.tweens.add({        // fade out
            targets: bgMusic,
            volume: 0,
            ease: 'Linear',
            duration: 400,
        }); 
        bgMusic.stop();
        this.deathSFX.play()
        // let death = this.add.sprite(this.player.x, this.player.y, 'death').setOrigin(1);
        // death.anims.play('death'); // explosion animation

        this.cameras.main.fadeOut(2000);
        this.time.delayedCall(2000, () => {this.scene.start("gameOverScene");});
    }
    
    dashing(){
        let dashLeft = this.input.keyboard.createCombo([cursors.left, cursors.left], {
            resetOnWrongKey: true,
            maxKeyDelay: 200,
            resetOnMatch: true,
            deleteOnMatch: false
        });

        let dashRight = this.input.keyboard.createCombo([cursors.right, cursors.right], {
            resetOnWrongKey: true,
            maxKeyDelay: 200,
            resetOnMatch: true,
            deleteOnMatch: false
        });

        this.input.keyboard.on('keycombomatch', (combo, event) => {
            if (combo === dashLeft) { 
                if (!this.isGrounded && !this.paused && this.canDash) {
                    this.canDash = false;
                    this.player.anims.play('dashL',true);
                    this.player.setSize(30,10).setOffset(10,10);
                    this.facing = 'left';
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(-this.movementSpeed - 20);
                    this.dashSFX.play();
                    this.time.addEvent({
                        delay: 400,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
                            this.falling = true;
                            this.player.play('fallingL',true);
                            this.player.setSize(30,50,false).setOffset(25,10);
                        }
                    })
                    this.time.addEvent({
                        delay: 2000,
                        callback: ()=> {
                            this.canDash = true;
                        }
                    })
                }
            }
            
            if (combo === dashRight && this.canDash) {
                if (!this.isGrounded && !this.paused) {
                    this.canDash = false;
                    this.player.anims.play('dashR',true);
                    this.player.setSize(30,10).setOffset(39,10);
                    this.facing = 'right';
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(this.movementSpeed + 20);
                    this.dashSFX.play();
                    this.time.addEvent({
                        delay: 400,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
                            this.falling = true;
                            this.player.play('fallingR',true);
                            this.player.setSize(30,50,false).setOffset(40,10);
                        }
                    });
                    this.time.addEvent({
                        delay: 2000,
                        callback: ()=> {
                            this.canDash = true;
                        }
                    });
                }
                
            }   
        });
    }

    musicUpdate(){
        if(!bgMusic.isPlaying)
        {
            while(nextSong == bgMusic.key)
            {
                nextSong = Phaser.Math.RND.pick(songList);
            }
            bgMusic = this.sound.add(nextSong, {volume: volPt / maxVolume * 0.25});
            bgMusic.play();
            console.log("Now Playing: " + bgMusic.key);
        }
    }

    zaWarudo()
    {
        if (this.slowMotion) {
            if (this.radius < 1000){
                this.radius = this.radius + 8;
                if (this.radius > 1000){
                    this.radius = 1000;
                }
                this.zawarudo.setScale(this.radius);
            }
        }
        else if(!this.slowMotion){
            if (this.radius > 1){
                this.radius = this.radius - 40;
                if (this.radius < 0){
                    this.radius = 1;
                }
                this.zawarudo.setScale(this.radius);
            }
        }
        
        if (this.radius < 1000){
            this.zawarudo.x = this.player.x;
            this.zawarudo.y = this.player.y;
        }
    }

    countdown(){
        this.timedEvent = this.time.addEvent({
            delay: 1000, 
            callback: ()=> {
                if (!this.paused && !this.slowMotion && this.initTime < 10){
                    this.initTime++;
                    this.slowmoBar.increase(this.amount);
                }
                else if (!this.paused && this.slowMotion && this.initTime > 0){
                    this.initTime--;
                    this.slowmoBar.decrease(this.amount);
                    if (this.initTime == 0){
                        this.electricSFX.play();
                        this.ranOutOfTime = true;
                    }
                }
            },
            loop: true
        })
    }

    checkWin(){
        if (this.player.y <= 0){
            this.level++;
            if (this.level == 4){
                this.scene.start("gameEndScene");
            }
            else{
                this.scene.start("playScene", {level: this.level, startingPos: this.player.x, remainingXVel: this.player.body.velocity.x});
            }
        }
    }

}
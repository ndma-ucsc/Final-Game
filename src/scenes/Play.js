class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    init (data){
        this.level = data.level;
    }

    create(){
        this.cameras.main.fadeIn(1000);
        this.input.keyboard.enabled = true;
        var _player;
        var _gameOver = false;
        var _inputKeyboard = this.input.keyboard;
        var _tweens = this.tweens;
        var _deathSFX;
        var _cam = this.cameras.main;
        var _time = this.time;
        var _emitter;

        //emitter overlap check
        this.particleHit = {
            contains: function (x, y)
            {
                if (_player.body.hitTest(x, y)) {
                    _player.body.enable = false;
                    _inputKeyboard.enabled = false;
                    _gameOver = true; // turn off collision checking
                    _player.alpha = 0;

                    // death sequence
                    _tweens.add({        // fade out
                        targets: bgMusic,
                        volume: 0,
                        ease: 'Linear',
                        duration: 400,
                    }); 
                    bgMusic.stop();
                    _deathSFX.play()

                    _cam.fadeOut(2000);
                    _time.delayedCall(2000, () => {game.scene.start("gameOverScene");});
                }
            }
        };
        
        this.zawarudo = this.add.image(0, 0,'gray');
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height, 'player');
        _player = this.player;
        this.boss = new Boss(this, game.config.width/2, 20, 'boss').setScale(1, 1).setOrigin(0,0);
        this.enemies = this.add.group({
            runChildUpdate: true    //Make sure update runs on group children
        });
        this.bullets = this.add.group({
            runChildUpdate: true,
            frameQuantity: 10
        });
        //energy balls
        this.bombs = this.physics.add.group({
            active: true,
            visible: false,
            key:'ball',
            frameQuantity: 8,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        //hitbox
        this.bombsHitbox = this.physics.add.group({
            active: true,
            visible: false,
            key:'hitbox',
            frameQuantity: 8,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        //energy balls
        this.bombs2 = this.physics.add.group({
            active: true,
            visible: false,
            key:'ball',
            frameQuantity: 24,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        //hitbox
        this.bombsHitbox2 = this.physics.add.group({
            active: true,
            visible: false,
            key:'hitbox',
            frameQuantity: 24,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        //energy balls
        this.bombs3 = this.physics.add.group({
            active: true,
            visible: false,
            key:'ball',
            frameQuantity: 30,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        //hitbox
        this.bombsHitbox3 = this.physics.add.group({
            active: true,
            visible: false,
            key:'hitbox',
            frameQuantity: 30,
            collideWorldBounds: false,
            immovable: true,
            allowGravity: false,
            classType: Boss
        });
        // this.powerUp = this.add.sprite(this.player.x, this.player.y, "null").setOrigin(0.5);

        this.slowMotion = false;
        this.slowSpeed = 5;
        this.movementSpeed = 300;
        this.jumpVelocity = -500;
        this.airSpeed = 300;
        this.fastFall = 2000;
        this.wallCling = false;
        this.wallJumpSpeedX = 400;
        this.wallJumpSpeedY = -650;
        this.facing = 'left';
        this.jump = false;
        this.falling = false;
        this.jumps;
        this.JUMP_MAX = 1;
        this.dashCooldown = false;
        this.paused = false;
        this.gameOver = false;
        this.startFiring = 0;
        this.radius = 1;

        _gameOver = this.gameOver;
        

        //Sound FX Implemented
        this.jumpSFX = this.sound.add('jump', {volume: sfx_volume});
        this.pauseOnSFX = this.sound.add('pauseOn', {volume: sfx_volume});
        this.pauseOffSFX = this.sound.add('pauseOff', {volume: sfx_volume});
        this.landSFX = this.sound.add('land', {volume: sfx_volume});
        this.slowSFX = this.sound.add('slow', {volume: sfx_volume});
        this.wallSFX = this.sound.add('wall', {volume: sfx_volume});
        this.deathSFX = this.sound.add('death', {volume: sfx_volume});
        this.ricochetSFX = this.sound.add('ricochet', {volume: sfx_volume/2});
        this.laserSFX = this.sound.add('laser', {volume: sfx_volume/2});

        _deathSFX = this.deathSFX;

        //Keyboard Inputs
        cursors = this.input.keyboard.createCursorKeys();
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //Background
        this.add.image(0, 0, 'background1').setOrigin(0, 0).setDepth(-10);
        this.add.image(0, 0, 'light').setOrigin(0, 0);

        //Background Music
        songList = ["Bad Flower", "Panda", "Action Breakbeat", 
        "Followed", "Turbo Giant", "Croissant Funk", "Beamin", "Gumption Junction", "Ragnarok",
        "Ducky", "Assault", "Lorry"];
        nextSong = Phaser.Math.RND.pick(songList);
        bgMusic = this.sound.add(nextSong);
        bgMusic.play();
        console.log("Now Playing: " + nextSong);

        //Player will not fall out of the screen
        this.player.body.collideWorldBounds = true;

        

        //add a tile map
        const map = this.add.tilemap(`level_map_${this.level}`);

        //add a tileset
        const tileset = map.addTilesetImage(`level_tileset_${this.level}`, "tiles");

        //create static layer
        const platformLayer = map.createStaticLayer("Platforms", tileset, 0, 0);

        //set map collision
        platformLayer.setCollision([1]);

        var rect = new Phaser.Geom.Rectangle(0, -50, 960, 1);
        this.particles = this.add.particles('oilcan');
        // this.particles.anims.play('spin',true);
        this.emitter = this.particles.createEmitter({
            lifespan: 4000,
            //angle: { min: 225, max: 315 },
            speed: { min: 50, max: 200 },
            scale: 1.2,
            gravityY: 300,
            //delay: 3000,
            timeScale: 1,
            bounce: 0.9,
            quantity: 1,
            frequency: 500, //higher = less
            bounds: { x: 0, y: 0, w: 960, h: 1024 },
            collideTop: false,
            collideBottom: false,
            emitZone: { source: rect },
            deathZone: { type: 'onEnter', source: this.particleHit }
        });
        _emitter = this.emitter;

        

        //create collider
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.bullets, platformLayer);

        this.spawnRandomEnemies(this.level); 
        this.spawnBullet();
        this.dashing();
        this.createCircle();

        this.physics.add.overlap(this.player, this.bombsHitbox, () => {
            //this.sound.play('sfx_explosion');
            this.collisionUpdate();
        });
        this.physics.add.overlap(this.player, this.bombsHitbox2, () => {
            //this.sound.play('sfx_explosion');
            this.collisionUpdate();
        });
        this.physics.add.overlap(this.player, this.bombsHitbox3, () => {
            //this.sound.play('sfx_explosion');
            this.collisionUpdate();
        });

        this.time.addEvent({ delay: 3000, callback: () => {
            this.startFiring++;
        }, callbackScope: this, loop: true });
    }

    update(){
        // this.powerUp.x = this.player.x;
        // this.powerUp.y = this.player.y;
        if(this.slowMotion) {
            this.player.anims.msPerFrame = 300;
            if(this.radius <= 1000) {
                this.radius = this.radius + 80;
                this.zawarudo.setScale(this.radius);
            }
        }
        else if(!this.slowMotion) {
            this.player.anims.msPerFrame = 130;
            if(this.radius > 1) {
                this.radius = this.radius - 80;
                this.zawarudo.setScale(this.radius);
            }
        }
        this.zawarudo.x = this.player.x;
        this.zawarudo.y = this.player.y;
        this.pauseUpdate();
        if (!this.paused && !this.gameOver){
            this.physics.world.collide(this.player, this.enemies, this.collisionUpdate, null, this);
            this.physics.world.collide(this.player, this.bullets, this.collisionUpdate, null, this);
            
            this.moveUpdate();
            this.slowMoUpdate();
            this.freezeUpdate();
            if(this.startFiring >=2) {
                this.bombs.getChildren().forEach(function() {
                    this.bombs.setVisible(true);
                }, this);
                this.boss.update(this.bombs,this.bombs2,this.bombs3,this.startAngle,this.endAngle,this.bombsHitbox,this.bombsHitbox2,this.bombsHitbox3,this.single,this.playerHitbox,this.bossHitbox);
            }
            if (this.player.x > 830 || this.player.x < 123){
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
        
    spawnRandomEnemies(enemyCount){
        if (!this.paused && !this.gameOver){
            console.log("Spawned Enemies");
            for(let i = 0; i < enemyCount; i++)
            {
                let randomHeight = Phaser.Math.Between(0, game.config.height - 600);
                let randomWidth = Phaser.Math.Between(0, game.config.width);
                let randomXSpeed = Phaser.Math.Between(25, 100);
                let randomYSpeed = Phaser.Math.Between(25, 100);
                let enemy = new Enemy(this, randomWidth, randomHeight, 'robot', randomXSpeed, randomYSpeed);
                this.enemies.add(enemy);
            }
        }
    }
    
    spawnBullet(){
        console.log("Firing Bullets");
        this.enemies.children.iterate((child) => {
            this.time.addEvent({
                delay: Phaser.Math.Between(100, 300) * Phaser.Math.Between(10,30) * Phaser.Math.Between(1,3),
                callback: ()=> {
                    if (!this.paused && !this.gameOver){
                        let bullet = new Bullet(this, child.x, child.y, 'ball');
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
            this.jumps = this.JUMP_MAX;
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
            
            //While in the air
            if (!this.isGrounded){
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
                this.falling = true;
                if(this.facing == 'left' && this.jump == false) {
                    this.player.play('fallingL',true);
                    this.player.setSize(30,50,false).setOffset(25,10);
                }
                else if(this.facing == 'right' && this.jump == false) {
                    this.player.play('fallingR',true);
                    this.player.setSize(30,50,false).setOffset(40,10);
                }
            }
            if (cursors.down.isDown){
                this.player.body.setAccelerationY(this.fastFall);
            }
            else{
                this.player.body.setAccelerationY(0);
                this.falling = true;
                if(this.facing == 'left' && this.jump == false) {
                    this.player.play('fallingL',true);
                    this.player.setSize(30,50,false).setOffset(25,10);
                }
                else if(this.facing == 'right' && this.jump == false) {
                    this.player.play('fallingR',true);
                    this.player.setSize(30,50,false).setOffset(40,10);
                }
            }
        }

        //Jumping
        if (this.slowMotion){
            this.jumpDuration = 1000;
        }
        else{
            this.jumpDuration = 200;
        }
        if(Phaser.Input.Keyboard.DownDuration(keySPACE, this.jumpDuration) && this.jumps > 0) {
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
        else if(Phaser.Input.Keyboard.UpDuration(keySPACE)) {
	    	this.jumps--;
        }
        if(justDownVal && this.player.body.onFloor()){
            this.jumpSFX.play();
        }


        //Wall Cling
        if (!this.player.body.onFloor()){
            if (this.player.body.blocked.left){
                if (cursors.left.isDown && !cursors.right.isDown && this.player.body.velocity.y > 0){
                    this.player.body.setVelocityX(-100)
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
                    console.log("Left Wall Jump");
                    this.wallSFX.play();
                    this.player.play('jumpR',true);
                    this.facing = 'right';
                    this.player.setSize(30,50,false).setOffset(40,10);
                    this.player.body.setVelocityX(this.wallJumpSpeedX);
                    this.player.body.setVelocityY(this.wallJumpSpeedY);
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
                    console.log("Right Wall Jump");
                    this.wallSFX.play();
                    this.player.play('jumpL',true);
                    this.facing = 'left';
                    this.player.setSize(30,50,false).setOffset(40,10);
                    this.player.body.setVelocityX(-this.wallJumpSpeedX);
                    this.player.body.setVelocityY(this.wallJumpSpeedY);
                }
            }
        }
        else{
            this.wallCling = false;
        }
    }

    slowMoUpdate(){
        //Slow Mo Time
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            if (this.slowMotion == false){
                console.log("Slow Mo On");
                this.slowSFX.play();
                //game.config.physics.gravity.y /= 5;

                //Slow down certain sounds when in slow mo
                this.laserSFX.rate = 1/this.slowSpeed;
                this.landSFX.rate = 1/this.slowSpeed;
                this.wallSFX.rate = 1/this.slowSpeed;
                this.ricochetSFX.rate = 1/this.slowSpeed;

                this.physics.world.timeScale = this.slowSpeed;
                this.time.timeScale = 1/this.slowSpeed;
                this.emitter.timeScale = 0.3;
                this.emitter.setLifespan(15000);
                this.boss.slowmo();
                this.slowMotion = true;

            }
            else if (this.slowMotion == true){
                console.log("Slow Mo Off");
                this.emitter.timeScale = 1;
                this.emitter.setLifespan(4000);
                this.slowSFX.stop();
                //game.config.physics.gravity.y *= 5;

                //Set sounds back to normal
                this.laserSFX.rate = 1;
                this.landSFX.rate = 1;
                this.wallSFX.rate = 1;
                this.ricochetSFX.rate = 1;
                this.boss.speedUp();
                this.physics.world.timeScale = 1;
                this.time.timeScale = 1;

                this.slowMotion = false;
            }
        }
    }
    freezeUpdate(){
        let player = this.player;
        //freeze
        if (Phaser.Input.Keyboard.DownDuration(keyX, 5000)){
            console.log("Freeze On");
            this.slowSFX.play();
            this.wallCling = false;
            this.player.body.setVelocity(0, 0);
            this.player.body.allowGravity = false;
            this.player.body.setAcceleration(0, 0);
            this.input.keyboard.on('keyup-X', function (event) {
                player.body.allowGravity = true;
            });
        }

    }

    pauseUpdate(){
        if (Phaser.Input.Keyboard.JustDown(keyESC)){
            if (!this.gameOver && this.paused == false){
                console.log("Game Paused");
                this.paused = true;
                this.emitter.timeScale = 0;
                this.pauseOnSFX.play();
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
                // this.tweens.add({
                //     targets: bgMusic,
                //     volume: 0,
                //     duration: 500,
                //     ease: 'Linear'
                // })
                // bgMusic.pause();
                this.anims.pauseAll();
                this.scene.launch("optionScene");
            }
            else if (!this.gameOver && this.paused == true){
                console.log("Game Unpaused");
                this.paused = false;
                this.emitter.timeScale = 1;
                this.pauseOffSFX.play();
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
                // this.tweens.add({
                //     targets: bgMusic,
                //     volume: bg_volume,
                //     duration: 500,
                //     ease: 'Linear'
                // })
                // bgMusic.resume();
                this.player.body.enable = true;
                this.anims.resumeAll();
                this.scene.stop("optionScene");
                cursors = this.input.keyboard.createCursorKeys();
                keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
                keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
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
            if (combo === dashLeft && this.dashCooldown == false) { 
                if (!this.isGrounded && !this.paused) {
                    this.dashCooldown = true;
                    this.player.anims.play('runL',true);
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(-this.movementSpeed * 2);
                    console.log("DASHED LEFT");
                    this.time.addEvent({
                        delay: 300,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
                        }
                    })
                    this.time.addEvent({
                        delay: 1000,
                        callback: ()=> {
                            this.dashCooldown = false;
                        }
                    })
                }
            }
            
            if (combo === dashRight && this.dashCooldown == false) {
                if (!this.isGrounded && !this.paused) {
                    this.dashCooldown = true;
                    this.player.anims.play('runR',true);
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(this.movementSpeed * 2);
                    console.log("DASHED RIGHT");
                    this.time.addEvent({
                        delay: 300,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
                        }
                    })
                    this.time.addEvent({
                        delay: 2000,
                        callback: ()=> {
                            this.dashCooldown = false;
                        }
                    })
                }              
            }   
        });
    }

    createCircle() {
        this.startAngle = this.tweens.addCounter({
            from: 0,
            to: 6.28,
            duration: 8000, //speed of rotation higher = slower
            repeat: -1
        })
    
        this.endAngle = this.tweens.addCounter({
            from: 6.28,
            to: 12.56,
            duration: 8000, //speed of rotation higher = slowerd
            repeat: -1
        })
    }

    musicUpdate()
    {
        if(!bgMusic.isPlaying)
        {
            nextSong = Phaser.Math.RND.pick(songList);
            while(bgMusic.key == nextSong)
            {
                nextSong = Phaser.Math.RND.pick(songList);
            }
            bgMusic = this.sound.add(nextSong);
            bgMusic.play();
            console.log("Now Playing: " + nextSong);
        }
    }
    checkWin(){
    }
}
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create()
    {
        console.log("In Credit Scene");
        keyESC= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        let creditsTextConfig = {
            fontFamily: 'Bradley Hand',
            fontSize: '80px',
            color: '#00FFFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        this.gameTitle = this.add.text(game.config.width / 2, game.config.height / 2, 'Junk Rat', creditsTextConfig).setOrigin(0.5);

        creditsTextConfig.color = '#FFC0CB';
        
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
                let textVar = this.add.text(game.config.width / 2, game.config.height + i * 40, groupArr[i], creditsTextConfig).setOrigin(0.5);
                this.groupText.add(textVar);
            }
        }
        
    }

    update(){
        this.zaWarudo();
        this.pauseUpdate();
        this.moveUpdate();
        this.slowMoUpdate();
        this.musicUpdate();
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
                this.player.play('fallingL',true);
                this.player.body.setAccelerationX(-this.airSpeed);
            }
            else if (cursors.right.isDown){
                this.player.play('fallingR',true);
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
                    this.player.anims.play('runL',true);
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(-this.movementSpeed);
                    this.dashSFX.play();
                    this.time.addEvent({
                        delay: 300,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
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
                    this.player.anims.play('runR',true);
                    this.player.body.allowGravity = false;
                    this.player.body.setVelocityY(0);
                    this.player.body.setVelocityX(this.movementSpeed);
                    this.dashSFX.play();
                    this.time.addEvent({
                        delay: 300,
                        callback: ()=> {
                            this.player.body.allowGravity = true;
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
}
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velX, velY) {

        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable();
        this.setVelocityX(velX);
        this.setVelocityY(velY);
        this.body.allowGravity = false;
        this.scene = scene;

        this.velX = velX;
        this.velY = velY;
    }

    update() {
        super.update();

        if(!this.scene.paused){
            this.body.enable = true;
        }
        else
        {
            this.body.enable = false;
        }
            
        //Horizontal Movement
        if(this.x <= 0 && this.body.velocity.x < 0)
        {
            this.body.velocity.x *= -1;
        }
        else if(this.x >= game.config.width && this.body.velocity.x > 0)
        {
            this.body.velocity.x *= -1;
        }

        //Vertical Movement
        if(this.y <= 0 && this.body.velocity.y < 0)
        {
            this.body.velocity.y *= -1;
        }
        else if(this.y >= game.config.height && this.body.velocity.y > 0)
        {
            this.body.velocity.y *= -1;
        }

        let changeXDirection = Phaser.Math.Between(0, 10000);
        let changeYDirection = Phaser.Math.Between(0, 10000);
        if(changeXDirection < 50)
        {
            console.log("Changed X");
            this.body.velocity.x *= -1;
        }
        if(changeYDirection < 50)
        {
            console.log("Changed Y");
            this.body.velocity.y *= -1; 
        }
    }
}
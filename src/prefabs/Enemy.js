class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, speed) {

        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityX(speed);
        this.body.allowGravity = false;
    }  
    
    update() {
        if(this.x <= 0 && this.body.velocity.x < 0)
        {
            this.body.velocity.x *= -1;
        }
        else if(this.x >= game.config.width && this.body.velocity.x > 0)
        {
            this.body.velocity.x *= -1;
        }
        
        /*
        if(this.moveLeft) {
            this.x -= this.speed;
            if(this.x <= -this.width + 32) {
                this.moveLeft = false;
            }
        }
        else {
            this.x += this.speed;
            if(this.x >= this.width) {
                this.moveLeft = true;
            }
        }
        */
    }
}
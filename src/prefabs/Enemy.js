class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velX, velY) {

        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityX(velX);
        this.setVelocityY(velY);
        this.body.allowGravity = false;
        this.scene = scene;  
    }

    update() {
        super.update();
        if (!this.scene.paused) {

        }
        else {
            
        }

        // //Horizontal Movement
        // if(this.x <= 0 && this.body.velocity.x < 0)
        // {
        //     this.body.velocity.x *= -1;
        // }
        // else if(this.x >= game.config.width && this.body.velocity.x > 0)
        // {
        //     this.body.velocity.x *= -1;
        // }

        // //Vertical Movement
        // if(this.y <= 0 && this.body.velocity.y < 0)
        // {
        //     this.body.velocity.y *= -1;
        // }
        // else if(this.y >= game.config.height && this.body.velocity.y > 0)
        // {
        //     this.body.velocity.y *= -1;
        // }
    }
}
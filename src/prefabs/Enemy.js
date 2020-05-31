class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velocity) {

        super(scene, x, y, texture);

        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setVelocityX(velocity);            // make it go!
        this.setImmovable();
        this.body.allowGravity = false;
        this.scene = scene;
        
    }
    update() {
        super.update();
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
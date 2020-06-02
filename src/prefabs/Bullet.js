class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.body.bounce.set(1)
        this.body.collideWorldBounds = true;
        this.body.setCircle(15, 10, 10);
        this.scene = scene;

        this.verticalError = 100;
        this.horizontalError = 100;
        this.angle = Phaser.Math.Angle.Between(this.x, this.y, 
            this.scene.player.x + Phaser.Math.Between(-this.horizontalError, this.horizontalError), 
            this.scene.player.y + Phaser.Math.Between(-this.verticalError, this.verticalError));
        scene.physics.velocityFromRotation(this.angle, 500, this.body.velocity);

        this.ricochetCount = 0;
    }
    update() {
        //Stop movement if scene is paused
        if(!this.scene.paused && !this.scene.gameOver){
            this.body.enable = true;
        }
        else
        {
            this.body.enable = false;
        }

        if (!this.body.blocked.none)
        {
            this.scene.ricochetSFX.play();
            this.ricochetCount++;
        }
        if(this.ricochetCount == 3)
        {
            this.destroy();
        }
    }
}
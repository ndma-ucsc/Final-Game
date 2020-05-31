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

        this.angle = Phaser.Math.Angle.BetweenPoints(this, this.scene.player);
        scene.physics.velocityFromRotation(this.angle, 300, this.body.velocity);

        this.ricochetCount = 0;
    }
    update() {
        if(!this.scene.paused){
            this.body.enable = true;
        }
        else
        {
            this.body.enable = false;
        }
        // if(this.body.blocked.left || this.body.blocked.up || this.body.blocked.down || this.body.blocked.right)
        if (!this.body.blocked.none)
        {
            this.ricochetCount++;
        }
        if(this.ricochetCount == 3)
        {
            this.destroy();
        }
    }
}
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, ricochet, angle) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.body.bounce.set(1)
        this.body.collideWorldBounds = true;
        this.body.setCircle(15, 10, 10);
        this.scene = scene;
        scene.physics.velocityFromRotation(angle, 300, this.body.velocity);
        this.ricochetCount = ricochet;
    }
    update() {
        super.update();
        if(!this.scene.paused && !this.scene.gameOver){
            this.body.enable = true;
        }
        else{
            this.body.enable = false;
        }

        if (!this.body.blocked.none) {
            this.scene.ricochetSFX.play();
            this.ricochetCount--;
        }
        if(this.ricochetCount == 0) {
            this.scene.boomSFX.play();
            this.destroy();
        }
    }
}
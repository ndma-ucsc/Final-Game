class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velX, velY) {

        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;

        this.setVelocityX(velX);
        this.setVelocityY(velY);
    }
    
}
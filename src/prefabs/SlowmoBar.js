// Slowmo prefab
class SlowmoBar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.endAngle = 360;
        this.draw();
        this.off = true;
        scene.add.existing(this.bar);
        
    }

    decrease () {
        this.endAngle -= 36;
        this.off = false;
        this.draw();
    }
    increase () {
        this.endAngle += 36;
        this.off = true;
        this.draw();
    }
    draw () {
        this.bar.clear();
        if(this.endAngle == 360) {
            this.bar.lineStyle(4, 0x00fff7, 1);
        }
        else {
            this.bar.lineStyle(4, 0x00a6ff, 1);
        }
        this.bar.beginPath();
        this.bar.arc(this.x + 40, this.y + 40, 20, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(this.endAngle), false);
        this.bar.strokePath();
    }

}
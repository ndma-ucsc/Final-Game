// Slowmo prefab
class SlowmoBar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 1000;
        this.p = 440 / 1000;

        this.draw();

        scene.add.existing(this.bar);
        
    }

    decrease (amount) {
        this.value -= amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw();
        return (this.value === 0);
    }
    increase (amount) {
        this.value += amount;
        if (this.value > 1000) {
            this.value = 1000;
        }
        this.draw();
        return (this.value === 1000);
    }
    draw () {
        this.bar.clear();

        if (this.value < 80) {
            this.bar.fillStyle(0xff0000);
        }
        else {
            this.bar.fillStyle(0x00ffee);
        }

        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}
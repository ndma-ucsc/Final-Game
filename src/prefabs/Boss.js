// Boss prefab
class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    
        // add object to existing scene
        scene.add.existing(this);
        this.bossFire = false; //track boss's firing status
        this.bossSpray = false;
        this.bossCollapse = false;
        this.projectileX;
        this.projectileY;
        this.projectileX2;
        this.projectileY2;
        this.projectileX3;
        this.projectileY3;
        this.projectileSpeed = 6;
        this.radius = 150;
        this.radius2 = 150;
        this.radius3 = 150;
        this.spraySpeed = 4;
        this.collapseSpeed = 6;
        this.collapse = false;
        this.rep = 0;
        this.offset = 0;
        
    }

    update(bombs,bombs2,bombs3,startAngle,endAngle,hitBox,hitBox2,hitBox3) {
        if(!this.bossFire && !this.bossSpray && !this.bossCollapse) {
            this.circle = new Phaser.Geom.Circle(this.projectileX + this.offset, this.projectileY + this.offset, this.radius); //<- radius of circle
            this.projectileX = this.x;
            this.projectileY = this.y;
            this.projectileX2 = this.x;
            this.projectileY2 = this.y;
            this.projectileX3 = this.x;
            this.projectileY3 = this.y;

            this.cyclonePos = Phaser.Actions.SetXY([this.circle], this.projectileX + this.offset, this.projectileY + this.offset);

            this.cyclone = Phaser.Actions.PlaceOnCircle(
                bombs.getChildren(), 
                this.circle, 
                startAngle.getValue(), 
                endAngle.getValue()
            );
            this.boxClone = Phaser.Actions.PlaceOnCircle(
                hitBox.getChildren(), 
                this.circle, 
                startAngle.getValue(), 
                endAngle.getValue()
            );
            let randValue = Phaser.Math.Between(1, 2);
            if(this.rep > 5) {
                randValue = 3;
            }
            if(randValue == 1) {
                this.rep = this.rep + randValue;
                this.bossFire = true;
                //this.sfxBoss.play();  // play sfx
            }
            else if(randValue == 2) {
                this.rep = this.rep + randValue;
                this.bossSpray = true;
                //this.sfxBoss3.play();  // play sfx
            }
            else if(randValue == 3) {
                this.bossCollapse = true;
                this.rep = 0;
                //this.sfxBoss2.play();  // play sfx
            }

        }

        //when firing
        if(this.bossFire && !this.bossSpray && !this.bossCollapse) {
            this.circle = new Phaser.Geom.Circle(this.projectileX + this.offset, this.projectileY + this.offset, this.radius); //<- radius of circle
            this.projectileY = this.projectileY + this.projectileSpeed;
            if(this.projectileY < 1200) {
                this.cyclonePos = Phaser.Actions.SetXY([this.circle], this.projectileX + this.offset, this.projectileY + this.offset);
    
                this.cyclone = Phaser.Actions.PlaceOnCircle(
                    bombs.getChildren(), 
                    this.circle, 
                    startAngle.getValue(), 
                    endAngle.getValue()
                );
                this.boxClone = Phaser.Actions.PlaceOnCircle(
                    hitBox.getChildren(), 
                    this.circle, 
                    startAngle.getValue(), 
                    endAngle.getValue()
                );
            }
        }

        //when spraying
        if(this.bossSpray && !this.bossFire && !this.bossCollapse) {
            this.newCircle = new Phaser.Geom.Circle(this.projectileX + this.offset, this.projectileY + this.offset, this.radius); //<- radius of circle
            this.newCircle2 = new Phaser.Geom.Circle(this.projectileX2 + this.offset, this.projectileY2 + this.offset, this.radius2); //<- radius of circle
            this.newCircle3 = new Phaser.Geom.Circle(this.projectileX3 + this.offset, this.projectileY3 + this.offset, this.radius3); //<- radius of circle
            this.radius = this.radius + this.spraySpeed;
            
            this.cyclonePos = Phaser.Actions.SetXY([this.newCircle], this.projectileX + this.offset, this.projectileY + this.offset);

            this.cyclone = Phaser.Actions.PlaceOnCircle(
                bombs.getChildren(), 
                this.newCircle, 
            );
            this.boxClone = Phaser.Actions.PlaceOnCircle(
                hitBox.getChildren(), 
                this.newCircle, 
            );

            if(this.radius >= 300) {
                bombs2.getChildren().forEach(function() {
                    bombs2.setVisible(true);
                }, this);
                if(this.radius == 300) {
                    this.projectileX2 = this.x;
                    this.projectileY2 = this.y;
                }
                this.radius2 = this.radius2 + this.spraySpeed;
                this.cyclonePos2 = Phaser.Actions.SetXY([this.newCircle2], this.projectileX2 + this.offset, this.projectileY2 + this.offset);

                this.cyclone2 = Phaser.Actions.PlaceOnCircle(
                    bombs2.getChildren(), 
                    this.newCircle2, 
                );
                this.boxClone2 = Phaser.Actions.PlaceOnCircle(
                    hitBox2.getChildren(), 
                    this.newCircle2, 
                );
            }
            if(this.radius2 >= 300) {
                bombs3.getChildren().forEach(function() {
                    bombs3.setVisible(true);
                }, this);
                if(this.radius2 == 300) {
                    this.projectileX3 = this.x;
                    this.projectileY3 = this.y;
                }
                this.radius3 = this.radius3 + this.spraySpeed;
                this.cyclonePos3 = Phaser.Actions.SetXY([this.newCircle3], this.projectileX3 + this.offset, this.projectileY3 + this.offset);

                this.cyclone3 = Phaser.Actions.PlaceOnCircle(
                    bombs3.getChildren(), 
                    this.newCircle3, 
                );
                this.boxClone3 = Phaser.Actions.PlaceOnCircle(
                    hitBox3.getChildren(), 
                    this.newCircle3, 
                );
            }
        }

        //when collapse
        if(this.bossCollapse && !this.bossSpray && !this.bossFire) {
            this.projectileX = this.x;
            this.projectileY = this.y;
            this.collapseCircle = new Phaser.Geom.Circle(this.projectileX + this.offset, this.projectileY + this.offset, this.radius); //<- radius of circle
            if(!this.collapse) {
                this.radius = this.radius - this.collapseSpeed;
                if(this.radius <= 10) {
                    this.collapse = true;
                }
            }
            else {
                this.radius = this.radius + this.collapseSpeed;
                if(this.radius >= 150) {
                    this.reset();
                }
            }

            this.cycloneCollapsePos = Phaser.Actions.SetXY([this.collapseCircle], this.projectileX + this.offset, this.projectileY + this.offset);

            this.cycloneCollapse = Phaser.Actions.PlaceOnCircle(
                bombs.getChildren(), 
                this.collapseCircle, 
            );
            this.boxCloneCollapse = Phaser.Actions.PlaceOnCircle(
                hitBox.getChildren(), 
                this.collapseCircle, 
            );
        }

        //reset when miss
        if(this.projectileY >= 1200) { 
            this.reset();
        }
        if(this.radius >= 1200 && this.radius2 >= 1200 && this.radius3 >= 1210) {
            this.reset();
        }
    }

    //reset projectile position back to boss
    reset() {
        this.bossFire = false;
        this.bossSpray = false;
        this.bossCollapse = false;
        this.collapse = false;
        this.projectileX = this.x;
        this.projectileY = this.y;
        this.projectileX2 = this.x;
        this.projectileY2 = this.y;
        this.projectileX3 = this.x;
        this.projectileY3 = this.y;
        this.radius = 150;
        this.radius2 = 150;
        this.radius3 = 150;
        
    }
    slowmo() {
        this.projectileSpeed = 3;
        this.spraySpeed = 2;
        this.collapseSpeed = 3;
    }
    speedUp() {
        this.projectileSpeed = 6;
        this.spraySpeed = 4;
        this.collapseSpeed = 6;
    }
}
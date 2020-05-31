class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    create() {
        console.log('GAME OVER');
        
        this.add.text(game.config.width/2, game.config.height/2, "YOU DIED YOU DUMBASS", {fontSize: "20px", color: "#FACADE"}).setOrigin(0.5);
    }

    update(){
        
        
    }
}
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload(){
        // loading bar frame
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(game.config.width / 4, game.config.height / 2, game.config.width / 2, 50);
        
        // loading... text
        var loadingText = this.make.text({
            x: game.config.width / 2 + 5,
            y: game.config.height / 2 - 30,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // loading percent text
        var percentText = this.make.text({
            x: game.config.width / 2,
            y: game.config.height / 2 + 70,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        // loader
        this.load.on('progress', function (value) {
            // console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            
            // active loading bar
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(game.config.width/4 + 10, game.config.height/2 + 10, (game.config.width / 2 - 20) * value, 30);
        });

        // load tracking
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });
        
        // destroy loading bar
        this.load.on('complete', function () {
            // console.log('complete');
            progressBar.destroy();
            progressBox.destroy();	
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.path = "./assets/music/";
        this.load.audio('Bad Flower', 'Bisou- Bad Flower.mp3');
        this.load.audio('Panda', 'Bisou- Panda.mp3');
        this.load.audio('Action Breakbeat', 'Bill Vortex- Action Breakbeat.mp3');
        this.load.audio('Followed', 'Shaolin Dub- Followed.mp3');
        this.load.audio('Turbo Giant', 'Wankers United- Turbo Giant.mp3');
        this.load.audio('Croissant Funk', 'Wankers United- Croissant Funk.mp3');
        this.load.audio('Kevlar Boys', 'Resonancedj & Giulio Maddaloni- Kevlar Boys.mp3');
        this.load.audio('Beamin', 'Strong Suit- Beamin.mp3');
        this.load.audio('Morphamish', 'Morphamish- Gumption Junction.mp3');

        this.load.path = "./assets/player/";
        this.load.spritesheet('runRight', 'run_right.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 7});
        this.load.spritesheet('runLeft', 'run_left.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 7});
        this.load.spritesheet('jumpRight', 'jump_right.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 5});
        this.load.spritesheet('jumpLeft', 'jump_left.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 5});
        this.load.spritesheet('jumpRight_recover', 'jump_right.png', {frameWidth: 100, frameHeight: 77, startFrame: 6, endFrame: 10});
        this.load.spritesheet('jumpLeft_recover', 'jump_left.png', {frameWidth: 100, frameHeight: 77, startFrame: 6, endFrame: 10});
        this.load.spritesheet('idleLeft', 'idle_left.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 3});
        this.load.spritesheet('idleRight', 'idle_right.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 3});
        this.load.spritesheet('wallclingLeft', 'wallcling_left.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 0});
        this.load.spritesheet('wallclingRight', 'wallcling_right.png', {frameWidth: 100, frameHeight: 77, startFrame: 0, endFrame: 0});
        this.load.image('player', 'player.png');

        this.load.path = "./assets/sfx/";
        this.load.audio('jump', 'Jump.wav');
        this.load.audio('pauseOn', 'Pause2.wav');
        this.load.audio('pauseOff', 'Pause1.wav');
        this.load.audio('land', 'Landing.wav');
        this.load.audio('slow', 'Slowmotion.wav');
        this.load.audio('wall', 'Wallslam.wav');
        this.load.audio("laser", "Laser.wav");
        this.load.audio('ricochet', 'Ricochet.wav');
        this.load.audio("death", "Hurt.wav");

        this.load.path = "./assets/backgrounds/";
        this.load.image('background1', 'tilemap.png');
        this.load.image('light', 'light.png');

        this.load.path = "./assets/sprites/";
        this.load.image("tiles", "tile1.png");
        this.load.image("robot", "robot.png");
        this.load.image("ball", "ball.png");
        this.load.spritesheet("oilcan", "Oilcan.png", {frameWidth: 46.5, frameHeight: 33, startFrame: 0, endFrame: 7});

        this.load.path = "./assets/tile_map/";
        this.load.tilemapTiledJSON("level_map_1", "tilemap01.json");
    }

    create() {
        bgMusic = this.sound.add(Phaser.Math.RND.pick(["Bad Flower", "Panda", "Action Breakbeat", "Followed", "Turbo Giant", "Croissant Funk", "Kevlar Boys", "Beamin", "Morphamish"]));
        bgMusic.play();
        this.scene.start("menuScene");
    }
}
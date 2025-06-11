class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    create() {
        this.map = this.make.tilemap({ key: "mapTitle" });
        const tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");

        // Add layers
        this.background = this.map.createLayer("Background", tileset, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tileset, 0, 0);

        this.cameras.main.setZoom(2.5);

        my.text.Title = this.add.text(game.config.width/2, game.config.height/2 - 70, "Dungeon Break", {
            fontFamily: 'Times, serif',
            fontSize: 45,
            color: '#FFFFFF'
        }).setOrigin(0.5);

        my.text.play = this.add.text(game.config.width/2, 450, "Play", {
            fontFamily: 'Times, serif',
            fontSize: 20,
            color: '#FFFF00'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.play.on('pointerdown', () => {
            this.scene.start("roomOneScene");
        });

        my.text.play.on('pointerover', () => {
            my.text.play.setStyle({ fill: '#90EE90' });
        });
        my.text.play.on('pointerout', () => {
            my.text.play.setStyle({ fill: '#FFFF00' });
        });

    }

    update() {

    }
}
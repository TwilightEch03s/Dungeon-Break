class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        this.cameras.main.setZoom(1.5);
        my.text.Credits = this.add.text(game.config.width/2, game.config.height/2 - 210, "Credits:", {
            fontFamily: 'Times, serif',
            fontSize: 80,
            color: '#32CD32'
        }).setOrigin(0.5);

        my.text.creditsText = this.add.text(game.config.width/2, game.config.height/2 - 100, "Game developed by: Tristan Chen, Lorenzo Uk, and Keith Kida", {
            fontFamily: 'Times, serif',
            fontSize: 19,
        }).setOrigin(0.5);

        my.text.creditsText2 = this.add.text(game.config.width/2, game.config.height/2 - 50, "Art Assets: https://kenney.nl/assets", {
            fontFamily: 'Times, serif',
            fontSize: 19,
        }).setOrigin(0.5);

        my.text.creditsText3 = this.add.text(game.config.width/2, game.config.height/2, "Audio Assets: https://pixabay.com/sound-effects/", {
            fontFamily: 'Times, serif',
            fontSize: 19,
        }).setOrigin(0.5);

        my.text.creditsText4 = this.add.text(game.config.width/2, game.config.height/2 + 50, "Music Used: Dark Cave theme from Pokemon Silver/Gold", {
            fontFamily: 'Times, serif',
            fontSize: 19,
        }).setOrigin(0.5);

        my.text.creditsText5 = this.add.text(game.config.width/2, game.config.height/2 + 100, "Made with Phaser Framework", {
            fontFamily: 'Times, serif',
            fontSize: 19,
        }).setOrigin(0.5);

        // Return button
        my.text.return = this.add.text(game.config.width/2, 600, "Return to Menu", {
            fontFamily: 'Times, serif',
            fontSize: 35,
            color: '#0096FF'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        my.text.return.on('pointerdown', () => {
            this.scene.start("titleScene");
        });

        my.text.return.on('pointerover', () => {
            my.text.return.setStyle({ fill: '#00FFFF' });
        });
        my.text.return.on('pointerout', () => {
            my.text.return.setStyle({ fill: '#0096FF' });
        });
    }
}
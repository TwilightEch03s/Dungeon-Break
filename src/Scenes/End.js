class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    create() {
        this.cameras.main.setZoom(2.5);
        my.text.Escaped = this.add.text(game.config.width/2, game.config.height/2 - 30, "You've Successfully Escaped!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            color: '#FFFFFF'
        }).setOrigin(0.5);

        my.text.Thanks = this.add.text(game.config.width/2, game.config.height/2, "Thanks for playing!", {
            fontFamily: 'Times, serif',
            fontSize: 18,
            color: '#FFFFFF'
        }).setOrigin(0.5);

        my.text.return = this.add.text(game.config.width/2, 490, "Return to Menu", {
            fontFamily: 'Times, serif',
            fontSize: 20,
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
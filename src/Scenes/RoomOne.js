class RoomOne extends Phaser.Scene {
    constructor() {
        super("roomOneScene");
        this.wKey = null;
        this.aKey = null;
        this.sKey = null;
        this.dKey = null;
    }

    init() {

    }

    preload() {

    }

    create() {
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        my.sprite.player = this.add.sprite(400, 300, "platformer_characters", "tile_0020.png");
        my.sprite.player.setScale(3);
    }

    update() {
        if (this.wKey.isDown) {
            my.sprite.player.y -= 5;
        } else if (this.sKey.isDown) {
            my.sprite.player.y += 5;
        } else if (this.aKey.isDown) {
            my.sprite.player.x -= 5;
        } else if (this.dKey.isDown) {
            my.sprite.player.x += 5;
        }
    }
}
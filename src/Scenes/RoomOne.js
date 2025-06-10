class RoomOne extends Phaser.Scene {
    constructor() {
        super("roomOneScene");
        
    }

    init() {
        this.SPEED = 1.5
        this.ACCELERATION = 150;
        this.SCALE = 3.0;
        this.isMoving = false;
    }
    create() {        
        // Load tilemap
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage("tilemap_pack", "tilemap_tiles");

        // Add layers
        this.ground = this.map.createLayer("Ground", tileset, 0, 0);
        this.wall = this.map.createLayer("Wall", tileset, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tileset, 0, 0);

        // Enable collision on wall layer
        this.wall.setCollisionByProperty({ collides: true });

        // Input Setup
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Add player sprite
        my.sprite.player = this.physics.add.sprite(400, 300, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(1);
        my.sprite.player.body.setCollideWorldBounds(true);

        // Collide player with wall layer
        this.physics.add.collider(my.sprite.player, this.wall);
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.startFollow(my.sprite.player);
    }


    update() {
        const player = my.sprite.player;

        // Set velocity
        let velocityX = 0;
        let velocityY = 0;

        // Movement
        if (this.wKey.isDown) {
            velocityY = -1;
            player.anims.play('walk', true);
            this.isMoving = true;
        } else if (this.sKey.isDown) {
            velocityY = 1;
            player.anims.play('walk', true);
            this.isMoving = true;
        } else if(this.aKey.isDown) {
            velocityX = -1;
            player.resetFlip();
            player.anims.play('walk', true);
            this.isMoving = true;
        } else if (this.dKey.isDown) {
            velocityX = 1;
            player.setFlip(true, false);
            player.anims.play('walk', true);
            this.isMoving = true;
        }
        else {
            player.anims.play('idle');
            this.isMoving = false;
        }

        // Movement sfx
        if (this.isMoving) {
            if (!my.sfx.walking.isPlaying) {
                my.sfx.walking.play();
            }
        }
        else {
            if (my.sfx.walking.isPlaying) {
                my.sfx.walking.stop();
            }
        }
        const vec = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        player.setVelocity(vec.x * this.ACCELERATION, vec.y * this.ACCELERATION);
    }

}

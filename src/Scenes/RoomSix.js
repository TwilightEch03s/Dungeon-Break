class RoomSix extends Phaser.Scene {
    constructor() {
        super("roomSixScene");
    }

    init() {
        // Variables and Settings
        this.ACCELERATION = 120;
        this.SCALE = 3.0;
        this.isMoving = false;
        this.transitioning = false;
        this.doorTriggered = false;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

    }
    create() {  
        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.map = this.make.tilemap({ key: "map6" });
        const tileset1 = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        const tileset2 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles2");
        const tilesets = [tileset1, tileset2];
        this.animatedTiles.init(this.map);

        this.ground = this.map.createLayer("Ground", tilesets, 0, 0);
        this.wall = this.map.createLayer("Wall", tilesets, 0, 0);
        this.wrong = this.map.createLayer("Wrong", tilesets, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tilesets, 0, 0);

        this.wall.setCollisionByProperty({ collides: true });
        this.wrong.setCollisionByProperty({ wrong: true });
        this.decorations.setCollisionByProperty({ exit: true });


        // Input Setup
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Add player sprite
        my.sprite.player = this.physics.add.sprite(408, 690, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.wall);
        this.physics.add.overlap(my.sprite.player, this.wrong, this.handleWrongTile, null, this);
        this.physics.add.collider(my.sprite.player, this.decorations, this.handleDoorCollision, null, this);
        this.physics.add.collider(my.sprite.player, this.decorations);

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
        } else if (this.aKey.isDown) {
            velocityX = -1;
            player.resetFlip();
            player.anims.play('walk', true);
            this.isMoving = true;
        } else if (this.dKey.isDown) {
            velocityX = 1;
            player.setFlip(true, false);
            player.anims.play('walk', true);
            this.isMoving = true;
        } else {
            player.anims.play('idle');
            this.isMoving = false;
        }

        // Movement sfx
        if (this.isMoving) {
            if (!my.sfx.walking.isPlaying) {
                my.sfx.walking.play();
            }
        } else {
            if (my.sfx.walking.isPlaying) {
                my.sfx.walking.stop();
            }
        }

        const vec = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        player.setVelocity(vec.x * this.ACCELERATION, vec.y * this.ACCELERATION);
    }

    handleWrongTile(player, tile) {
        const tileProps = tile.properties || {};
        if (tileProps.wrong && !this.transitioning) {
            this.transitioning = true;
            // TODO: Add Sound
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.time.delayedCall(500, () => {
                this.transitioning = false;
                this.scene.start("roomFiveScene");
            });
        }

        
    }

    handleDoorCollision() {
        if (!this.transitioning) {
            this.transitioning = true;
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("endScene");
            });
        }
    }
}
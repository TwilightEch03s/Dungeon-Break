class RoomFive extends Phaser.Scene {
    constructor() {
        super("roomFiveScene");
    }

    init() {
        // Variables and Settings
        this.ACCELERATION = 120;
        this.SCALE = 3.0;
        this.isMoving = false;
        this.transitioning = false;
        this.wallBroke = false;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {  
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.map = this.make.tilemap({ key: "map5" });
        const tileset1 = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        const tileset2 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles2");
        const tileset3 = this.map.addTilesetImage("tilemap3_packed ", "tilemap_tiles3");
        const tilesets = [tileset1, tileset2, tileset3];
        this.animatedTiles.init(this.map);

        this.ground = this.map.createLayer("Ground", tilesets, 0, 0);
        this.wall = this.map.createLayer("Wall", tilesets, 0, 0);
        this.cracked = this.map.createLayer("Cracked", tilesets, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tilesets, 0, 0);

        this.wall.setCollisionByProperty({ collides: true });
        this.decorations.setCollisionByProperty({ cracked: true });

        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        my.sprite.player = this.physics.add.sprite(712, 80, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.body.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.wall);
        this.physics.add.overlap(my.sprite.player, this.cracked, this.handleCrackeWalls, null, this);
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

    
    handleCrackeWalls(player, tile) {
                const tileProps = tile.properties || {};
            if (tileProps.cracked && !this.transitioning && !this.wallBroke) {
                this.transitioning = true;
                this.wallBroke = true;
                
                this.cracked.visible = false;
                
                this.sound.play("wallcracked");
                
            }
    }
}

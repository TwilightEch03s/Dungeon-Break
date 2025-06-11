class RoomTwo extends Phaser.Scene {
    constructor() {
        super("roomTwoScene");
    }

    init() {
        this.ACCELERATION = 120;
        this.SCALE = 3.0;
        this.isMoving = false;
        this.transitioning = false;
        this.doorTriggered = false;
        this.vaultOpened = false;
        this.keysObtained = 0;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // Load tilemap
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.map = this.make.tilemap({ key: "map2" });
        const tileset1 = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        const tileset2 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles2");
        const tileset3 = this.map.addTilesetImage("tilemap3_packed ", "tilemap_tiles3");
        const tilesets = [tileset1, tileset2, tileset3];
        this.animatedTiles.init(this.map);

        // Add layers
        this.ground = this.map.createLayer("Ground", tilesets, 0, 0);
        this.wall = this.map.createLayer("Wall", tilesets, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tilesets, 0, 0);
        this.doors1 = this.map.createLayer("Doors1", tilesets, 0, 0);
        this.doors2 = this.map.createLayer("Doors2", tilesets, 0, 0);
        this.vault = this.map.createLayer("Vault", tilesets, 0, 0);
        this.keys = this.map.createLayer("Keys", tilesets, 0, 0);


        // Enable collision on wall layer
        this.wall.setCollisionByProperty({ collides: true });
        this.vault.setCollisionByProperty({ collides: true });

        // Objects
        this.keys = this.map.createFromObjects("Objects", {
            name: "Key",
            key: "tilemap_sheet3",
            frame: 27
        });
        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.keys);
        
        // Input Setup
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Add player sprite
        my.sprite.player = this.physics.add.sprite(712, 80, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.body.setCollideWorldBounds(true);

        // Collide player with wall layer
        this.physics.add.collider(my.sprite.player, this.wall);
        this.physics.add.collider(my.sprite.player, this.vault);
        this.physics.add.overlap(my.sprite.player, this.doors2, this.handleDoorOverlap, null, this);

        // Vault Collisions
        // Make trigger zone at vault
        const vaultTriggerObj = this.map.findObject("Triggers", obj => obj.name === "VaultTrigger");
        this.vaultTrigger = this.add.zone(vaultTriggerObj.x, vaultTriggerObj.y, vaultTriggerObj.width, vaultTriggerObj.height);
        this.physics.world.enable(this.vaultTrigger);
        this.vaultTrigger.body.setAllowGravity(false);
        this.vaultTrigger.body.setImmovable(true);
        this.physics.add.overlap(my.sprite.player, this.vaultTrigger, this.openVault, null, this);

        // Object collisions
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (player, key) => {
            key.destroy(); // remove key on overlap
            this.sound.play("keyObtain", {
                volume: 1
            });
            this.keysObtained++;
            my.text.keysObtained.setText("Keys: " + this.keysObtained);
        });

        // Camera 
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.startFollow(my.sprite.player);

        // UI elements
        my.text.keysObtained = this.add.text(275, 270, "Keys: " + this.keysObtained, {
            fontSize: '20px',
            fill: '#ffffff',
        }).setScrollFactor(0);

        this.decorations.setCollisionByProperty({ exit: true });
        this.physics.add.collider(my.sprite.player, this.decorations, this.handleDoorCollision, null, this);
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

    handleDoorOverlap(player, tile) {
        const tileProps = tile.properties || {};
        if (tileProps.door && !this.transitioning && !this.doorTriggered) {
            this.transitioning = true;
            this.doorTriggered = true;
            
            this.doors1.visible = false;
            this.doors2.visible = false;
            
            this.sound.play("doorOpen");
            
            this.time.delayedCall(600, () => {
                this.sound.play("doorClose");
                
                this.doors1.visible = true;
                this.doors2.visible = true;
                
                this.transitioning = false;
                this.doorTriggered = false;
            });
        }
    }

    openVault(player, trigger) {
        if (this.keysObtained > 0 && !this.vaultOpened) {
            this.vaultOpened = true;
    
            this.vault.forEachTile(tile => {
                if (tile.properties.collides) {
                    tile.setCollision(false);
                    tile.visible = false;
                }
            });
    
            this.sound.play("doorOpen");
            this.keysObtained--;
            my.text.keysObtained.setText("Keys: " + this.keysObtained);
        }
    }

    handleDoorCollision() {
        if (!this.transitioning) {
            this.transitioning = true;
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("roomThreeScene");
            });
        }
    }
    

}

class RoomOne extends Phaser.Scene {
    constructor() {
        super("roomOneScene");
        
    }

    init() {
        this.ACCELERATION = 120;
        this.SCALE = 3.0;
        this.PARTICLE_VELOCITY = 50;
        this.isMoving = false;
        this.transitioning = false;
    }
    create() {        
        // Load tilemap
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage("tilemap_pack", "tilemap_tiles");

        // Add layers
        this.ground = this.map.createLayer("Ground", tileset, 0, 0);
        this.wall = this.map.createLayer("Wall", tileset, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tileset, 0, 0);
        this.decorations2 = this.map.createLayer("Decorations2", tileset, 0, 0);


        // Enable collision on wall layer
        this.wall.setCollisionByProperty({ collides: true });
        this.decorations.setCollisionByProperty({ door: true });


        // Input Setup
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Add player sprite
        my.sprite.player = this.physics.add.sprite(260, 190, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.body.setCollideWorldBounds(true);

        // Collide player with wall layer
        this.physics.add.collider(my.sprite.player, this.wall);

        // Camera
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.startFollow(my.sprite.player);

        this.physics.add.collider(my.sprite.player, this.decorations, this.handleDoorCollision, null, this);

        // VFX
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_02.png'],
            scale: {start: 0.02, end: 0.04},
            random: true,
            lifespan: 350,
            maxAliveParticles: 6,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -200,
        });
        my.vfx.walking.stop();

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
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        } else if (this.sKey.isDown) {
            velocityY = 1;
            player.anims.play('walk', true);
            this.isMoving = true;
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        } else if(this.aKey.isDown) {
            velocityX = -1;
            player.resetFlip();
            player.anims.play('walk', true);
            this.isMoving = true;
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        } else if (this.dKey.isDown) {
            velocityX = 1;
            player.setFlip(true, false);
            player.anims.play('walk', true);
            this.isMoving = true;
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            my.vfx.walking.start();
        }
        else {
            player.anims.play('idle');
            this.isMoving = false;
            my.vfx.walking.stop();
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

    handleDoorCollision() {
        if (!this.transitioning) {
            this.transitioning = true;
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("roomTwoScene");
            });
        }
    }
}

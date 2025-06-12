class RoomFour extends Phaser.Scene {
    constructor() {
        super("roomFourScene");
    }

    init() {
        this.ACCELERATION = 120;
        this.SCALE = 2.0;
        this.PARTICLE_VELOCITY = 50;
        this.isMoving = false;
        this.transitioning = false;
        this.doorTriggered = false;
        this.cookOn = false;
        this.potOn = false;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // Load tilemap
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.map = this.make.tilemap({ key: "map4" });
        const tileset1 = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        const tileset2 = this.map.addTilesetImage("tilemap2_packed", "tilemap_tiles2");
        const tileset3 = this.map.addTilesetImage("tilemap3_packed ", "tilemap_tiles3");
        const tilesets = [tileset1, tileset2, tileset3];
        this.animatedTiles.init(this.map);

        // Add layers
        this.ground = this.map.createLayer("Ground", tilesets, 0, 0);
        this.wall = this.map.createLayer("Wall", tilesets, 0, 0);
        this.decorations = this.map.createLayer("Decorations", tilesets, 0, 0);
        this.exit = this.map.createLayer("Exit", tilesets, 0, 0);


        // Enable collision on wall layer
        this.wall.setCollisionByProperty({ collides: true });
        this.decorations.setCollisionByProperty({ collides: true });
        this.exit.setCollisionByProperty({ exit: true });

        // Plant pot object
        this.pot = this.map.createFromObjects("Objects", {
            name: "pot",
            key: "tilemap_sheet2",
            frame: 16
        });
        
        this.potTile = this.map.worldToTileXY(this.pot[0].x, this.pot[0].y);

        // Stove object
        this.physics.world.enable(this.pot, Phaser.Physics.Arcade.STATIC_BODY);
        this.cook = this.map.createFromObjects("Objects", {
            name: "cook",
            key: "tilemap_sheet2",
            frame: 404
        });
        this.physics.world.enable(this.cook, Phaser.Physics.Arcade.STATIC_BODY);

        // Input setup
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Add player sprite
        my.sprite.player = this.physics.add.sprite(392, 690, "platformer_characters", "tile_0006.png");
        my.sprite.player.setScale(0.8);
        my.sprite.player.body.setCollideWorldBounds(true);

        //Guards
        my.sprite.npc = this.add.sprite(385, 80, "platformer_characters", "tile_0009.png");
        my.sprite.npc2 = this.add.sprite(400, 80, "platformer_characters", "tile_0009.png");
        
        this.physics.add.existing(my.sprite.npc, false);
        my.sprite.npc.body.setImmovable(true);

        this.physics.add.existing(my.sprite.npc2, false);
        my.sprite.npc2.body.setImmovable(true);

        // Exit collision
        this.physics.add.collider(my.sprite.player, this.exit, this.handleDoorCollision, null, this);

        // Collide player with wall layer
        this.physics.add.collider(my.sprite.player, my.sprite.npc);
        this.physics.add.collider(my.sprite.player, my.sprite.npc2);
        this.physics.add.collider(my.sprite.player, this.wall);
        this.physics.add.collider(my.sprite.player, this.decorations);
        

        // Object collisions
        this.physics.add.overlap(my.sprite.player, this.pot, (player, pot) => {
            if (!this.potOn) {
                pot.setFrame(18);
                this.potOn = true;
                this.sound.play("glass");
                this.potVFX.stop();
                const grid = this.layersToGrid([this.wall, this.decorations]);
                const startTile = this.map.worldToTileXY(my.sprite.npc.x, my.sprite.npc.y);
                const potTile = this.map.worldToTileXY(pot.x, pot.y);
                const path = this.findPath(startTile, potTile, grid);

                if (path) {
                    this.moveNPC(path, my.sprite.npc);
                }
            }
        });

        this.physics.add.overlap(my.sprite.player, this.cook, (player, cook) => {
            if (!this.cookOn) {
                this.cookOn = true;
                this.sound.play("cook", {
                    volume: 0.5
                });
                this.ACCELERATION = 0;
                this.cookVFX.stop();
                const grid = this.layersToGrid([this.wall, this.decorations]);
                const startTile = this.map.worldToTileXY(my.sprite.npc2.x, my.sprite.npc2.y);
                const cookTile = this.map.worldToTileXY(cook.x, cook.y);
                const path = this.findPath(startTile, cookTile, grid);

                if (path) {
                    this.moveNPC(path, my.sprite.npc2);
                }

                this.time.delayedCall(3000, () => {
                    this.ACCELERATION = 120;
                });
            }
        });

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

        // Spark burst for interaction
        // Looping sparkle VFX for pot
        this.potVFX = this.add.particles(0, 0, "kenny-particles", {
            frame: ['sparkle_01.png', 'sparkle_02.png'],  // Choose actual sparkle frame names
            scale: { start: 0.05, end: 0.01 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            frequency: 300,
            quantity: 1,
            speed: 10
        });
        this.potVFX.startFollow(this.pot[0], this.pot[0].width - 20, this.pot[0].height - 20, false);

        // Looping sparkle VFX for cook
        this.cookVFX = this.add.particles(0, 0, "kenny-particles", {
            frame: ['sparkle_01.png', 'sparkle_02.png'],
            scale: { start: 0.05, end: 0.01 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            frequency: 300,
            quantity: 1,
            speed: 10
        });
        this.cookVFX.startFollow(this.cook[0], this.cook[0].width - 20, this.cook[0].height - 20, false);

        // Guard walking particles
        my.vfx.npcWalk = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_02.png'],
            scale: { start: 0.02, end: 0.05 },
            random: true,
            lifespan: 350,
            maxAliveParticles: 6,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -200,
        });
        my.vfx.npcWalk.stop();

        my.vfx.npc2Walk = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_01.png', 'smoke_02.png'],
            scale: { start: 0.02, end: 0.05 },
            random: true,
            lifespan: 350,
            maxAliveParticles: 6,
            alpha: {start: 1, end: 0.1}, 
            gravityY: -200,
        });
        my.vfx.npc2Walk.stop();


        // Camera 
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
        } else {
            if (my.sfx.walking.isPlaying) {
                my.sfx.walking.stop();
            }
        }

        const vec = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        player.setVelocity(vec.x * this.ACCELERATION, vec.y * this.ACCELERATION);
    }


    // Setting each layer as a grid
    layersToGrid(layers) {
        let grid = [];
        let rows = this.map.height;
        let cols = this.map.width;

        for (let i = 0; i < rows; i++) {
            grid[i] = [];
            for (let j = 0; j < cols; j++) {
                grid[i][j] = 0;
            }
        }

        for (let layer of layers) {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    let tile = layer.getTileAt(x, y);
                    if (tile !== null && tile.collides) {
                        grid[y][x] = 1;
                    }
                }
            }
        }

        return grid;
    }

    // Guards moving
    moveNPC(path, character) {
        const emitter = character === my.sprite.npc ? my.vfx.npcWalk : my.vfx.npc2Walk;
        emitter.startFollow(character, character.displayWidth / 2, character.displayHeight / 2, false);
        emitter.start();
        character.anims.play('npcWalk', true);

        const tweens = [];

        for (let i = 0; i < path.length - 1; i++) {
            const ex = path[i + 1].x * this.map.tileWidth;
            const ey = path[i + 1].y * this.map.tileHeight;

            tweens.push({
                x: ex,
                y: ey,
                duration: 200,
                ease: 'Linear'
            });
        }

        this.tweens.chain({
            targets: character,
            tweens: tweens,
            onComplete: () => {
                emitter.stop();
                if (character.body) {
                    character.body.setVelocity(0, 0);
                }
                character.anims.stop();
            }
        });
    }


    // BFS Algorithm
    findPath(start, goal, grid) {
        const numRows = grid.length;
        const numCols = grid[0].length;
        let visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
        let queue = [{ pos: start, path: [start] }];

        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 }
        ];

        while (queue.length > 0) {
            const { pos, path } = queue.shift();
            if (pos.x === goal.x && pos.y === goal.y) return path;

            for (let dir of directions) {
                const nx = pos.x + dir.x;
                const ny = pos.y + dir.y;

                if (
                    nx >= 0 && nx < numCols &&
                    ny >= 0 && ny < numRows &&
                    !visited[ny][nx] && grid[ny][nx] === 0
                ) {
                    visited[ny][nx] = true;
                    queue.push({ pos: { x: nx, y: ny }, path: [...path, { x: nx, y: ny }] });
                }
            }
        }
        return null;
    }

    handleDoorCollision() {
        if (!this.transitioning) {
            this.transitioning = true;
            this.cameras.main.fadeOut(500, 0, 0, 0); 
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("roomFiveScene");
            });
        }
    }
}

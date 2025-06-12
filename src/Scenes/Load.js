class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.image("tilemap_tiles2", "tilemap2_packed.png");
        this.load.image("tilemap_tiles3", "tilemap3_packed.png");

        this.load.tilemapTiledJSON("mapTitle", "titleScreen.json");
        this.load.tilemapTiledJSON("map", "floorOne.json");
        this.load.tilemapTiledJSON("map2", "floorTwo.json");
        this.load.tilemapTiledJSON("map3", "floorThree.json");
        this.load.tilemapTiledJSON("map4", "floorFour.json");
        this.load.tilemapTiledJSON("map5", "floorFive.json");
        this.load.tilemapTiledJSON("map6", "floorSix.json");



        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 17,
            frameHeight: 17
        });

        this.load.spritesheet("tilemap_sheet2", "tilemap2_packed.png", {
            frameWidth: 17,
            frameHeight: 17
        });

        this.load.spritesheet("tilemap_sheet3", "tilemap3_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Audio
        this.load.audio("walking", "walking_audio.mp3")
        this.load.audio("doorOpen", "minecraft-door-open.mp3")
        this.load.audio("doorClose", "minecraft-door-close.mp3")
        this.load.audio("keyObtain", "keyObtain.mp3")
        this.load.audio("lever", "leverSFX.mp3")

        this.load.audio("music", "cave.mp3")
        this.load.audio("fall", "fall.mp3")
        this.load.audio("rock", "rock.mp3")

        this.load.audio("glass", "glass.mp3")
        this.load.audio("cook", "cook.mp3")

    }
    

    create() {

        if (!this.sound.get('music')) {
        my.sfx.music = this.sound.add("music", {
            loop: true,
            volume: 0.2
        });

        my.sfx.music.play();
    }

        this.scene.start("titleScene");
        //this.scene.start("roomOneScene");
        //this.scene.start("roomTwoScene");
        //this.scene.start("roomThreeScene");
        this.scene.start("roomFourScene");
        //this.scene.start("roomFivecene");
        //this.scene.start("roomSixScene");
        //this.scene.start("endScene");

        // Walk animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        // Idle animation
        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        // Walk sfx
        my.sfx.walking = this.sound.add("walking", {
            loop: true,
            volume: 0.5
        });

    }

    update() {
    }
}

class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("map", "floorOne.json");
        this.load.tilemapTiledJSON("map2", "floorTwo.json");

        // Audio
        this.load.audio("walking", "walking_audio.mp3")

    }
    

    create() {
        this.scene.start("roomOneScene");

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

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        my.sfx.walking = this.sound.add("walking", {
            loop: true,
            volume: 0.5
        });

    }

    update() {
    }
}

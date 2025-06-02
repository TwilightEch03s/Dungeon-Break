class RoomSix extends Phaser.Scene {
    constructor() {
        super("RoomSixScene");
    }

    init() {
        // Variables and Settings

    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }
    create() {  

    }

    update() {

    }
}
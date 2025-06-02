class RoomThree extends Phaser.Scene {
    constructor() {
        super("RoomThreeScene");
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
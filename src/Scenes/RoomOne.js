class RoomOne extends Phaser.Scene {
    constructor() {
        super("RoomOneScene");
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
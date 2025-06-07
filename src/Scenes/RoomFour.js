class RoomFour extends Phaser.Scene {
    constructor() {
        super("RoomFourScene");
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
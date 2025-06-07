class RoomFive extends Phaser.Scene {
    constructor() {
        super("roomFiveScene");
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
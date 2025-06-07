class RoomTwo extends Phaser.Scene {
    constructor() {
        super("roomTwoScene");
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
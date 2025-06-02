"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    fps: {forceSetTimeOut: true, target: 60},
    width: 800,
    height: 600,
    scene: [Load, RoomOne, RoomTwo, RoomThree, RoomFour, RoomFive, RoomSix]
}

const game = new Phaser.Game(config);
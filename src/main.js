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
    scene: [Load, RoomOne, RoomThree, RoomFour, RoomFive, RoomSix]

}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);
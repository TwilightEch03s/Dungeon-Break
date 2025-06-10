"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    fps: {forceSetTimeOut: true, target: 60},
    width: 800,
    height: 800,
    scene: [Load, RoomOne, RoomThree, RoomFour, RoomFive, RoomSix]

}

var my = {sprite: {}, text: {}, vfx: {}, sfx: {}};

const game = new Phaser.Game(config);
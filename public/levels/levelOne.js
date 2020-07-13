var levelOne = {
    srcs: [
        { "F": "dungeon_floor.png", width: 96, height: 80 },
        { "X": "dungeon_walls.png", width: 96, height: 96 },
        { "A": "knight.png", width: 144, height: 64 }
    ],
    animations: [{
        entity: "A", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100, faceOffSet: 32
    },
    {
        entity: "A", name: "Run", frames: [
            { x: 64, y: 0, width: 16, height: 32 },
            { x: 80, y: 0, width: 16, height: 32 },
            { x: 96, y: 0, width: 16, height: 32 },
            { x: 112, y: 0, width: 16, height: 32 }
        ], interval: 100, faceOffSet: 32
    },
    {
        entity: "A", name: "Jump", frames: [
            { x: 128, y: 0, width: 16, height: 32 },
            { x: 128, y: 0, width: 16, height: 32 },
            { x: 128, y: 0, width: 16, height: 32 },
            { x: 128, y: 0, width: 16, height: 32 }
        ], interval: 100, faceOffSet: 32
    }],
    startPositions: [
        { x: 02 * 16, y: 02 * 16 },
        { x: 02 * 16, y: 90 * 16 },
        { x: 90 * 16, y: 90 * 16 },
        { x: 90 * 16, y: 02 * 16 }
    ],
    size: 47
}
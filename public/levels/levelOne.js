var levelOne = {
    srcs: [
        { "F": "dungeon_floor.png", width: 96, height: 80 },
        { "X": "dungeon_walls.png", width: 96, height: 96 },
        { "A": "knight.png", width: 144, height: 64 },
        { "b": "enemies_bob.png", width: 128, height: 96 },
        { "c": "enemies_clovis.png", width: 128, height: 96 },
        { "d": "enemies_dug.png", width: 128, height: 96 },
        { "e": "enemies_earl.png", width: 128, height: 96 },
        { "f": "enemies_frank.png", width: 128, height: 96 },
        { "g": "enemies_greg.png", width: 128, height: 96 },
        { "h": "enemies_hank.png", width: 128, height: 96 },
        { "i": "enemies_igor.png", width: 128, height: 96 },        
        { "m": "mapframe.png", width: 38, height: 24 }
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
    },
    {
        entity: "X", name: "LFA", frames: [
            { x: 48, y: 48, width: 16, height: 16 },
            { x: 64, y: 48, width: 16, height: 16 },
            { x: 80, y: 48, width: 16, height: 16 }
        ], interval: 100
    },
    {
        entity: "X", name: "LFB", frames: [
            { x: 48, y: 80, width: 16, height: 16 },
            { x: 64, y: 80, width: 16, height: 16 },
            { x: 80, y: 80, width: 16, height: 16 }
        ], interval: 100
    },
    {
        entity: "F", name: "WLFA", frames: [
            { x: 48, y: 16, width: 16, height: 16 },
            { x: 64, y: 16, width: 16, height: 16 },
            { x: 80, y: 16, width: 16, height: 16 }
        ], interval: 100
    },
    {
        entity: "F", name: "WLFB", frames: [
            { x: 48, y: 0, width: 16, height: 16 },
            { x: 64, y: 0, width: 16, height: 16 },
            { x: 80, y: 0, width: 16, height: 16 }
        ], interval: 100
    },
    {
        entity: "b", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "b", name: "Moving", frames: [
            { x: 64, y: 0, width: 16, height: 32 },
            { x: 80, y: 0, width: 16, height: 32 },
            { x: 96, y: 0, width: 16, height: 32 },
            { x: 112, y: 0, width: 16, height: 32 }
        ], interval: 100, faceOffSet: 32
    },
    {
        entity: "c", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "d", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "e", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "f", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "g", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "h", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    },
    {
        entity: "i", name: "Idle", frames: [
            { x: 0, y: 0, width: 16, height: 32 },
            { x: 16, y: 0, width: 16, height: 32 },
            { x: 32, y: 0, width: 16, height: 32 },
            { x: 48, y: 0, width: 16, height: 32 }
        ], interval: 100
    }],
    startPositions: [
        { x: 2 * 16, y: 2 * 16 },
        { x: 2 * 16, y: 90 * 16 },
        { x: 90 * 16, y: 90 * 16 },
        { x: 90 * 16, y: 2 * 16 }
    ],
    size: 47
}

export {levelOne};
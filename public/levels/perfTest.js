var perfTest = { tiles:
    "X1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n"+
    "X                      X╝      XX                                                                                     X\n"+
    "X   CX4   XXX                  ╚X                       ╔X                                                            X\n"+
    "XCC CXXXXXX       X╗               X╗   X╗1        p    XX                                     XXX   X X              X\n"+
    "XCXXXXXXXXX C    XXX╗1       X     2 ╗  XXX╗1    ╔X╗                                           X X        X  X        X\n"+
    "X           C  XXXXXXX╗2     X        ╗ XXXXX╗1 ╔XXX╗                                          XXX   X X              X\n"+
    "XXX    X4   XXXXXXXXXXXXX╗2        X2 XXXXXXXXXXXXXXX     X  X                                    X                   X\n"+
    "3XXX    CC        XXXXXXXXXX╗2                                                                     X      X  X        X\n"+
    " XXXX   CC        XXXXXXXXXXXXXXSXXXXXXXXXXXXXXXXXXXXXSSSSXXXXX                                     X                 X\n"+
    "      XXCC                                                                                           X                X\n"+
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        movingPlatforms: [{ id: "3-51", features: { moving: true }, settings: { movingOnX: true } }],
        levelSwiches: [//{ id: "8-54", features: { moveTarget: true }, settings: { targetId: "6-58", defaulTimer: 120, direction: "U" } },
                       { id: "8-55", features: { moveTarget: true }, settings: { targetId: "6-58", timed: true, defaulTimer: 120, direction: "D" } },
                       { id: "8-56", features: { moveTarget: true }, settings: { targetId: "6-58", timed: true, defaulTimer: 120, direction: "L" } },
                       //{ id: "8-57", features: { moveTarget: true }, settings: { targetId: "6-58", defaulTimer: 120, direction: "R" } }
                       { id: "8-32", features: { moveTarget: true }, settings: { targetId: "8-33", timed: true, defaulTimer: 120, direction: "U", distance: 1 } },
                       ],
        customProperties: [{ id: "4-12", settings: { searchDepth: 8 } }],
    backGround:
    "X X \n" +
    " X X\n" +
    "X X \n" +
    " X X",    
    srcs: [{ "F": "dungeon_floor.png", width: 96, height: 80 },
           { "X": "dungeon_walls.png", width: 96, height: 96 },
           { "A": "knight.png", width: 144, height: 64 }],
    animations: [{entity: "A", name: "Idle", frames: [{x: 0, y: 0, width:16, height: 32},
                                                      {x: 16, y: 0, width:16, height: 32},
                                                      {x: 32, y: 0, width:16, height: 32},
                                                      {x: 48, y: 0, width:16, height: 32}], interval: 100 }]
}
"use strict";
import {fg} from './engine/fg.js';
import {Bob} from './enemies/bob.js';
import {Actor} from './characters/actor.js';
import {Wall} from './tiles/wall.js';
import {Floor} from './tiles/floor.js';
let TYPE = fg.TYPE;

/************ updated ************/
fg.Camera.init = function (position) {
    if (position) {
        fg.Game.screenOffsetX = position.x;
        fg.Game.screenOffsetY = position.y;
    }
    else if (this.following) {
        fg.Game.screenOffsetX = this.following.x;
        fg.Game.screenOffsetY = this.following.y;
    }
    this.mapFrame = fg.Game.currentLevel.srcs.find(e => e['m'] != null);
    this.scale = 4;
    this.scaleMini = 1;
    this.mapPosition = { x: 123, y: 66 };
    this.cellPosition = { x: 123, y: 66 };
    this.searchDepth = { x: 16, y: 10 };
    this.mapPositionMini = { x: 274, y: 148 };
    this.cellPositionMini = { x: 0, y: 0 };
    this.searchDepthMini = { x: 16, y: 9 };
};
fg.Camera.update = function () {
    if (this.following) {
        this.dampX = ((this.following.x - fg.Game.screenOffsetX) - ((fg.System.canvas.width / 2) - (this.following.width / 2)));// - (Math.abs(this.following.speedX) >= this.following.maxSpeedX * 0.9 ? this.following.speedX * fg.Timer.deltaTime * 2 : 0);
        this.dampY = ((this.following.y - fg.Game.screenOffsetY) - ((fg.System.canvas.height / 2) - (this.following.height / 2)));

        if (Math.abs(this.dampX) > 0.1) this.dampX *= this.dampRatio;
        if (Math.abs(this.dampY) > 0.1) this.dampY *= this.dampRatio;

        var posX = Math.min(Math.max(((this.following.x) + (this.following.width / 2) - (fg.System.canvas.width / 2)) - this.dampX, 0), fg.Game.currentLevel.width - fg.System.canvas.width);
        var posY = Math.min(Math.max(((this.following.y) + (this.following.height / 2) - (fg.System.canvas.height / 2)) - this.dampY, 0), fg.Game.currentLevel.height - fg.System.canvas.height);
        fg.Game.screenOffsetX = Math.round(posX);// this.following.speedX >= 0 ? Math.floor(posX) : Math.ceil(posX);
        fg.Game.screenOffsetY = Math.round(posY);//this.following.speedY <= 0 ? Math.ceil(posY) : Math.round(posY) ;
    } else if (this.position) {
        this.dampX = ((this.position.x - fg.Game.screenOffsetX) - ((fg.System.canvas.width / 2))); // - (Math.abs(0) >= 0 * 0.9 ? 0 * fg.Timer.deltaTime * 2 : 0);
        this.dampY = ((this.position.y - fg.Game.screenOffsetY) - ((fg.System.canvas.height / 2)));

        if (Math.abs(this.dampX) > 0.1) this.dampX *= Math.abs(this.dampX) * this.dampRate > this.dampThreshold ? this.dampRate : 0;// this.dampRatio;
        if (Math.abs(this.dampY) > 0.1) this.dampY *= Math.abs(this.dampY) * this.dampRate > this.dampThreshold ? this.dampRate : 0;// this.dampRatio;

        var posX = Math.min(Math.max(((this.position.x) - (fg.System.canvas.width / 2)) - this.dampX, 0), fg.Game.currentLevel.width - fg.System.canvas.width);
        var posY = Math.min(Math.max(((this.position.y) - (fg.System.canvas.height / 2)) - this.dampY, 0), fg.Game.currentLevel.height - fg.System.canvas.height);
        fg.Game.screenOffsetX = Math.round(posX);// this.following.speedX >= 0 ? Math.floor(posX) : Math.ceil(posX);
        fg.Game.screenOffsetY = Math.round(posY);//this.following.speedY <= 0 ? Math.ceil(posY) : Math.round(posY) ;
    }

    this.left = fg.Game.screenOffsetX;
    this.top = fg.Game.screenOffsetY;
    this.right = fg.Game.screenOffsetX + fg.System.canvas.width;
    this.bottom = fg.Game.screenOffsetY + fg.System.canvas.height;
    this.drawMap();
};
fg.Camera.renderMap = function (mini = true) {
    let scale = mini ? this.scaleMini : this.scale;

    let mapCtx = fg.Game.currentLevel.map.getContext('2d');
    this.allVisited = true;
    let mapEntities = fg.Game.searchArea(0, 0, fg.Game.currentLevel.entities.length, fg.Game.currentLevel.entities[0].length);

    let x, y;

    for (var i = 0, entity; entity = mapEntities[i]; i++) {
        x = parseInt(entity.id.split('-')[1]);// - Math.round(fg.Game.screenOffsetX / fg.System.defaultSide);
        y = parseInt(entity.id.split('-')[0]);// - Math.floor(fg.Game.screenOffsetY / fg.System.defaultSide);

        if ((entity.type == TYPE.WALL || entity.type == TYPE.PLATFORM || TYPE.FLOOR) && (entity.visited || this.allVisited)) {
            mapCtx.fillStyle = entity.type == TYPE.WALL ? "rgba(255,0,0,0.5)" : entity.bossRoom ? "rgba(90,255,90,0.5)" : "rgba(90,90,255,0.5)";
            mapCtx.fillRect((x * scale), (y * scale), scale, entity.type == TYPE.PLATFORM ? (scale / 2) : scale);
        }
    }
};
fg.Camera.drawMap = function (mini = true) {
    let scale = mini ? this.scaleMini : this.scale;
    let mapPosition = mini ? this.mapPositionMini : this.mapPosition;

    fg.Render.draw(fg.Game.currentLevel.map, Math.round((fg.Game.actors[0].x - 320) / 16), Math.round((fg.Game.actors[0].y - 180) / 16),
        this.mapFrame.width - 2, this.mapFrame.height - 2,
        Math.round(this.mapPositionMini.x + fg.Game.screenOffsetX),
        Math.round(this.mapPositionMini.y + fg.Game.screenOffsetY));

    fg.Render.draw(fg.Game.currentLevel.mapCover, Math.round((fg.Game.actors[0].x - 320) / 16), Math.round((fg.Game.actors[0].y - 180) / 16),
        this.mapFrame.width - 2, this.mapFrame.height - 2,
        Math.round(this.mapPositionMini.x + fg.Game.screenOffsetX),
        Math.round(this.mapPositionMini.y + fg.Game.screenOffsetY));

    // if (entity.column == fg.Game.actors[0].column && entity.row == fg.Game.actors[0].row) {
    //     mapCtx.fillStyle = "rgba(120,120,255,0.8)";
    //     ma
    ctx.fillStyle = "#fff";
    // ctx.createRadialGradient(75, 50, 5, 90, 60, 100)
    ctx.fillRect(this.mapPositionMini.x + 20, this.mapPositionMini.y + 11, scale, scale);

    if (this.showFrame) {
        if (!fg.Render.cached['m']) {
            let c = fg.Render.preRenderCanvas();
            let ctx = c.getContext("2d");
            c = fg.protoEntity.drawTile.call({ type: 'm' }, c, ctx);
            if (c)
                fg.Render.draw(fg.Render.cache('m', c), 0, 0, this.mapFrame.width, this.mapFrame.height, (mapPosition.x * scale) + fg.Game.screenOffsetX - 1, (mapPosition.y * scale) + fg.Game.screenOffsetY - 1);
        }
        else {
            fg.Render.draw(fg.Render.cached['m'], 0, 0, this.mapFrame.width, this.mapFrame.height, (mapPosition.x * scale) + fg.Game.screenOffsetX - 1, (mapPosition.y * scale) + fg.Game.screenOffsetY - 1);
        }
    }
};
fg.protoLevel.init = function (name) {
    this.name = name;
    this.load('levels/');
}
fg.protoLevel.loadSettings = function () {
    if (window[this.name].levelSwiches)
        this.levelSwiches = window[this.name].levelSwiches;
    if (window[this.name].movingPlatforms)
        this.movingPlatforms = window[this.name].movingPlatforms;
    if (window[this.name].customProperties)
        this.customProperties = window[this.name].customProperties;
    if (window[this.name].warpDecks)
        this.warpDecks = window[this.name].warpDecks;
    if (window[this.name].srcs)
        this.srcs = window[this.name].srcs;
    if (window[this.name].animations)
        this.animations = window[this.name].animations;
    if (window[this.name].startPositions)
        this.startPositions = window[this.name].startPositions;
    if (window[this.name].size)
        this.size = window[this.name].size;
}
fg.protoLevel.getRowsFromMaze = function() {
    var rows = [];
    if (!this.maze) this.maze = Maze(fg.Game.currentLevel.size, undefined, undefined, undefined, undefined, this.seed);
    for (let line of this.maze) {
        rows[rows.length] = "";
        for (let cell of line) {
            if(cell) rows[rows.length - 1] += "XX";
            else rows[rows.length - 1] += "FF";
        }

        rows[rows.length] = "";
        for (let cell of line) {
            if(cell) rows[rows.length - 1] += "XX";
            else rows[rows.length - 1] += "FF";
        }
    }

    return rows;
}
fg.protoLevel.createEntities = function () {
    var rows;
    rows = this.getRowsFromMaze();    
    for (var i = 0, row; row = rows[i]; i++) {
        if (!this.entities[i]) this.entities[i] = [];
        for (var k = 0, col; col = row[k]; k++) {
            if (!col.match(/[ #\d]/g)) {
                var cx = 0, cy = 0, idx = 0;
                if ((!row[k + 1] || !row[k + 1].match(/[\d]/g)) && (!rows[i + 1] || !rows[i + 1][k].match(/[\d]/g))) {
                    this.addEntity(row, col, i, k, cx, cy, idx);
                }
                else {
                    if ((row[k + 1] && !!row[k + 1].match(/[\d]/g)) && (!rows[i + 1] || !rows[i + 1][k].match(/[\d]/g))) //multiply rows                            
                        this.addEntityColumn(row, col, i, k, cx, cy, idx);
                    else if ((rows[i + 1] && !!rows[i + 1][k].match(/[\d]/g)) && (!row[k + 1] || !row[k + 1].match(/[\d]/g))) //multiply columns                            
                        this.addEntityRow(rows, row, col, i, k, cx, cy, idx);
                    else
                        this.addEntityArea(rows, row, col, i, k, cx, cy, idx);
                }
            }
        }
    }
    fg.Game.actors[0].canJump = true;
    fg.Game.actors[0].position = fg.Game.currentLevel.startPositions[rand(0,fg.Game.currentLevel.startPositions.length)];
    this.loadLevelCompleted()
}
fg.protoLevel.loadLevelCompleted = function () {
    window[this.name] = null;
    this.loaded = true;
    this.height = this.entities.length * fg.System.defaultSide;
    this.width = this.entities[0].length * fg.System.defaultSide;
    let size = fg.Game.currentLevel.size * fg.System.defaultSide
    let defaultSide = fg.System.defaultSide
    this.mainRoom = {
        x: size - (roomSize * defaultSide),
        y: size - (roomSize * defaultSide),
        width: roomSize * defaultSide * 2,
        height: roomSize * defaultSide * 2
    }        
    fg.Camera.follow(fg.Game.actors[0]);
    fg.Camera.init();
    this.map = fg.Render.preRenderCanvas();
    this.map.width = 94;
    this.map.height = 94;
    this.mapPath = fg.Render.preRenderCanvas();
    this.mapPathContext = this.mapPath.getContext('2d');
    this.mapPath.width = 94;
    this.mapPath.height = 94;
    this.mapCover = fg.Render.preRenderCanvas();
    this.mapCoverContext = this.mapCover.getContext('2d');
    this.mapCover.width = 94;
    this.mapCover.height = 94;
    fg.Camera.renderMap();
}
fg.protoLevel.markVisitedOnMap = function(x,y){
    let pathCtx = this.mapPathContext;
    let coverCtx = this.mapCoverContext;
    pathCtx.beginPath();
    pathCtx.fillStyle = "red";
    pathCtx.arc(x, y, 1, 0, 2 * Math.PI);
    pathCtx.fill();

    coverCtx.globalCompositeOperation = "source-over"
    coverCtx.fillStyle = "rgba(0,0,0,0.5)";
    coverCtx.fillRect(0, 0, this.width, this.height);
    coverCtx.shadowColor = 'black';
    coverCtx.shadowOffsetX = -94;
    coverCtx.shadowBlur = 1;
    coverCtx.globalCompositeOperation = "destination-out";
    coverCtx.drawImage(this.mapPath, 94, 0, 94,94);
}
fg.Actor = Actor;
fg.Wall = Wall;
fg.Floor = Floor;
fg.Game.start = function () {
    fg.System.init();
    fg.UI.init();
    if (fg.Game.actors.length == 0) {
        fg.Game.actors[0] = fg.Entity("A-A", TYPE.ACTOR, fg.System.defaultSide * 2, fg.System.defaultSide * 2, 0, 0, 0);//17,12|181,54|6,167|17,11|437,61|99,47|98,8|244,51|61,57
    }
    this.loadState();
    this.currentLevel = this.loadLevel("levelOne");
    this.bindInputs();
    this.run();
};
fg.Game.drawLoading = function (x, y, width, height, pos) {
    if (pos) {
        fg.System.context.fillStyle = "black";
        fg.System.context.fillRect(x, y, width, height);
        fg.System.context.fillStyle = "white";
        fg.System.context.fillRect(x + 1, y + 1, (pos * width) - 2, height - 2);
    } else {
        fg.System.context.font = "15px Arial";
        fg.System.context.fillStyle = "black";
        fg.System.context.fillText("Loading...", x, y);
    }
};
fg.Game.loadState = function () {
    //Load State
    if (localStorage.fallingSaveState != undefined) {
        var saveState = JSON.parse(localStorage.fallingSaveState);

        var posX = saveState.startPosition.x;
        var posY = saveState.startPosition.y;

        fg.Game.actors[0].x = (posY * fg.System.defaultSide) + ((fg.System.defaultSide / 2) - (fg.Game.actors[0].width / 2));
        fg.Game.actors[0].y = (posX * fg.System.defaultSide) + ((fg.System.defaultSide / 2) - (fg.Game.actors[0].height / 2));

        fg.Game.actors[0].glove = saveState.powerUps.glove;
        fg.Game.actors[0].light = saveState.powerUps.light;
        fg.Game.actors[0].wallJump = saveState.powerUps.wallJump;
        fg.Game.actors[0].superJump = saveState.powerUps.superJump;
        fg.Game.actors[0].velocity = saveState.powerUps.velocity;

        this.loadedSaveStations = saveState.saveStations;
        this.secrets = saveState.secrets ? saveState.secrets : [];
    }
};
fg.Game.saveState = function () {
    var curSaveState = localStorage.fallingSaveState ? JSON.parse(localStorage.fallingSaveState) : null;
    var saveStations = curSaveState && curSaveState.saveStations ? curSaveState.saveStations : [];
    var secrets = this.secrets ? this.secrets : [];

    var saveStation = saveStations.find(function (e) { return e.id == fg.Game.curSaveStation.id });
    fg.Game.curSaveStation.drawScreen();
    if (!saveStation)
        saveStations.push({ id: fg.Game.curSaveStation.id, screen: fg.Game.curSaveStation.screen, date: Date.now() });
    else
        saveStations[saveStations.indexOf(saveStation)] = { id: fg.Game.curSaveStation.id, screen: fg.Game.curSaveStation.screen, date: Date.now() };

    var saveState = {
        startPosition: { x: fg.Game.curSaveStation.id.split('-')[0], y: fg.Game.curSaveStation.id.split('-')[1] },
        powerUps: {
            glove: fg.Game.actors[0].glove,
            light: fg.Game.actors[0].light,
            wallJump: fg.Game.actors[0].wallJump,
            superJump: fg.Game.actors[0].superJump,
            velocity: fg.Game.actors[0].velocity
        },
        saveStations: saveStations,
        secrets: secrets
    };
    this.loadedSaveStations = saveState.saveStations;
    localStorage.fallingSaveState = JSON.stringify(saveState);
    fg.Game.curSaveStation.screen = fg.System.canvas.toDataURL();
};
fg.Game.update = function () {
    if ((fg.Input.actions["esc"] && fg.Input.actions["esc"] != this.lastPauseState) && !this.saving) this.paused = !this.paused;
    this.lastPauseState = fg.Input.actions["esc"];
    if (!this.paused) {
        this.clearScreen();
        if (this.screenShot) this.screenShot = null;
        this.foreGroundEntities = [];
        if (fg.Game.drawLevel) {
            this.searchArea(((fg.System.canvas.width / 2) + fg.Game.screenOffsetX),
                ((fg.System.canvas.height / 2) + fg.Game.screenOffsetY),
                fg.System.searchDepth, Math.round(fg.System.searchDepth * (fg.System.canvas.height / fg.System.canvas.width)),
                this.updateEntity);
        }
        for (var index = 0, entity; entity = this.actors[index]; index++)
            this.updateEntity(entity);
        if (fg.Game.drawLevel) {
            for (var index = this.foreGroundEntities.length - 1, entity; entity = this.foreGroundEntities[index]; index--) {
                entity.update(true);
                entity.draw(true);
            }
        }
        fg.Camera.update();
        this.saveScreenAnimation = 0;
    } else {
        if (!this.screenShot) {
            var img = new Image();
            img.src = fg.System.canvas.toDataURL();
            this.screenShot = img;
        }
        fg.Render.drawImage(this.screenShot, 0, 0);
        if (!this.saving) {
            fg.System.context.fillStyle = "black";
            this.drawFont("PAUSED", "", (fg.System.canvas.width / 2) - 12, 180);
        } else {
            fg.UI.update();
            fg.UI.draw();
        }
    }
    fg.Timer.update();
};
fg.Game.showTitle = function () {
    var ctx = fg.System.context;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, fg.System.canvas.width, fg.System.canvas.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.lineWidth = 2;
    var tittleXOffSet = 10;
    var tittleYOffSet = 60;
    ctx.strokeStyle = 'white';

    //F
    ctx.moveTo(20 + tittleXOffSet, 20 + tittleYOffSet);
    ctx.lineTo(53 + tittleXOffSet, 17 + tittleYOffSet);
    ctx.lineTo(54 + tittleXOffSet, 29 + tittleYOffSet);
    ctx.lineTo(32 + tittleXOffSet, 27 + tittleYOffSet);
    ctx.lineTo(34 + tittleXOffSet, 42 + tittleYOffSet);
    ctx.lineTo(48 + tittleXOffSet, 40 + tittleYOffSet);
    ctx.lineTo(50 + tittleXOffSet, 54 + tittleYOffSet);
    ctx.lineTo(31 + tittleXOffSet, 52 + tittleYOffSet);
    ctx.lineTo(33 + tittleXOffSet, 69 + tittleYOffSet);
    ctx.lineTo(19 + tittleXOffSet, 67 + tittleYOffSet);
    ctx.lineTo(20 + tittleXOffSet, 20 + tittleYOffSet);

    //a
    ctx.moveTo(20 + 60, 20 + 70);
    ctx.lineTo(52 + 60, 18 + 70);
    ctx.lineTo(48 + 60, 57 + 70);
    ctx.lineTo(22 + 60, 60 + 70);
    ctx.lineTo(18 + 60, 43 + 70);
    ctx.lineTo(42 + 60, 39 + 70);
    ctx.lineTo(37 + 60, 29 + 70);
    ctx.lineTo(19 + 60, 32 + 70);
    ctx.lineTo(20 + 60, 20 + 70);

    //l
    ctx.moveTo(20 + 110, 20 + 70);
    ctx.lineTo(32 + 110, 18 + 70);
    ctx.lineTo(31 + 110, 57 + 70);
    ctx.lineTo(18 + 110, 62 + 70);
    ctx.lineTo(20 + 110, 20 + 70);

    //l                     
    ctx.moveTo(20 + 140, 20 + 70);
    ctx.lineTo(32 + 140, 18 + 70);
    ctx.lineTo(31 + 140, 57 + 70);
    ctx.lineTo(18 + 140, 62 + 70);
    ctx.lineTo(20 + 140, 20 + 70);

    //i                     
    ctx.moveTo(20 + 165, 20 + 90);
    ctx.lineTo(32 + 165, 18 + 90);
    ctx.lineTo(31 + 165, 42 + 90);
    ctx.lineTo(18 + 165, 44 + 90);
    ctx.lineTo(20 + 165, 20 + 90);

    //n
    ctx.moveTo(20 + 190, 20 + 82);
    ctx.lineTo(49 + 190, 52 + 82);
    ctx.lineTo(41 + 190, 49 + 82);
    ctx.lineTo(28 + 190, 42 + 82);
    ctx.lineTo(31 + 190, 51 + 82);
    ctx.lineTo(19 + 190, 49 + 82);
    ctx.lineTo(20 + 190, 20 + 82);

    //g
    ctx.moveTo(20 + 230, 20 + 90);
    ctx.lineTo(51 + 230, 19 + 90);
    ctx.lineTo(48 + 230, 59 + 90);
    ctx.lineTo(18 + 230, 61 + 90);
    ctx.lineTo(21 + 230, 52 + 90);
    ctx.lineTo(39 + 230, 50 + 90);
    ctx.lineTo(41 + 230, 41 + 90);
    ctx.lineTo(19 + 230, 38 + 90);
    ctx.lineTo(20 + 230, 20 + 90);

    ctx.stroke();

    this.drawFont("Press any key...", "", 120, 150);
    /*if (tracks[0].paused) {
        tracks[0].play();
    }*/
};
/************ updated ************/

fg.Level = function (name) {
    var level = Object.create(fg.protoLevel);
    level.levelSwiches = [];
    level.movingPlatforms = [];
    level.customProperties = [];
    level.marioBuffer = [];
    level.entities = [];
    level.init(name);
    return level;
}

fg.UI = {
    closeAll: false,
    init: function () {
        this.mainForm = Object.assign(Object.create(this.control), this.container, this.form, {
            id: "mainForm", active: true, animate: true, showBorder: true, visible: true, width: 100, height: 80, controls: [],
            x: (fg.System.canvas.width / 2) - (100 / 2),
            y: (fg.System.canvas.height / 2) - (80 / 2)
        });
        var buttonList = Object.assign(Object.create(this.control), this.container, {
            id: "buttonList", active: true, animate: false, visible: true, width: 100, height: 80, controls: [], x: 0, y: 0
        });
        var saveStationList = Object.assign(Object.create(this.control), this.container, this.form, {
            id: "saveStationList", active: true, animate: true, showBorder: true, visible: false, width: 240, height: 192, controls: [], x: -70, y: -60
        });
        this.mainForm.addControl(buttonList);
        this.mainForm.addControl(saveStationList);
        saveStationList.addControl(Object.assign(Object.create(this.control), this.container, {
            id: "ssList", active: true, animate: false, showBorder: true, visible: true, width: 232, height: 64, controls: [], x: 4, y: 124
        }));
        buttonList.addControl(Object.assign(Object.create(this.control), this.button, {
            id: "save", text: "SAVE", highlighted: true, controls: [],
            click: function () {
                fg.Game.saveState();
                return true;
            }
        }));
        buttonList.addControl(Object.assign(Object.create(this.control), this.button, {
            id: "warp", controls: [], text: "WARP",
            click: function () {
                var saveStationList = fg.UI.mainForm.controls.find(function (e) { return e.id == "saveStationList" });
                saveStationList.getActiveContainer().controls = [];
                for (var i = 0, ctrl; ctrl = fg.Game.loadedSaveStations[i]; i++) {
                    saveStationList.getActiveContainer().addControl(Object.assign(Object.create(fg.UI.control), fg.UI.button, {
                        id: "ss-" + ctrl.id, text: ctrl.id, highlighted: i == 0, controls: [],
                        image: ctrl.screen, ctrl: ctrl, width: 40,
                        click: function () {
                            fg.Game.warp(fg.Game.actors[0], { y: (parseInt(this.ctrl.id.split("-")[0]) - 1), x: parseInt(this.ctrl.id.split("-")[1]) });
                            fg.UI.closeAll = true;
                            return true;
                        }
                    }));
                }
                saveStationList.visible = true;
                if (fg.Input.actions["jump"]) delete fg.Input.actions["jump"];
                if (fg.Input.actions["enter"]) delete fg.Input.actions["enter"];
            }
        }));
        buttonList.addControl(Object.assign(Object.create(this.control), this.button, {
            id: "delete", text: "DELETE", controls: [], click: function () {
                if (!fg.UI.mainForm.controls.find(function (e) { return e.id == "confirm" }))
                    fg.UI.mainForm.addControl(Object.assign(Object.create(fg.UI.control), fg.UI.container, fg.UI.form, fg.UI.confirm, {
                        text: "Confirm deletion? (All your progress will be lost!)",
                        id: "confirm",
                        controls: [],
                        x: (this.parent.realX / 2) - (fg.UI.confirm.width / 2),
                        y: (this.parent.realY / 2) - (fg.UI.confirm.height / 2),
                        click: function (result) {
                            if (result) {
                                fg.UI.closeAll = true;
                                delete localStorage.fallingSaveState;
                            }
                            if (fg.Input.actions["jump"]) delete fg.Input.actions["jump"];
                            if (fg.Input.actions["enter"]) delete fg.Input.actions["enter"];
                            return result;
                        }
                    }));
                else fg.UI.mainForm.controls.find(function (e) { return e.id == "confirm" }).show();
                if (fg.Input.actions["jump"]) delete fg.Input.actions["jump"];
                if (fg.Input.actions["enter"]) delete fg.Input.actions["enter"];
            }
        }));
    },
    mainForm: undefined,
    form: {
        type: "form",
        draw: function () {
            if (!this.visible) return;
            var fractionX = this.width / this.maxAnimation;
            var fractionY = this.height / this.maxAnimation;
            if (!this.animate) this.curAnimation = this.maxAnimation;
            var width = (fractionX * this.curAnimation);
            var height = (fractionY * this.curAnimation);
            fg.System.context.fillStyle = this.showBorder ? this.borderColor : this.fillColor;
            fg.System.context.fillRect(this.realX + this.x + ((this.width / 2) - (width / 2)), this.realY + this.y + ((this.height / 2) - (height / 2)), width, height);
            if (this.showBorder) {
                fg.System.context.fillStyle = this.fillColor;
                fg.System.context.fillRect(this.realX + this.x + ((this.width / 2) - (width / 2)) + 1, this.realY + this.y + ((this.height / 2) - (height / 2)) + 1, width - 2, height - 2);
            }

            if (this.curAnimation < this.maxAnimation)
                this.curAnimation++;
            else {
                for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.draw();
            }
        },
    },
    container: {
        type: "container",
        align: "center",
        direction: "vertical",
        positionRelative: false,
        draw: function () {
            if (this.showBorder) {
                fg.System.context.beginPath();
                fg.System.context.fillStyle = this.borderColor;
                fg.System.context.rect(this.realX + this.x, this.realY + this.y, this.width, this.height);
                fg.System.context.stroke();
            }
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.draw();
        },
        update: function () {
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.update();
        },
        addControl: function (obj) {
            var _ctrl = fg.UI.control.addControl.call(this, obj)
            if (this.controls.length == 1) this.setHighlightedControl(obj);
            if (this.align == "center") {
                var totalHeight = 0;
                var totalWidth = 0;
                var startX = 0;
                var startY = 0;
                if (this.direction == "vertical") {
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        totalHeight += ctrl.height;
                    }
                    startY = (this.height - totalHeight) / 2;
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        ctrl.y = (this.height - startY) - totalHeight;
                        totalHeight -= ctrl.height;
                        ctrl.x = (this.width / 2) - (ctrl.width / 2);
                    }
                } else if (this.direction == "horizontal") {
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        totalWidth += ctrl.width;
                    }
                    startX = (this.width - totalWidth) / 2;
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        ctrl.x = (this.width - startX) - totalWidth;
                        totalWidth -= ctrl.width;
                        ctrl.y = (this.height / 2) - (ctrl.height / 2);
                    }
                }
            } else if (this.align == "grid") {

            }
        },
        changeHighlighted: function () {
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                if (ctrl.controls.length > 0) {
                    ctrl.changeHighlighted();
                }
                if (!ctrl.highlighted || !this.active) continue;
                ctrl.highlighted = false;
                if (fg.Input.actions["right"]) {
                    if (this.controls[i + 1])
                        this.controls[i + 1].highlighted = true;
                    else
                        this.controls[0].highlighted = true;
                    delete fg.Input.actions["right"];
                    this.setHighlightedControl(this.controls[i + 1] || this.controls[0]);
                } else {
                    if (this.controls[i - 1])
                        this.controls[i - 1].highlighted = true;
                    else
                        this.controls[this.controls.length - 1].highlighted = true;
                    delete fg.Input.actions["left"];
                    this.setHighlightedControl(this.controls[i - 1] || this.controls[this.controls.length - 1]);
                }
                break;
            }
        },
        setHighlightedControl: function (ctrl) {
            if (this.parent)
                this.parent.setHighlightedControl(ctrl);
            else
                this.highlightedControl = ctrl;
        },
        getActiveContainer: function () {
            return this.controls.find(function (e) { return e.type == "container" && e.active }) || this;
        },
        getHighlightedControl: function () {
            return this.getActiveContainer().controls.find(function (e) { return e.highlighted });
        }
    },
    draw: function () {
        this.mainForm.draw();
    },
    confirm: {
        id: "confirm",
        text: "confirm?",
        width: 180,
        height: 52,
        direction: "horizontal",
        showBorder: true,
        draw: function () {
            if (!this.visible) return;
            if (this.controls.length == 0) this.addButtons();
            fg.UI.form.draw.call(this);
            fg.System.context.textBaseline = "middle";
            fg.System.context.textAlign = "center";
            fg.System.context.font = "8px Arial";
            fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.text, this.realX + this.x + (this.width / 2), this.realY + this.y + 12 + 1);
        },
        addButtons: function () {
            this.addControl(Object.assign(Object.create(fg.UI.control), fg.UI.button, {
                id: "yes", text: "yes", highlighted: true, controls: [],
                click: function () {
                    this.parent.click(true);
                    return true;
                }
            }));
            this.addControl(Object.assign(Object.create(fg.UI.control), fg.UI.button, {
                id: "no", text: "no", highlighted: false, controls: [],
                click: function () {
                    this.parent.click(false);
                    return true;
                }
            }));
        },
        show: function () { this.visible = true; }
    },
    infoBox: {
        image: fg.$new('img'),
        canvas: fg.$new("canvas"),
        screen: undefined,
        update: function () {
            if (this.screen) {
                this.image.src = this.screen;
            }
        },
        draw: function () {
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.image, this.realX + this.x + 1, this.realY + this.y + 1, 160, 120);
        }
    },
    button: {
        type: "button",
        text: "myButton",
        draw: function () {
            fg.UI.control.draw.call(this);
            fg.System.context.textBaseline = "middle";
            fg.System.context.textAlign = "center";
            fg.System.context.font = "8px Arial";
            fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.text, this.realX + this.x + (this.width / 2), this.realY + this.y + (this.height / 2) + 1);
        }
    },
    control: {
        active: false,
        showBorder: false,
        animate: false,
        curAnimation: 0,
        maxAnimation: 30,
        fillColor: "black",
        borderColor: "white",
        highlightedColor: "lightGrey",
        index: 0,
        selected: false,
        highlighted: false,
        x: 0,
        y: 0,
        realX: 0,
        realY: 0,
        width: 48,
        height: 12,
        positionRelative: true,
        visible: true,
        draw: function () {
            if (!this.visible) return;
            var startX = this.positionRelative ? this.realX : 0;
            var startY = this.positionRelative ? this.realY : 0;
            fg.System.context.fillStyle = this.highlighted ? this.highlightedColor : this.fillColor;
            fg.System.context.fillRect(startX + this.x, startY + this.y, this.width, this.height);
            fg.System.context.fillStyle = this.fillColor;
            fg.System.context.fillRect(startX + this.x + 1, startY + this.y + 1, this.width - 2, this.height - 2);
        },
        parent: null,
        addControl: function (obj) {
            obj.parent = this;
            obj.realX = this.realX + this.x;
            obj.realY = this.realY + this.y;
            this.controls.push(obj);
            return obj;
        },
        reset: function () {
            this.curAnimation = 0;
        },
        click: function () { }
    },
    close: function () {
        var activeForms = this.mainForm.controls.filter(function (e) { return e.visible });
        if (activeForms.length > 1) {
            if (!fg.UI.closeAll) {
                activeForms[activeForms.length - 1].visible = false;
                activeForms[activeForms.length - 1].curAnimation = 0;
                delete fg.Input.actions["esc"];
                return;
            } else {
                while (this.mainForm.controls.filter(function (e) { return e.visible }).length > 1) {
                    activeForms = this.mainForm.controls.filter(function (e) { return e.visible });
                    activeForms[activeForms.length - 1].visible = false;
                    activeForms[activeForms.length - 1].curAnimation = 0;
                }
            }
        }
        fg.Game.paused = false;
        fg.Game.saving = false;
        this.closeAll = false;
        this.mainForm.reset();
    },
    activeForm: function () {
        return this.mainForm.controls.find(function (e) { return e.type == "form" && e.visible && e.active }) || this.mainForm;
    },
    update: function () {
        var visibleForms = this.mainForm.controls.filter(function (e) { return (e.type == "form" || e.type == "container") && e.visible });
        for (var i = 0, ctrl; ctrl = visibleForms[i]; i++)  ctrl.active = i == visibleForms.length - 1;
        if (fg.Input.actions["esc"]) {
            this.close();
        }
        if (this.mainForm.active) {
            if (fg.Input.actions["right"] || fg.Input.actions["left"]) this.mainForm.changeHighlighted();
            if (fg.Input.actions["enter"] || fg.Input.actions["jump"]) {
                if ((this.activeForm().getHighlightedControl() || { click: function () { } }).click()) this.close();
            }
        }
    }
}

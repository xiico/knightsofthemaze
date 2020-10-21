"use strict";
import {fg} from './engine/fg.js';
import {Bob} from './enemies/bob.js';
import {Actor} from './characters/actor.js';
import {Wall} from './tiles/wall.js';
import {Floor} from './tiles/floor.js';
import {Maze} from './maze-generator.js';
import {TitleScreen} from './components/titleScreen.js';
let TYPE = fg.TYPE;

/************ updated ************/
fg.Maze = Maze;
fg.TitleScreen = TitleScreen;
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
    this.scale = 1.5;
    this.scaleMini = 1;
    this.mapPosition = { x: 86, y: 16, width: 94, height: 94 };
    this.cellPosition = { x: 123, y: 66 };
    this.searchDepth = { x: 16, y: 10 };
    this.mapPositionMini = { x: 274, y: 148, width: this.mapFrame.width, height: this.mapFrame.height };
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
    if (fg.Input.actions["map"]) this.drawMap(false);
    else this.drawMap();
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

    fg.Render.draw(fg.Game.currentLevel.map, 
        mini ? Math.round((fg.Game.actors[0].x - 320) / 16) : 0, 
        mini ? Math.round((fg.Game.actors[0].y - 180) / 16) : 0,
        (mapPosition.width) - (mini ? 2 : 0), 
        (mapPosition.height) - (mini ? 2 : 0),
        Math.round(mapPosition.x + fg.Game.screenOffsetX),
        Math.round(mapPosition.y + fg.Game.screenOffsetY),scale);

    fg.Render.draw(fg.Game.currentLevel.mapCover, 
        mini ? Math.round((fg.Game.actors[0].x - 320) / 16) : 0, 
        mini ? Math.round((fg.Game.actors[0].y - 180) / 16) : 0,
        (mapPosition.width) - (mini ? 2 : 0), 
        (mapPosition.height) - (mini ? 2 : 0),
        Math.round(mapPosition.x + fg.Game.screenOffsetX),
        Math.round(mapPosition.y + fg.Game.screenOffsetY), scale);

    let ctx = fg.System.context;
    ctx.fillStyle = "#fff";
    if (mini) ctx.fillRect(mapPosition.x + 20, mapPosition.y + 11, scale, scale);
    else {
        if (fg.Game.fontAnimation.fadeIn) fg.Game.fontAnimation.blinkText += 1;
        else fg.Game.fontAnimation.blinkText -= 1;
        if (fg.Game.fontAnimation.blinkText >= 50) fg.Game.fontAnimation.fadeIn = false;
        if (fg.Game.fontAnimation.blinkText <= 0) fg.Game.fontAnimation.fadeIn = true;

        fg.System.context.fillStyle = "rgba(255,255,255," + fg.Game.fontAnimation.blinkText / 50 + ")";
        ctx.fillRect((fg.Game.actors[0].x / 16 * scale) + mapPosition.x, (fg.Game.actors[0].y / 16 * scale) + mapPosition.y, scale, scale);
    }
    
    if (mini) {
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
fg.protoLevel.getRowsFromMaze = function() {
    var rows = [];
    if (!this.maze) this.maze = Maze(fg.Game.currentLevel.size, undefined, undefined, undefined, undefined, this.seed);
    for (let line of this.maze.maze) {
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
    // this.mainRoom = {
    //     x: size - (roomSize * defaultSide),
    //     y: size - (roomSize * defaultSide),
    //     width: roomSize * defaultSide * 2,
    //     height: roomSize * defaultSide * 2
    // }        
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
    if (!this.paused && !fg.Game.showUI) {
        this.clearScreen();
        if (this.screenShot) this.screenShot = null;
        this.foreGroundEntities = [];
        if (fg.Game.drawLevel) {
            this.searchArea(((fg.System.canvas.width / 2) + fg.Game.screenOffsetX),
                ((fg.System.canvas.height / 2) + fg.Game.screenOffsetY),
                fg.System.searchDepth, Math.round(fg.System.searchDepth * (fg.System.canvas.height / fg.System.canvas.width)),
                this.updateEntity);
        }
        for (let index = 0, entity; entity = this.actors[index]; index++)
            this.updateEntity(entity);
        if (fg.Game.currentLevel.enemies) {
            for (let index = 0, enemy; enemy = fg.Game.currentLevel.enemies[index]; index++)
                this.updateEntity(enemy);
        }
        if (fg.Game.drawLevel) {
            for (var index = this.foreGroundEntities.length - 1, entity; entity = this.foreGroundEntities[index]; index--) {
                entity.update(true);
                entity.draw(true);
            }
        }
        

        if(!fg.Game.currentLevel.enemies) {
            fg.Game.currentLevel.enemies = [];

            

           // for (let index = 0; index < 25; index++) {
                
                
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,
            this.actors[0].x + 12,
            this.actors[0].y));
            // fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 2)));

            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"c"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"d"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"e"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"f"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"g"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"h"));
            fg.Game.currentLevel.enemies.push(Bob(`e-${fg.Game.currentLevel.enemies.length}`,32,32 + (fg.Game.currentLevel.enemies.length * 16),"i"));
            //}
        }
        fg.Camera.update();
        this.saveScreenAnimation = 0;
        fg.Timer.update();
        // fg.UI.fonts.small.draw('Xx!@#$%¨&*()_+,',20,20);
        // fg.UI.fonts.small.draw('Xxpdfjlig',20,20);
        // fg.UI.fonts.small.draw('https://sistema.bridgescultural.com.br/',20,20);
        // fg.UI.fonts.tiny.draw('Xxpdfjlig',20 ,30 ,'left');
        // fg.UI.fonts.tiny.draw('https://sistema.bridgescultural.com.br/',20 ,30 ,'left');
        // this.drawFont("Press any key...", "", 120, 150);
        // fg.UI.fonts.tiny.draw('Press any key...', 120 ,130 ,'left');
        // fg.UI.fonts.small.draw('Press any key...',120,120);
    } else {
        if (!this.screenShot) {
            var img = new Image();
            img.src = fg.System.canvas.toDataURL();
            this.screenShot = img;
        }
        fg.Render.drawImage(this.screenShot, 0, 0);
        if (!this.showUI) {
            fg.System.context.fillStyle = "black";
            this.drawFont("PAUSED", "", (fg.System.canvas.width / 2) - 12, 120);
        } else {
            fg.UI.update();
            fg.UI.draw();
        }
    }
};
fg.Game.showTitle = function() {
    fg.TitleScreen.showTitle();
}
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

fg.UI.init = function () {
    fg.UI.initInfobox();
    this.fonts['small'] = this.Font('assets/font_small.png',8,8);
    this.fonts['tiny'] = this.Font('assets/font_tiny.png',5,9, null, 1);
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
}

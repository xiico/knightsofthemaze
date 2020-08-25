let Game =
{
    levels: [],
    currentLevel: null,
    showIds: false,
    screenOffsetX: 0,//5818
    screenOffsetY: 0,//818,5200,72
    increaseX: 0,//0.06666=1
    increaseY: 0,
    currentEntities: [],
    foreGroundEntities: [],
    gravity: 0.012,//0.016,0.012
    actors: [],
    secrets: [],
    loaded: 0,
    paused: false,
    lastPauseState: undefined,
    started: false,
    saving: false,
    fontAnimation: { fadeIn: false, blinkText: 0 },
    totalSecrets: 0,
    debug: false,
    drawLevel: true,
    showUI: false,
    showHitBox: false,
    loadLevel: function (name) {
        this.levels.push(fg.Level(name));
        return this.levels[this.levels.length - 1];
    },
    screenShot: undefined,
    loadedSaveStations: [],
    bindInputs: function () {
        fg.Input.initKeyboard();
        fg.Input.bind(fg.Input.KEY.SPACE, "jump");
        fg.Input.bind(fg.Input.KEY.LEFT_ARROW, "left");
        fg.Input.bind(fg.Input.KEY.RIGHT_ARROW, "right");
        fg.Input.bind(fg.Input.KEY.A, "left");
        fg.Input.bind(fg.Input.KEY.D, "right");
        fg.Input.bind(fg.Input.KEY.ESC, "esc");
        fg.Input.bind(fg.Input.KEY.ENTER, "enter");
        fg.Input.bind(fg.Input.KEY.UP_ARROW, "up");
        fg.Input.bind(fg.Input.KEY.DOWN_ARROW, "down");
        fg.Input.bind(fg.Input.KEY.M, "map");
        if (fg.System.platform.mobile) {
            fg.Input.bindTouch(fg.$("#btnMoveLeft"), "left");
            fg.Input.bindTouch(fg.$("#btnMoveRight"), "right");
            fg.Input.bindTouch(fg.$("#btnMoveUp"), "up");
            fg.Input.bindTouch(fg.$("#btnMoveDown"), "down");
            fg.Input.bindTouch(fg.$("#btnJump"), "jump");
            //fg.Input.bindTouch(fg.$("#main"), "esc");
        }
    },
    start: function () {
        fg.System.init();
        fg.UI.init();
        this.bindInputs();
        this.run();
    },
    mapPosition: [],
    run: function () {
        if (fg.Game.currentLevel.loaded) {
            if (!fg.Game.started) {
                if (Object.keys(fg.Input.actions).length > 0) {
                    fg.Input.actions = {};
                    fg.Game.started = true;
                }
                fg.Game.showTitle();
                fg.Timer.update();
            } else fg.Game.update();
        } else fg.Game.drawLoading(10, fg.System.canvas.height - 20, fg.System.canvas.width - 20, 20);

        requestAnimationFrame(fg.Game.run);
    },
    clearScreen: function () {
        fg.System.context.fillStyle = fg.System.platform.mobile ? "deepSkyBlue" : "rgb(55,55,72)";
        fg.System.context.fillRect(0, 0, fg.System.canvas.width, fg.System.canvas.height);
    },
    drawLoading: function (x, y, width, height, pos) {
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
    },
    loadState: function () {
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
    },
    saveState: function () {
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
    },
    update: function () {
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
    },
    warp: function (entity, checkPoint) {
        var x = checkPoint ? checkPoint.x : 0;//warpx.value;
        var y = checkPoint ? checkPoint.y : 0;//warpy.value;
        if (x != "" && y != "") {
            entity.y = (y * fg.System.defaultSide) + entity.width / 2;
            entity.x = (x * fg.System.defaultSide) + entity.height / 2;
            fg.Camera.fixed = false;
        }
    },
    outOfScene: function (obj) {
        return obj.x > fg.Camera.right || obj.x + obj.width < fg.Camera.left || obj.y > fg.Camera.bottom || obj.y + obj.height < fg.Camera.top;
    },
    updateEntity: function (obj) {
        if (!obj.foreGround || obj.backGround) obj.update();
        if (fg.Game.outOfScene(obj)) return;
        //fg.Game.visibleEntities.push(obj);
        obj.draw();
        if (obj.foreGround) fg.Game.foreGroundEntities.push(obj);
    },
    searchArea: function (startX, startY, depthX, depthY, loopCallBack, endLoopCallBack, caller, markVisited) {
        this.currentEntities = [];
        var mainColumn = Math.round(startX / fg.System.defaultSide);
        var mainRow = Math.round(startY / fg.System.defaultSide);
        var startRowIndex = mainRow - depthY < 0 ? 0 : mainRow - depthY;
        var endRowIndex = mainRow + depthY > fg.Game.currentLevel.entities.length ? fg.Game.currentLevel.entities.length : mainRow + depthY;
        var startColIndex = mainColumn - depthX < 0 ? 0 : mainColumn - depthX;
        var endColIndex = mainColumn + depthX > fg.Game.currentLevel.entities[0].length ? fg.Game.currentLevel.entities[0].length : mainColumn + depthX;

        this.mapPosition = [mainColumn, mainRow];

        for (var i = (endRowIndex - 1); i >= startRowIndex; i--) {
            for (var k = startColIndex, obj; k < endColIndex; k++) {
                var obj = fg.Game.currentLevel.entities[i][k];
                if (!obj || obj.type == fg.TYPE.DARKNESS)
                    continue;
                if (loopCallBack)
                    (!caller ? loopCallBack : loopCallBack.bind(caller))(obj);
                this.currentEntities.push(obj);
                if (markVisited && !obj.visited && obj.visited != undefined) {
                    obj.visited = true;
                    fg.Game.currentLevel.markVisitedOnMap(obj.id.split('-')[1], obj.id.split('-')[0]);
                }
                if (obj.target && obj.target.segments)
                    for (var index = 0, entity; entity = obj.target.segments[index]; index++)
                        this.currentEntities.push(entity);
            }
        }

        if (endLoopCallBack)
            (!caller ? endLoopCallBack : endLoopCallBack.bind(caller))();

        return this.currentEntities;
    },
    testOverlap: function (a, b) {
        if (a.id == b.id || b.vanished) return false;
        if (a.x > b.x + b.width || a.x + a.width < b.x) return false;
        if (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.height + a.y > b.y) {
            return true;
        }
        return false;
    },
    showTitle: function () {
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
    },
    drawFont: function (text, color, x, y, font = "10px Arial") {
        if (fg.Game.fontAnimation.fadeIn)
            fg.Game.fontAnimation.blinkText += 1;
        else
            fg.Game.fontAnimation.blinkText -= 1;

        if (fg.Game.fontAnimation.blinkText >= 100) fg.Game.fontAnimation.fadeIn = false;

        if (fg.Game.fontAnimation.blinkText <= 0) fg.Game.fontAnimation.fadeIn = true;

        fg.System.context.font = font;
        fg.System.context.fillStyle = "rgba(255,255,255," + fg.Game.fontAnimation.blinkText / 100 + ")";
        fg.System.context.fillText(text, x, y);
    },
    drawBackGround: function () {
        var bgSize = 4;
        var bgRow = Math.floor(((c.height / 2) + moveDown) * .5 / (defaultHeight * 2));
        var bgColumn = Math.floor(((c.width / 2) + scroller) * .5 / (defaultWidth * 2));

        var bgDrawDepthX = disableBG ? -1 : 4;//6
        var bgDrawDepthY = disableBG ? -1 : 3;//6

        var startBgRowIndex = /*bgRow - bgDrawDepthY < 0 ? 0 :*/ bgRow - bgDrawDepthY;
        var endBgRowIndex = bgRow + bgDrawDepthY;

        var startBgColIndex = /*bgColumn - bgDrawDepthX < 0 ? 0 :*/ bgColumn - bgDrawDepthX;
        var endBgColIndex = bgColumn + bgDrawDepthX;

        for (var i = startBgRowIndex; i <= endBgRowIndex; i++) {
            for (var k = startBgColIndex, obj; k <= endBgColIndex; k++) {
                var bgRowIndex = (i > 0 ? i : bgSize + i) % bgSize;
                var bgColIndex = (k > 0 ? k : bgSize + k) % bgSize;
                obj = BackGround[bgRowIndex][bgColIndex];
                if (!obj)
                    continue;

                obj.bgOffSetX = ((Math.floor(k / bgSize) * (defaultWidth * 2) * bgSize)) + (obj.width * 2);
                obj.bgOffSetY = ((Math.floor(i / bgSize) * (defaultHeight * 2) * bgSize)) + (obj.height);

                if (obj.isVisible())
                    obj.Draw();
            }
        }
    }
}
export {Game};
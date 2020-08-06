let protoLevel = {
    name: "",
    loaded: false,
    height: 0,
    width: 0,
    maze: null,
    seed: undefined,
    map: null,
    loadSettings: function () {
        if (window[this.name].default)
            this.default = window[this.name].default;
    },
    createEntities: function () {
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
    },
    applySettingsToEntity: function (entity) {
        var settings = undefined;
        switch (entity.type) {
            case fg.TYPE.PLATFORM:
                settings = (this.movingPlatforms.find(function (e) { return e.id == entity.id }) || {}).settings;
                break;
            case fg.TYPE.SWITCH:
                settings = (this.levelSwiches.find(function (e) { return e.id == entity.id }) || {}).settings;
                break;
            case fg.TYPE.WARPDECK:
                settings = (this.warpDecks.find(function (e) { return e.id == entity.id }) || {}).settings;
                break;
            default:
                settings = (this.customProperties.find(function (e) { return e.id == entity.id }) || {}).settings;
                break;
        }
        if (settings) Object.assign(entity, settings);
        return entity;
    },
    applyFeaturesToEntity: function (entity) {
        var features = undefined;
        switch (entity.type) {
            case TYPE.PLATFORM:
                features = (this.movingPlatforms.find(function (e) { return e.id == entity.id }) || {}).features;
                break;
            case TYPE.SWITCH:
                features = (this.levelSwiches.find(function (e) { return e.id == entity.id }) || {}).features;
                break;
            default:
                break;
        }
        if (features) Object.assign(entity, features);
    },
    load: function (path) {
        fg.loadScript(path, this.name,
            function (self) { self.loadSettings(); self.createEntities(); }, this);
    },
    loadLevelCompleted: function () {
        window[this.name] = null;
        this.loaded = true;
    },
    init: function (name) {
        this.name = name;
    },
    addEntity: function (row, col, i, k, cx, cy, idx) {
        this.entities[i][k] = fg.Entity(i + "-" + k, col, fg.System.defaultSide * k, fg.System.defaultSide * i, 0, 0, 0);
        if (!this.entities[i][k]) return;
        if (this.entities[i][k].setYs) this.entities[i][k].setYs(null, null);
        if (this.entities[i][k].type == fg.TYPE.MARIO) this.marioBuffer.push(this.entities[i][k]);
    },
    addEntityColumn: function (row, col, i, k, cx, cy, idx) {//row-column
        for (var index = 0; index <= row[k + 1]; index++) {
            cx = fg.System.defaultSide;
            if ("╝╚╗╔".indexOf(col) < 0) {
                if (index == 0) idx = 1;
                else if (index == row[k + 1]) cx *= (idx = 3);
                else cx *= (idx = 2);
            } else
                cx = ((parseInt(row[k + 1]) * (parseInt(row[k + 1]) + 1)) / 2 * fg.System.defaultSide) + (index * fg.System.defaultSide);
            this.entities[i][k + index] = fg.Entity(i + "-" + (k + index), col, fg.System.defaultSide * (k + index), fg.System.defaultSide * i, cx, cy, index);
            if (this.entities[i][k + index].setYs)
                this.entities[i][k + index].setYs(row[k + 1], null);

            if (index > 0)
                this.entities[i][k].segments.push({ l: i, c: k + index });
        }
    },
    addEntityRow: function (rows, row, col, i, k, cx, cy, idx) {
        for (var index = 0; index <= rows[i + 1][k]; index++) {
            if (!this.entities[i + index])
                this.entities[i + index] = [];
            cy = fg.System.defaultSide;
            if ("╝╚╗╔".indexOf(col) < 0) {
                if (index == 0) idx = 4;
                else if (index == rows[i + 1][k]) cy *= (idx = (12 / 4));
                else cy *= (idx = (8 / 4));
            } else
                cy = ((parseInt(rows[i + 1][k]) * (parseInt(rows[i + 1][k]) + 1)) / 2 * fg.System.defaultSide) + (index * fg.System.defaultSide);
            this.entities[i + index][k] = fg.Entity((i + index) + "-" + k, col, fg.System.defaultSide * k, fg.System.defaultSide * (i + index), cx, cy, index);
            if (this.entities[i + index][k].setYs)
                this.entities[i + index][k].setYs(null, rows[i + 1][k]);
        }
    },
    addEntityArea: function (rows, row, col, i, k, cx, cy, idx) {
        var computedPos = null;
        for (var kIndex = 0; kIndex <= row[k + 1]; kIndex++) {
            for (var iIndex = 0; iIndex <= rows[i + 1][k]; iIndex++) {
                if (!this.entities[i + iIndex]) this.entities[i + iIndex] = [];
                if (iIndex == 0) {
                    if (kIndex == 0) computedPos = this.computeEntityAreaPos(5, 1, 1);
                    else if (kIndex == row[k + 1]) computedPos = this.computeEntityAreaPos(7, 3, 1);
                    else computedPos = this.computeEntityAreaPos(6, 2, 1);
                } else if (iIndex == rows[i + 1][k]) {
                    if (kIndex == 0) computedPos = this.computeEntityAreaPos(13, 1, 3);
                    else if (kIndex == row[k + 1]) computedPos = this.computeEntityAreaPos(15, 3, 3);
                    else computedPos = this.computeEntityAreaPos(14, 2, 3);
                } else {
                    if (kIndex == 0) computedPos = this.computeEntityAreaPos(9, 1, 2);
                    else if (kIndex == row[k + 1]) computedPos = this.computeEntityAreaPos(11, 3, 2);
                    else computedPos = this.computeEntityAreaPos(10, 2, 2);
                }
                this.entities[i + iIndex][k + kIndex] = fg.Entity((i + iIndex) + "-" + (k + kIndex), col, fg.System.defaultSide * (k + kIndex), fg.System.defaultSide * (i + iIndex), computedPos.cx, computedPos.cy, (iIndex * (parseInt(row[k + 1]) + 1)) + kIndex);
            }
        }
    },
    computeEntityAreaPos: function (idx, xMultiplyer, yMultiplyer) {
        var cx = fg.System.defaultSide * xMultiplyer;
        var cy = fg.System.defaultSide * yMultiplyer;
        return { idx: idx, cx: cx, cy: cy };
    }
};
export {protoLevel};
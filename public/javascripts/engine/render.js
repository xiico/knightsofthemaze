let Render = {
    marioCache: {},
    cached: {},
    offScreenRender: function () {
        if (!this.hc) {
            this.hc = fg.$new("canvas");
            this.hc.width = fg.System.defaultSide
            this.hc.width = fg.System.defaultSide
            return this.hc;
        }
        else
            return this.hc;
    },
    drawOffScreen: function (data, cacheX, cacheY, width, height, mapX, mapY) {
        this.offScreenRender().getContext('2d').drawImage(data, cacheX, cacheY, width, height, mapX, mapY, width, height);
    },
    drawToCache: function (data, x, y, type) {
        this.cached[type].getContext('2d').drawImage(data, x, y);
    },
    preRenderCanvas: function () { return fg.$new("canvas"); },
    draw: function (data, cacheX, cacheY, width, height, mapX, mapY) {
        fg.System.context.drawImage(data, cacheX, cacheY, width, height,
            Math.floor(mapX - fg.Game.screenOffsetX), Math.floor(mapY - fg.Game.screenOffsetY), width, height);
    },
    drawImage: function (data, x, y) {
        fg.System.context.drawImage(data, x, y);
    },
    cache: function (type, data) {
        this.cached[type] = data;
        return this.cached[type];
    }
}

export {Render};
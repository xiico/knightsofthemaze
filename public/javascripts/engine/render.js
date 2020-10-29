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
    draw: function (data, cacheX, cacheY, width, height, mapX, mapY, scale = 1) {
        fg.System.context.drawImage(data, cacheX, cacheY, width, height,
            Math.floor(mapX - fg.Game.screenOffsetX), Math.floor(mapY - fg.Game.screenOffsetY), width * scale, height * scale);
    },
    drawImage: function (data, x, y) {
        fg.System.context.drawImage(data, x, y);
    },
    cache: function (type, data) {
        this.cached[type] = data;
        return this.cached[type];
    },
    cloneCanvas: function (oldCanvas) {

        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
    
        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
    
        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);
    
        //return the new canvas
        return newCanvas;
    }
}

export {Render};
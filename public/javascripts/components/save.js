

let Save = function (id, type, x, y, cx, cy, index) {
    return Object.assign(Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index), fg.Interactive, {
        animationIndex: 0,
        tuning: 0,
        maxTuning: 300,
        screen: (fg.Game.loadedSaveStations.find(function (e) { return e.id == id }) || {}).screen,
        screenCanvas: fg.$new("canvas"),
        screenContext: null,
        foreGround: true,
        frameCount: 6,
        drawScreen: function () {
            var data;
            if (!fg.Render.cached[this.type]) {
                this.draw();
                if (this.screen) {
                    var img = fg.$new("img");
                    img.src = this.screen;
                    data = img;
                } else data = fg.System.canvas;
            } else data = fg.System.canvas;
            fg.Render.cached[this.type].getContext('2d').drawImage(data, 2, 2, fg.System.canvas.width / 16, fg.System.canvas.height / 16);
        },
        drawTile: function (c, ctx) {
            this.screenCanvas.width = fg.System.defaultSide;
            this.screenCanvas.height = fg.System.defaultSide;
            this.screenContext = this.screenCanvas.getContext('2d');
            var imageData = null;
            var data = null;
            c.width = this.width * this.frameCount;
            c.height = this.height;
            for (var index = 0; index < this.frameCount; index++) {
                var offSetX = this.width * index;
                ctx.fillStyle = "black";
                ctx.fillRect(offSetX + 0, 0, this.width, this.height);
                ctx.fillStyle = "#995006";
                ctx.fillRect(offSetX + 1, 1, this.width - 2, this.height - 2);
                ctx.fillStyle = "#565656";
                ctx.fillRect(offSetX + 1, 18, 22, 5);
                ctx.fillStyle = "#060D99";
                ctx.fillRect(offSetX + 2, 20, 4, 1);
                ctx.fillRect(offSetX + 3, 19, 2, 3);
                ctx.fillRect(offSetX + 18, 20, 4, 1);
                ctx.fillRect(offSetX + 19, 19, 2, 3);
                ctx.fillStyle = "white";
                ctx.fillRect(offSetX + 2, 2, 20, 15);
                imageData = ctx.getImageData(offSetX + 2, 2, 20, 15);
                data = imageData.data;
                for (var i = 0; i < data.length; i += 4) {
                    if (Math.round(Math.random())) continue;
                    data[i] = 0;     // red
                    data[i + 1] = 0; // green
                    data[i + 2] = 0; // blue
                }
                ctx.putImageData(imageData, offSetX + 2, 2);
            }

            return c;
        },
        update: function (foreGround) {
            if (foreGround) return;
            this.animationIndex = this.animationIndex + 1 < 6 ? this.animationIndex + 1 : 0;
            var randValue = Math.round(Math.random() * 5);
            this.cacheX = (!this.interacting ? randValue : (this.animationIndex % 2 == 0 ? randValue : 0)) * this.width;
            fg.Game.saving = false;
            if (!this.interacting) {
                this.tuning = 0;
                if (this.screen) this.cacheX = 0;;
            } else {
                if (!fg.Render.cached[this.type]) this.drawScreen();
                if (this.tuning < this.maxTuning) {
                    this.tuning++;
                    if (this.tuning == this.maxTuning) {
                        fg.Game.saving = true;
                        fg.Game.paused = true;
                        fg.Game.curSaveStation = this;
                    }
                }
                if (this.tuning / 60 >= this.animationIndex) this.cacheX = 0;
            }
            fg.Interactive.update.call(this);
        }/*,
        draw: function (foreGround){
            if(this.interacting)
                fg.Render.draw(this.drawScreen(), this.cacheX, this.cacheY, this.cacheWidth, this.cacheHeight, this.x, this.y);
            else
                fg.protoEntity.draw.call(this, foreGround);
            fg.Interactive.update.call(this);
        }*/
    });
}
export {Save};
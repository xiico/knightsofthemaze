let Mario = function (id, type, x, y, cx, cy, index) {
    return Object.assign(
        Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index), {
            cacheX: 0,//Math.round(Math.random() * 4) * fg.System.defaultSide,//cacheX: fg.System.defaultSide * 0,
            edges: undefined,
            tileSet: "",
            procedural: true,
            marioSeed: null,
            cachePosition: [{ x: (fg.System.defaultSide / 2), y: 0 }, { x: (fg.System.defaultSide / 2), y: (fg.System.defaultSide / 2) }, { x: 0, y: (fg.System.defaultSide / 2) }, { x: 0, y: 0 }],
            drawTile: function (c, ctx) {

                c.width = fg.System.defaultSide * 10;
                c.height = fg.System.defaultSide * 5;
                var seedCanvas = fg.$new("canvas");
                var seedCtx = seedCanvas.getContext('2d');
                seedCanvas.width = fg.System.defaultSide * 5;
                seedCanvas.height = fg.System.defaultSide;
                if (this.procedural) {
                    var colorA = "rgb(201,152,86)";
                    seedCtx.fillStyle = colorA;
                    seedCtx.fillRect(0, 0, 72, 24);
                    seedCtx.fillRect(79, 7, 10, 10);
                    seedCtx.fillRect(96, 0, 24, 24);
                    //draw speckles
                    this.speckles(seedCtx);
                    //draw sides tiles
                    this.sides(seedCtx);
                    //draw inner corners
                    this.innerCorners(seedCtx);
                    //draw outer corners
                    this.outerCorners(seedCtx);
                    //mirror sides
                    seedCtx.save();
                    seedCtx.translate(seedCanvas.width + fg.System.defaultSide, 0);
                    seedCtx.scale(-1, 1);
                    this.sides(seedCtx);
                    seedCtx.restore();
                } else {

                }
                this.marioSeed = new Image();
                var mario = this;
                this.marioSeed.onload = function (e) {
                    //draw background image
                    for (var i = 0, key; key = Object.keys(fg.Render.marioCache)[i]; i++) {
                        mario.renderSubTile(ctx, key);
                    }
                };
                this.marioSeed.src = seedCanvas.toDataURL();

                return c;
            },
            update: function () {
                if (this.tileSet == "") this.setSubTiles(true);
            },/*
            draw: function (foreGround) {
                if (this.tileSet == "") return;
                fg.protoEntity.draw.call(this, foreGround);
            },*/
            setEdges: function () {
                this.edges = [];
                var i = parseInt(this.id.split('-')[0]), k = parseInt(this.id.split('-')[1]);
                var objs = fg.Game.currentLevel.entities;
                this.edges.push(objs[i - 1][k + 0] && objs[i - 1][k + 0].type == TYPE.MARIO && !objs[i - 1][k + 0].vanished ? 1 : 0);
                this.edges.push(objs[i - 1][k + 1] && objs[i - 1][k + 1].type == TYPE.MARIO && !objs[i - 1][k + 1].vanished ? 1 : 0);
                this.edges.push(objs[i - 0][k + 1] && objs[i - 0][k + 1].type == TYPE.MARIO && !objs[i - 0][k + 1].vanished ? 1 : 0);
                this.edges.push(objs[i + 1][k + 1] && objs[i + 1][k + 1].type == TYPE.MARIO && !objs[i + 1][k + 1].vanished ? 1 : 0);
                this.edges.push(objs[i + 1][k + 0] && objs[i + 1][k + 0].type == TYPE.MARIO && !objs[i + 1][k + 0].vanished ? 1 : 0);
                this.edges.push(objs[i + 1][k - 1] && objs[i + 1][k - 1].type == TYPE.MARIO && !objs[i + 1][k - 1].vanished ? 1 : 0);
                this.edges.push(objs[i - 0][k - 1] && objs[i - 0][k - 1].type == TYPE.MARIO && !objs[i - 0][k - 1].vanished ? 1 : 0);
                this.edges.push(objs[i - 1][k - 1] && objs[i - 1][k - 1].type == TYPE.MARIO && !objs[i - 1][k - 1].vanished ? 1 : 0);
            },
            getSubTiles: function (tileA, tileB, tileC, index) {
                if (tileA == 1 && tileB == 1 && tileC == 1)
                    return "0" + index;
                else if (tileA == 1 && tileB == 0 && tileC == 1)
                    return "2" + (2 + index) % 4;
                else if (tileA == 1 && tileC == 0)
                    return "4" + index;
                else if (tileA == 0 && tileC == 1)
                    return "1" + index;
                else
                    return "3" + index;
            },
            setSubTiles: function (setCacheXY) {
                this.setEdges();
                this.tileSet = "";
                for (var i = 0; i <= 6; i += 2)
                    this.tileSet += this.getSubTiles(this.edges[i], this.edges[i + 1], (this.edges[i + 2] === undefined ? this.edges[0] : this.edges[i + 2]), i / 2);
                if (setCacheXY) {
                    this.cacheX = fg.Render.marioCache[this.tileSet] % (fg.System.defaultSide * 10);
                    this.cacheY = Math.floor(fg.Render.marioCache[this.tileSet] / (fg.System.defaultSide * 10)) * fg.System.defaultSide;
                }
            },
            renderSubTile: function (ctx, key) {
                var posX = fg.Render.marioCache[key] % (fg.System.defaultSide * 10);
                var posY = Math.floor(fg.Render.marioCache[key] / (fg.System.defaultSide * 10))*fg.System.defaultSide;
                for (var i = 0; i <= 6; i += 2) {
                    var cacheX = (parseInt(key[i]) * fg.System.defaultSide) + parseInt(this.cachePosition[key[i + 1]].x);
                    var cacheY = parseInt(this.cachePosition[key[i + 1]].y);
                    var cacheWidth = fg.System.defaultSide / 2;
                    var cacheHeight = fg.System.defaultSide / 2;
                    ctx.drawImage(this.marioSeed, cacheX, cacheY, cacheWidth, cacheHeight, posX + this.cachePosition[i / 2].x, posY + this.cachePosition[i / 2].y, (fg.System.defaultSide / 2), (fg.System.defaultSide / 2));
                }
            },
            drawColor: function (ctx, t_x, t_y, t_w, t_h, color) {
                ctx.fillStyle = color;
                for (var index = 0; index < t_x.length; index++)
                    ctx.fillRect(t_x[index], t_y[index], t_w[index], t_h[index]);
            },
            sides: function (ctx) {
                var colorOne = "rgb(120,105,24)";//DarkBrown
                var t_x = [24, 29, 30, 31, 36, 40, 41, 41],
                    t_y = [17, 0, 7, 16, 6, 12, 5, 17],
                    t_w = [7, 2, 2, 5, 5, 2, 7, 2],
                    t_h = [2, 7, 5, 2, 2, 5, 2, 7];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorOne);
                var colorTwo = "rgb(0,201,1)";//LightGreen
                t_x = [24, 25, 36, 43];
                t_y = [19, 0, 1, 12];
                t_w = [12, 4, 12, 4];
                t_h = [4, 12, 4, 12];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorTwo);
                var colorThree = "rgb(0,120,72)";//DarkGreen
                t_x = [24, 27, 27, 28, 28, 28, 29, 30, 32, 35, 36, 37, 40, 42, 42, 43, 43, 43, 44, 45];
                t_y = [19, 3, 20, 0, 6, 11, 8, 19, 18, 19, 4, 5, 4, 3, 13, 12, 16, 21, 18, 4];
                t_w = [3, 1, 3, 1, 1, 1, 1, 2, 3, 1, 1, 3, 2, 3, 1, 1, 1, 1, 1, 3];
                t_h = [1, 3, 1, 3, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 2, 3, 3, 1];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorThree);
                var colorFour = "rgb(0,0,0)";//Black
                t_x = [24, 24, 24, 27, 28, 29, 29, 29, 30, 30, 32, 35, 36, 36, 37, 40, 41, 42, 42, 42, 42, 43, 45, 47];
                t_y = [0, 18, 23, 19, 3, 0, 6, 11, 8, 18, 17, 18, 0, 5, 6, 5, 13, 4, 12, 16, 21, 18, 5, 12];
                t_w = [1, 3, 12, 3, 1, 1, 1, 1, 1, 2, 3, 1, 12, 1, 3, 2, 1, 3, 1, 1, 1, 1, 3, 1];
                t_h = [12, 1, 1, 1, 3, 3, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2, 3, 3, 1, 12];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorFour);
            },
            innerCorners: function (ctx) {
                var colorOne = "rgb(120,105,24)";//DarkBrown
                var t_x = [54, 55, 53, 58, 59, 66,],
                    t_y = [7, 6, 10, 18, 5, 11,],
                    t_w = [12, 10, 1, 3, 3, 1,],
                    t_h = [10, 12, 3, 1, 1, 3,];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorOne);
                var colorTwo = "rgb(0,201,1)";//LightGreen
                t_x = [56];
                t_y = [8];
                t_w = [8];
                t_h = [8];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorTwo);
                var colorThree = "rgb(0,120,72)";//DarkGreen
                t_x = [55, 56, 56, 57, 57, 59, 59, 61, 61, 63, 63, 64];
                t_y = [11, 8, 13, 8, 15, 7, 16, 8, 15, 8, 13, 11];
                t_w = [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1];
                t_h = [2, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 2];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorThree);
                var colorFour = "rgb(0,0,0)";//Black
                t_x = [54, 55, 55, 56, 56, 59, 59, 61, 61, 64, 64, 65];
                t_y = [11, 8, 13, 7, 16, 6, 17, 7, 16, 8, 13, 11];
                t_w = [1, 1, 1, 3, 3, 2, 2, 3, 3, 1, 1, 1];
                t_h = [2, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 2];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorFour);
            },
            outerCorners: function (ctx) {
                var colorOne = "rgb(120,105,24)";//DarkBrown
                var t_x = [77, 77, 79, 83, 88, 89, 85, 79, 79, 84, 88, 82],
                    t_y = [5, 11, 16, 17, 13, 7, 5, 5, 12, 16, 10, 7],
                    t_w = [3, 2, 4, 6, 3, 2, 4, 6, 1, 2, 1, 2],
                    t_h = [6, 6, 3, 2, 4, 6, 3, 2, 2, 1, 2, 1];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorOne);
                var colorTwo = "rgb(0,0,0)";//Black
                t_x = [72, 73, 74, 74, 76, 76, 89, 89, 91, 91, 77, 77, 80, 82, 84, 86, 90, 90];
                t_y = [4, 2, 1, 17, 0, 19, 1, 17, 2, 4, 8, 12, 18, 5, 18, 5, 10, 14];
                t_w = [5, 4, 5, 5, 16, 16, 5, 5, 4, 5, 1, 1, 2, 2, 2, 2, 1, 1];
                t_h = [16, 20, 6, 6, 5, 5, 6, 6, 20, 16, 2, 2, 1, 1, 1, 1, 2, 2];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorTwo);
                var colorThree = "rgb(0,120,72)";//DarkGreen
                t_x = [76, 75, 76, 78, 78, 90, 90, 92, 76, 76, 80, 82, 84, 86, 91, 91];
                t_y = [4, 6, 18, 20, 3, 4, 18, 6, 8, 12, 19, 4, 19, 4, 10, 14];
                t_w = [2, 1, 2, 12, 12, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1];
                t_h = [2, 12, 2, 1, 1, 2, 2, 12, 2, 2, 1, 1, 1, 1, 2, 2];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorThree);
                var colorFour = "rgb(0,201,1)";//LightGreen
                t_x = [74, 73, 74, 76, 91, 93, 91, 76, 75, 75, 75, 75, 77, 80, 84, 90, 92, 92, 92, 92, 90, 86, 82, 77];
                t_y = [2, 4, 19, 21, 19, 4, 2, 1, 5, 8, 12, 18, 20, 20, 20, 20, 18, 14, 10, 5, 3, 3, 3, 3];
                t_w = [3, 2, 3, 16, 3, 2, 3, 16, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1];
                t_h = [3, 16, 3, 2, 3, 16, 3, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1];
                this.drawColor(ctx, t_x, t_y, t_w, t_h, colorFour);
            },
            speckles: function (ctx) {
                var colorB = "rgba(224,190,80,1)";
                var t_x = [3, 6, 8, 8, 13, 15, 15, 16, 18, 20],
                    t_y = [8, 11, 5, 17, 14, 2, 20, 8, 14, 4],
                    t_w = [1, 2, 2, 1, 1, 1, 1, 2, 2, 1],
                    t_h = [3, 3, 3, 3, 2, 3, 2, 3, 3, 2];
                ctx.fillStyle = colorB;
                for (var t = 0; t < 5; t++)
                    for (var index = 0; index < 10; index++)
                        ctx.fillRect(t_x[index] + (t * this.width), t_y[index], t_w[index], t_h[index]);
            }
        });
}
export {Mario};
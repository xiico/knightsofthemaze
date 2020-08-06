let Secret = function (id, type, x, y, cx, cy, index) {
    fg.Game.totalSecrets++;
    if (fg.Game.secrets.find(function (e) { return e == id }))
        return undefined;
    else
        return Object.assign(Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index), fg.Interactive, {
            animationIndex: 0,
            width: fg.System.defaultSide / 2,
            height: fg.System.defaultSide / 2,
            x: x + (fg.System.defaultSide / 4),
            y: y + (fg.System.defaultSide / 2),
            cacheWidth: fg.System.defaultSide / 2,
            cacheHeight: fg.System.defaultSide / 2,
            drawBase: function (ctx, offSetX, colorA, colorB, colorC, colorD) {
                ctx.fillStyle = colorA;
                ctx.fillRect(offSetX + 4, 9, 4, 2);
                ctx.fillRect(offSetX + 3, 11, 6, 1);
                ctx.fillStyle = colorB;
                ctx.fillRect(offSetX + 6, 5, 2, 1);
                ctx.fillRect(offSetX + 6, 5, 1, 4);
                ctx.fillRect(offSetX + 6, 8, 2, 1);
                ctx.fillStyle = colorC;
                ctx.fillRect(offSetX + 5, 5, 1, 4);
                ctx.fillStyle = colorD;
                ctx.fillRect(offSetX + 4, 5, 1, 1);
                ctx.fillRect(offSetX + 4, 8, 1, 1);
            },
            drawTile: function (c, ctx) {
                this.cacheWidth = this.width;
                this.cacheHeight = this.height;;
                c.width = this.width * 4;
                c.height = this.height;
                var colorA = 'rgb(52, 36, 24)';
                var colorB = 'rgb(226,154,00)';
                var colorC = 'rgb(255,208,21)';
                var colorD = 'rgb(255,243,188)';
                for (var i = 0; i < 4; i++) {
                    var offSetX = (i * (fg.System.defaultSide / 2));
                    this.drawBase(ctx, offSetX, colorA, colorB, colorC, colorD);
                    ctx.fillStyle = colorB;
                    ctx.fillRect(offSetX + 7, 1, 2, 4);
                    ctx.fillRect(offSetX + [9, 6, 6, 6][i], [1, 4, 1, 1][i], [2, 1, 1, 1][i], [1, 1, 4, 4][i]);
                    if (i != 2) ctx.fillRect(offSetX + [10, 9, , 9][i], [2, 1, , 1][i], [1, 1, , 1][i], [1, 2, , 2][i]);
                    if (i == 0 || i == 3) ctx.fillRect(offSetX + [9, , , 5][i], [3, , , 1][i], [1, , , 1][i], [1, , , 3][i]);
                    ctx.fillStyle = colorC;
                    ctx.fillRect(offSetX + [3, 3, 3, 5][i], [1, 1, 1, 4][i], [4, 3, 3, 1][i], [4, 4, 4, 1][i]);
                    ctx.fillRect(offSetX + [1, 6, , 4][i], [1, 1, , 1][i], [2, 1, , 1][i], [1, 3, , 3][i]);
                    ctx.fillRect(offSetX + [1, 2, , 2][i], [2, 1, , 1][i], [1, 1, , 1][i], [1, 2, , 2][i]);
                    if (i == 0) ctx.fillRect(offSetX + 2, 3, 1, 1);
                    ctx.fillStyle = colorD;
                    ctx.fillRect(offSetX + (i != 3 ? 4 : 3), 1, 1, 4);
                    if (i == 3) ctx.fillRect(offSetX + 4, 4, 1, 1);
                }
                return c;
            },
            update: function () {
                if (fg.Timer.ticks % 10 == 0) this.animationIndex = this.animationIndex + 1 < 4 ? this.animationIndex + 1 : 0;
                this.cacheX = this.animationIndex * this.width;
            },
            interact: function () {
                var self = this;
                if (!fg.Game.secrets.find(function (e) { return e == self.id })) fg.Game.secrets.push(self.id);
                fg.Game.currentLevel.entities[this.id.split("-")[0]][this.id.split("-")[1]] = null;
            }
        });
}
export {Secret};
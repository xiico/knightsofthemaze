
let Crate = function (id, type, x, y, cx, cy, index) {
    var crate = Object.create(fg.protoEntity);
    crate = Object.assign(crate, fg.Active);
    crate.init(id, type, x, y, cx, cy, index);
    crate.width = fg.System.defaultSide / 2;
    crate.height = fg.System.defaultSide / 2;
    crate.cacheWidth = crate.width;
    crate.cacheHeight = crate.height;
    crate.drawTile = function (c, ctx) {
        c.width = fg.System.defaultSide /*/ 2*/;
        c.height = fg.System.defaultSide / 2;

        ctx.fillStyle = "rgb(110,50,25)";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(205,153,69)";
        ctx.rect(1.5, 1.5, (this.width) - 3, (this.height) - 3);
        ctx.stroke();
        ctx.fillStyle = "rgb(150,79,15)";
        ctx.fillRect(3, 3, 7, 7);
        ctx.fillStyle = "rgb(125,66,13)";
        ctx.fillRect(3, 4, 7, 1);
        ctx.fillRect(3, 6, 7, 1);
        ctx.fillRect(3, 8, 7, 1);
        ctx.fillRect(this.width, 0, this.width, this.height);

        return c;
    };
    fg.Game.currentLevel.applySettingsToEntity(crate);
    return crate;
}
export {Crate};
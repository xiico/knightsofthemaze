
let Slope = function (id, type, x, y, cx, cy, index) {
    var slope = Object.create(fg.protoEntity);
    slope.init(id, type, x, y, cx, cy, index);
    slope.slope = true;
    slope.backGround = true;
    slope.drawTile = function (c, ctx) {
        c.width = this.width * 15;
        c.height = this.height;
        ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = this.color;
        if (this.type == TYPE.SLOPENE) {//╗
            slope.drawNE(ctx);
        } else if (this.type == TYPE.SLOPESE) {//╝
            ctx.moveTo(0, 0);
            ctx.lineTo(this.width, 0);
            ctx.lineTo(0, this.height);
        } else if (this.type == TYPE.SLOPESW) {//╚
            ctx.moveTo(0, 0);
            ctx.lineTo(this.width, 0);
            ctx.lineTo(this.width, this.height);
        } else if (this.type == TYPE.SLOPENW) {//╔
            slope.drawNW(ctx);
        }
        ctx.fill();

        return c;
    };
    slope.drawNE = function (ctx) {
        var height = 0, width = 0;
        for (var i = 0; i < 6; i++) {
            width += i * this.width;
            ctx.moveTo(width, 0);
            ctx.lineTo(width, this.height);
            ctx.lineTo(width + this.width * (i + 1), this.height);
        }
    };
    slope.drawNW = function (ctx) {
        var height = 0, width = 0;
        for (var i = 0; i < 6; i++) {
            width += i * this.width;
            ctx.moveTo(width + this.width * (i + 1), 0);
            ctx.lineTo(width + this.width * (i + 1), this.height);
            ctx.lineTo(width, this.height);
        }
    };
    slope.setYs = function (colSize, rowSize) {
        colSize++;
        rowSize++;
        slope.colSize = colSize;
        slope.rowSize = rowSize;
        switch (slope.type) {
            case TYPE.SLOPENE:
                if (colSize > 1) {
                    slope.leftY = slope.y + (slope.width / colSize) * slope.index;
                    slope.rightY = slope.y + ((slope.width / colSize) * slope.index) + (slope.width / colSize);
                } else {
                    slope.leftY = slope.y;
                    slope.rightY = slope.y + slope.height;
                }
                break;
            case TYPE.SLOPENW:
                slope.leftY = slope.y + (slope.width / colSize) * (colSize - slope.index);
                slope.rightY = slope.y + ((slope.width / colSize) * (colSize - slope.index)) - (slope.width / colSize);
                break;
            default:
                break;
        }
    }
    return slope;
}
export {Slope};
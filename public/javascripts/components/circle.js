
let Circle = function (id, type, x, y, cx, cy, index) {
    var circle = Object.create(fg.protoEntity);
    circle.init(id, type, x, y, cx, cy, index);
    if (type == TYPE.CIRCLE) {
        circle = Object.assign(circle, fg.Active);
        circle.soilFriction = 0.999;
        circle.speedX = -0.05;//1.4
        circle.bounceness = 0.7;
        circle.width = fg.System.defaultSide / 2;
        circle.height = fg.System.defaultSide / 2;
    } else {
        circle.width = fg.System.defaultSide / 3;
        circle.height = fg.System.defaultSide / 3;
        Object.assign(circle, fg.Interactive);
        switch (type) {
            case TYPE.WALLJUMP:
                circle.color = 'green';
                break;
            case TYPE.SUPERJUMP:
                circle.color = "brown";
                break;
            case TYPE.LIGHT:
                circle.color = "white";
                break;
            case TYPE.VELOCITY:
                circle.color = "pink";
                break;
            case TYPE.GLOVE:
                circle.color = "orange";
                break;
            default:
                break;
        }
        circle.interact = function () {
            if (this.type == TYPE.GLOVE) {
                fg.Game.actors[0].glove = true;
            } else if (this.type == TYPE.LIGHT) {
                fg.Game.actors[0].light = true;
            } else if (this.type == TYPE.WALLJUMP) {
                fg.Game.actors[0].wallJump = true;
            } else if (this.type == TYPE.SUPERJUMP) {
                fg.Game.actors[0].superJump = true;
            } else if (this.type == TYPE.VELOCITY) {
                fg.Game.actors[0].velocity = true;
            }
            fg.Game.currentLevel.entities[this.id.split("-")[0]][this.id.split("-")[1]] = null;
        }
    }
    circle.drawTile = function (c, ctx) {
        this.cacheWidth = this.width;
        this.cacheHeight = this.height;;
        c.width = this.width * 2;
        c.height = this.height;
        ctx.fillStyle = this.color;
        ctx.arc(this.width / 2, this.height / 2, this.height / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = this.color;
        ctx.arc(this.width + (this.width / 2), this.height / 2, this.height / 2, 0, 2 * Math.PI);
        ctx.fill();
        return c;
    }
    return circle;
}
export {Circle};
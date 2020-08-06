
let Switch = {
    on: false,
    defaulState: false,
    foreGround: true,
    target: undefined,
    timed: false,
    timer: undefined,
    defaulTimer: 120,
    canChangeState: true,
    init: function () {
        if (this.targetId) {
            this.target = fg.Game.currentLevel.entities[this.targetId.split('-')[0]][this.targetId.split('-')[1]];
            this.target.drawSegments = this.drawSegments;
            this.target.update = (function (original) {
                return function () {
                    if (this.drawSegments) this.drawSegments();
                    original.apply(this, arguments);
                }
            })(this.target.update)
        }
        this.timer = this.defaulTimer;
    },
    update: function (foreGround) {
        if (this.target === undefined) this.init();
        if (foreGround) return;
        if (this.interacting) {
            if (this.interactor.x >= this.x && this.interactor.x + this.interactor.width <= this.x + this.width) {
                if (this.canChangeState) {
                    this.on = !this.on;
                    this.canChangeState = false;
                }
                if (this.timed) this.timer = this.defaulTimer;
                if (this.pressure) this.on = true;
            }
        } else this.canChangeState = true;

        if (this.timed && this.timer > 0) {
            this.timer--;
            if (this.timer <= 0) this.on = this.defaulState;
        }
        if (this.doAction) this.doAction();
        if (this.growTarget) this.handleYSegments();
        fg.Interactive.update.call(this);
    },
    handleYSegments: function () {
        var size = Math.ceil((this.target.defaultY + this.target.height - this.target.y) / this.target.height) - 1;
        while (this.target.segments.length > size) this.target.segments.pop();
        if (size > 0) {
            for (var i = 0; i < size; i++) {
                if (!this.target.segments[i]) {
                    this.target.segments[i] = Object.create(fg.protoEntity).init(i, this.target.type, this.target.x, this.target.defaultY - (i * this.target.height), 0, ((size == 1 ? 3 : 2) * this.target.height));
                    this.target.segments[i].foreGround = true;//Gambiarra =(
                }
            }
        }
        this.target.cacheY = this.target.segments.length > 0 ? this.height : 0;
    },
    drawSegments: function () {
        for (var i = 0, segment; segment = this.segments[i]; i++)
            fg.Game.foreGroundEntities.push(segment);
    },
    interact: function (obj) {
        fg.Interactive.interact.call(this, obj);
    },
    drawTile: function (c, ctx) {
        c.width = this.width * 3;
        c.height = this.height
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 5, this.width, this.height - 5);
        ctx.fillStyle = "grey";
        ctx.fillRect(1, 6, this.width - 2, this.height - 7);
        ctx.fillStyle = this.color;
        ctx.fillRect(2, 7, this.width - 4, this.height - 9);
        //Green
        ctx.fillStyle = "rgb(0,160,0)";
        ctx.fillRect(this.width, 0, this.width, 5);
        ctx.fillStyle = "rgb(90,255,90)";
        ctx.fillRect(this.width + 1, 0, this.width - 1, 4);
        ctx.fillStyle = "rgb(0,255,0)";
        ctx.fillRect(this.width + 1, 1, this.width - 2, 3);
        //Red
        ctx.fillStyle = "rgb(160,0,0)";
        ctx.fillRect((this.width * 2), 0, this.width, 5);
        ctx.fillStyle = "rgb(255,90,90)";
        ctx.fillRect((this.width * 2) + 1, 0, this.width - 1, 4);
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect((this.width * 2) + 1, 1, this.width - 2, 3);
        //ctx.fillRect(this.width * 2, 0, this.width, 5);
        return c;
    },
    draw: function (foreGround) {
        if (foreGround) {
            if (this.on)
                this.cacheX = this.width;
            else
                this.cacheX = this.width * 2;
        } else
            this.cacheX = 0

        fg.protoEntity.draw.call(this, foreGround);
    }
}
export {Switch};
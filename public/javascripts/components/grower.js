let Grower = {
    defaultGrowTimer: 60,
    growTimer: undefined,
    defaultShrinkTimer: 60,
    shrinkTimer: undefined,
    maxGrowth: 2,
    growthSpeed: 0.06,
    defaultY: undefined,
    interactor: null,
    init: function () {
        this.growTimer = this.defaultGrowTimer;
        this.shrinkTimer = this.defaultShrinkTimer;
        this.defaultY = this.y;
    },
    interact: function (obj) {
        fg.Interactive.interact.call(this, obj);
        if (this.growTimer > 0) {
            this.growTimer--;
            this.shrinkTimer = this.defaultShrinkTimer;
        }
    },
    update: function () {
        if (this.growTimer === undefined) this.init();
        if (this.interacting && this.interactor.x >= this.x && this.interactor.x + this.interactor.width <= this.x + this.width) {
            if (this.growTimer <= 0) {
                this.vectors = undefined;
                if (this.y > this.defaultY - ((this.maxGrowth * fg.System.defaultSide) - fg.System.defaultSide))
                    this.y -= (this.growthSpeed * fg.Timer.deltaTime);
                else
                    this.y = this.defaultY - ((this.maxGrowth * fg.System.defaultSide) - fg.System.defaultSide);
            }
        } else {
            if (this.growTimer < this.defaultGrowTimer)
                this.growTimer++;
            else
                this.growTimer = this.defaultGrowTimer

            if (this.shrinkTimer <= 0 && this.y != this.defaultY) {
                this.vectors = undefined;
                if (this.y < this.defaultY) {
                    this.y += (this.growthSpeed * fg.Timer.deltaTime);
                } else {
                    this.shrinkTimer = this.defaultShrinkTimer;
                    this.y = this.id.split('-')[0] * fg.System.defaultSide;
                }
            }
            if (this.shrinkTimer > 0) this.shrinkTimer--;
        }
        fg.Interactive.update.call(this);
    }
}
export {Grower};
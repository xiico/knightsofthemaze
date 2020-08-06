
let MovingPlatform = {
    loop: false,
    path: undefined,
    hovering: 0,
    hoverTime: 120,
    movingSpeed: 0.06,//0.06
    nextPosition: {},
    iterator: 1,
    currentIndex: 0,
    speedX: 0,
    init: function () {
        if (!this.path) {
            this.path = [];
            if (this.movingOnX) {
                this.path.push({ x: this.x - (fg.System.defaultSide * 3), y: this.y });
                this.path.push({ x: this.x + (fg.System.defaultSide * 3), y: this.y });
            } else {
                this.path.push({ x: this.x, y: this.y - (fg.System.defaultSide * 1) });
                this.path.push({ x: this.x, y: this.y + (fg.System.defaultSide * 1) });
            }
            this.movingSpeed *= -1;
            this.nextPosition = this.path[0];
        }
        if (this.segments.length > 0)
            for (var i = 0, segment; segment = this.segments[i]; i++)
                fg.Game.currentLevel.entities[segment.l][segment.c].interact = this.interact;
    },
    setNextPosition: function () {
        this.currentIndex = this.path.indexOf(this.nextPosition);
        if (this.currentIndex + this.iterator >= this.path.length || this.currentIndex + this.iterator <= 0) {
            if (this.loop) {
                this.currentIndex = 0;
                this.nextPosition = this.path[this.currentIndex];
            } else {
                this.iterator *= -1;
                this.nextPosition = this.path[this.currentIndex + this.iterator];
            }
        } else {
            this.nextPosition = this.path[this.currentIndex + this.iterator];
        }
        if (this.movingOnX) {
            if ((this.nextPosition.x > this.x && this.movingSpeed < 0) || (this.nextPosition.x < this.x && this.movingSpeed > 0))
                this.movingSpeed *= -1;
        } else {
            if ((this.nextPosition.y > this.y && this.movingSpeed < 0) || (this.nextPosition.y < this.y && this.movingSpeed > 0))
                this.movingSpeed *= -1;
        }

        if (this.hoverTime > 0) this.hovering = this.hoverTime;
    },
    update: function () {
        if (!this.path) this.init();
        if (this.hovering > 0) {
            this.speedX = 0;
            this.updateSegments();
            this.hovering--;
            return;
        }
        if (this.movingOnX)
            this.moveOnX();
        else
            this.moveOnY();
        this.speedX = this.movingSpeed;
        this.updateSegments();
    },
    updateSegments: function () {
        if (this.segments.length > 0)
            for (var i = 0, segment; segment = this.segments[i]; i++) {
                var sgmt = fg.Game.currentLevel.entities[segment.l][segment.c];
                if (this.movingOnX)
                    sgmt.x = this.x + (sgmt.index * fg.System.defaultSide);
                else
                    sgmt.y = this.y;
                sgmt.speedX = this.speedX;
                sgmt.hovering = this.hovering;
                sgmt.movingOnX = this.movingOnX;
            }
    },
    moveOnX: function () {
        this.movingOnX = true;
        this.x += this.movingSpeed * fg.Timer.deltaTime;
        if ((this.movingSpeed < 0 && this.x <= this.nextPosition.x) || (this.movingSpeed > 0 && this.x >= this.nextPosition.x)) {
            if (this.syncX && this.movingSpeed > 0) {
                //var synched = fg.Game.currentLevel.entities[this.syncX.split('-')[0]][this.syncX.split('-')[1]];
                //synched.x = this.x + this.width + (this.segments.length * fg.System.defaultSide);
                //synched.hovering = 0;
            }
            this.x = this.nextPosition.x;
            this.setNextPosition();
        }
    },
    moveOnY: function () {
        this.movingOnX = false;
        this.y += this.movingSpeed * fg.Timer.deltaTime;
        if ((this.movingSpeed < 0 && this.y <= this.nextPosition.y) || (this.movingSpeed > 0 && this.y >= this.nextPosition.y)) {
            this.y = this.nextPosition.y;
            this.setNextPosition();
        }
    },
    interact: function (obj) {
        if (this.hovering == 0) {
            if (!this.movingOnX)
                obj.y = this.y - (obj.height + 1);
        }
    }
}
export {MovingPlatform};
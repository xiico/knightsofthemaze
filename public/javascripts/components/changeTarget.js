
let ChangeTarget = {
    distance: 1,
    direction: "U",
    speed: 0.06,
    moveUp: function () {
        if (!this.target.defaultY) this.target.defaultY = this.target.y;
        if (this.on) {
            if (this.target.y - (this.speed * fg.Timer.deltaTime) > this.target.defaultY - (fg.System.defaultSide * this.distance))
                this.target.y -= this.speed * fg.Timer.deltaTime;//0.2;//0.1;
            else
                this.target.y = this.target.defaultY - (fg.System.defaultSide * this.distance);//0.2;//0.1;
        } else {
            if (this.target.y + (this.speed * fg.Timer.deltaTime) < this.target.defaultY)
                this.target.y += this.speed * fg.Timer.deltaTime;
            else
                this.target.y = this.target.defaultY;
        }
    },
    moveDown: function () {
        if (!this.target.defaultY) this.target.defaultY = this.target.y;
        if (this.on) {
            if (this.target.y + (this.speed * fg.Timer.deltaTime) < this.target.defaultY + (fg.System.defaultSide * this.distance))
                this.target.y += this.speed * fg.Timer.deltaTime;//0.2;//0.1;
            else
                this.target.y = this.target.defaultY + (fg.System.defaultSide * this.distance);//0.2;//0.1;
        } else {
            if (this.target.y - (this.speed * fg.Timer.deltaTime) > this.target.defaultY)
                this.target.y -= this.speed * fg.Timer.deltaTime;
            else
                this.target.y = this.target.defaultY;
        }
    },
    moveLeft: function () {
        if (!this.target.defaultX) this.target.defaultX = this.target.x;
        this.target.addedSpeedX = 0;
        if (this.on) {
            if (this.target.x > this.target.defaultX - (fg.System.defaultSide * this.distance)) {
                this.target.x -= this.speed * fg.Timer.deltaTime;//0.2;//0.1;
                this.target.addedSpeedX = this.speed * -1;
            } else
                this.target.x = this.target.defaultX - (fg.System.defaultSide * this.distance);//0.2;//0.1;
        } else {
            if (this.target.x < this.target.defaultX) {
                this.target.x += this.speed * fg.Timer.deltaTime;
                this.target.addedSpeedX = this.speed;
            } else
                this.target.x = this.target.defaultX;
        }
    },
    moveRight: function () {
        if (!this.target.defaultX) this.target.defaultX = this.target.x;
        this.target.addedSpeedX = 0;
        if (this.on) {
            if (this.target.x < this.target.defaultX + (fg.System.defaultSide * this.distance)) {
                this.target.x += this.speed * fg.Timer.deltaTime;//0.2;//0.1;
                this.target.addedSpeedX = this.speed;
            } else
                this.target.x = this.target.defaultX + (fg.System.defaultSide * this.distance);//0.2;//0.1;
        } else {
            if (this.target.x > this.target.defaultX) {
                this.target.x -= this.speed * fg.Timer.deltaTime;
                this.target.addedSpeedX = this.speed * -1;
            } else
                this.target.x = this.target.defaultX;
        }
    },
    doAction: function () {
        switch (this.direction) {
            case "U":
                this.moveUp();
                break;
            case "D":
                this.moveDown();
                break;
            case "L":
                this.moveLeft();
                break;
            case "R":
                this.moveRight();
                break;
            default:
                break;
        }
    }
}
export {ChangeTarget};
let Active =
{
    active: true,
    speedX: 0,//-0.49
    speedY: 0,
    grounded: false,
    maxSpeedX: .06,//0.12
    maxSpeedY: .06,
    entitiesToTest: [],
    searchDepth: 6,
    bounceness: 0.2,//0.75
    airFriction: 0.85,
    soilFriction: 0.75,
    ignoreFriction: false,
    accelX: 0.06,
    accelY: 0.06,
    accelAirX: 0.0075,
    entitiesToResolveX: null,
    entitiesToResolveY: null,
    nextPosition: {},
    addedSpeedX: 0,
    backGround: true,
    life: 100,
    searchDepthX: 4,
    searchDepthY: 3,
    update: function () {
        // this.addGravity();
        this.entitiesToTest = fg.Game.searchArea(this.x + (this.width / 2), this.y + (this.height / 2), this.searchDepth, this.searchDepth);
        fg.Game.searchArea(this.x + (this.width / 2), this.y + (this.height / 2), this.searchDepthX, this.searchDepthY, undefined, undefined, undefined, true);
        this.lastPosition = { x: this.x, y: this.y, grounded: this.grounded, speedX: this.speedX, speedY: this.speedY };
        // this.speedX = this.getSpeedX();
        // this.speedY = this.getSpeedY();
        for (var index = 0, entity; entity = fg.Game.actors[index]; index++)
            this.entitiesToTest.push(entity);
        this.ignoreFriction = false;
        this.checkCollisions();
        this.cacheX = this.grounded ? 0 : this.width;
        if (this.x != this.lastPosition.x && Math.abs(this.y - this.lastPosition.y) != fg.Game.gravity * fg.Timer.deltaTime) this.vectors = null;
    },
    getSpeedX: function () {
        return Math.abs(this.speedX) * this.getFriction() > 0.001 ? this.speedX * this.getFriction() : 0;
    },
    getSpeedY: function () {
        return Math.abs(this.speedY) * this.getFriction() > 0.001 ? this.speedY * this.getFriction() : 0;
    },
    getFriction: function () {
        return this.ignoreFriction ? 1 : this.soilFriction; // (this.grounded ? this.soilFriction : this.airFriction);
    },
    getAccelX: function () {
        return this.accelX;
    },
    getAccelY: function () {
        return this.accelY;
    },
    addGravity: function () {
        this.speedY = this.speedY < this.maxSpeedY ? this.speedY + fg.Game.gravity : this.maxSpeedY;
    },
    checkCollisions: function () {
        this.entitiesToResolveX = [];
        this.entitiesToResolveY = [];
        this.grounded = false;
        this.nextPosition = { x: this.x + ((this.speedX + this.addedSpeedX) * fg.Timer.deltaTime), y: this.y + this.speedY * fg.Timer.deltaTime, width: this.width, height: this.height, id: this.id };
        for (var i = this.entitiesToTest.length - 1, obj; obj = this.entitiesToTest[i]; i--) {
            if (fg.Game.testOverlap(this.nextPosition, obj)) {
                if (obj.interactive) obj.interact(this);
                this.entitiesToResolveX.push(obj);
                this.entitiesToResolveY.push(obj);
                if (this.entitiesToResolveX.length >= 4)
                    break;
            }
        }
        if (this.entitiesToResolveX.length > 0) {
            this.resolveCollisions(this.entitiesToResolveX, this.entitiesToResolveY);
            if (this.type == fg.TYPE.ACTOR && (Math.abs(this.speedX) >= Math.abs(this.maxSpeedX * 2) || Math.abs(this.speedY) > Math.abs(this.maxSpeedY * 2))) this.life = 0;
        } else {
            this.addedSpeedX = 0;
            this.x = this.nextPosition.x;
            this.y = this.nextPosition.y;
            if (this.canJump && this.y - this.lastPosition.y > 1)
                this.canJump = false;
        }
    },
    resolveCollisions: function (entitiesToResolveX, entitiesToResolveY) {
        if (entitiesToResolveX.length > 1) entitiesToResolveX.sort(function (a, b) { return a.slope; });
        if (entitiesToResolveY.length > 1) entitiesToResolveY.sort(function (a, b) { return a.slope; });
        var countx = 0, county = 0;
        this.x += (this.speedX + this.addedSpeedX) * fg.Timer.deltaTime;
        while (entitiesToResolveX.length > 0) {
            var obj = entitiesToResolveX[entitiesToResolveX.length - 1];
            this.resolveForX(entitiesToResolveX, obj);
            county++;
            if (county > 4) break;
        }
        this.y += this.speedY * fg.Timer.deltaTime;
        while (entitiesToResolveY.length > 0) {
            var obj = entitiesToResolveY[entitiesToResolveY.length - 1];
            this.resolveForY(entitiesToResolveY, obj);
            countx++;
            if (countx > 4) break;
        }
    },
    resolveForX: function (entitiesToResolve, obj) {
        if (!fg.Game.testOverlap(this, obj) || obj.oneWay || !obj.collidable) {
            entitiesToResolve.pop();
            return;
        } else {
            if (!obj.slope) this.nonSlopeXcollision(obj);
            if (this.collision) this.collision(obj);
        }
    },
    nonSlopeXcollision: function (obj) {
        var intersection = this.getIntersection(obj);
        if ((intersection.height >= intersection.width && intersection.height > 1)) {
            if (this.x < obj.x)
                this.x = obj.x - this.width;
            else
                this.x = obj.x + obj.width;
            if (this.type != fg.TYPE.ACTOR || !obj.active) {
                this.speedX = this.speedX * -1;
                if (obj.active)
                    obj.speedX -= this.speedX * Math.max(this.bounceness, (obj.bounceness || 0));
                this.speedX = Math.abs(this.speedX) * Math.max(this.bounceness, (obj.bounceness || 0)) >= 0.001 ? this.speedX * Math.max(this.bounceness, (obj.bounceness || 0)) : 0;
                if (obj.type == fg.TYPE.BOUNCER && Math.abs(this.speedX) < 0.2)
                    this.speedX = this.speedX > 0 ? 0.2 : -0.2;
            } else {
                this.processActorCollisionX(obj);
            }
        } else {
            if (Math.round((this.y + intersection.height) * 100) / 100 >= Math.round((obj.y + obj.height) * 100) / 100)
                this.y = obj.y + obj.height;
            else
                this.y = obj.y - this.height;
            if (Math.abs(this.y - this.lastPosition.y) >= obj.height)
                this.y = this.lastPosition.y;
        }
        //if (obj.interactive) obj.interact(this);
    },
    processActorCollisionX: function (obj) {
        if (this.glove) obj.speedX = Math.abs(this.speedX) > this.accelX ? 0 : this.speedX;
        this.speedX = 0;
    },
    slopeXcollision: function (obj) { },
    resolveForY: function (entitiesToResolve, obj) {
        if (!fg.Game.testOverlap(this, obj) || !obj.collidable) {
            entitiesToResolve.pop();
            return;
        } else {
            if (!obj.slope)
                this.nonSlopeYcollision(obj);
            else
                this.slopeYcollision(obj);

            if (obj.oneWay) entitiesToResolve.pop();
            if (this.collision) this.collision(obj);
        }
    },
    slopeYcollision: function (obj) {
        var t = (Math.round(this.x + (this.width / 2)) - obj.x) / (fg.System.defaultSide / (obj.rowSize || 1));
        var hitY = (1 - t) * obj.leftY + t * obj.rightY;
        if (this.y + this.height >= hitY) {
            if (!fg.Input.actions["jump"]) this.canJump = true;
            this.speedY = 0;
            this.y = hitY - this.height;
            this.grounded = true;
        }
    },
    resolveNonOneWayYCollision: function (obj) {
        if (this.type == fg.TYPE.ACTOR && obj.type == fg.TYPE.CHECKPOINT) this.lastCheckPoint = obj;
        if (Math.abs(this.speedY) <= fg.Game.gravity) return;
        this.addedSpeedX = this.computeAddedSpeedX((obj.addedSpeedX || obj.speedX) || 0);
        if (this.y <= obj.y)
            this.y = obj.y - this.height;
        else
            this.y = obj.y + obj.height;
        this.speedY = this.speedY * -1;
        if (Math.abs(this.speedY) < 0.03) this.speedY = 0;
        if (obj.active)
            obj.speedY -= this.speedY * Math.max(this.bounceness, (obj.bounceness || 0));
        this.speedY = this.speedY * Math.max(this.bounceness, (obj.bounceness || 0));
        if (obj.bounceness >= 1 && this.speedY < 0 && this.speedY > -(fg.Game.gravity * 2))
            this.speedY = -(fg.Game.gravity * fg.Timer.deltaTime);
        if (obj.lastPosition) {
            if (obj.type == fg.TYPE.CIRCLE) {
                this.speedX += obj.speedX;
                obj.speedX = obj.speedX * 0.70749;
            }
        }
        //if (obj.interactive) obj.interact(this);
    },
    computeAddedSpeedX: function (newAddedValue) {
        if (newAddedValue == 0) return newAddedValue;
        var multiplyer = Math.min(Math.abs(this.addedSpeedX + this.speedX), Math.abs(newAddedValue)) / Math.max(Math.abs(this.addedSpeedX + this.speedX), Math.abs(newAddedValue));
        if (multiplyer == 0) multiplyer = 0.001;
        if (multiplyer < 0.9 && Math.abs(newAddedValue) > 0.06) return newAddedValue * multiplyer;
        return newAddedValue;
    },
    nonSlopeYcollision: function (obj) {
        if (this.speedY >= 0) {
            if (!fg.Input.actions["jump"]) this.canJump = true;
            this.grounded = true;
        }
        var intersection = this.getIntersection(obj);
        if (intersection.height <= intersection.width) {
            if (!obj.oneWay) {
                this.resolveNonOneWayYCollision(obj);
            } else {
                if ((this.lastPosition.y + this.height) - (this.lastPosition.speedY * fg.Timer.deltaTime) <= obj.y && this.y + this.height > obj.y) {
                    this.addedSpeedX = this.computeAddedSpeedX((obj.addedSpeedX || obj.speedX) || 0);
                    this.y = obj.y - this.height;
                    this.speedY = this.speedY * -1;
                    this.speedY = this.speedY * this.bounceness;
                }
            }
        } else {
            if (obj.oneWay) return;
            if (this.x <= obj.x)
                this.x = obj.x - this.width;
            else
                this.x = obj.x + obj.width;
            if (Math.abs(this.x - this.lastPosition.x) >= obj.width) this.x = this.lastPosition.x;
            this.lastPosition.x = this.x;
        }
    },
    getIntersection: function (obj) {
        var intersection = { x: Math.max(this.x, obj.x), y: Math.max(this.y, obj.y) };
        intersection.width = Math.round((Math.min(this.x + this.width, obj.x + obj.width) - intersection.x) * 1000) / 1000;
        intersection.height = Math.round((Math.min(this.y + this.height, obj.y + obj.height) - intersection.y) * 1000 / 1000);
        return intersection;
    }
};
export {Active};
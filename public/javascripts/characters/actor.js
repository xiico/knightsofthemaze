let Actor = function (id, type, x, y, cx, cy, index) {
    var actor = Object.create(fg.protoEntity);
    actor = Object.assign(actor, fg.Active);
    actor.init(id, type, x, y, cx, cy, index);
    actor.width = 10;//fg.System.defaultSide * .625; //* .625; // fg.System.defaultSide / 3;
    actor.height = 14;//fg.System.defaultSide * .5; //* .9375; //fg.System.defaultSide - 4;
    actor.color = "red";
    actor.canJump = true;
    actor.active = false;
    actor.cacheWidth = actor.width;
    actor.cacheHeight = actor.height;
    //powerUps
    actor.glove = false;
    actor.wallJump = true;
    actor.cacheOffSetX = -3;
    actor.cacheOffSetY = -18; // -17;
    actor.wallSlideSpeed = 0.082;
    actor.wallSliding = false;
    actor.segments = [];
    actor.wait = 0;
    actor.respawn = 0;
    actor.lastCheckPoint = { id:"3-3" };
    actor.bounceness = 0;
    actor.searchDepth = 12;
    actor.facingRight = true;
    actor.drawTile = function (c, ctx) {
        fg.protoEntity.drawTile.call(this, c,ctx);
        return c;
    };
    // actor.draw = function (foreGround) {
    //     fg.protoEntity.draw.call(this, foreGround);
    //     return this;
    // };
    actor.explode = function () {
        var divider = 4;
        for (var i = 0; i < this.width / divider; i++) {
            for (var k = 0; k < this.height / divider; k++) {
                var segment = fg.Entity(i + "." + k, "C", this.x + (i * divider), this.y + (k * divider), 0, 0, 0);
                segment.width = divider;
                segment.height = divider;
                segment.cacheWidth = segment.width;
                segment.cacheHeight = segment.height;
                segment.foreGround = true;
                segment.speedX = this.speedX;
                segment.speedY = this.speedY;
                segment.bounceness = 0.6;
                this.segments.push(segment);
            }
        }
        this.vanished = true;
        this.respawn = 240;
    },
    actor.drawSegments = function () {
        for (var i = 0, segment; segment = this.segments[i]; i++)
            fg.Game.foreGroundEntities.push(segment);
    };
    actor.checkDeath = function () {
        if (this.life == 0) {
            if (this.segments.length == 0) this.explode();
            this.drawSegments();
            fg.Camera.following = this.segments[0];
            if (this.respawn > 0)
                this.respawn--;
            else {
                this.segments = [];
                this.life = 100;
                this.vanished = undefined;
                fg.Camera.following = this;
                fg.Game.warp(this, { y: (parseInt(this.lastCheckPoint.id.split("-")[0]) - 1), x: parseInt(this.lastCheckPoint.id.split("-")[1]) });
            }
            return true;
        }
        return false;
    };
    actor.update = function () {
        if (this.checkDeath() || this.disabled) return;
        this.soilFriction = 0.25;
        this.speedX = 0;
        this.speedY = 0;
        if (fg.Input.actions["jump"]) {
            if (this.canJump) {
                this.canJump = false;
                fg.Game.currentLevel.maze = fg.Maze(fg.Game.currentLevel.size, undefined, undefined, undefined, undefined, fg.Game.currentLevel.seed);
                fg.Game.currentLevel.createEntities();
                this.playAnimation("Jump");
            }
        }
        this.active = false;
        if (fg.Input.actions["left"]) {
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = false;
            this.speedX = -this.getAccelX(); // this.speedX - this.getAccelX() >= -this.maxSpeedX ? this.speedX - this.getAccelX() : -this.maxSpeedX;
        } else if (fg.Input.actions["right"]) {
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = true;
            this.speedX = this.getAccelX(); // this.speedX + this.getAccelX() <= this.maxSpeedX ? this.speedX + this.getAccelX() : this.maxSpeedX;
        } 
        if (fg.Input.actions["up"]) {
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = -this.getAccelY(); // this.speedY - this.getAccelY() >= -this.maxSpeedY ? this.speedY - this.getAccelY() : -this.maxSpeedY;
        } else if (fg.Input.actions["down"]) {
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = this.getAccelY(); // this.speedY + this.getAccelY() <= this.maxSpeedY ? this.speedY + this.getAccelY() : this.maxSpeedY;
        } 

        
        if(!Object.keys(fg.Input.actions).length)
            this.playAnimation("Idle");
        else 
        {
            if((fg.Input.actions["up"] || fg.Input.actions["down"] || fg.Input.actions["left"] || fg.Input.actions["right"]) && !fg.Input.actions["jump"]) this.playAnimation("Run");
        }
        let bossRoom = {
            x: fg.Game.currentLevel.maze.bossRoom.x * fg.System.defaultSide * 2, 
            y: fg.Game.currentLevel.maze.bossRoom.y * fg.System.defaultSide * 2,
            width: fg.Game.currentLevel.maze.bossRoom.size * fg.System.defaultSide * 2,
            height: fg.Game.currentLevel.maze.bossRoom.size * fg.System.defaultSide * 2
        };
        let overlapRoom = fg.Game.testOverlap(bossRoom,this);

        
        
        if(overlapRoom) {
            if (fg.Camera.following) fg.Camera.following = null;
            fg.Camera.moveTo({x:bossRoom.x + fg.Game.currentLevel.maze.bossRoom.size * fg.System.defaultSide,y:bossRoom.y + fg.Game.currentLevel.maze.bossRoom.size * fg.System.defaultSide})
        } else fg.Camera.following = this;

        this.vectors = undefined;
        fg.Active.update.call(this);
        fg.protoEntity.update.call(this);
    };
    actor.updateAnimationCache = function() {
        var frame;
        if (this.curAnimation) frame = this.curAnimation.update(this.facingRight);
        if (frame) {
            // if (this.cacheOffSetX || this.cacheOffSetY) {
            //     this.cacheOffSetX = -3;
            //     this.cacheOffSetY = -26; // -17;
            // }
            this.cacheX = frame.x;
            // this.cacheY = frame.y + fr;
            this.cacheY = frame.y;
            this.cacheWidth = frame.width;
            this.cacheHeight = frame.height;
        } else {
            this.cacheX = 0;
            this.cacheY = 0;
            this.cacheWidth = 16;
            this.cacheHeight = 32;
        }
    }
    return actor;
}
export {Actor};
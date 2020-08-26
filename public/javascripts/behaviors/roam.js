import {Active} from '../engine/active.js';

let Roam = {
    waitTimeRange: {
        min: 1000,
        max: 3000
    },
    moveTimeRange: {
        min: 500,
        max: 2000
    },
    distanceRange: {
        min: 50,
        max: 150
    },
    startPosition: {
        x: 0,
        y: 0
    },
    waitTime: null,
    curWaitTime: null,   
    moveTime: null, 
    curMoveTime: null,  
    accelX: 0.01,
    accelY: 0.01,
    maxSpeedX: 0.03,
    maxSpeedY: 0.03,
    actionsNames: ["left","right","up", "down"],
    // enabled: false,
    // init: function(minWait = 2000, maxWait = 5000, minDistance = 50, maxDistance = 150) {
    //     this.waitTimeRange.min = minWait;
    //     this.waitTimeRange.max = maxWait;
    //     this.distanceRange.min = minDistance;
    //     this.waitTimeRange.max = maxDistance;
    // },
    roam: function() {
        // if (!this.enabled) return;
        this.speedX = 0;
        this.speedY = 0;
        if (!this.waitTime) this.waitTime = rand(this.waitTimeRange.min, this.waitTimeRange.max);
        if (this.moveTime === null && this.curWaitTime < this.waitTime) {
            this.curWaitTime += fg.Timer.deltaTime;
            if (fg.Game.debug) this.text('waiting');
        } else this.move();
    },
    text: function(text) {
        // fg.System.context.font = "7px Arial";
        fg.System.context.fillStyle = "white";
        fg.System.context.fillText(text, this.x + 8 - fg.Game.screenOffsetX , this.y + 8 - fg.Game.screenOffsetY);
    },
    move: function() {
        if (!this.moveTime) this.moveTime = rand(this.moveTimeRange.min, this.moveTimeRange.max);
        if (this.curMoveTime < this.moveTime) {
            this.curMoveTime += fg.Timer.deltaTime;
            if (fg.Game.debug) this.text('moving:' + this.actionsNames[this.curAction]);
            this.defineAction();
        } else {
            this.waitTime = null;
            this.moveTime = null;
            this.curWaitTime = 0;
            this.curMoveTime = 0;
            this.curAction = null;
        }
    },
    defineAction: function() {
        if(this.curAction == null) {
            this.actions = [];
            this.curAction = rand(0,4);
            this.actions[0] = null;
            this.actions[1] = null;
            this.actions[2] = null;
            this.actions[3] = null;
            this.actions[this.curAction] = true;
        }
        if (this.actions[0]) { // "left"
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = false;
            this.speedX = -this.getAccelX();
        } else if (this.actions[1]) { //"right"
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = true;
            this.speedX = this.getAccelX();
        } 
        if (this.actions[2]) { // "up"
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = -this.getAccelY();
        } else if (this.actions[3]) { // "down"
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = this.getAccelY();
        } 
    }
}
Object.assign(Roam, Active);
export {Roam};
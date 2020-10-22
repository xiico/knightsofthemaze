import {Active} from '../engine/active.js';
import { fg } from '../engine/fg.js';

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
    check: null,
    enabled: true,
    curActionIndex: null,
    roam: function() {
        if (!this.enabled) return;
        this.speedX = 0;
        this.speedY = 0;
        if (!this.waitTime) this.waitTime = rand(this.waitTimeRange.min, this.waitTimeRange.max);
        if (this.moveTime === null && this.curWaitTime < this.waitTime) {
            this.curWaitTime += fg.Timer.deltaTime;
            if (fg.Game.debug) this.text('waiting');
            this.actions = {};
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
            if (fg.Game.debug) this.text('moving:' + this.curAction);
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
        if (this.curAction == null) {
            this.actions = {};
            if (!this.check) this.check = [...this.actionsNames];            
            this.curActionIndex = rand(0, this.check.length);
            switch (this.curAction = this.check[this.curActionIndex]) {
                case "left":
                    this.actions.left = true;
                    this.facingRight = false;
                    break;
                case "right":
                    this.actions.right = true;
                    this.facingRight = true;
                    break;
                case "up":
                    this.actions.up = true;
                    break;
                case "down":
                    this.actions.down = true;
                    break;
            }
        }
        if (this.actions["left"]) { // "left"
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = false;
            this.speedX = -this.getAccelX();
        } else if (this.actions["right"]) { //"right"
            this.active = true;
            // this.soilFriction = 1;
            this.facingRight = true;
            this.speedX = this.getAccelX();
        } 
        if (this.actions["up"]) { // "up"
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = -this.getAccelY();
        } else if (this.actions["down"]) { // "down"
            this.active = true;
            // this.soilFriction = 1;
            this.speedY = this.getAccelY();
        }
        this.check = [...this.actionsNames];
    },
    collision: function(obj) {        
        let self = this;
        if (this.type == 'b' || true) {
            //console.log(obj);
            this.curMoveTime = this.moveTime;
            this.check = this.actionsNames.filter(function(item) {
                return item !== self.curAction
            });
        }
        if(fg.Game.debug) console.log('obj: ', obj.id, 'direction: ', self.curAction);
    }
}
Object.assign(Roam, Active);
export {Roam};
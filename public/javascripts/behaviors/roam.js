import {Active} from '../engine/active.js';

let Roam = {
    waitTimeRange: {
        min: 2000,
        max: 5000
    },
    distanceRange: {
        min: 50,
        max: 150
    },
    startPosition: {
        x: 0,
        y: 0
    },
    waitTime: 0,
    curWaitTime: 0,
    speedX: 0,
    speedY: 0,
    actions: ["up", "down","left","right"],
    roam: function() {
        this.waitTime += fg.System.Timer.deltaTime;
        if ( this.waitTime < this.curWaitTime) {
            this.move()
        }
    },
}
Object.assign(Roam, Active);
export {Roam};
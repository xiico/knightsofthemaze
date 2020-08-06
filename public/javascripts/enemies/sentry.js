
let ProtoSentry = {
    attached: false,
    moving: true,
    rotation: 0,
    speedX: 0,
    speedY: 0,
    vectorList: [],
    width: fg.System.defaultSide / 2,
    height: fg.System.defaultSide / 2,
    cacheWidth: fg.System.defaultSide / 2,
    cacheHeight: fg.System.defaultSide / 2,
    searchDepth: 1,
    wait: 0,
    aim: 0,
    active: true,
    curAngle: 0,
    castAngle: 0,
    maxAim: 120,
    maxWait: 120,
    currentEntities: [],
    laserPoint: { x: 0, y: 0 },
    actorBeams: [],
    stationary: false,
    segValue: 16,//12,6;
    drawTile: function (c, ctx) {
        c.width = this.width;
        c.height = this.height;
        ctx.fillStyle = "#54A6BF";
        ctx.arc(this.width / 2, this.height / 2, this.height / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "#407B95";
        ctx.stroke();
        return c;
    },
    setVectors: function (entity) {
        var vectors = [];
        vectors[vectors.length] = { type: entity.type, id: entity.id + "-T", a: { x: entity.x, y: entity.y }, b: { x: entity.x + entity.width, y: entity.y } };
        vectors[vectors.length] = { type: entity.type, id: entity.id + "-R", a: { x: entity.x + entity.width, y: entity.y }, b: { x: entity.x + entity.width, y: entity.y + entity.height } };
        vectors[vectors.length] = { type: entity.type, id: entity.id + "-B", a: { x: entity.x, y: entity.y + entity.height }, b: { x: entity.x + entity.width, y: entity.y + entity.height } };
        vectors[vectors.length] = { type: entity.type, id: entity.id + "-L", a: { x: entity.x, y: entity.y }, b: { x: entity.x, y: entity.y + entity.height } };
        entity.vectors = vectors;
    },
    getEntitiesVectors: function (entities) {        
        for (var i = 0, entity; entity = entities[i]; i++) {
            if (entity.id == this.id) continue;
            if (!entity.vectors) this.setVectors(entity);
            if (entity.segments) this.getEntitiesVectors(entity.segments);
            for (var k = 0; k < entity.vectors.length; k++)
                this.vectorList.push(entity.vectors[k]);
        }
        for (var i = 0, entity; entity = fg.Game.foreGroundEntities[i]; i++) {
            if (entity.id == this.id || entity.type == TYPE.TUNNEL) continue;
            if (!entity.vectors) this.setVectors(entity);
            for (var k = 0; k < entity.vectors.length; k++)
                this.vectorList.push(entity.vectors[k]);
        }
    },
    checkCollisions: function () {
        var entities = fg.Game.searchArea(this.x + (this.width / 2), this.y + (this.height / 2), this.searchDepth, Math.round(this.searchDepth * (fg.System.canvas.height / fg.System.canvas.width)));
        for (var k = 0; k < 6; k++) {
            if (k == 0)
                this.rotation -= 90;
            else
                this.rotation += 90;
            if (this.rotation < 0) this.rotation = 360 + this.rotation;
            if (this.rotation == 360) this.rotation = 0;
            this.addSpeed();
            if (!this.resolveCollision(entities)) if (this.attached) return;
        }
    },
    resolveCollision: function (ents) {
        for (var i = 0, obj; obj = ents[i]; i++) {
            if (fg.Game.testOverlap({ id: this.id, x: this.x + this.speedX, y: this.y + this.speedY, width: this.width, height: this.height }, obj)) {
                if (this.speedX != 0) {
                    if (this.speedX > 0)
                        this.x = obj.x - this.width;
                    else
                        this.x = obj.x + obj.width;
                } else {
                    if (this.speedY > 0)
                        this.y = obj.y - this.height;
                    else
                        this.y = obj.y + obj.height;
                }
                this.attached = true;
                return true;
            }
        }
        return false;
    },
    addSpeed: function () {
        this.speedX = 0;
        this.speedY = 0;
        var vel = 0.03 * fg.Timer.deltaTime;
        switch (this.rotation) {
            case 0:
                this.speedX = vel;
                break;
            case 90:
                this.speedY = vel;
                break;
            case 180:
                this.speedX = -vel;
                break;
            case 270:
                this.speedY = -vel;
                break;
        }
    },
    searchArea: function (actor) {
        this.currentEntities = [];
        var startCol = Math.floor(Math.min(this.laserPoint.x / fg.System.defaultSide, (this.x + (this.width / 2)) / fg.System.defaultSide));
        var startRow = Math.floor(Math.min(this.laserPoint.y / fg.System.defaultSide, (this.y + (this.height / 2)) / fg.System.defaultSide));
        var endCol = Math.ceil(Math.max(this.laserPoint.x / fg.System.defaultSide, (this.x + (this.width / 2)) / fg.System.defaultSide));
        var endRow = Math.ceil(Math.max(this.laserPoint.y / fg.System.defaultSide, (this.y + (this.height / 2)) / fg.System.defaultSide));
        var startRowIndex = startRow < 0 ? 0 : startRow;
        var endRowIndex = endRow > fg.Game.currentLevel.entities.length ? fg.Game.currentLevel.entities.length : endRow;
        var startColIndex = startCol < 0 ? 0 : startCol;
        var endColIndex = endCol > fg.Game.currentLevel.entities[0].length ? fg.Game.currentLevel.entities[0].length : endCol;

        for (var i = (endRowIndex - 1); i >= startRowIndex; i--) {
            for (var k = startColIndex, obj; k <= endColIndex; k++) {
                var obj = fg.Game.currentLevel.entities[i][k];
                if (!obj || obj.type == TYPE.DARKNESS || obj.type == TYPE.TUNNEL || obj.vanished) continue;
                this.currentEntities.push(obj);
                if (obj.target && obj.target.segments)
                    for (var index = 0, entity; entity = obj.target.segments[index]; index++)
                        this.currentEntities.push(entity);
            }
        }
        if (!actor.vanished) this.currentEntities.push(actor);
    },
    targetDistance: function () {
        return Math.sqrt(Math.pow((this.y + (this.height / 2)) - this.laserPoint.y, 2) + Math.pow((this.x + (this.width / 2)) - this.laserPoint.x, 2));
    },
    updateVectors: function (actor) {
        if (actor && !actor.vanished && this.aim < (this.maxAim * 0.8) && this.wait == 0) {
            this.laserPoint.x = (actor.x + (actor.width / 2));
            this.laserPoint.y = (actor.y + (actor.height / 2));
        }
        //if (fg.Game.outOfScene(this) && this.targetDistance() > fg.System.canvas.width * 0.9) return;
        this.searchArea(actor);
        this.vectorList = [];
        this.getEntitiesVectors(this.currentEntities);
    },
    laserFinalMoments: function () {
        var count = 0;
        var targetDistance = this.targetDistance();
        while (this.castRay(this.shootAngle) && targetDistance < (fg.System.canvas.width)) {
            this.laserPoint.x = this.laserPoint.x + (Math.cos(this.shootAngle * Math.PI / 180) * (targetDistance + 4));
            this.laserPoint.y = this.laserPoint.y + (Math.sin(this.shootAngle * Math.PI / 180) * (targetDistance + 4));
            this.updateVectors(fg.Game.actors[0]);
            count++;
            if (count > 40)
                return;
            targetDistance = this.targetDistance();
        }
    },
    search: function () {
        this.updateVectors(fg.Game.actors[0]);
        if (this.wait == 0) {
            if (this.active) this.moving = true;
            if (this.aim < (this.maxAim * 0.8)) {
                var searchAngle = 360 / this.segValue;
                this.curAngle = Math.round(Math.atan2((fg.Game.actors[0].y + (fg.Game.actors[0].height / 2)) - (this.y + (this.height / 2)), (fg.Game.actors[0].x + fg.Game.actors[0].width / 2) - (this.x + (this.width / 2))) * 180 / Math.PI) - (searchAngle / 2);
                this.actorBeams = [];
                for (var i = (this.castAngle * searchAngle) + this.curAngle; i < ((this.castAngle * searchAngle) + searchAngle) + this.curAngle; i += (this.aim == 0 ? 2 : 1)) {
                    this.castRay(i % 360);
                }
                if (this.actorBeams.length > 0) {
                    var beam = this.actorBeams[Math.floor(this.actorBeams.length / 2)];
                    this.aiming(beam.intersect);
                    this.drawTargetCircle(beam.intersect);
                    this.moving = false;
                    this.shootAngle = beam.angle;
                }
                if (this.aim > 0) {
                    var resultAngle = this.shootAngle - (searchAngle / 2);
                    this.curAngle = (resultAngle >= 0 ? resultAngle : 360 + resultAngle);
                }
            } else this.laserFinalMoments();

            if (this.moving) this.aim = 0;
        } else {
            this.castRay(this.shootAngle);
            this.wait--;
        }
    },
    castRay: function (angle) {
        var endCastX = Math.cos(angle * Math.PI / 180) * (fg.System.canvas.width / 4);
        var endCastY = Math.sin(angle * Math.PI / 180) * (fg.System.canvas.width / 4);
        var ray = {
            a: { x: this.x + (this.width / 2), y: this.y + (this.height / 2) },
            b: { x: this.x + endCastX, y: this.y + endCastY }
        };
        //debug
        //this.drawLaser(ray.b);

        // Find CLOSEST intersection
        var closestIntersect = null;
        for (var i = 0; i < this.vectorList.length; i++) {
            var intersect = this.getIntersection(ray, this.vectorList[i]);
            if (!intersect) continue;
            if (!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect;
            }
        }
        var intersect = closestIntersect;

        if (!intersect) return true;

        if (fg.Game.debug) this.drawLaser(intersect);

        if ((intersect.type == TYPE.ACTOR || this.aim >= (this.maxAim * 0.8) || this.wait > 0) /*&& this.targetDistance() < fg.System.canvas.width * 0.9*/) {
            if (this.aim < (this.maxAim * 0.8) && this.wait == 0)
                this.actorBeams.push({ angle: angle, intersect: intersect }); //Beams that actually touch the actor
            else {
                this.aiming(intersect);
                this.drawTargetCircle(intersect);
                this.moving = false;
                this.shootAngle = angle;
                return false;
            }
        }

        return true;
    },
    aiming: function (intersect) {
        var ctx = fg.System.context;
        if (this.aim <= (this.maxAim * 0.8))
            ctx.lineWidth = 1;
        else
            ctx.lineWidth = 2;

        if ((this.maxAim == this.aim || this.wait > 60)) {
            // Draw red laser
            this.drawLaser(intersect);

            if (this.wait == 0) this.wait = this.maxWait;

            this.aim = 0;
            if (intersect.type == TYPE.ACTOR && !fg.Game.actors[0].disabled) fg.Game.actors[0].life = 0;

            if (intersect.type == TYPE.MARIO) {
                var objX = parseInt(intersect.id.split("-")[0]);
                var objY = parseInt(intersect.id.split("-")[1]);
                if (this.wait <= 61) {
                    fg.Game.currentLevel.entities[objX][objY].vanished = 20000;
                    this.vanish(intersect);
                    if (fg.Game.currentLevel.entities[objX][objY].ID == "17-86")
                        camera.fixed = false;
                }
            }
        }
    },
    drawTargetCircle: function (intersect) {
        var ctx = fg.System.context;
        ctx.strokeStyle = "#dd3838";
        ctx.beginPath();
        ctx.arc(intersect.x - fg.Game.screenOffsetX, intersect.y - fg.Game.screenOffsetY, 1, 0, 2 * Math.PI, false);
        ctx.stroke();
        if (this.maxAim != this.aim && this.wait == 0) {
            ctx.beginPath();
            ctx.arc(intersect.x - fg.Game.screenOffsetX, intersect.y - fg.Game.screenOffsetY, this.maxAim - this.aim, 0, 2 * Math.PI, false);
            ctx.stroke();
            this.aim++;
        }
    },
    drawLaser: function (intersect) {
        var ctx = fg.System.context;
        // Draw red laser
        ctx.save();
        ctx.strokeStyle = "#dd3838";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x - fg.Game.screenOffsetX + (this.width / 2), this.y - fg.Game.screenOffsetY + (this.height / 2));
        ctx.lineTo(intersect.x - fg.Game.screenOffsetX, intersect.y - fg.Game.screenOffsetY);
        ctx.stroke();
        ctx.restore();
    },
    vanish: function (intersect) {
        var entities = fg.Game.currentLevel.entities;
        var tempX = intersect ? intersect.id.split("-")[0] : this.id.split("-")[0];
        var tempY = intersect ? intersect.id.split("-")[1] : this.id.split("-")[1];

        var objX = parseInt(tempX);
        var objY = parseInt(tempY);

        if (entities[objX - 1][objY + 0] && entities[objX - 1][objY + 0].type == TYPE.MARIO) entities[objX - 1][objY + 0].tileSet = "";
        if (entities[objX - 1][objY + 1] && entities[objX - 1][objY + 1].type == TYPE.MARIO) entities[objX - 1][objY + 1].tileSet = "";
        if (entities[objX - 0][objY + 1] && entities[objX - 0][objY + 1].type == TYPE.MARIO) entities[objX - 0][objY + 1].tileSet = "";
        if (entities[objX + 1][objY + 1] && entities[objX + 1][objY + 1].type == TYPE.MARIO) entities[objX + 1][objY + 1].tileSet = "";
        if (entities[objX + 1][objY + 0] && entities[objX + 1][objY + 0].type == TYPE.MARIO) entities[objX + 1][objY + 0].tileSet = "";
        if (entities[objX + 1][objY - 1] && entities[objX + 1][objY - 1].type == TYPE.MARIO) entities[objX + 1][objY - 1].tileSet = "";
        if (entities[objX - 0][objY - 1] && entities[objX - 0][objY - 1].type == TYPE.MARIO) entities[objX - 0][objY - 1].tileSet = "";
        if (entities[objX - 1][objY - 1] && entities[objX - 1][objY - 1].type == TYPE.MARIO) entities[objX - 1][objY - 1].tileSet = "";
    },
    getIntersection: function getIntersection(ray, vector) {
        var r_px = ray.a.x;
        var r_py = ray.a.y;
        var r_dx = ray.b.x - ray.a.x;
        var r_dy = ray.b.y - ray.a.y;

        var s_px = vector.a.x;
        var s_py = vector.a.y;
        var s_dx = vector.b.x - vector.a.x;
        var s_dy = vector.b.y - vector.a.y;

        // Are they parallel? If so, no intersect
        //if (Math.atan2(r_dy, r_dx) == Math.atan2(s_dy, s_dx)) return null;
        if (r_dy == s_dy || r_dx == s_dx) return null;

        // SOLVE FOR T1 & T2
        var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

        if (isNaN(T1)) T1 = (s_py + s_dy * T2 - r_py) / r_dy;

        // Must be within parametic whatevers for RAY/SEGMENT
        if (T1 < 0) return null;
        if (T2 < 0 || T2 > 1) return null;

        // Return the POINT OF INTERSECTION
        return {
            x: r_px + r_dx * T1,
            y: r_py + r_dy * T1,
            param: T1,
            type: vector.type,
            id: vector.id
        };
    },
    update: function () {
        if (this.moving && !this.stationary) {
            this.checkCollisions();
            switch (this.rotation) {
                case 0:
                case 180:
                    this.x += this.speedX
                    break;
                case 90:
                case 270:
                    this.y += this.speedY;
                    break;
            }
        }
        this.search();
    }
}

let Sentry = function (id, type, x, y, cx, cy, index) {
    return fg.Game.currentLevel.applySettingsToEntity(
        Object.assign(Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index), fg.ProtoSentry,
            { vectorList: [], currentEntities: [], laserPoint: { x: 0, y: 0 }, actorBeams: [] }));
}

export {Sentry};
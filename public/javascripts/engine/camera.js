let Camera = {
    following: null,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    dampX: 0,
    dampY: 0,
    dampRatio: 0.96,
    position: null,
    dampRate: 0.85,
    dampThreshold: 2,//4.5,
    mapFrame: null,
    showFrame: true,
    init: function (position) {
        if(position) {
            fg.Game.screenOffsetX = position.x;
            fg.Game.screenOffsetY = position.y;
        }
        else if (this.following) {
            fg.Game.screenOffsetX = this.following.x;
            fg.Game.screenOffsetY = this.following.y;
        }
        this.mapFrame = fg.Game.currentLevel.srcs.find(e => e['m'] != null);
        this.scale =4;
        this.scaleMini = 1;
        this.mapPosition = { x: 123, y: 66 };
        this.cellPosition = { x: 123, y: 66 };
        this.searchDepth = { x: 16, y: 10 };
        this.mapPositionMini = { x: 274, y: 148 };
        this.cellPositionMini = { x: 0, y: 0 };
        this.searchDepthMini = {x: 16, y: 9};
    },
    follow: function (obj) {
        this.following = obj;
    },
    moveTo: function (position) {
        this.position = position;
     },
    update: function () {
        if (this.following) {
            this.dampX = ((this.following.x - fg.Game.screenOffsetX) - ((fg.System.canvas.width  / 2) - (this.following.width  / 2)));// - (Math.abs(this.following.speedX) >= this.following.maxSpeedX * 0.9 ? this.following.speedX * fg.Timer.deltaTime * 2 : 0);
            this.dampY = ((this.following.y - fg.Game.screenOffsetY) - ((fg.System.canvas.height / 2) - (this.following.height / 2)));

            if (Math.abs(this.dampX) > 0.1) this.dampX *= this.dampRatio;
            if (Math.abs(this.dampY) > 0.1) this.dampY *= this.dampRatio;

            var posX = Math.min(Math.max(((this.following.x) + (this.following.width / 2) - (fg.System.canvas.width / 2)) - this.dampX, 0), fg.Game.currentLevel.width - fg.System.canvas.width);
            var posY = Math.min(Math.max(((this.following.y) + (this.following.height / 2) - (fg.System.canvas.height / 2)) - this.dampY, 0), fg.Game.currentLevel.height - fg.System.canvas.height);
            fg.Game.screenOffsetX = Math.round(posX);// this.following.speedX >= 0 ? Math.floor(posX) : Math.ceil(posX);
            fg.Game.screenOffsetY = Math.round(posY);//this.following.speedY <= 0 ? Math.ceil(posY) : Math.round(posY) ;
        } else if (this.position) {
            this.dampX = ((this.position.x - fg.Game.screenOffsetX) - ((fg.System.canvas.width  / 2))); // - (Math.abs(0) >= 0 * 0.9 ? 0 * fg.Timer.deltaTime * 2 : 0);
            this.dampY = ((this.position.y - fg.Game.screenOffsetY) - ((fg.System.canvas.height / 2)));

            if (Math.abs(this.dampX) > 0.1) this.dampX *= Math.abs(this.dampX) * this.dampRate > this.dampThreshold ? this.dampRate : 0;// this.dampRatio;
            if (Math.abs(this.dampY) > 0.1) this.dampY *= Math.abs(this.dampY) * this.dampRate > this.dampThreshold ? this.dampRate : 0;// this.dampRatio;

            var posX = Math.min(Math.max(((this.position.x) - (fg.System.canvas.width / 2)) - this.dampX, 0), fg.Game.currentLevel.width - fg.System.canvas.width);
            var posY = Math.min(Math.max(((this.position.y) - (fg.System.canvas.height / 2)) - this.dampY, 0), fg.Game.currentLevel.height - fg.System.canvas.height);
            fg.Game.screenOffsetX = Math.round(posX);// this.following.speedX >= 0 ? Math.floor(posX) : Math.ceil(posX);
            fg.Game.screenOffsetY = Math.round(posY);//this.following.speedY <= 0 ? Math.ceil(posY) : Math.round(posY) ;
        }

        this.left = fg.Game.screenOffsetX;
        this.top = fg.Game.screenOffsetY;
        this.right = fg.Game.screenOffsetX + fg.System.canvas.width;
        this.bottom = fg.Game.screenOffsetY + fg.System.canvas.height;
        this.drawMap();
    },
    renderMap: function (mini = true) {
        let scale = mini ? this.scaleMini : this.scale;
        
        let mapCtx = fg.Game.currentLevel.map.getContext('2d');
        this.allVisited = true;
        let mapEntities = fg.Game.searchArea(0, 0, fg.Game.currentLevel.entities.length, fg.Game.currentLevel.entities[0].length);

        let x, y;

        for (var i = 0, entity; entity = mapEntities[i]; i++) {                
            x = parseInt(entity.id.split('-')[1]);// - Math.round(fg.Game.screenOffsetX / fg.System.defaultSide);
            y = parseInt(entity.id.split('-')[0]);// - Math.floor(fg.Game.screenOffsetY / fg.System.defaultSide);

            if ((entity.type == TYPE.WALL || entity.type == TYPE.PLATFORM || TYPE.FLOOR) && (entity.visited || this.allVisited)) {                    
                mapCtx.fillStyle = entity.type == TYPE.WALL ? "rgba(255,0,0,0.5)" : entity.bossRoom ? "rgba(90,255,90,0.5)" : "rgba(90,90,255,0.5)" ;
                mapCtx.fillRect((x * scale), (y * scale), scale, entity.type == TYPE.PLATFORM ? (scale / 2) : scale);
            }
        }
    },
    drawMap: function(mini = true) {
        let scale = mini ? this.scaleMini : this.scale;
        let mapPosition = mini ? this.mapPositionMini : this.mapPosition;

        fg.Render.draw(fg.Game.currentLevel.map, Math.round((fg.Game.actors[0].x - 320) / 16), Math.round((fg.Game.actors[0].y - 180) / 16),
            this.mapFrame.width - 2, this.mapFrame.height - 2,
            Math.round(this.mapPositionMini.x + fg.Game.screenOffsetX),
            Math.round(this.mapPositionMini.y + fg.Game.screenOffsetY));

        fg.Render.draw(fg.Game.currentLevel.mapCover, Math.round((fg.Game.actors[0].x - 320) / 16), Math.round((fg.Game.actors[0].y - 180) / 16),
            this.mapFrame.width - 2, this.mapFrame.height - 2,
            Math.round(this.mapPositionMini.x + fg.Game.screenOffsetX),
            Math.round(this.mapPositionMini.y + fg.Game.screenOffsetY));            

        // if (entity.column == fg.Game.actors[0].column && entity.row == fg.Game.actors[0].row) {
        //     mapCtx.fillStyle = "rgba(120,120,255,0.8)";
        //     ma
        ctx.fillStyle = "#fff";
        // ctx.createRadialGradient(75, 50, 5, 90, 60, 100)
        ctx.fillRect(this.mapPositionMini.x + 20, this.mapPositionMini.y + 11, scale, scale);

        if (this.showFrame) {
            if (!fg.Render.cached['m']) {
                let c = fg.Render.preRenderCanvas();
                let ctx = c.getContext("2d");
                c = fg.protoEntity.drawTile.call({ type: 'm' }, c, ctx);
                if (c)
                    fg.Render.draw(fg.Render.cache('m', c), 0, 0, this.mapFrame.width, this.mapFrame.height, (mapPosition.x * scale) + fg.Game.screenOffsetX - 1, (mapPosition.y * scale) + fg.Game.screenOffsetY - 1);
            }
            else {
                fg.Render.draw(fg.Render.cached['m'], 0, 0, this.mapFrame.width, this.mapFrame.height, (mapPosition.x * scale) + fg.Game.screenOffsetX - 1, (mapPosition.y * scale) + fg.Game.screenOffsetY - 1);
            }
        }
    },
    get column() {
        return (this.left + (canvas.width / 2)) / fg.Game.defaultSide;
    },
    get row() {
        return (this.top + (canvas.height / 2)) / fg.Game.defaultSide;
    },
    get center() {
        return {
            x: this.left + (canvas.width / 2),
            y: this.top + (canvas.height / 2)
        }
    }
}

export {Camera};
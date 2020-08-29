let protoEntity = {
    index: 0,
    cacheOffSetX: 0,
    cacheOffSetY: 0,
    animations: [],
    init: function (id, type, x, y, cx, cy, index) {
        let self = this;
        this.type = type;
        this.id = id;
        this.color = "black";        
        this.width = fg.System.defaultSide;
        this.height = fg.System.defaultSide;
        this.cacheWidth = fg.System.defaultSide;
        this.cacheHeight = fg.System.defaultSide;
        this.x = x;
        this.y = y;
        this.cacheX = cx;
        this.cacheY = cy;
        this.index = index;
        this.collidable = this.type != fg.TYPE.TUNNEL && this.type != fg.TYPE.DARKNESS && this.type != fg.TYPE.SAVE;
        this.segments = [];
        this.backGround = true;
        this.curAnimation = null;
        return this;
    },
    draw: function (foreGround) {
        if (this.animationName) this.updateAnimationCache();
        if (!fg.Render.cached[this.type]) {
            var c = fg.Render.preRenderCanvas();
            var ctx = c.getContext("2d");
            c = this.drawTile(c, ctx);
            if (c)
                fg.Render.draw(fg.Render.cache(this.type, c), this.cacheX, this.cacheY, this.cacheWidth, this.cacheHeight, this.x, this.y);
        }
        else {
            if (!foreGround && !this.backGround || foreGround && !this.foreGround || this.vanished) return;
            fg.Render.draw(fg.Render.cached[this.type], this.cacheX, this.cacheY, this.cacheWidth, this.cacheHeight, this.x + this.cacheOffSetX, this.y + this.cacheOffSetY);
        }
        if (fg.Game.showIds) {
            fg.System.context.font = "7px Arial";
            fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.id.split('-')[0], this.x - fg.Game.screenOffsetX + 7, this.y + 11 - fg.Game.screenOffsetY);
            fg.System.context.fillText(this.id.split('-')[1], this.x - fg.Game.screenOffsetX + 7, this.y + 18 - fg.Game.screenOffsetY);
        }
        if(this.active !== undefined && fg.Game.showHitBox) {
            fg.System.context.fillStyle = 'rgba(125,235,214,0.5)';
            fg.System.context.fillRect(Math.floor(this.x - fg.Game.screenOffsetX), Math.floor(this.y - fg.Game.screenOffsetY), this.width, this.height);
        }
    },
    drawTile: function (c, ctx, callBack) {
        ctx.fillStyle = 'rgba(0,0,0,.75)';
        let src = fg.Game.currentLevel.srcs.find(e => e[this.type] != null);
        if (src) {
            var img = fg.$new("img");
            img.addEventListener('load', function() {
                // execute drawImage statements here
                c.width = src.width;
                c.height = src.height;
                ctx.drawImage(img, 0, 0);
                if (callBack) callBack(ctx);
              }, false);
              img.src = "/assets/" + src[this.type];
        } else ctx.fillRect(0, 0, this.height, this.width);
        return c;
    },
    playAnimation: function (name) {
        if (!this.curAnimation || this.curAnimation.name != name) {
            var animation = fg.Game.currentLevel.animations.find(a => !a.entity.indexOf(this.type) && a.name == name);
            if (animation && (this.curAnimation == null || animation.name != this.curAnimation.name)) {
                
                this.cacheOffSetX = animation.cacheOffSetX || this.cacheOffSetX;
                this.cacheOffSetY = animation.cacheOffSetY || this.cacheOffSetY;
                this.width = animation.width || this.width;
                this.height = animation.height || this.height;
                
                this.curAnimation = new fg.Animation(animation);
                this.animationName = name;
            }
        }
    },
    updateAnimationCache: function() {
        var frame;
        if (this.curAnimation) frame = this.curAnimation.update(this.facingRight);
        if (frame) {
            this.cacheX = frame.x;
            // this.cacheY = frame.y + fr;
            this.cacheY = frame.y;
            //this.cacheWidth = frame.width;
            //this.cacheHeight = frame.height;
        }
    },
    update: function () { },
    get position() {
        return {
            x: this.x,
            y: this.y
        }
    },
    set position(p) {
        this.x = p.x || this.x;
        this.y = p.y || this.y;
    },
    get row() {
        return Math.round(this.x / fg.System.defaultSide);
    },
    get column() {
        return Math.round(this.y / fg.System.defaultSide);
    }
};
export {protoEntity};
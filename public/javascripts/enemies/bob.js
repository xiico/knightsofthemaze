import {Roam} from '../behaviors/roam.js'


let Bob = function (id,x, y, type = 'b') {
    var bob = Object.create(fg.protoEntity);
    bob = Object.assign(bob, fg.Active, Roam);
    bob.init(id, type, x, y, 0, 0, 0);
    // bob.width = type == 'b' ? 10 : fg.System.defaultSide;// * .625; //* .625; // fg.System.defaultSide / 3;
    // bob.height = type == 'b' ? 12 : fg.System.defaultSide;// * .5; //* .9375; //fg.System.defaultSide - 4;
    // bob.cacheWidth = fg.System.defaultSide;
    // bob.cacheHeight = fg.System.defaultSide;
    // bob.cacheOffSetX = type == 'b' ? -3 : 0;
    // bob.cacheOffSetY = type == 'b' ? -4 : 0;
    // bob.facingRight = true;
    bob.cache = {};
    bob.curCache = '';
    bob.blinkTime = 5;
    bob.curBlinkTime = 0;
    bob.drawTile = function (c, ctx) {
        fg.protoEntity.drawTile.call(this, c,ctx, function(ctx) {
            let frames = ctx.canvas.width / bob.cacheWidth;
            let cacheWidth = bob.cacheWidth;
            let cacheHeight = bob.cacheHeight;
            let offCanvas = fg.Render.offScreenRender();
            let ocCtx = offCanvas.getContext('2d');
            offCanvas.width = cacheWidth;
            offCanvas.height = cacheHeight;

            let offCanvas2 = fg.Render.preRenderCanvas();
            offCanvas2.width = cacheWidth;
            offCanvas2.height = cacheHeight;
            let ocCtx2 = offCanvas2.getContext('2d');
            for (let index = 0; index < frames; index++) {
                let imgData = ctx.getImageData(index * cacheWidth, 0, cacheHeight, cacheHeight);                
                
                ocCtx2.clearRect(0, 0, offCanvas.width, offCanvas.height);
                ocCtx2.putImageData(imgData, 0, 0);

                ocCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
                ocCtx.save();
                ocCtx.scale(-1, 1);
                ocCtx.drawImage(offCanvas2, -offCanvas.width, 0);
                ocCtx.restore();
                ctx.drawImage(offCanvas,index * cacheWidth, cacheHeight);               
            }
        });
        return c;
    };
    bob.update = function () {
        this.roam();
        if(this.actions.left || this.actions.right || this.actions.up || this.actions.down || this.actions.chasing )  this.playAnimation("Moving");
        else this.playAnimation("Idle")
        fg.Active.update.call(this);
        fg.protoEntity.update.call(this);
    };
    bob.draw = function () {
        if (this.blink /*&& this.type == 'b'*/) {
            if (!this.cache['default']) this.cache['default'] = fg.Render.cloneCanvas(fg.Render.cached[this.type]);
            if (!this.cache[this.blink]) {
                this.cache[this.blink] = fg.Render.cloneCanvas(this.cache['default']);
                let ctx = this.cache[this.blink].getContext('2d');
                ctx.fillStyle = this.blink;
                ctx.globalCompositeOperation = "source-in";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                fg.Render.cached[this.type] = this.cache[this.blink];
                fg.protoEntity.draw.call(this);
                this.curCache = this.blink;
            } else {
                if (this.blink != this.curCache) fg.Render.cached[this.type] = this.cache[this.blink];
                fg.protoEntity.draw.call(this);
            }
            if (this.curBlinkTime < this.blinkTime) {
                this.curBlinkTime++;
            } else if (this.curBlinkTime > 0) {
                this.curBlinkTime = 0;
                this.curCache = this.blink = null;
            }
        } else {            
            if (!this.blink != this.curCache && this.curCache != 'default') {
                this.curCache = 'default';
                fg.Render.cached[this.type] = this.cache['default'];
            }
            fg.protoEntity.draw.call(this);
        }
    }
    return bob;
}

export {Bob};
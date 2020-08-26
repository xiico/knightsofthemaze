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
    bob.drawTile = function (c, ctx) {
        fg.protoEntity.drawTile.call(this, c,ctx);
        return c;
    };
    bob.update = function () {
        this.playAnimation("Idle");
        this.roam();
        fg.Active.update.call(this);
        fg.protoEntity.update.call(this);
    };
    return bob;
}

export {Bob};
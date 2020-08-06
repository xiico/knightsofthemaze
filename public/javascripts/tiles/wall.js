let Wall = function (id, type, x, y, cx, cy, index) {
    var wall = Object.create(fg.protoEntity);
    wall.init(id, type, x, y, cx, cy, index);
    wall.tiles = [{x:0 ,y:32},{x:16,y:32},{x:32,y:32},
                  {x:0 ,y:48},{x:16,y:48},{x:32,y:48},
                  {x:0 ,y:64},{x:16,y:64},{x:32,y:64},
                  {x:0 ,y:80},{x:16,y:80},{x:32,y:80}]
    wall.cacheX = -1;
    wall.draw = function (foreGround) {
        if(this.cacheX == -1)
        {
            var line = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0])];
            var topLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) - 1];
            var bottomLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) + 1];
            var bottomBottomLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) + 2];
            var right, left, top, topLeft, topRight, bottom, bottomLeft, bottomRight, bottomBottom, bottomBottomRight, bottomBottomLeft;
            if (line) right = line[parseInt(this.id.split('-')[1]) + 1];
            if (line) left = line[parseInt(this.id.split('-')[1]) - 1];
            if (topLine) top = topLine[parseInt(this.id.split('-')[1])];
            if (topLine) topLeft = topLine[parseInt(this.id.split('-')[1]) - 1];
            if (topLine) topRight = topLine[parseInt(this.id.split('-')[1]) + 1];
            if (bottomLine) bottom = bottomLine[parseInt(this.id.split('-')[1])];
            if (bottomLine) bottomLeft = bottomLine[parseInt(this.id.split('-')[1]) - 1];
            if (bottomLine) bottomRight = bottomLine[parseInt(this.id.split('-')[1]) + 1];
            if (bottomBottomLine) bottomBottom = bottomBottomLine[parseInt(this.id.split('-')[1])];
            if (bottomBottomLine) bottomBottomLeft = bottomBottomLine[parseInt(this.id.split('-')[1]) - 1];
            if (bottomBottomLine) bottomBottomRight = bottomBottomLine[parseInt(this.id.split('-')[1]) + 1];
            if (!bottomBottom && bottomLine) {
                if (!right) {
                    this.cacheX = 32;
                    this.cacheY = 16;            
                } else if (!left) {
                    this.cacheX = 0;
                    this.cacheY = 16;    
                } else {
                    this.cacheX = 16;
                    this.cacheY = 16;  
                }
            } else if(((!left && bottomLine) || ((left && left.type == "F" && bottomLeft && bottomLeft.type == fg.TYPE.FLOOR) && bottom && bottom.type == "X" && bottomBottom && bottomBottom.type == "X" ) )) {
                this.cacheX = 0;
                this.cacheY = 0;
            } else if(((!right && bottomLine) || ((right && right.type == "F" && bottomRight && bottomRight.type == fg.TYPE.FLOOR) && bottom && bottom.type == "X" && bottomBottom && bottomBottom.type == "X" ))) {
                this.cacheX = 32;
                this.cacheY = 0;
            } else if (left && left.type == "F" && bottom && bottom.type == "X" && bottomBottom && bottomBottom.type == "F") {
                this.cacheX = 0;
                this.cacheY = 16;
            } else if (right && right.type == "F" && bottom && bottom.type == "X" && bottomBottom && bottomBottom.type == "F") {
                this.cacheX = 32;
                this.cacheY = 16;
            } else if (bottom && bottom.type == "X" && bottomBottom && bottomBottom.type == "F") {
                this.cacheX = 16;
                this.cacheY = 16;
            } else if (bottom && bottom.type == "X" && bottomLeft && bottomLeft.type == "F") {
                this.cacheX = 0;
                this.cacheY = 0;
            } else if (bottom && bottom.type == "X" && bottomRight && bottomRight.type == "F") {
                this.cacheX = 32;
                this.cacheY = 0;
            } else if (left && left.type == fg.TYPE.FLOOR && top && top.type == fg.TYPE.WALL && bottom && bottom.type == fg.TYPE.WALL) {
                this.cacheX = 64;
                this.cacheY = 16;
            } else if (topRight && topRight.type == fg.TYPE.FLOOR && top && top.type == fg.TYPE.WALL && bottom && bottom.type == fg.TYPE.WALL && bottomBottomRight && bottomBottomRight.type == fg.TYPE.WALL) {
                this.cacheX = 48;
                this.cacheY = 16;
            } else if (bottom && bottom.type == fg.TYPE.WALL && left && left.type == fg.TYPE.WALL && right && right.type == fg.TYPE.WALL && bottomBottomRight && bottomBottomRight.type == fg.TYPE.FLOOR) {
                this.cacheX = 48;
                this.cacheY = 0;
            } else if (bottom && bottom.type == fg.TYPE.WALL && left && left.type == fg.TYPE.WALL && right && right.type == fg.TYPE.WALL && bottomBottomLeft && bottomBottomLeft.type == fg.TYPE.FLOOR) {
                this.cacheX = 64;
                this.cacheY = 0;
            } else {
                var fountain = rand(0,60);
                if(fountain == 20 || fountain == 40) {
                    this.animationName = fountain == 20 ? 'LFA' : 'LFB';
                    let floor = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) + 1]?.[this.id.split('-')[1]];
                    if (floor) floor.animationName = this.animationName === 'LFA' ? 'WLFA' : 'WLFB'
                } else {
                    var index = rand(0,11);
                    this.cacheX = this.tiles[index].x;
                    this.cacheY = this.tiles[index].y;
                }
            }
            this.cacheWidth = 16;
            this.cacheHeight = 16;
        }
        fg.protoEntity.draw.call(this);        
    };
    
    wall.update = function () {
        if (this.animationName) this.playAnimation(this.animationName);
        fg.protoEntity.update.call(this);
    }
    wall.visited = false;
    return wall;
}
export {Wall};
let Floor = function (id, type, x, y, cx, cy, index) {
    var floor = Object.create(fg.protoEntity);
    floor.init(id, type, x, y, cx, cy, index);
    floor.tiles = [{x:0,y:0 },{x:16,y:0 },{x:32,y:0 },
                {x:0,y:16},{x:16,y:16},{x:32,y:16},
                {x:0,y:32},{x:16,y:32}]
    floor.collidable = false;
    floor.cacheX = -1;
    floor.cacheY = -1;
    floor.visited = false;
    floor.draw = function (foreGround) {
        if(this.cacheX == -1)
        {
            var line = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0])];
            var topLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) - 1];
            var bottomLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) + 1];
            var bottomBottomLine = fg.Game.currentLevel.entities[parseInt(this.id.split('-')[0]) + 2];
            var right, left, top, bottom, bottomLeft, bottomRight;
            if (line) right = line[parseInt(this.id.split('-')[1]) + 1];
            if (line) left = line[parseInt(this.id.split('-')[1]) - 1];
            if (topLine) top = topLine[parseInt(this.id.split('-')[1])];
            if (bottomLine) bottom = bottomLine[parseInt(this.id.split('-')[1])];
            if (bottomLine) bottomLeft = bottomLine[parseInt(this.id.split('-')[1]) - 1];
            if (bottomLine) bottomRight = bottomLine[parseInt(this.id.split('-')[1]) + 1];

            if(bottom && bottom.type == fg.TYPE.WALL) {
                this.foreGround = true;
                if(bottomLeft && bottomLeft.type == fg.TYPE.FLOOR){
                    this.cacheX = 0;
                    this.cacheY = 64;
                } else if (bottomRight && bottomRight.type == fg.TYPE.FLOOR){
                    this.cacheX = 32;
                    this.cacheY = 64;
                } else {
                    this.cacheX = 16;
                    this.cacheY = 64;
                }
            } else {
                let tileIndex = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7];
                var index = tileIndex[rand(0,tileIndex.length)];
                this.cacheX = floor.tiles[index].x;
                this.cacheY = floor.tiles[index].y;
                this.cacheWidth = 16;
                this.cacheHeight = 16;

                var row = parseInt(this.id.split('-')[0]);
                var col = parseInt(this.id.split('-')[1]);
                let size = fg.Game.currentLevel.size;
                if(row >= parseInt(size) - parseInt(roomSize) && row < parseInt(size) + parseInt(roomSize) &&
                   col >= parseInt(size) - parseInt(roomSize) && col < parseInt(size) + parseInt(roomSize) ){
                    this.cacheX = 80;
                    this.cacheY = 32;
                    this.bossRoom = true;
                }
            }
        }
        fg.protoEntity.draw.call(this);
        
    }
    
    floor.update = function () {
        if (this.animationName) this.playAnimation(this.animationName);
        fg.protoEntity.update.call(this);
    }
    fg.Game.currentLevel.applySettingsToEntity(floor);
    return floor;
}
export {Floor};
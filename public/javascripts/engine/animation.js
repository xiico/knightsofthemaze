export default function (animation){//name, frames=[], total = 4, interval = 100) {
    var self = this;
    self.getFrame = function(facingRight = true) { 
        self.curFrame = Math.floor(self.totalFrameTime += self.interval);
        if(self.totalFrameTime > self.total) self.reset();
        var frame = self.frames[self.curFrame]
        if(animation.faceOffSet) frame.y = facingRight ? 0 : animation.faceOffSet;
        return frame; 
    },
    self.name = animation.name, 
    self.frames = animation.frames,
    self.total = animation.frames.length,
    self.interval = 16.6666 / animation.interval;
    self.totalFrameTime = 0;
    self.curFrame = 0;
    self.reset = function() {
        self.curFrame = 0;
        self.totalFrameTime = 0;
    };
    self.update = function (facingRight = true) {
        var frame = this.getFrame(facingRight);
        return frame;
     }
}
let WarpDeck = function (id, type, x, y, cx, cy, index) {
    return fg.Game.currentLevel.applySettingsToEntity(
        Object.assign(Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index), fg.Interactive, {
            collidable: false,
            interact: function (obj) {
                fg.Game.warp(obj, { y: this.destinationY, x: this.destinationX });
            }
        }))
}
export {WarpDeck};
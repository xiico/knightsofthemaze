let Font = function(path, charWidth, charHeight, colour, spacing = 0) {
    return Object.create({
        fontImagePath: path,
        mapHeight: 40,
        mapWidth: 20,
        startChar: 32,
        charCodes: [],
        init: function () {
            var fntImage = new Image();
            var fnt = this;
            fntImage.src = this.fontImagePath;
            // this.bgImage = fntImage;
            fntImage.onload = function (e) {
                //draw background image
                //ctx.drawImage(gem, 0, 0);
                var i = e;
                fnt.charWidth = charWidth;
                fnt.charHeight = charHeight;
                fnt.mapWidth = e.target.width;
                fnt.mapHeight = e.target.height;
                fnt.bgImage = fnt.imageToCanvas(this);
            };
            return this;
        },
        _getCharCodes: function (text) {
            this.charCodes = [];
            for (var i = 0, char; char = text[i]; i++) {
                this.charCodes.push(char.charCodeAt(0) - this.startChar);
            }
        },
        imageToCanvas: function (image){
            const c = document.createElement("canvas");
            c.width = image.width;
            c.height = image.height;
            c.ctx = c.getContext("2d"); // attach context to the canvas for eaasy reference
            c.ctx.drawImage(image,0,0);
            return c;
        },
        draw: function (text, x, y, hAlign, vAlign) {
            this._getCharCodes(String(text));
            var valgn = 0;
            var halgn = hAlign == 'left'? 1 : 0;;
            if (hAlign) {
                if (hAlign == 'center') halgn = -(this.charWidth * text.length / 2);
                if (hAlign == 'right') halgn = -(this.charWidth * text.length);
            }
            if (vAlign) {
                if (vAlign == 'middle') valgn = -(this.charHeight / 2);
                if (vAlign == 'bottom') valgn = -(this.charHeight);
            }
            for (var i = 0; i < this.charCodes.length; i++) {
                var code = this.charCodes[i];
                //fg.Render.draw(this.bgImage, code * this.fontWidth, 0, this.fontWidth, this.fontHeight, x + (i * (this.fontWidth)) + halgn, y + valgn);
                fg.System.context.drawImage(this.bgImage, (code * this.charWidth) % this.mapWidth , Math.floor((code * charWidth)/this.mapWidth) * this.charHeight, this.charWidth, this.charHeight, x + (i * (this.charWidth)) + i * spacing/*halgn*/, y + valgn, this.charWidth, this.charHeight);
            }
        }
    }).init();
}

export {Font};
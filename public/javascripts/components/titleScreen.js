let TitleScreen = {
    showTitle: function () {
        let ctx = fg.System.context;
        ctx.fillStyle = '#4a54c3';
        ctx.fillRect(0, 0, fg.System.canvas.width, fg.System.canvas.height);
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.lineWidth = 2;
        // var tittleXOffSet = 10;
        // var tittleYOffSet = 60;
        // ctx.strokeStyle = 'white';

        // //F
        // ctx.moveTo(20 + tittleXOffSet, 20 + tittleYOffSet);
        // ctx.lineTo(53 + tittleXOffSet, 17 + tittleYOffSet);
        // ctx.lineTo(54 + tittleXOffSet, 29 + tittleYOffSet);
        // ctx.lineTo(32 + tittleXOffSet, 27 + tittleYOffSet);
        // ctx.lineTo(34 + tittleXOffSet, 42 + tittleYOffSet);
        // ctx.lineTo(48 + tittleXOffSet, 40 + tittleYOffSet);
        // ctx.lineTo(50 + tittleXOffSet, 54 + tittleYOffSet);
        // ctx.lineTo(31 + tittleXOffSet, 52 + tittleYOffSet);
        // ctx.lineTo(33 + tittleXOffSet, 69 + tittleYOffSet);
        // ctx.lineTo(19 + tittleXOffSet, 67 + tittleYOffSet);
        // ctx.lineTo(20 + tittleXOffSet, 20 + tittleYOffSet);

        // //a
        // ctx.moveTo(20 + 60, 20 + 70);
        // ctx.lineTo(52 + 60, 18 + 70);
        // ctx.lineTo(48 + 60, 57 + 70);
        // ctx.lineTo(22 + 60, 60 + 70);
        // ctx.lineTo(18 + 60, 43 + 70);
        // ctx.lineTo(42 + 60, 39 + 70);
        // ctx.lineTo(37 + 60, 29 + 70);
        // ctx.lineTo(19 + 60, 32 + 70);
        // ctx.lineTo(20 + 60, 20 + 70);

        // //l
        // ctx.moveTo(20 + 110, 20 + 70);
        // ctx.lineTo(32 + 110, 18 + 70);
        // ctx.lineTo(31 + 110, 57 + 70);
        // ctx.lineTo(18 + 110, 62 + 70);
        // ctx.lineTo(20 + 110, 20 + 70);

        // //l                     
        // ctx.moveTo(20 + 140, 20 + 70);
        // ctx.lineTo(32 + 140, 18 + 70);
        // ctx.lineTo(31 + 140, 57 + 70);
        // ctx.lineTo(18 + 140, 62 + 70);
        // ctx.lineTo(20 + 140, 20 + 70);

        // //i                     
        // ctx.moveTo(20 + 165, 20 + 90);
        // ctx.lineTo(32 + 165, 18 + 90);
        // ctx.lineTo(31 + 165, 42 + 90);
        // ctx.lineTo(18 + 165, 44 + 90);
        // ctx.lineTo(20 + 165, 20 + 90);

        // //n
        // ctx.moveTo(20 + 190, 20 + 82);
        // ctx.lineTo(49 + 190, 52 + 82);
        // ctx.lineTo(41 + 190, 49 + 82);
        // ctx.lineTo(28 + 190, 42 + 82);
        // ctx.lineTo(31 + 190, 51 + 82);
        // ctx.lineTo(19 + 190, 49 + 82);
        // ctx.lineTo(20 + 190, 20 + 82);

        // //g
        // ctx.moveTo(20 + 230, 20 + 90);
        // ctx.lineTo(51 + 230, 19 + 90);
        // ctx.lineTo(48 + 230, 59 + 90);
        // ctx.lineTo(18 + 230, 61 + 90);
        // ctx.lineTo(21 + 230, 52 + 90);
        // ctx.lineTo(39 + 230, 50 + 90);
        // ctx.lineTo(41 + 230, 41 + 90);
        // ctx.lineTo(19 + 230, 38 + 90);
        // ctx.lineTo(20 + 230, 20 + 90);

        // ctx.stroke();
        ctx.save();
        ctx.scale(2,2);
        fg.UI.fonts.tiny.draw('Knights of the Maze',24 ,30 ,'left');
        ctx.restore();
        fg.Game.drawFont("Press any key...", "", 120, 150);
        /*if (tracks[0].paused) {
            tracks[0].play();
        }*/
    }
}

export { TitleScreen };
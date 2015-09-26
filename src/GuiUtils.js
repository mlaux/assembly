/**
 * Created by mlaux on 9/26/15.
 */
var StaticGuiUtils = function() {
    this.initializeContextForGui = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
    };
};
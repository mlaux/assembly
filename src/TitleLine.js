/**
 * Created by Trent on 9/26/2015.
 */

var TitleLine = function(transitionLine, x, y) {
    this.pos = [_.isNumber(x) ? x : 1.0, _.isNumber(y) ? y : Math.random()];
    this.width = transitionLine ? 10 : Math.random() * 0.4 + 0.2;
    this.speed = transitionLine ? Math.random() * 0.01 + 0.01 : Math.random() * 0.006 + 0.001;

    this.update = function(delta) {
        this.pos[0] -= this.speed * delta;
    };

    this.render = function() {
        // ctx.fillStyle = '#660000';
        ctx.fillStyle = '#' + Constants.COLOR_DARK_GRAY;
        ctx.fillRect(this.pos[0] * canvas.width, TitleScreen.getTitleYPos() + this.pos[1] * TitleScreen.getTitleHeight(), this._getWidth(), this._getHeight());
    };

    this.isDead = function() {
        return this.pos[0] <= -this.width;
    };

    this._getWidth = function() {
        return canvas.width * this.width;
    };

    this._getHeight = function() {
        return TitleScreen.getTitleLineHeight();
    };
};
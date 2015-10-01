/**
 * Created by Trent on 9/26/2015.
 */

var TitleLine = function(transitionLine, x, y) {
    this.speed = null;
    this.pos = [0, 0];
    this.width = 0;

    this.update = function(delta) {
        this.pos[0] -= this.speed * delta;
    };

    this.render = function() {
        ctx.fillStyle = '#660000';
        ctx.fillStyle = '#' + Constants.COLOR_DARK_GRAY;
        ctx.fillRect(this.pos[0] * canvas.width, this.pos[1] * canvas.height, this._getWidth(), this._getHeight());
    };

    this.isDead = function() {
        return this.pos[0] <= -this.width;
    };

    this._getWidth = function() {
        return canvas.width * this.width;
    };

    this._getHeight = function() {
        return TransitionManager.getLineHeight();
    };

    this._calculateTransitionWidth = function() {
        return this.speed / TransitionManager.LINE_BASE_TRANSITION_SPEED;
    };

    this.init = function() {
        this.speed = transitionLine ? Math.random() * TransitionManager.LINE_BASE_TRANSITION_SPEED + TransitionManager.LINE_BASE_TRANSITION_SPEED : Math.random() * 0.006 + 0.001;
        this.width = transitionLine ? this._calculateTransitionWidth() : Math.random() * 0.4 + 0.2;
        this.pos = [_.isNumber(x) ? x * (1 + this.width) - this.width : 1.0, _.isNumber(y) ? y : TitleScreen.getTitleYPos() / canvas.height + TitleScreen.getTitleFontHeight() / canvas.height * Math.random()];
    };
    this.init();
};
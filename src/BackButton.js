/**
 * Created by mlaux on 9/30/15.
 */
var BackButton = function() {
    this._BACK_TEXT = "back";

    this._PADDING_HORIZONTAL = 20;
    this._PADDING_VERTICAL = 10;

    this._x = 20;
    this._y = 20;

    this._width = 0;
    this._height = 0;

    this.render = function() {
        if (!this._isActive()) {
            return;
        }

        if (this._width == 0) {
            // first time rendering, measure
            var textSize = ctx.measureText(this._BACK_TEXT);
            this._width = textSize.width + this._PADDING_HORIZONTAL;
            this._height = textSize.height + this._PADDING_VERTICAL;
        }

        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.font = this._getFontSize() + 'px Begok';

        ctx.fillRect(this._x, this._y, this._width, this._height);

        ctx.fillText(this._BACK_TEXT, this._x + this._PADDING_HORIZONTAL / 2, this._y + this._PADDING_VERTICAL / 2);
    };

    this.click = function(x, y) {
        if (!this._isActive()) {
            return false;
        }

        if (x >= this._x && y >= this._y && x < this._x + this._width && y < this._y + this._height) {
            StateManager.setState(StateManager.STATE_TITLE_SCREEN);
            return true;
        }

        return false;
    };

    this._isActive = function() {
        var state = StateManager.getState();
        return state == Game || state == ScoresScreen;
    };

    this._getFontSize = function() {
        return canvas.height / 24;
    };
};
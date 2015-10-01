/**
 * Created by Trent on 9/26/2015.
 */

var StaticTitleScreen = function() {
    this.MAX_LINE_COUNT = 20;
    this.LINE_CREATE_TIME = 400;
    this.LINE_BASE_TRANSITION_SPEED = 0.01;

    this.lineList = [];
    this.transitionLineList = [];

    this.update = function(delta) {
        for (var i = 0; i < this.lineList.length; i++) {
            this.lineList[i].update(delta);

            if (this.lineList[i].isDead()) {
                this.lineList.splice(i, 1);
                i--;
            }
        }

        while (this.lineList.length < this.MAX_LINE_COUNT) {
            this.lineList.push(new TitleLine(false, 1.0 - Math.random() * Math.min(1.0, delta / 200)));
        }
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].update(delta);
        }
    };

    this.render = function() {
        GuiUtils.initializeContextForGui();

        ctx.font = this._getTitleFontSize() + 'px Begok';
        ctx.fillText('centrifuge', canvas.width / 2, this.getTitleYPos());

        ctx.font = this._getMenuFontSize() + 'px Begok';
        ctx.fillStyle = '#' + (this._mouseOverPlay(GameInput.mousePos[0], GameInput.mousePos[1]) ? Constants.COLOR_LIGHT_GRAY : Constants.COLOR_WHITE);
        ctx.fillText('play', canvas.width / 2, this.getPlayYPos());
        ctx.fillStyle = '#' + (this._mouseOverScores(GameInput.mousePos[0], GameInput.mousePos[1]) ? Constants.COLOR_LIGHT_GRAY : Constants.COLOR_WHITE);
        ctx.fillText('scores', canvas.width / 2, this.getScoreYPos());

        for (var i = 0; i < this.lineList.length; i++) {
            this.lineList[i].render();
        }
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].render();
        }
    };

    this.click = function(x, y) {
        if (this._mouseOverPlay(x, y)) {
            this.startTransition(function() {
                Game.init();
                StateManager.setState(StateManager.STATE_GAME);
            });
        }
        if (this._mouseOverScores(x, y)) {
            ScoresScreen.init();
            this.startTransition(function() {
                StateManager.setState(StateManager.STATE_SCORES);
            });
        }
    };

    this._mouseOverPlay = function(x, y) {
        if (x >= canvas.width / 2 - this.getPlayWidth() / 2 && x < canvas.width / 2 + this.getPlayWidth() / 2) {
            if (y >= this.getPlayYPos() && y < this.getPlayYPos() + this.getMenuFontHeight()) {
                return true;
            }
        }
        return false;
    };

    this._mouseOverScores = function(x, y) {
        if (x >= canvas.width / 2 - this.getScoreWidth() / 2 && x < canvas.width / 2 + this.getScoreWidth() / 2) {
            if (y >= this.getScoreYPos() && y < this.getScoreYPos() + this.getMenuFontHeight()) {
                return true;
            }
        }
        return false;
    };

    this.init = function() {
        while (this.lineList.length < this.MAX_LINE_COUNT) {
            this.lineList.push(new TitleLine(false, Math.random()));
        }
    };

    this.startTransition = function(callback) {
        for (var y = 0; y < canvas.height; y += this.getLineHeight() - 1) {
            this.transitionLineList.push(new TitleLine(true, 1.0, y / canvas.height));
        }
        setTimeout(callback, this.getTransitionTime());
    };

    this.getTransitionTime = function() {
        return 1.0 / (Constants.DELTA_SCALE * this.LINE_BASE_TRANSITION_SPEED);
    };

    // title methods
    this._getTitleFontSize = function() {
        return canvas.width / 9;
    };

    this.getTitleYPos = function() {
        return canvas.height * 0.1;
    };

    this.getTitleFontHeight = function() {
        return canvas.width * 0.125;
    };

    // menu methods
    this._getMenuFontSize = function() {
        return canvas.width / 15 * (canvas.width > canvas.height ? 1 : 1.4);
    };

    this.getPlayYPos = function() {
        return canvas.height * (canvas.width > canvas.height ? 0.4 : 0.5);
    };

    this.getPlayWidth = function() {
        return canvas.width / 3.75 * (canvas.width > canvas.height ? 1 : 1.4);
    };

    this.getScoreYPos = function() {
        return this.getPlayYPos() + this.getMenuFontHeight() * 1.1;
    };

    this.getScoreWidth = function() {
        return canvas.width / 2.5 * (canvas.width > canvas.height ? 1 : 1.4);
    };

    this.getMenuFontHeight = function() {
        return canvas.width * 0.075 * (canvas.width > canvas.height ? 1 : 1.4);
    };

    // other methods
    this.getLineHeight = function() {
        return canvas.width * 0.005;
    };
};

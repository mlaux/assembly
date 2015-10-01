/**
 * Created by Trent on 9/26/2015.
 */

var StaticTitleScreen = function() {
    this.MAX_LINE_COUNT = 20;

    this.lineList = [];

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
    };

    this.render = function() {
        GuiUtils.initializeContextForGui();

        ctx.font = this._getTitleFontSize() + 'px Begok';
        ctx.fillText('centrifuge', window.innerWidth / 2, this.getTitleYPos());

        ctx.font = this._getMenuFontSize() + 'px Begok';
        ctx.fillStyle = '#' + (this._mouseOverPlay(GameInput.mousePos[0], GameInput.mousePos[1]) ? Constants.COLOR_LIGHT_GRAY : Constants.COLOR_WHITE);
        ctx.fillText('play', window.innerWidth / 2, this.getPlayYPos());
        ctx.fillStyle = '#' + (this._mouseOverScores(GameInput.mousePos[0], GameInput.mousePos[1]) ? Constants.COLOR_LIGHT_GRAY : Constants.COLOR_WHITE);
        ctx.fillText('scores', window.innerWidth / 2, this.getScoreYPos());

        for (var i = 0; i < this.lineList.length; i++) {
            this.lineList[i].render();
        }
    };

    this.click = function(x, y) {
        if (TransitionManager.isTransitioning()) {
            return;
        }

        if (this._mouseOverPlay(x, y)) {
            TransitionManager.startTransition(function() {
                Game.init();
                StateManager.setState(StateManager.STATE_GAME);
            });
        }
        if (this._mouseOverScores(x, y)) {
            ScoresScreen.init();
            TransitionManager.startTransition(function() {
                StateManager.setState(StateManager.STATE_SCORES);
            });
        }
    };

    this._mouseOverPlay = function(x, y) {
        if (TransitionManager.isTransitioning()) {
            return false;
        }

        if (x >= window.innerWidth / 2 - this.getPlayWidth() / 2 && x < window.innerWidth / 2 + this.getPlayWidth() / 2) {
            if (y >= this.getPlayYPos() && y < this.getPlayYPos() + this.getMenuFontHeight()) {
                return true;
            }
        }
        return false;
    };

    this._mouseOverScores = function(x, y) {
        if (TransitionManager.isTransitioning()) {
            return false;
        }

        if (x >= window.innerWidth / 2 - this.getScoreWidth() / 2 && x < window.innerWidth / 2 + this.getScoreWidth() / 2) {
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

    // title methods
    this._getTitleFontSize = function() {
        return window.innerWidth / 9;
    };

    this.getTitleYPos = function() {
        return window.innerHeight * 0.1;
    };

    this.getTitleFontHeight = function() {
        return window.innerWidth * 0.12;
    };

    // menu methods
    this._getMenuFontSize = function() {
        return window.innerWidth / 15 * (window.innerWidth > window.innerHeight ? 1 : 1.4);
    };

    this.getPlayYPos = function() {
        return window.innerHeight * (window.innerWidth > window.innerHeight ? 0.4 : 0.5);
    };

    this.getPlayWidth = function() {
        return window.innerWidth / 3.75 * (window.innerWidth > window.innerHeight ? 1 : 1.4);
    };

    this.getScoreYPos = function() {
        return this.getPlayYPos() + this.getMenuFontHeight() * 1.1;
    };

    this.getScoreWidth = function() {
        return window.innerWidth / 2.5 * (window.innerWidth > window.innerHeight ? 1 : 1.4);
    };

    this.getMenuFontHeight = function() {
        return window.innerWidth * 0.075 * (window.innerWidth > window.innerHeight ? 1 : 1.4);
    };
};

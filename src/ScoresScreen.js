/**
 * Created by mlaux on 9/26/15.
 */
var StaticScoresScreen = function() {
    this.scores = [];
    this.waitingForMore = false;
    this.loadedAllScores = false;

    this.init = function() {
        this.requestMoreScores();
    };

    this.requestMoreScores = function() {
        if (this.waitingForMore || this.loadedAllScores) {
            return;
        }
        this.waitingForMore = true;
        Network.queryHiscores(this.scores.length, 20, function(obj) {
            if (obj['hiscores'].length === 0) {
                this.loadedAllScores = true;
            }
            this.waitingForMore = false;
            this.scores = this.scores.concat(obj['hiscores']);
            _.sortBy(this.scores, function(obj) {
                return obj['score'];
            });
        }.bind(this));
    };

    this.update = function(delta) {

    };

    this.render = function() {
        GuiUtils.initializeContextForGui();

        var allowableScrollAmount = 2 * this._getScoreFontSize() + canvas.height * 0.2;
        allowableScrollAmount += (this.scores.length + 1) * this._getScoreFontSize();
        allowableScrollAmount = canvas.height - allowableScrollAmount;
        allowableScrollAmount = Math.min(0, allowableScrollAmount);

        GameInput.scrollAmount = Math.max(allowableScrollAmount, GameInput.scrollAmount);

        if (GameInput.scrollAmount <= allowableScrollAmount || allowableScrollAmount === 0) {
            this.requestMoreScores();
        }

        ctx.translate(0, GameInput.scrollAmount);

        ctx.textBaseline = 'top';
        ctx.font = this._getScoreFontSize() * 2 + 'px Begok';
        ctx.fillText('hiscores', window.innerWidth / 2, window.innerHeight * 0.1);

        var y = 2 * this._getScoreFontSize() + window.innerHeight * 0.2;
        for (var k = 0; k < this.scores.length; k++) {
            var score = this.scores[k];

            ctx.textAlign = 'right';
            ctx.font = this._getScoreFontSize() + 'px Begok';
            ctx.fillText(score['username'], window.innerWidth / 2 - window.innerWidth / 50 + window.innerWidth / 10, y);

            ctx.textAlign = 'left';
            ctx.font = this._getScoreFontSize() + 'px PirulenRg-Regular';
            ctx.fillText(score['score'], window.innerWidth / 2 + window.innerWidth / 50 + window.innerWidth / 10, y - window.innerWidth / 240);
            y += this._getScoreFontSize();
        }

        ctx.translate(0, -GameInput.scrollAmount);

        this.renderBackButton();
    };

    this.renderBackButton = function() {
        ButtonManager.renderBackButton();
    };

    this.click = function(x, y) {
        if (ButtonManager.isPointInsideBackButton(x, y)) {
            TransitionManager.startTransition(function() {
                StateManager.setState(StateManager.lastState);
            });
        }
    };

    this._getScoreFontSize = function() {
        return window.innerWidth / 24;
    };

    this._getBackButtonPosition = function() {
        var dim = this._getButtonDimensions();
        return [
            window.innerWidth * 0.05,
            window.innerHeight - window.innerWidth * 0.05 - dim[1]
        ]
    };

    this._getButtonDimensions = function() {
        return [
            window.innerWidth * 0.0005 * 153,
            window.innerWidth * 0.0005 * 128
        ];
    };

    this._getButtonFontSize = function() {
        return window.innerWidth * 0.0175;
    };

    this._getButtonFontHeight = function() {
        return window.innerWidth * 0.018;
    };

    this._isPointInsideBackButton = function(x, y) {
        var pos = this._getBackButtonPosition();
        var dim = this._getButtonDimensions();
        dim[1] += this._getButtonFontHeight();

        // top right point of bounding box
        var point = [
            pos[0] + dim[0] + pos[0],
            pos[1] - (window.innerHeight - pos[1] - dim[1])
        ];

        return x < point[0] && y >= point[1];
    };
};
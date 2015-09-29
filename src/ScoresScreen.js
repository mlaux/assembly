/**
 * Created by mlaux on 9/26/15.
 */
var StaticScoresScreen = function() {

    this.scores = [];

    this.init = function() {
        Network.queryHiscores(function(obj) {
            this.scores = obj['hiscores'];
            this.scores.sort(function(a, b) {
                return b['score'] - a['score'];
            });
            console.log(this.scores);
        }.bind(this));
    };

    this.update = function(delta) {

    };

    this.render = function() {
        GuiUtils.initializeContextForGui();

        ctx.fillText('hiscores', canvas.width / 2, 0);

        var y = 2 * this._getScoreFontSize();
        for (var k = 0; k < this.scores.length; k++) {
            var score = this.scores[k];
            var nameWidth = ctx.measureText(score['username']).width;
            var scoreWidth = ctx.measureText(score['score']).width;
            var totalWidth = nameWidth + scoreWidth;

            ctx.textAlign = 'right';
            ctx.font = this._getScoreFontSize() + 'px Begok';
            ctx.fillText(score['username'], canvas.width * 3 / 2 - canvas.width / 100, y);

            ctx.textAlign = 'left';
            ctx.font = this._getScoreFontSize() + 'px PirulenRg-Regular';
            ctx.fillText(score['score'], canvas.width * 3 / 2 + canvas.width / 100, y - canvas.width / 240);
            y += this._getScoreFontSize();
        }
    };

    this.click = function(x, y) {

    };

    this._getScoreFontSize = function() {
        return canvas.width / 24;
    };
};
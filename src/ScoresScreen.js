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

        ctx.font = this._getScoreFontSize() + 'px Begok';
        var y = 0;
        for (var k = 0; k < this.scores.length; k++) {
            var score = this.scores[k];
            ctx.fillText(score['username'] + ' ' + score['score'], canvas.width / 2, y);
            y += this._getScoreFontSize();
        }
    };

    this.click = function(x, y) {

    };

    this._getScoreFontSize = function() {
        return canvas.width / 24;
    };
};
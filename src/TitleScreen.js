/**
 * Created by Trent on 9/26/2015.
 */

var StaticTitleScreen = function() {
    this.MAX_LINE_COUNT = 20;
    this.LINE_CREATE_TIME = 400;

    this.createLineCountdown = this.LINE_CREATE_TIME;
    this.lineList = [];
    this.transitionLineList = [];

    this.update = function(delta) {
        if (this.createLineCountdown <= 0 && this.lineList.length < this.MAX_LINE_COUNT) {
            this.lineList.push(new TitleLine());
            this.createLineCountdown = this.LINE_CREATE_TIME;
        }
        this.createLineCountdown -= delta * 20;

        for (var i = 0; i < this.lineList.length; i++) {
            this.lineList[i].update(delta);

            if (this.lineList[i].isDead()) {
                this.lineList.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].update(delta);
        }
    };

    this.render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.font = this._getTitleFontSize() + 'px Begok';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('assembly', canvas.width / 2, canvas.height * 0.1);

        for (var i = 0; i < this.lineList.length; i++) {
            this.lineList[i].render();
        }
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].render();
        }
    };

    this.init = function() {
        for (var i = 0; i < this.MAX_LINE_COUNT; i++) {
            this.lineList.push(new TitleLine(false, Math.random()));
        }

        setTimeout(this.startTransition.bind(this), 2000);
    };

    this.startTransition = function() {
        console.log('starting transition');
        for (var y = 0; y < this.getTitleHeight(); y += this.getTitleLineHeight() - 1) {
            this.transitionLineList.push(new TitleLine(true, 1.0, y / this.getTitleHeight()));
        }
    };

    this.getTitleYPos = function() {
        return canvas.height * 0.1;
    };

    this.getTitleHeight = function() {
        return canvas.width * 0.1;
    };

    this.getTitleLineHeight = function() {
        return canvas.width * 0.005;
    };

    this._getTitleFontSize = function() {
        return canvas.width / 11.25;
    };
};
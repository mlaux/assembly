/**
 * Created by Trent on 9/30/2015.
 */

var Transition = function(callback) {
    this.transitionLineList = [];
    this.startTransitionTime = time;
    this.callback = callback;

    this.update = function(delta) {
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].update(delta);
        }

        this.remainingTransitionTime -= delta / Constants.DELTA_SCALE;
    };

    this.render = function() {
        for (var i = 0; i < this.transitionLineList.length; i++) {
            this.transitionLineList[i].render();
        }
    };

    this.shouldCallback = function() {
        return this.callback && time - this.startTransitionTime >= 1 * TransitionManager.getTransitionTime();
    };

    this.isTransitioning = function() {
        return time - this.startTransitionTime < 1.5 * TransitionManager.getTransitionTime();
    };

    this.isDone = function() {
        return time - this.startTransitionTime >= 2 * TransitionManager.getTransitionTime();
    };

    this.init = function() {
        for (var y = 0; y < window.innerHeight; y += TransitionManager.getLineHeight() - 1) {
            this.transitionLineList.push(new TitleLine(true, 1.0, y / window.innerHeight));
        }
    };
    this.init();
};
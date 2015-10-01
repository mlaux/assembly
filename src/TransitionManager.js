/**
 * Created by Trent on 9/30/2015.
 */

var StaticTransitionManager = function() {
    this.LINE_BASE_TRANSITION_SPEED = 0.018;

    this.transitions = [];

    this.update = function(delta) {
        for (var i = 0; i < this.transitions.length; i++) {
            if (this.transitions[i].shouldCallback()) {
                this.transitions[i].callback();
                this.transitions[i].callback = null;
            }
            if (this.transitions[i].isDone()) {
                this.transitions.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < this.transitions.length; i++) {
            this.transitions[i].update(delta);
        }
    };

    this.render = function() {
        for (var i = 0; i < this.transitions.length; i++) {
            this.transitions[i].render();
        }
    };

    this.startTransition = function(callback) {
        var newCallback = function() {
            GameInput.scrollAmount = 0;
            callback();
        };
        this.transitions.push(new Transition(newCallback));
    };

    this.isTransitioning = function() {
        for (var i = 0; i < this.transitions.length; i++) {
            if (this.transitions[i].isTransitioning()) {
                return true;
            }
        }
        return false;
    };

    this.getTransitionTime = function() {
        return 1.0 / (Constants.DELTA_SCALE * this.LINE_BASE_TRANSITION_SPEED);
    };

    // other methods
    this.getLineHeight = function() {
        return Math.max(window.innerWidth, window.innerHeight) * 0.005;
    };
};
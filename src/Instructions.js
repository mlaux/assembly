/**
 * Created by Trent on 10/1/2015.
 */

var StaticInstructions = function() {
    this.update = function(delta) {

    };

    this.render = function() {
        ButtonManager.renderBackButton();

        this.renderTitle();
    };

    this.renderTitle = function() {

    };

    this.click = function(x, y) {
        if (ButtonManager.isPointInsideBackButton(x, y)) {
            TransitionManager.startTransition(function() {
                StateManager.setState(StateManager.lastState);
            });
        }
    };
};
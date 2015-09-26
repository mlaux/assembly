/**
 * Created by Trent on 9/26/2015.
 */

var StaticGameInput = function() {
    this.init = function() {
        canvas.addEventListener('mousedown', function(e) {
            StateManager.getState().click(e.clientX, e.clientY);
        }.bind(this));
    };
};
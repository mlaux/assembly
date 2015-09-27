/**
 * Created by Trent on 9/26/2015.
 */

var StaticGameInput = function() {
    this.mousePos = [0, 0];
    this.mobilePhone = false;

    this.init = function() {
        canvas.addEventListener('touchend', function(e) {
            this.mobilePhone = true;
            StateManager.getState().click(e.clientX, e.clientY);
        }.bind(this));
        canvas.addEventListener('touchmove', function(e) {
            this.mobilePhone = true;
            if (e.targetTouches.length === 0) {
                return;
            }
            var touch = e.targetTouches[0];
            this.mousePos[0] = touch.pageX;
            this.mousePos[1] = touch.pageY;
            e.preventDefault();
        }.bind(this));

        canvas.addEventListener('mouseup', function(e) {
            if (this.mobilePhone) {
                return;
            }
            StateManager.getState().click(e.clientX, e.clientY);
        }.bind(this));
        canvas.addEventListener('mousemove', function(e) {
            if (this.mobilePhone) {
                return;
            }
            this.mousePos[0] = e.clientX;
            this.mousePos[1] = e.clientY;
        }.bind(this));
    };
};
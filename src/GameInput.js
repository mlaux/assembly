/**
 * Created by Trent on 9/26/2015.
 */

var StaticGameInput = function() {
    this.mousePos = [-1, -1];
    this.mobilePhone = false;

    this.init = function() {
        canvas.addEventListener('touchend', function(e) {
            this.mobilePhone = true;
            var touch = e.changedTouches[0];
            if (!touch) {
                return;
            }
            this.mousePos = [-1, -1];
            this._dispatchClick(touch.pageX, touch.pageY);
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


        canvas.addEventListener('mousedown', function(e) {
            if (this.mobilePhone) {
                return;
            }
            e.preventDefault();
        }.bind(this));
        canvas.addEventListener('mouseup', function(e) {
            if (this.mobilePhone) {
                return;
            }
            this._dispatchClick(e.clientX, e.clientY);
        }.bind(this));
        canvas.addEventListener('mousemove', function(e) {
            if (this.mobilePhone) {
                return;
            }
            this.mousePos[0] = e.clientX;
            this.mousePos[1] = e.clientY;
        }.bind(this));
        canvas.addEventListener('mouseout', function(e) {
            if (this.mobilePhone) {
                return;
            }
            this.mousePos = [-1, -1]
        }.bind(this));
        canvas.addEventListener('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        canvas.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    };

    this._dispatchClick = function(x, y) {
        StateManager.getState().click(x, y);
    }
};
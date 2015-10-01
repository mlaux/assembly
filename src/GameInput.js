/**
 * Created by Trent on 9/26/2015.
 */

var StaticGameInput = function() {
    this.SCROLL_ACCEL = 2;

    this.downMousePos = [0, 0];
    this.mousePos = [-1, -1];
    this.mobilePhone = false;

    this.scrollAmount = 0;
    this.scrollVel = 0;
    this.scrollVels = [];

    this.update = function(delta) {
        while (this.scrollVels.length > 0 && time - this.scrollVels[0].time > 50) {
            this.scrollVels.splice(0, 1);
        }
        if (Math.abs(this.scrollVel) < this.SCROLL_ACCEL * delta) {
            this.scrollVel = 0;
        } else {
            if (this.scrollVel > 0) {
                this.scrollVel -= this.SCROLL_ACCEL * delta;
            } else {
                this.scrollVel += this.SCROLL_ACCEL * delta;
            }
        }

        if (this.mousePos[0] === -1 && this.mousePos[1] === -1) {
            this.scrollAmount += this.scrollVel * delta;
            this.scrollAmount = Math.min(0, this.scrollAmount);
        }
    };

    this.init = function() {
        canvas.addEventListener('touchstart', function(e) {
            this.mobilePhone = true;
            var touch = e.changedTouches[0];
            if (!touch) {
                return;
            }
            this.downMousePos = [touch.pageX, touch.pageY];
        }.bind(this));
        canvas.addEventListener('touchend', function(e) {
            this.mobilePhone = true;
            var baseSize = Math.min(window.innerWidth, window.innerHeight);
            var touch = e.changedTouches[0];
            if (!touch) {
                return;
            }
            var dx = this.downMousePos[0] - touch.pageX;
            var dy = this.downMousePos[1] - touch.pageY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            this.mousePos = [-1, -1];
            this.scrollVel = 0;
            for (var i = 0; i < this.scrollVels.length; i++) {
                if (Math.abs(this.scrollVels[i].vel) > Math.abs(this.scrollVel)) {
                    this.scrollVel = this.scrollVels[i].vel;
                }
            }
            if (dist / baseSize <= 0.025) {
                this._dispatchClick(touch.pageX, touch.pageY);
            }
        }.bind(this));
        canvas.addEventListener('touchmove', function(e) {
            var baseSize = Math.min(window.innerWidth, window.innerHeight);
            this.mobilePhone = true;
            if (e.targetTouches.length === 0) {
                return;
            }
            var touch = e.targetTouches[0];

            if (this.mousePos[1] !== -1) {
                var dy = touch.pageY - this.mousePos[1];
                this.scrollAmount += dy;
                if (Math.abs(dy) > baseSize * 0.01) {
                    this.scrollVels.push({'vel': dy, 'time': time});
                }
                this.scrollAmount = Math.min(0, this.scrollAmount);
            }
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
        document.addEventListener('wheel', function(e) {
            this.scrollAmount += e.deltaY * -3;
            this.scrollAmount = Math.min(0, this.scrollAmount);
        }.bind(this));
    };

    this._dispatchClick = function(x, y) {
        StateManager.getState().click(x, y);
    }
};
/**
 * Created by Trent on 9/27/2015.
 */

var StaticAdInitialize = function() {
    this.TRANSITION_TIME = 300;

    this.container = null;
    this.ins = null;

    this.visible = false;
    this.remainingTransitionTime = 0;
    this.percentDown = 1.0;

    this.update = function(delta) {
        this.remainingTransitionTime = Math.max(0, this.remainingTransitionTime - delta / Constants.DELTA_SCALE);

        if (this.visible) {
            this.percentDown = 1.0 - this.remainingTransitionTime / this.TRANSITION_TIME;

            if (this.ins.style.display !== 'block') {
                this.ins.style.display = 'block';
            }
        } else {
            this.percentDown = this.remainingTransitionTime / this.TRANSITION_TIME;

            if (this.percentDown === 0.0) {
                if (this.ins.style.display !== 'none') {
                    this.ins.style.display = 'none';
                }
            }
        }

        this.resize();
    };

    this.hide = function() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        this.remainingTransitionTime = this.TRANSITION_TIME - this.remainingTransitionTime;
    };

    this.show = function() {
        if (this.visible) {
            return;
        }
        this.visible = true;
        this.remainingTransitionTime = this.TRANSITION_TIME - this.remainingTransitionTime;
    };

    this.resize = function() {
        var height = window.getComputedStyle(this.ins).getPropertyValue('height');
        height = parseInt(height.substring(0, height.length - 2));

        this.container.style.top = '-' + Math.floor(height * (1.0 - this.percentDown)) + 'px';
    };

    this.init = function() {
        this.container = document.getElementById('ad-container');
        this.ins = document.getElementById('advert');
    };
};

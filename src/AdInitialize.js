/**
 * Created by Trent on 9/27/2015.
 */

var StaticAdInitialize = function() {
    this.TRANSITION_TIME = 300;

    this.container = null;
    this.adFrame = null;

    this.visible = false;
    this.remainingTransitionTime = 0;
    this.percentDown = 0.0;

    this.userRequestedRefresh = false;

    this.update = function(delta) {
        if (!this.adFrame || this.adFrame.contentWindow.document.readyState !== 'complete') {
            return;
        }
        this.remainingTransitionTime = Math.max(0, this.remainingTransitionTime - delta / Constants.DELTA_SCALE);


        if (this.visible) {
            this.percentDown = 1.0 - this.remainingTransitionTime / this.TRANSITION_TIME;
        } else {
            if (this.remainingTransitionTime === 0 && this.percentDown !== 0) {
                this.clearAd();
            }
            this.percentDown = this.remainingTransitionTime / this.TRANSITION_TIME;
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
        this.userRequestedRefresh = true;
        this.visible = true;
        this.remainingTransitionTime = this.TRANSITION_TIME - this.remainingTransitionTime;
    };

    this.refreshAd = function() {
        this.adFrame.contentWindow.location.replace('adPage.html');
    };

    this.clearAd = function() {
        this.adFrame.contentWindow.location.replace('about:blank');
    };

    this.resize = function() {
        if (!this.adFrame || !this.adFrame.contentWindow || !this.adFrame.contentWindow.document || this.adFrame.contentWindow.document.readyState !== 'complete') {
            return;
        }
        var adFrameAdContainer = this.adFrame.contentWindow.document.getElementById('adFrameAdContainer');
        if (!adFrameAdContainer) {
            return;
        }
        var width = this.adFrame.contentWindow.getComputedStyle(adFrameAdContainer).getPropertyValue('width');
        width = width.substring(0, width.length - 2);
        var height = this.adFrame.contentWindow.getComputedStyle(adFrameAdContainer).getPropertyValue('height');
        height = height.substring(0, height.length - 2);

        this.adFrame.style.width = width + 'px';
        this.adFrame.style.height = height + 'px';
        this.container.style.top = '-' + Math.floor(height * (1.0 - this.percentDown)) + 'px';
    };

    this.init = function() {
        if (window.AdInterface) {
            return;
        }
        this.container = document.getElementById('ad-container');
        this.adFrame = document.getElementById('ad-frame');

        this.resize();
    };
};

/**
 * Created by Trent on 10/1/2015.
 */

var StaticInstructions = function() {
    this.globalInstructionsBall = null;
    this.globalInstructionsFinger = null;
    this.globalInstructionsPaddleGreen = null;
    this.globalInstructionsPaddleGreenSelected = null;
    this.globalInstructionsPaddlePurple = null;
    this.globalInstructionsPaddlePurpleSelected = null;
    this.globalInstructionsPaddleRed = null;
    this.globalInstructionsPaddleRedSelected = null;

    this.haveSeenInstructions = window.localStorage ?
        window.localStorage.getItem('centrifuge-have-seen-instructions5') ? '1' : '0'
    : '0';

    this.update = function(delta) {

    };

    this.render = function() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.renderOverlay(false);

        ButtonManager.renderBackButton();
    };

    this.renderOverlayWithClickToContinue = function() {
        this.renderOverlay(true);
    };

    this.renderOverlay = function(clickToContinue) {
        if (this.haveSeenInstructions === '0') {
            this.haveSeenInstructions = '1';
            if (window.localStorage) {
                try {
                    window.localStorage.setItem('centrifuge-have-seen-instructions5', '1');
                } catch (e) {
                    console.error(e);
                }
            }
        }
        var allowableScrollAmount = this._getCreditsPosition()[1] + this._getTextFontHeight() / 1.5 * 2 + this._getPadding();
        allowableScrollAmount = window.innerHeight - allowableScrollAmount;
        allowableScrollAmount = Math.min(0, allowableScrollAmount);

        GameInput.scrollAmount = Math.max(allowableScrollAmount, GameInput.scrollAmount);

        ctx.translate(0, GameInput.scrollAmount);

        this.renderTitle();
        this.renderScrollDown();
        if (clickToContinue) {
            this.renderClickToContinue();
        }
        ctx.font = this._getTextFontSize() + 'px Arial';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        this.renderCorrectExample();
        this.renderWrongExample();
        this.renderInactiveExample();
        this.renderCheckOutAetherPass();
        this.renderCredits();

        ctx.translate(0, -GameInput.scrollAmount);
    };

    this.renderCorrectExample = function() {
        var pos = this._getCorrectExamplePosition();
        var dim = this._getExampleDimensions();

        ctx.drawImage(this.globalInstructionsBall, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleGreenSelected, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddlePurple, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleRed, pos[0], pos[1], dim[0], dim[1]);

        ctx.fillText('Tap a line before', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('the ball hits it.', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());

        var fingerDim = this._getFingerDimensions();
        ctx.translate(pos[0] + dim[0] + this._getPadding() + fingerDim[0] / 2, pos[1] + dim[1] / 2 + this._getPadding() + fingerDim[1] / 2);
        ctx.rotate(-Math.PI * 0.2);

        ctx.drawImage(
            this.globalInstructionsFinger,
            -fingerDim[0] / 2,
            -fingerDim[1] / 2,
            fingerDim[0],
            fingerDim[1]
        );

        ctx.rotate(Math.PI * 0.2);
        ctx.translate(-pos[0] - dim[0] - this._getPadding() - fingerDim[0] / 2, -pos[1] - dim[1] / 2 - this._getPadding() - fingerDim[1] / 2);
    };

    this.renderWrongExample = function() {
        var pos = this._getWrongExamplePosition();
        var dim = this._getExampleDimensions();

        ctx.drawImage(this.globalInstructionsBall, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleGreen, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddlePurpleSelected, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleRed, pos[0], pos[1], dim[0], dim[1]);

        ctx.fillText('If you tap the', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('wrong line you', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());
        ctx.fillText('will lose.', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight() * 2);

        var fingerDim = this._getFingerDimensions();
        ctx.translate(pos[0] + dim[0] / 4 + fingerDim[0] / 2, pos[1] + dim[1] - this._getPadding() + fingerDim[1] / 2);
        ctx.rotate(-Math.PI * 0.1);

        ctx.drawImage(
            this.globalInstructionsFinger,
            -fingerDim[0] / 2,
            -fingerDim[1] / 2,
            fingerDim[0],
            fingerDim[1]
        );

        ctx.rotate(Math.PI * 0.1);
        ctx.translate(-pos[0] - dim[0] / 4 - fingerDim[0] / 2, -pos[1] - dim[1] + this._getPadding() - fingerDim[1] / 2);
    };

    this.renderInactiveExample = function() {
        var pos = this._getInactiveExamplePosition();
        var dim = this._getExampleDimensions();

        ctx.drawImage(this.globalInstructionsBall, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleGreen, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddlePurple, pos[0], pos[1], dim[0], dim[1]);
        ctx.drawImage(this.globalInstructionsPaddleRed, pos[0], pos[1], dim[0], dim[1]);

        ctx.fillText('You won\'t lose', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('points for doing', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());
        ctx.fillText('nothing.', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight() * 2);
    };

    this.renderCheckOutAetherPass = function() {
        var pos = this._getAetherPassPosition();
        ctx.textAlign = 'center';
        ctx.font = this._getTextFontSize() + 'px Arial';
        ctx.fillText('Enjoy Centrifuge?', pos[0], pos[1]);
        ctx.fillText('Check out our MMO, Aether Pass!', pos[0], pos[1] + this._getTextFontHeight());
        ctx.fillStyle = '#' + (this._isPointInsideAetherPass(GameInput.mousePos[0], GameInput.mousePos[1]) ? Constants.COLOR_LIGHT_GRAY : Constants.COLOR_WHITE);
        ctx.fillText('http://aetherpass.com/', pos[0], pos[1] + this._getTextFontHeight() * 2);
        ctx.fillRect(pos[0] - window.innerWidth / 3.2, pos[1] + this._getTextFontHeight() * 3, window.innerWidth / 1.6, window.innerWidth / 400);
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
    };

    this.renderCredits = function() {
        var pos = this._getCreditsPosition();
        ctx.font = (this._getTextFontSize() / 1.5) + 'px Arial';
        ctx.fillText('Created by:', pos[0], pos[1]);
        ctx.fillText('Trent Davies, Matt Laux, Rachel Ho', pos[0], pos[1] + this._getTextFontHeight() / 1.5);
    };

    this.renderTitle = function() {
        ctx.font = this._getTitleFontSize() + 'px Begok';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.fillText('instructions', window.innerWidth / 2, window.innerHeight * 0.1);
    };

    this.renderScrollDown = function() {
        ctx.font = (this._getTitleFontSize() / 4) + 'px Begok';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.fillText('scroll down', window.innerWidth / 2, window.innerHeight * 0.1 + this._getTitleFontHeight());
    };

    this.renderClickToContinue = function() {
        ctx.font = (this._getTitleFontSize() / 4) + 'px Begok';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#' + Constants.COLOR_WHITE;
        ctx.fillText('click to continue', window.innerWidth / 2, window.innerHeight * 0.1 + this._getTitleFontHeight() + this._getTitleFontHeight() / 4);
    };

    this._getCorrectExamplePosition = function() {
        return [
            this._getPadding(),
            window.innerHeight * 0.2 + this._getTitleFontHeight() + this._getTitleFontHeight() / 4
        ];
    };

    this._getWrongExamplePosition = function() {
        return [
            this._getPadding(),
            this._getCorrectExamplePosition()[1] + this._getExampleDimensions()[1] + this._getTitleFontHeight() * 2
        ];
    };

    this._getInactiveExamplePosition = function() {
        return [
            this._getPadding(),
            this._getWrongExamplePosition()[1] + this._getExampleDimensions()[1] + this._getTitleFontHeight() * 2
        ];
    };

    this._getAetherPassPosition = function() {
        return [
            window.innerWidth / 2,
            this._getInactiveExamplePosition()[1] + this._getExampleDimensions()[1] + this._getPadding() * 4
        ];
    };

    this._getCreditsPosition = function() {
        return [
            window.innerWidth / 2,
            this._getAetherPassPosition()[1] + this._getTextFontHeight() * 3 + this._getPadding() * 4
        ];
    };

    this._getExampleDimensions = function() {
        var width = window.innerWidth / 2 - this._getPadding() * 2;
        var height = width / this.globalInstructionsBall.width * this.globalInstructionsBall.height;

        return [width, height];
    };

    this._getTitleFontSize = function() {
        return window.innerWidth / 12;
    };

    this._getTitleFontHeight = function() {
        return window.innerWidth / 12;
    };

    this._getPadding = function() {
        return window.innerWidth * 0.05;
    };

    this._getFingerDimensions = function() {
        return [this.globalInstructionsFinger.width * window.innerWidth * 3 / 9800,
            this.globalInstructionsFinger.height * window.innerWidth * 3 / 9800];
    };

    this._getTextFontSize = function() {
        return window.innerWidth / 16;
    };

    this._getTextFontHeight = function() {
        return window.innerWidth / 24 * 1.5;
    };

    this._isPointInsideAetherPass = function(x, y) {
        var pos = this._getAetherPassPosition();
        pos[1] += GameInput.scrollAmount + this._getTextFontHeight() * 2;
        var dim = [window.innerWidth / 1.6, this._getTextFontHeight() * 1.3];
        return x >= pos[0] - dim[0] / 2 && x < pos[0] + dim[0] / 2 && y >= pos[1] && y < pos[1] + dim[1];
    };

    this.click = function(x, y) {
        if (ButtonManager.isPointInsideBackButton(x, y)) {
            if (window.AdInterface) {
                AdInterface.hideAd();
            } else {
                AdInitialize.hide();
            }
            TransitionManager.startTransition(function() {
                StateManager.setState(StateManager.lastState);
            });
            return;
        }

        if (this._isPointInsideAetherPass(x, y)) {
            var win = window.open('http://aetherpass.com/', '_blank');
            win.focus();
        }
    };

    this.init = function() {
        this.globalInstructionsBall = document.createElement('img');
        this.globalInstructionsBall.src = 'assets/instructions-ball.png';
        this.globalInstructionsBall.id = 'globalInstructionsBall';
        this.globalInstructionsBall.width = '800';
        this.globalInstructionsBall.height = '873';

        this.globalInstructionsFinger = document.createElement('img');
        this.globalInstructionsFinger.src = 'assets/instructions-finger.png';
        this.globalInstructionsFinger.id = 'globalInstructionsFinger';
        this.globalInstructionsFinger.width = '500';
        this.globalInstructionsFinger.height = '628';

        this.globalInstructionsPaddleGreen = document.createElement('img');
        this.globalInstructionsPaddleGreen.src = 'assets/instructions-paddle-green.png';
        this.globalInstructionsPaddleGreen.id = 'globalInstructionsPaddleGreen';
        this.globalInstructionsPaddleGreen.width = '800';
        this.globalInstructionsPaddleGreen.height = '873';

        this.globalInstructionsPaddleGreenSelected = document.createElement('img');
        this.globalInstructionsPaddleGreenSelected.src = 'assets/instructions-paddle-green-selected.png';
        this.globalInstructionsPaddleGreenSelected.id = 'globalInstructionsPaddleGreenSelected';
        this.globalInstructionsPaddleGreenSelected.width = '800';
        this.globalInstructionsPaddleGreenSelected.height = '873';

        this.globalInstructionsPaddlePurple = document.createElement('img');
        this.globalInstructionsPaddlePurple.src = 'assets/instructions-paddle-purple.png';
        this.globalInstructionsPaddlePurple.id = 'globalInstructionsPaddlePurple';
        this.globalInstructionsPaddlePurple.width = '800';
        this.globalInstructionsPaddlePurple.height = '873';

        this.globalInstructionsPaddlePurpleSelected = document.createElement('img');
        this.globalInstructionsPaddlePurpleSelected.src = 'assets/instructions-paddle-purple-selected.png';
        this.globalInstructionsPaddlePurpleSelected.id = 'globalInstructionsPaddlePurpleSelected';
        this.globalInstructionsPaddlePurpleSelected.width = '800';
        this.globalInstructionsPaddlePurpleSelected.height = '873';

        this.globalInstructionsPaddleRed = document.createElement('img');
        this.globalInstructionsPaddleRed.src = 'assets/instructions-paddle-red.png';
        this.globalInstructionsPaddleRed.id = 'globalInstructionsPaddleRed';
        this.globalInstructionsPaddleRed.width = '800';
        this.globalInstructionsPaddleRed.height = '873';

        this.globalInstructionsPaddleRedSelected = document.createElement('img');
        this.globalInstructionsPaddleRedSelected.src = 'assets/instructions-paddle-red-selected.png';
        this.globalInstructionsPaddleRedSelected.id = 'globalInstructionsPaddleRedSelected';
        this.globalInstructionsPaddleRedSelected.width = '800';
        this.globalInstructionsPaddleRedSelected.height = '873';
    };
    this.init();
};
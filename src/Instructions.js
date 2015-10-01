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
        window.localStorage.getItem('centrifuge-have-seen-instructions') ? true : false
    : true;

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
        if (!this.haveSeenInstructions) {
            this.haveSeenInstructions = true;
            window.localStorage.setItem('centrifuge-have-seen-instructions', true);
        }
        var allowableScrollAmount = this._getCreditsPosition()[1] + this._getTextFontHeight() / 1.5 * 2 + this._getPadding();
        allowableScrollAmount = canvas.height - allowableScrollAmount;
        allowableScrollAmount = Math.min(0, allowableScrollAmount);

        GameInput.scrollAmount = Math.max(allowableScrollAmount, GameInput.scrollAmount);

        ctx.translate(0, GameInput.scrollAmount);

        this.renderTitle();
        this.renderScrollDown();
        if (clickToContinue) {
            this.renderClickToContinue();
        }
        ctx.font = this._getTextFontSize() + 'px Begok';
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

        ctx.fillText('tap a line', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('before the', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());
        ctx.fillText('ball hits it', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight() * 2);

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

        ctx.fillText('if you tap the', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('wrong line', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());
        ctx.fillText('you will lose', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight() * 2);

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

        ctx.fillText('you wont lose', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding());
        ctx.fillText('points for', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight());
        ctx.fillText('doing nothing', pos[0] + dim[0] + this._getPadding(), pos[1] + this._getPadding() + this._getTextFontHeight() * 2);
    };

    this.renderCheckOutAetherPass = function() {
        var pos = this._getAetherPassPosition();
        ctx.textAlign = 'center';
        ctx.font = (this._getTextFontSize() * 1.5) + 'px Times New Roman';
        ctx.fillText('Enjoy Centrifuge?', pos[0], pos[1]);
        ctx.fillText('Check out our MMO, Aether Pass!', pos[0], pos[1] + this._getTextFontHeight());
        ctx.fillText('http://aetherpass.com/', pos[0], pos[1] + this._getTextFontHeight() * 2);
    };

    this.renderCredits = function() {
        var pos = this._getCreditsPosition();
        ctx.font = this._getTextFontSize() + 'px Times New Roman';
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
        return [this.globalInstructionsFinger.width * 0.3, this.globalInstructionsFinger.height * 0.3];
    };

    this._getTextFontSize = function() {
        return window.innerWidth / 24;
    };

    this._getTextFontHeight = function() {
        return window.innerWidth / 24 * 1.5;
    };

    this.click = function(x, y) {
        if (ButtonManager.isPointInsideBackButton(x, y)) {
            TransitionManager.startTransition(function() {
                StateManager.setState(StateManager.lastState);
            });
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
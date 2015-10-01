/**
 * Created by Trent on 10/1/2015.
 */

var StaticButtonManager = function() {
    this.renderBackButton = function() {
        var pos = this.getBackButtonPosition();
        var dimensions = this.getButtonDimensions();

        var hover = this.isPointInsideBackButton(GameInput.mousePos[0], GameInput.mousePos[1]) && !TransitionManager.isTransitioning();

        if (hover) {
            ctx.drawImage(
                globalBackButtonHover,
                pos[0],
                pos[1],
                dimensions[0],
                dimensions[1]
            );
        } else {
            ctx.drawImage(
                globalBackButton,
                pos[0],
                pos[1],
                dimensions[0],
                dimensions[1]
            );
        }

        ctx.fillStyle = hover ? '#' + Constants.COLOR_LIGHT_GRAY : '#' + Constants.COLOR_WHITE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = this.getButtonFontSize() + 'px Begok ';
        ctx.fillText('back', pos[0] + dimensions[0] / 2, pos[1] + dimensions[1]);
    };

    this.renderSubmitButton = function() {
        var pos = this.getSubmitButtonPosition();
        var dimensions = this.getButtonDimensions();

        var hover = this.isPointInsideSubmitButton(GameInput.mousePos[0], GameInput.mousePos[1]) && !TransitionManager.isTransitioning();

        ctx.translate(pos[0] + dimensions[0] / 2, pos[1] + dimensions[1] / 2);
        ctx.scale(-1, 1);

        if (hover) {
            ctx.drawImage(
                globalBackButtonHover,
                -dimensions[0] / 2,
                -dimensions[1] / 2,
                dimensions[0],
                dimensions[1]
            );
        } else {
            ctx.drawImage(
                globalBackButton,
                -dimensions[0] / 2,
                -dimensions[1] / 2,
                dimensions[0],
                dimensions[1]
            );
        }

        ctx.scale(-1, 1);
        ctx.translate(-pos[0] - dimensions[0] / 2, -pos[1] - dimensions[1] / 2);

        ctx.fillStyle = hover ? '#' + Constants.COLOR_LIGHT_GRAY : '#' + Constants.COLOR_WHITE;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = this.getButtonFontSize() + 'px Begok ';
        ctx.fillText('submit', pos[0] + dimensions[0] / 2, pos[1] + dimensions[1]);
    };

    this.getBackButtonPosition = function() {
        var dim = this.getButtonDimensions();
        return [
            canvas.width * 0.05,
            canvas.height - canvas.width * 0.05 - dim[1]
        ]
    };

    this.getSubmitButtonPosition = function() {
        var dim = this.getButtonDimensions();
        return [
            canvas.width - canvas.width * 0.05 - dim[0],
            canvas.height - canvas.width * 0.05 - dim[1]
        ]
    };

    this.getButtonDimensions = function() {
        return [
            canvas.width * 0.00075 * 153,
            canvas.width * 0.00075 * 128
        ];
    };

    this.getButtonFontSize = function() {
        return canvas.width * 0.02625;
    };

    this.getButtonFontHeight = function() {
        return canvas.width * 0.027;
    };

    this.isPointInsideBackButton = function(x, y) {
        var pos = this.getBackButtonPosition();
        var dim = this.getButtonDimensions();
        dim[1] += this.getButtonFontHeight();

        // top right point of bounding box
        var point = [
            pos[0] + dim[0] + pos[0],
            pos[1] - (canvas.height - pos[1] - dim[1])
        ];

        return x < point[0] && y >= point[1];
    };

    this.isPointInsideSubmitButton = function(x, y) {
        var pos = this.getSubmitButtonPosition();
        var dim = this.getButtonDimensions();
        dim[1] += this.getButtonFontHeight();

        // top left point of bounding box
        var point = [
            pos[0] - (canvas.width - pos[0] - dim[0]),
            pos[1] - (canvas.height - pos[1] - dim[1])
        ];

        return x >= point[0] && y >= point[1];
    };
};
/**
 * Created by Trent on 9/26/2015.
 */

var StaticGame = function() {
    this.PADDLE_GAP = 0.02;
    this.PADDLE_THICKNESS = 0.02;
    this.CIRCLE_DIAMETER = 0.85;
    this.ROTATE_ACCEL = 0.001;

    this.paddleAngles = [];

    this.desiredRotateSpeed = 0;
    this.rotateSpeed = 0;

    this.update = function(delta) {
        if (this.desiredRotateSpeed - this.rotateSpeed <= this.ROTATE_ACCEL) {
            this.rotateSpeed = this.desiredRotateSpeed;
        } else {
            this.rotateSpeed += this.ROTATE_ACCEL;
        }
    };

    this.render = function() {
        this.renderPaddles();
    };

    this.renderPaddles = function() {
        var baseSize = Math.min(canvas.width, canvas.height);
        var paddleThickness = baseSize * this.PADDLE_THICKNESS;
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;

        var outerPaddleAngle = Math.PI * 2 * (this.paddleAngles.length - 2) / this.paddleAngles.length;
        var innerPaddleAngle = Math.PI * 2 - outerPaddleAngle;

        var fakePoint1 = [
            Math.cos(0) * radius,
            Math.sin(0) * radius
        ];
        var fakePoint2 = [
            Math.cos(innerPaddleAngle) * radius,
            Math.sin(innerPaddleAngle) * radius
        ];

        var fakeMiddlePoint = [(fakePoint1[0] + fakePoint2[0]) / 2, (fakePoint1[1] + fakePoint2[1]) / 2];
        radius = Math.sqrt(fakeMiddlePoint[0] * fakeMiddlePoint[0] + fakeMiddlePoint[1] * fakeMiddlePoint[1]);

        ctx.fillStyle = '#ffffff';

        for (var i = 0; i < this.paddleAngles.length; i++) {
            var angle = this.paddleAngles[i];

            var pos = [canvas.width / 2 + Math.cos(angle) * radius, canvas.height / 2 + Math.sin(angle) * radius];
            ctx.fillRect(pos[0] - 20, pos[1] - 20 , 40, 40);

            var unitVector = [Math.cos(angle), Math.sin(angle)];
            var orthogonalUnitVector = this.getOrthogonalUnitVector(angle);

            var paddleWidth = this.getPaddleLength(this.paddleAngles.length);

            var point1 = [
                pos[0] - paddleWidth / 2 * orthogonalUnitVector[0] - paddleThickness / 2 * unitVector[0],
                pos[1] - paddleWidth / 2 * orthogonalUnitVector[1] - paddleThickness / 2 * unitVector[1]
            ];
            var point2 = [
                pos[0] + paddleWidth / 2 * orthogonalUnitVector[0] - paddleThickness / 2 * unitVector[0],
                pos[1] + paddleWidth / 2 * orthogonalUnitVector[1] - paddleThickness / 2 * unitVector[1]
            ];
            var point3 = [
                pos[0] + paddleWidth / 2 * orthogonalUnitVector[0] + paddleThickness / 2 * unitVector[0],
                pos[1] + paddleWidth / 2 * orthogonalUnitVector[1] + paddleThickness / 2 * unitVector[1]
            ];
            var point4 = [
                pos[0] - paddleWidth / 2 * orthogonalUnitVector[0] + paddleThickness / 2 * unitVector[0],
                pos[1] - paddleWidth / 2 * orthogonalUnitVector[1] + paddleThickness / 2 * unitVector[1]
            ];

            ctx.beginPath();
            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);
            ctx.lineTo(point3[0], point3[1]);
            ctx.lineTo(point4[0], point4[1]);
            ctx.closePath();
            ctx.fill();
        }
    };

    this.click = function(x, y) {

    };

    this.init = function() {
        this.desiredRotateSpeed = 0.1;
        this.rotateSpeed = 0;

        this.paddleAngles = [
            Math.PI - Math.PI * 3 / 2,
            Math.PI - Math.PI * 13 / 6,
            Math.PI - Math.PI * 17 / 6
        ];
    };

    // paddle functions
    this.getOrthogonalUnitVector = function(angle) {
        return [
            Math.cos(angle + Math.PI / 2),
            Math.sin(angle + Math.PI / 2)
        ];
    };

    this.getPaddleLength = function(sides) {
        var baseSize = Math.min(canvas.width, canvas.height);
        var angle = Math.PI * 2 * (sides - 2) / sides;
        var innerAngle = Math.PI * 2 - angle;

        var radius = baseSize * this.CIRCLE_DIAMETER / 2;
        var point1 = [
            Math.cos(0) * radius,
            Math.sin(0) * radius
        ];
        var point2 = [
            Math.cos(innerAngle) * radius,
            Math.sin(innerAngle) * radius
        ];

        var dx = point2[0] - point1[0];
        var dy = point2[1] - point1[1];
        var distance = Math.sqrt(dx * dx + dy * dy);

        return distance - baseSize * this.PADDLE_GAP;
    };
};
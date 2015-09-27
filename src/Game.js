/**
 * Created by Trent on 9/26/2015.
 */

var StaticGame = function() {
    this.BALL_DIAMETER = 0.1;
    this.PADDLE_GAP = 0.12;
    this.PADDLE_THICKNESS = 0.04;
    this.CIRCLE_DIAMETER = 0.85;
    this.ROTATE_ACCEL = 0.0005;
    this.BALL_ACCEL = 0.00025;

    this.score = 0;

    this.ballPos = [0, 0];

    this.paddleAngles = [];
    this.paddleAddAngle = 0;
    this.selectedPaddleIndex = -1;

    this.desiredRotateSpeed = 0;
    this.rotateSpeed = 0;

    this.ballAngle = Math.PI * 2 * Math.random();
    this.ballSpeed = 0;
    this.desiredBallSpeed = 0;

    this.update = function(delta) {
        if (this.desiredRotateSpeed - this.rotateSpeed <= this.ROTATE_ACCEL * delta) {
            this.rotateSpeed = this.desiredRotateSpeed;
        } else {
            this.rotateSpeed += this.ROTATE_ACCEL * delta;
        }

        this.paddleAddAngle += this.rotateSpeed * delta;

        this.updateBall(delta);
    };

    this.updateBall = function(delta) {
        var baseSize = Math.min(canvas.width, canvas.height);
        if (this.desiredBallSpeed - this.ballSpeed <= this.BALL_ACCEL * delta) {
            this.ballSpeed = this.desiredBallSpeed;
        } else {
            this.ballSpeed += this.BALL_ACCEL * delta;
        }

        var collisionPaddles = this.getCollisionPaddles();
        var collidedPaddleIndices = [];

        var collided = true;
        while (collided) {
            var canvasBallPos = [
                canvas.width / 2 + this.ballPos[0] * baseSize,
                canvas.height / 2 + this.ballPos[1] * baseSize
            ];
            var newCanvasBallPos = [
                canvas.width / 2 + (this.ballPos[0] + this.ballSpeed * Math.cos(this.ballAngle)) * baseSize,
                canvas.height / 2 + (this.ballPos[1] + this.ballSpeed * Math.sin(this.ballAngle)) * baseSize
            ];

            var ballLine = [canvasBallPos, newCanvasBallPos];

            for (var i = 0; i < collisionPaddles.length; i++) {
                // if u already collided then freakin skip it
                if (_.contains(collidedPaddleIndices, i)) {
                    continue;
                }
                var collisionLine = collisionPaddles[i];

                var intersectPoint = [0, 0];
                if (MathUtils.intersectLines2D(intersectPoint, ballLine, collisionLine)) {
                    collidedPaddleIndices.push(i);
                    var dx = intersectPoint[0] - newCanvasBallPos[0];
                    var dy = intersectPoint[1] - newCanvasBallPos[1];
                    var remainingDistance = Math.sqrt(dx * dx + dy * dy);
                    this.ballAngle =  -(this.ballAngle + MathUtils.radiansBetweenTwoAngles(this.ballAngle, this.paddleAngles[i]) * 2);

                    break;
                }
            }
            collided = false;
        }

        this.ballPos[0] += this.ballSpeed * Math.cos(this.ballAngle);
        this.ballPos[1] += this.ballSpeed * Math.sin(this.ballAngle);
    };

    this.render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.renderScore();
        this.renderPaddles();
        this.renderBall();
    };

    this.renderBall = function() {
        var baseSize = Math.min(canvas.width, canvas.height);
        var ballRadius = baseSize * this.BALL_DIAMETER / 2;

        ctx.fillStyle = '#ffffff';

        ctx.beginPath();
        ctx.arc(canvas.width / 2 + this.ballPos[0] * baseSize, canvas.height / 2 + this.ballPos[1] * baseSize, ballRadius, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    };

    this.renderPaddles = function() {
        var baseSize = Math.min(canvas.width, canvas.height);
        var paddleThickness = baseSize * this.PADDLE_THICKNESS;
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;

        var outerPaddleAngle = Math.PI * (this.paddleAngles.length - 2) / this.paddleAngles.length;
        var innerPaddleAngle = Math.PI - outerPaddleAngle;

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


        for (var i = 0; i < this.paddleAngles.length; i++) {
            var angle = this.paddleAngles[i] + this.paddleAddAngle;

            var pos = [canvas.width / 2 + Math.cos(angle) * radius, canvas.height / 2 + Math.sin(angle) * radius];

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

            ctx.fillStyle = this.selectedPaddleIndex === i ? '#660000' : '#ffffff';

            ctx.beginPath();
            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);
            ctx.lineTo(point3[0], point3[1]);
            ctx.lineTo(point4[0], point4[1]);
            ctx.closePath();
            ctx.fill();
        }
    };

    this.renderScore = function() {
        ctx.fillStyle = '#' + Constants.COLOR_GRAY;
        ctx.textAlign = canvas.height > canvas.width ? 'center' : 'left';
        ctx.textBaseline = canvas.height > canvas.width ? 'top' : 'middle';
        ctx.font = this._getScoreFontSize() + 'px PirulenRg-Regular';

        ctx.fillText('' + this.score,
            canvas.height > canvas.width ? canvas.width / 2 : canvas.width * 0.1,
            canvas.height > canvas.width ? canvas.height * 0.1 : canvas.height / 2);
    };

    this.click = function(x, y) {
        var clickAngle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
        var clickUnitVector = [Math.cos(clickAngle), Math.sin(clickAngle)];

        var smallestDistance = 2147483648;
        var smallestDistanceIndex = -1;
        for (var i = 0; i < this.paddleAngles.length; i++) {
            var paddleAngle = this.paddleAngles[i] + this.paddleAddAngle;
            var paddleUnitVector = [Math.cos(paddleAngle), Math.sin(paddleAngle)];

            var dx = clickUnitVector[0] - paddleUnitVector[0];
            var dy = clickUnitVector[1] - paddleUnitVector[1];
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                smallestDistanceIndex = i;
            }
        }

        if (smallestDistanceIndex !== -1) {
            if (smallestDistanceIndex === this.selectedPaddleIndex) {
                this.selectedPaddleIndex = -1;
            } else {
                this.selectedPaddleIndex = smallestDistanceIndex;
            }
        }
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
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;
        var outerPaddleAngle = Math.PI * (sides - 2) / sides;
        var innerPaddleAngle = Math.PI - outerPaddleAngle;

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
        var paddleHalfWidth = radius * Math.tan(innerPaddleAngle / 2);

        return paddleHalfWidth * 2 - baseSize * this.PADDLE_GAP;
    };

    this.getCollisionPaddles = function() {
        this.returnPaddleLines = [];

        var baseSize = Math.min(canvas.width, canvas.height);
        var ballRadius = baseSize * this.BALL_DIAMETER / 2;
        var paddleThickness = baseSize * this.PADDLE_THICKNESS;
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;

        var outerPaddleAngle = Math.PI * (this.paddleAngles.length - 2) / this.paddleAngles.length;
        var innerPaddleAngle = Math.PI - outerPaddleAngle;

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

        radius -= paddleThickness / 2 + ballRadius;

        var widthAngle = innerPaddleAngle / 2;
        var paddleHalfWidth = radius * Math.tan(widthAngle);


        for (var i = 0; i < this.paddleAngles.length; i++) {
            var angle = this.paddleAngles[i] + this.paddleAddAngle;

            var pos = [canvas.width / 2 + Math.cos(angle) * radius, canvas.height / 2 + Math.sin(angle) * radius];

            var unitVector = [Math.cos(angle), Math.sin(angle)];
            var orthogonalUnitVector = this.getOrthogonalUnitVector(angle);

            var point1 = [
                pos[0] - paddleHalfWidth * orthogonalUnitVector[0],
                pos[1] - paddleHalfWidth * orthogonalUnitVector[1]
            ];
            var point2 = [
                pos[0] + paddleHalfWidth * orthogonalUnitVector[0],
                pos[1] + paddleHalfWidth * orthogonalUnitVector[1]
            ];

            this.returnPaddleLines.push([point1, point2]);
        }

        return this.returnPaddleLines;
    };

    // other functions
    this._getScoreFontSize = function() {
        return canvas.width / 12;
    };

    this.init = function() {
        this.desiredBallSpeed = 0.01;
        this.desiredRotateSpeed = 0.05;
        this.rotateSpeed = 0;

        this.paddleAngles = [
            -Math.PI * 3 / 2,
            -Math.PI * 13 / 6,
            -Math.PI * 17 / 6
        ];

        this.score = 0;
    };
};
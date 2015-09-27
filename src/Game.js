/**
 * Created by Trent on 9/26/2015.
 */

var StaticGame = function() {
    this.BALL_DIAMETER = 0.1;
    this.PADDLE_GAP = 0.12;
    this.PADDLE_THICKNESS = 0.04;
    this.CIRCLE_DIAMETER = 0.85;
    this.ROTATE_ACCEL = 0.00025;
    this.BALL_ACCEL = 0.0005;

    this.score = 0;

    this.ballPos = [0, 0];

    this.paddleAngles = [];
    this.paddleAddAngle = 0;
    this.selectedPaddleIndex = -1;
    this.greenPaddleIndex = -1;

    this.desiredRotateSpeed = 0;
    this.rotateSpeed = 0;

    this.ballAngle = 0;
    this.ballSpeed = 0;
    this.desiredBallSpeed = 0;

    this.lastCollisionPoint = [0, 0];

    this.loser = false;
    this.loserAngle = 0;

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

        var collisionPaddles = this.getCollisionPaddles(baseSize * this.CIRCLE_DIAMETER / 2);
        var outerCollisionPaddles = this.getCollisionPaddles(baseSize * this.CIRCLE_DIAMETER / 2 + baseSize * 0.2);

        var ballPos = [
            canvas.width / 2 + this.ballPos[0] * baseSize,
            canvas.height / 2 + this.ballPos[1] * baseSize
        ];
        var newBallPos = [0, 0];
        var remainingDistance = this.ballSpeed * delta * baseSize;

        var collided = true;
        while (collided) {
            collided = false;
            newBallPos = [
                canvas.width / 2 + this.ballPos[0] * baseSize + remainingDistance * Math.cos(this.ballAngle),
                canvas.height / 2 + this.ballPos[1] * baseSize + remainingDistance * Math.sin(this.ballAngle)
            ];
            var dirUnitVector = [newBallPos[0] - ballPos[0], newBallPos[1] - ballPos[1]];
            var length = Math.sqrt(dirUnitVector[0] * dirUnitVector[0] + dirUnitVector[1] * dirUnitVector[1]);
            dirUnitVector[0] /= length;
            dirUnitVector[1] /= length;

            var ballLine = [ballPos, newBallPos];

            for (var i = 0; i < collisionPaddles.length; i++) {
                var collisionLine = collisionPaddles[i];
                var collisionPolygon = [
                    outerCollisionPaddles[i][1],
                    outerCollisionPaddles[i][0],
                    collisionLine[0],
                    collisionLine[1]
                ];

                var intersectPoint = [0, 0];
                if (MathUtils.intersectLines2D(intersectPoint, ballLine, collisionLine)) {
                    var collisionDX = intersectPoint[0] - this.lastCollisionPoint[0];
                    var collisionDY = intersectPoint[1] - this.lastCollisionPoint[1];
                    if (Math.sqrt(collisionDX * collisionDX + collisionDY * collisionDY) <= 0.01) {
                        continue;
                    }
                    collided = true;
                    var dx = intersectPoint[0] - newBallPos[0];
                    var dy = intersectPoint[1] - newBallPos[1];
                    remainingDistance = Math.sqrt(dx * dx + dy * dy);
                    var angleDiff = MathUtils.radiansBetweenTwoAngles(this.ballAngle, this.paddleAngles[i] + this.paddleAddAngle);
                    this.ballAngle = Math.PI + (this.paddleAngles[i] + this.paddleAddAngle) + angleDiff;

                    this.lastCollisionPoint[0] = intersectPoint[0];
                    this.lastCollisionPoint[1] = intersectPoint[1];
                    ballPos[0] = intersectPoint[0];
                    ballPos[1] = intersectPoint[1];
                    this.ballPos[0] = (intersectPoint[0] - canvas.width / 2) / baseSize;
                    this.ballPos[1] = (intersectPoint[1] - canvas.height / 2) / baseSize;

                    this.collided(i);

                    break;
                } else if (MathUtils.isPointInPolygon2D(collisionPolygon, newBallPos)) {
                    var newBallLine = [
                        [
                            ballLine[0][0] - dirUnitVector[0] * 500,
                            ballLine[0][1] - dirUnitVector[1] * 500
                        ], [
                            ballLine[1][0],
                            ballLine[1][1]
                        ]
                    ];

                    var collisionLineVector = [collisionLine[1][0] - collisionLine[0][0], collisionLine[1][1] - collisionLine[0][1]];
                    var collisionLineLength = Math.sqrt(collisionLineVector[0] * collisionLineVector[0] + collisionLineVector[1] * collisionLineVector[1]);
                    collisionLineVector[0] /= collisionLineLength;
                    collisionLineVector[1] /= collisionLineLength;
                    var newCollisionLine = [
                        [collisionLine[0][0] - collisionLineVector[0], collisionLine[0][1] - collisionLineVector[1]],
                        [collisionLine[1][0] + collisionLineVector[0], collisionLine[1][1] + collisionLineVector[1]]
                    ];

                    if (MathUtils.intersectLines2D(intersectPoint, newBallLine, newCollisionLine)) {
                        var collisionDX = intersectPoint[0] - this.lastCollisionPoint[0];
                        var collisionDY = intersectPoint[1] - this.lastCollisionPoint[1];
                        if (Math.sqrt(collisionDX * collisionDX + collisionDY * collisionDY) <= 0.01) {
                            continue;
                        }
                        collided = true;
                        var dx = intersectPoint[0] - newBallPos[0];
                        var dy = intersectPoint[1] - newBallPos[1];
                        remainingDistance = Math.sqrt(dx * dx + dy * dy);
                        var angleDiff = MathUtils.radiansBetweenTwoAngles(this.ballAngle, this.paddleAngles[i] + this.paddleAddAngle);
                        this.ballAngle = Math.PI + (this.paddleAngles[i] + this.paddleAddAngle) + angleDiff;

                        this.lastCollisionPoint[0] = intersectPoint[0];
                        this.lastCollisionPoint[1] = intersectPoint[1];
                        ballPos[0] = intersectPoint[0];
                        ballPos[1] = intersectPoint[1];
                        this.ballPos[0] = (intersectPoint[0] - canvas.width / 2) / baseSize;
                        this.ballPos[1] = (intersectPoint[1] - canvas.height / 2) / baseSize;

                        this.collided(i);

                        break;
                    }
                }
            }
        }

        this.ballPos[0] = (newBallPos[0] - canvas.width / 2) / baseSize;
        this.ballPos[1] = (newBallPos[1] - canvas.height / 2) / baseSize;
    };

    this.render = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!this.loser) {
            this.renderScore();
        }
        if (this.loser) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-this.paddleAddAngle + this.loserAngle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        this.renderPaddles();
        this.renderBall();

        if (this.loser) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(this.paddleAddAngle - this.loserAngle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        if (this.loser) {
            this.renderLoser();
        }
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

            if (this.selectedPaddleIndex === i) {
                ctx.fillStyle = '#660000';
            } else if (this.greenPaddleIndex === i) {
                ctx.fillStyle = '#006600';
            } else {
                ctx.fillStyle = '#ffffff';
            }

            ctx.beginPath();
            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);
            ctx.lineTo(point3[0], point3[1]);
            ctx.lineTo(point4[0], point4[1]);
            ctx.closePath();
            ctx.fill();
        }
    };

    this.renderLoser = function() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = this._getLoserFontSize() + 'px PirulenRg-Regular';
        ctx.fillText('loser', canvas.width / 2, canvas.height / 2);
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
        if (this.loser) {
            return;
        }

        var clickAngle = Math.atan2(y - canvas.height / 2, x - canvas.width / 2);
        var clickUnitVector = [Math.cos(clickAngle), Math.sin(clickAngle)];

        var smallestDistance = 2147483647;
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

    this.breakPaddle = function(selectedPaddleIndex) {
        var oldSpacing = Math.PI * 2 / this.paddleAngles.length;
        var newSpacing = Math.PI * 2 / (this.paddleAngles.length + 1);
        var diff = newSpacing - oldSpacing;
        for (var k = 1; k < this.paddleAngles.length; k++) {
            this.paddleAngles[k] += k * diff;
        }
        this.paddleAngles.push(this.paddleAngles[0] + newSpacing * this.paddleAngles.length);
        this.PADDLE_GAP *= 0.75;
        this.desiredRotateSpeed += 0.5 / (2 * this.desiredRotateSpeed) / 8000;
        this.desiredBallSpeed += 0.5 / (2 * this.desiredBallSpeed + 0.015) / 8000;
    };

    this.collided = function(index) {
        if (this.loser) {
            return;
        }

        if (this.selectedPaddleIndex !== -1) {
            if (this.selectedPaddleIndex === index) {
                this.breakPaddle(this.selectedPaddleIndex);
                this.score++;
                this.selectedPaddleIndex = -1;
            } else {
                setTimeout(this.init.bind(this), 2000);
                this.loser = true;
                this.loserAngle = this.paddleAddAngle;
                this.greenPaddleIndex = index;
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

    this.getCollisionPaddles = function(radius) {
        this.returnPaddleLines = [];

        var baseSize = Math.min(canvas.width, canvas.height);
        var ballRadius = baseSize * this.BALL_DIAMETER / 2;
        var paddleThickness = baseSize * this.PADDLE_THICKNESS;

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

    this._getLoserFontSize = function() {
        return canvas.width / 5;
    };

    this.init = function() {
        this.ballPos = [0, 0];
        this.ballSpeed = 0;
        this.desiredBallSpeed = 0.01;
        this.rotateSpeed = 0;
        this.desiredRotateSpeed = 0.02;

        this.selectedPaddleIndex = -1;
        this.greenPaddleIndex = -1;

        this.loser = false;

        this.ballAngle = Math.PI * 2 * Math.random();

        this.PADDLE_GAP = 0.12;

        this.paddleAngles = [
            0,
            Math.PI / 2,
            Math.PI,
            Math.PI * 3 / 2
        ];

        this.score = 0;
    };
};
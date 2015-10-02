/**
 * Created by Trent on 9/26/2015.
 */

var StaticGame = function() {
    this.BALL_DIAMETER = 0.1;
    this.PADDLE_GAP = 0.12;
    this.PADDLE_THICKNESS = 0.04;
    this.CIRCLE_DIAMETER = 0.85;
    this.ROTATE_ACCEL = 0.00025;
    this.BALL_ACCEL = 0.0004;

    // the width of the ball glow png divided by the width of the actual ball inside that png
    this.BALL_GLOW_RADIUS_PERCENT = 1.96875;
    this.BALL_GLOW_DECREASE_SPEED = 0.02;

    this.sentScores = false;

    this.sparkles = [];

    this.score = 0;

    this.ballPos = [0, 0];

    this.paddleAngles = [];
    this.paddleAddAngle = 0;
    this.selectedPaddleIndex = -1;

    this.desiredRotateSpeed = 0;
    this.rotateSpeed = 0;

    this.ballAngle = 0;
    this.ballSpeed = 0;
    this.desiredBallSpeed = 0;

    this.firstCollisionPoint = [0, 0];
    this.lastCollisionPoint = [0, 0];

    this.clickToContinueOpacity = 0;

    this.ballGlowOpacity = 0;

    this.screenShakeDesiredAmount = [0, 0];
    this.screenShakeIntensity = 0;
    this.screenShakeAmount = [0, 0];
    this.screenShakeStartRemainingTime = 0;
    this.screenShakeRemainingTime = 0;
    this.screenShakeMaxVel = 1;

    this.loser = false;

    this.showingInstructions = false;

    this.update = function(delta) {
        if (this.showingInstructions) {
            return;
        }
        if (this.clickToContinueOpacity > 0) {
            this.clickToContinueOpacity += 0.03 * delta;
            this.clickToContinueOpacity = Math.min(1.0, this.clickToContinueOpacity);
        }
        if (this.loser) {
            return;
        }

        if (this.desiredRotateSpeed - this.rotateSpeed <= this.ROTATE_ACCEL * delta) {
            this.rotateSpeed = this.desiredRotateSpeed;
        } else {
            this.rotateSpeed += this.ROTATE_ACCEL * delta;
        }

        this.paddleAddAngle += this.rotateSpeed * delta;

        this.updateBall(delta);

        this.checkBallBoundaries();

        this.updateScreenShake(delta);

        for (var i = 0; i < this.sparkles.length; i++) {
            this.sparkles[i].update(delta);
            if (this.sparkles[i].isDead()) {
                this.sparkles.splice(i, 1);
                i--;
            }
        }
    };

    this.updateScreenShake = function(delta) {
        this.screenShakeRemainingTime = Math.max(0, this.screenShakeRemainingTime - delta / Constants.DELTA_SCALE);

        var scaledIntensity = this.screenShakeIntensity * (this.screenShakeRemainingTime / this.screenShakeStartRemainingTime);

        if (this.screenShakeRemainingTime > 0 && this.screenShakeAmount[0] === this.screenShakeDesiredAmount[0] && this.screenShakeAmount[1] === this.screenShakeDesiredAmount[1]) {
            // select a new desired amount
            var currentAngle = Math.atan2(this.screenShakeAmount[1], this.screenShakeAmount[0]);
            var newAngle = currentAngle - Math.PI + Math.random() * Math.PI - Math.PI / 2;

            this.screenShakeDesiredAmount = [
                Math.cos(newAngle) * scaledIntensity,
                Math.sin(newAngle) * scaledIntensity
            ];
        } else if (this.screenShakeRemainingTime === 0 && (this.screenShakeAmount[0] !== 0 || this.screenShakeAmount[1] !== 0)) {
            this.screenShakeDesiredAmount = [0, 0];
        }

        var velDirVector = [
            this.screenShakeDesiredAmount[0] - this.screenShakeAmount[0],
            this.screenShakeDesiredAmount[1] - this.screenShakeAmount[1]
        ];
        var velDirLength = Math.sqrt(velDirVector[0] * velDirVector[0] + velDirVector[1] * velDirVector[1]);
        velDirVector[0] = velDirVector[0] / velDirLength;
        velDirVector[1] = velDirVector[1] / velDirLength;

        var toDesiredDX = this.screenShakeDesiredAmount[0] - this.screenShakeAmount[0];
        var toDesiredDY = this.screenShakeDesiredAmount[1] - this.screenShakeAmount[1];
        var distanceToDesired = Math.sqrt(toDesiredDX * toDesiredDX + toDesiredDY * toDesiredDY);

        if (distanceToDesired < this.screenShakeMaxVel * delta) {
            this.screenShakeAmount[0] = this.screenShakeDesiredAmount[0];
            this.screenShakeAmount[1] = this.screenShakeDesiredAmount[1];
        } else {
            this.screenShakeAmount[0] += velDirVector[0] * this.screenShakeMaxVel * delta;
            this.screenShakeAmount[1] += velDirVector[1] * this.screenShakeMaxVel * delta;
        }
    };

    this.updateBall = function(delta) {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        if (this.desiredBallSpeed - this.ballSpeed <= this.BALL_ACCEL * delta) {
            this.ballSpeed = this.desiredBallSpeed;
        } else {
            this.ballSpeed += this.BALL_ACCEL * delta;
        }

        this.ballGlowOpacity = Math.max(0, this.ballGlowOpacity - this.BALL_GLOW_DECREASE_SPEED * delta);

        var collisionPaddles = this.getCollisionPaddles(baseSize * this.CIRCLE_DIAMETER / 2);
        var outerCollisionPaddles = this.getCollisionPaddles(baseSize * this.CIRCLE_DIAMETER / 2 + baseSize * 0.2);

        var ballPos = [
            window.innerWidth / 2 + this.ballPos[0] * baseSize,
            window.innerHeight / 2 + this.ballPos[1] * baseSize
        ];
        var newBallPos = [0, 0];
        var remainingDistance = this.ballSpeed * delta * baseSize;

        var collidedIndex = -1;
        var collided = true;
        while (collided) {
            collided = false;

            var closestCollisionDistance = 2147483647;
            var closestCollisionIndex = -1;
            var closestCollisionRemainingDistance = remainingDistance;
            var closestCollisionPoint = [0, 0];
            var closestCollisionResultAngle = 0;

            newBallPos = [
                window.innerWidth / 2 + this.ballPos[0] * baseSize + closestCollisionRemainingDistance * Math.cos(this.ballAngle),
                window.innerHeight / 2 + this.ballPos[1] * baseSize + closestCollisionRemainingDistance * Math.sin(this.ballAngle)
            ];
            var ballDirUnitVector = [newBallPos[0] - ballPos[0], newBallPos[1] - ballPos[1]];
            var length = Math.sqrt(ballDirUnitVector[0] * ballDirUnitVector[0] + ballDirUnitVector[1] * ballDirUnitVector[1]);
            ballDirUnitVector[0] /= length;
            ballDirUnitVector[1] /= length;

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

                    // check closest collision stuff
                    var closestDistanceDX = intersectPoint[0] - window.innerWidth / 2;
                    var closestDistanceDY = intersectPoint[1] - window.innerHeight / 2;
                    var closestDistance = Math.sqrt(closestDistanceDX * closestDistanceDX + closestDistanceDY * closestDistanceDY);
                    if (closestDistance >= closestCollisionDistance) {
                        continue;
                    }
                    // closest distance
                    closestCollisionDistance = closestDistance;

                    // collision point
                    closestCollisionPoint[0] = intersectPoint[0];
                    closestCollisionPoint[1] = intersectPoint[1];

                    // angle
                    var angleDiff = MathUtils.radiansBetweenTwoAngles(this.ballAngle, this.paddleAngles[i] + this.paddleAddAngle);
                    closestCollisionResultAngle = Math.PI + (this.paddleAngles[i] + this.paddleAddAngle) + angleDiff;

                    // remaining distance
                    var remainingDX = intersectPoint[0] - newBallPos[0];
                    var remainingDY = intersectPoint[1] - newBallPos[1];
                    closestCollisionRemainingDistance = Math.sqrt(remainingDX * remainingDX + remainingDY * remainingDY);

                    // collision paddle index
                    closestCollisionIndex = i;

                    break;
                } else if (MathUtils.isPointInPolygon2D(collisionPolygon, newBallPos)) {
                    var newBallLine = [
                        [
                            ballLine[0][0] - ballDirUnitVector[0] * 500,
                            ballLine[0][1] - ballDirUnitVector[1] * 500
                        ], [
                            ballLine[1][0] + ballDirUnitVector[0] * 500,
                            ballLine[1][1] + ballDirUnitVector[1] * 500
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

                    // check if elongated ball line intersects with elongated collision line
                    if (MathUtils.intersectLines2D(intersectPoint, newBallLine, newCollisionLine)) {
                        var collisionDX = intersectPoint[0] - this.lastCollisionPoint[0];
                        var collisionDY = intersectPoint[1] - this.lastCollisionPoint[1];
                        if (Math.sqrt(collisionDX * collisionDX + collisionDY * collisionDY) <= 0.01) {
                            continue;
                        }
                        collided = true;

                        // check closest distance stuff
                        var closestDistanceDX = intersectPoint[0] - window.innerWidth / 2;
                        var closestDistanceDY = intersectPoint[1] - window.innerHeight / 2;
                        var closestDistance = Math.sqrt(closestDistanceDX * closestDistanceDX + closestDistanceDY * closestDistanceDY);
                        if (closestDistance >= closestCollisionDistance) {
                            continue;
                        }
                        // closest distance
                        closestCollisionDistance = closestDistance;

                        // collision point
                        closestCollisionPoint[0] = intersectPoint[0];
                        closestCollisionPoint[1] = intersectPoint[1];

                        // angle
                        var angleDiff = MathUtils.radiansBetweenTwoAngles(this.ballAngle, this.paddleAngles[i] + this.paddleAddAngle);
                        closestCollisionResultAngle = Math.PI + (this.paddleAngles[i] + this.paddleAddAngle) + angleDiff;

                        // remaining distance
                        var remainingDX = intersectPoint[0] - newBallPos[0];
                        var remainingDY = intersectPoint[1] - newBallPos[1];
                        closestCollisionRemainingDistance = Math.sqrt(remainingDX * remainingDX + remainingDY * remainingDY);

                        // collision paddle index
                        closestCollisionIndex = i;

                        break;
                    }
                }
            }

            if (closestCollisionDistance !== 2147483647) {
                this.ballAngle = closestCollisionResultAngle;
                this.lastCollisionPoint[0] = closestCollisionPoint[0];
                this.lastCollisionPoint[1] = closestCollisionPoint[1];
                ballPos[0] = closestCollisionPoint[0] + Math.cos(this.ballAngle) * closestCollisionRemainingDistance;
                ballPos[1] = closestCollisionPoint[1] + Math.sin(this.ballAngle) * closestCollisionRemainingDistance;
                this.ballPos[0] = (ballPos[0] - window.innerWidth / 2) / baseSize;
                this.ballPos[1] = (ballPos[1] - window.innerHeight / 2) / baseSize;

                if (collidedIndex === -1) {
                    this.firstCollisionPoint[0] = this.lastCollisionPoint[0];
                    this.firstCollisionPoint[1] = this.lastCollisionPoint[1];
                    collidedIndex = closestCollisionIndex;
                }
            }
        }

        if (collidedIndex >= 0) {
            this.collided(collidedIndex);
        }

        // check if new position is still out of bounds, if so project to line
        for (var i = 0; i < collisionPaddles.length; i++) {
            var collisionLine = collisionPaddles[i];
            var collisionPolygon = [
                outerCollisionPaddles[i][1],
                outerCollisionPaddles[i][0],
                collisionLine[0],
                collisionLine[1]
            ];
            if (MathUtils.isPointInPolygon2D(collisionPolygon, newBallPos)) {
                var returnPoint = [0, 0];
                MathUtils.nearestLinePoint2D(returnPoint, collisionLine, newBallPos);

                newBallPos[0] = returnPoint[0];
                newBallPos[1] = returnPoint[1];
            }
        }

        this.ballPos[0] = (newBallPos[0] - window.innerWidth / 2) / baseSize;
        this.ballPos[1] = (newBallPos[1] - window.innerHeight / 2) / baseSize;

        if (this.loser) {
            this.ballPos[0] = (this.firstCollisionPoint[0] - window.innerWidth / 2) / baseSize;
            this.ballPos[1] = (this.firstCollisionPoint[1] - window.innerHeight / 2) / baseSize;
        }
    };

    this.shakeScreen = function(intensity) {
        this.screenShakeIntensity = intensity / 50;
        this.screenShakeMaxVel = intensity / 100;
        this.screenShakeRemainingTime = 300 * (this.screenShakeIntensity / (1 / 50));
        this.screenShakeStartRemainingTime = this.screenShakeRemainingTime;
    };

    this.checkBallBoundaries = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var ballPosX = this.ballPos[0] * baseSize + window.innerWidth / 2;
        var ballPosY = this.ballPos[1] * baseSize + window.innerHeight / 2;
        if (ballPosX < 0 || ballPosX > window.innerWidth || ballPosY < 0 || ballPosY > window.innerHeight) {
            this.ballPos[0] = 0;
            this.ballPos[1] = 0;
        }
    };

    this.render = function() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var currentScreenShake = [this.screenShakeAmount[0], this.screenShakeAmount[1]];

        ctx.translate(currentScreenShake[0] * baseSize, currentScreenShake[1] * baseSize);

        if (!this.loser) {
            this.renderScore();
        }

        for (var i = 0; i < this.sparkles.length; i++) {
            this.sparkles[i].render();
        }

        this.renderPaddles();
        this.renderBall();

        if (this.loser) {
            ctx.globalAlpha = this.clickToContinueOpacity * 0.8;
            ctx.fillStyle = '#' + Constants.COLOR_DARK_GRAY;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalAlpha = 1;
            this.renderLoser();
            this.renderLoserScore();
            this.renderBackButton();
            if (!this.sentScores) {
                this.renderSubmitButton();
            }
        }
        if (this.clickToContinueOpacity > 0) {
            this.renderClickToContinue();
        }

        ctx.translate(-currentScreenShake[0] * baseSize, -currentScreenShake[1] * baseSize);

        if (globalScoreDialog.style.display === 'block') {
            ctx.globalAlpha = this.clickToContinueOpacity * 0.8;
            ctx.fillStyle = '#' + Constants.COLOR_DARK_GRAY;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalAlpha = 1;
        }

        if (this.showingInstructions) {
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#' + Constants.COLOR_DARK_GRAY;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.globalAlpha = 1;

            Instructions.renderOverlayWithClickToContinue();
        }
    };

    this.renderBackButton = function() {
        ctx.globalAlpha = this.clickToContinueOpacity;

        ButtonManager.renderBackButton();

        ctx.globalAlpha = 1;
    };

    this.renderSubmitButton = function() {
        ctx.globalAlpha = this.clickToContinueOpacity;

        ButtonManager.renderSubmitButton();

        ctx.globalAlpha = 1;
    };

    this.renderLoserScore = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var padding = baseSize * 0.1;

        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = (this._getLoserFontSize() / 5) + 'px PirulenRg-Regular';
        ctx.fillText('score:   ', window.innerWidth / 2, window.innerHeight / 2 + padding);

        ctx.textAlign = 'left';
        ctx.font = (this._getLoserFontSize() / 5) + 'px PirulenRg-Regular';
        ctx.fillText('' + this.score, window.innerWidth / 2 + window.innerWidth / 10, window.innerHeight / 2 + padding - window.innerWidth / 1600);
    };

    this.renderBall = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var ballRadius = baseSize * this.BALL_DIAMETER / 2;

        ctx.fillStyle = '#ffffff';

        if (this.ballGlowOpacity > 0) {
            ctx.globalAlpha = this.ballGlowOpacity;
            var diameter = ballRadius * 2 * this.BALL_GLOW_RADIUS_PERCENT;
            ctx.drawImage(
                globalBallGlow,
                window.innerWidth / 2 + this.ballPos[0] * baseSize - diameter / 2,
                window.innerHeight / 2 + this.ballPos[1] * baseSize - diameter / 2,
                diameter,
                diameter
            );
            ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(window.innerWidth / 2 + this.ballPos[0] * baseSize, window.innerHeight / 2 + this.ballPos[1] * baseSize, ballRadius, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    };

    this.renderPaddles = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var paddleThickness = baseSize * this.PADDLE_THICKNESS;
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;

        var outerPaddleAngle = Math.PI * (this.paddleAngles.length - 2) / this.paddleAngles.length;
        var innerPaddleAngle = Math.PI - outerPaddleAngle;

        var mouseOverIndex = this._getPaddleByMousePos(GameInput.mousePos[0], GameInput.mousePos[1]);
        if (this.loser) {
            mouseOverIndex = -1;
        }

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

            var pos = [window.innerWidth / 2 + Math.cos(angle) * radius, window.innerHeight / 2 + Math.sin(angle) * radius];

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

            var STROKE_WIDTH = 4;
            var strokePoint1 = [
                pos[0] - paddleWidth / 2 * orthogonalUnitVector[0] - orthogonalUnitVector[0] * STROKE_WIDTH - paddleThickness / 2 * unitVector[0] - unitVector[0] * STROKE_WIDTH,
                pos[1] - paddleWidth / 2 * orthogonalUnitVector[1] - orthogonalUnitVector[1] * STROKE_WIDTH - paddleThickness / 2 * unitVector[1] - unitVector[1] * STROKE_WIDTH
            ];
            var strokePoint2 = [
                pos[0] + paddleWidth / 2 * orthogonalUnitVector[0] + orthogonalUnitVector[0] * STROKE_WIDTH - paddleThickness / 2 * unitVector[0] - unitVector[0] * STROKE_WIDTH,
                pos[1] + paddleWidth / 2 * orthogonalUnitVector[1] + orthogonalUnitVector[1] * STROKE_WIDTH - paddleThickness / 2 * unitVector[1] - unitVector[1] * STROKE_WIDTH
            ];
            var strokePoint3 = [
                pos[0] + paddleWidth / 2 * orthogonalUnitVector[0] + orthogonalUnitVector[0] * STROKE_WIDTH + paddleThickness / 2 * unitVector[0] + unitVector[0] * STROKE_WIDTH,
                pos[1] + paddleWidth / 2 * orthogonalUnitVector[1] + orthogonalUnitVector[1] * STROKE_WIDTH + paddleThickness / 2 * unitVector[1] + unitVector[1] * STROKE_WIDTH
            ];
            var strokePoint4 = [
                pos[0] - paddleWidth / 2 * orthogonalUnitVector[0] - orthogonalUnitVector[0] * STROKE_WIDTH + paddleThickness / 2 * unitVector[0] + unitVector[0] * STROKE_WIDTH,
                pos[1] - paddleWidth / 2 * orthogonalUnitVector[1] - orthogonalUnitVector[1] * STROKE_WIDTH + paddleThickness / 2 * unitVector[1] + unitVector[1] * STROKE_WIDTH
            ];

            if (this.selectedPaddleIndex === i) {
                ctx.fillStyle = '#ffffff';
            } else if (mouseOverIndex === i) {
                var color = this._getPaddleColor(i);
                var r = color[0];
                var g = color[1];
                var b = color[2];
                var colorScale = 1.5;
                ctx.fillStyle = 'rgb(' + Math.floor(Math.min(255, r * colorScale)) + ', ' + Math.floor(Math.min(255, g * colorScale)) + ', ' + Math.floor(Math.min(255, b * colorScale)) + ')';
            } else {
                var color = this._getPaddleColor(i);
                ctx.fillStyle = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
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
        ctx.textBaseline = 'alphabetic';
        ctx.font = this._getLoserFontSize() + 'px PirulenRg-Regular';
        ctx.fillText('loser', window.innerWidth / 2, window.innerHeight / 2);
    };

    this.renderClickToContinue = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var padding = baseSize * 0.1;

        var fontHeight = this._getLoserFontHeight() / 5;

        ctx.fillStyle = 'rgba(255, 255, 255, ' + this.clickToContinueOpacity + ')';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = (this._getLoserFontSize() / 5) + 'px PirulenRg-Regular';
        ctx.fillText('tap to try again', window.innerWidth / 2, window.innerHeight / 2 + padding + fontHeight);
    };

    this.renderScore = function() {
        ctx.fillStyle = '#' + Constants.COLOR_GRAY;
        ctx.textAlign = window.innerHeight > window.innerWidth ? 'center' : 'left';
        ctx.textBaseline = window.innerHeight > window.innerWidth ? 'top' : 'middle';
        ctx.font = this._getScoreFontSize() + 'px PirulenRg-Regular';

        ctx.fillText('' + this.score,
            window.innerHeight > window.innerWidth ? window.innerWidth / 2 : window.innerWidth * 0.1,
            window.innerHeight > window.innerWidth ? window.innerHeight * 0.1 : window.innerHeight / 2);
    };

    this.click = function(x, y) {
        if (TransitionManager.isTransitioning()) {
            return;
        }

        if (this.showingInstructions) {
            this.showingInstructions = false;
            return;
        }

        if (globalScoreDialog.style.display === 'block') {
            globalScoreDialog.style.display = 'none';
            return;
        }

        if (this.loser) {
            if (this.clickToContinueOpacity > 0) {
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
                if (ButtonManager.isPointInsideSubmitButton(x, y)) {
                    globalScoreDialog.style.display = 'block';
                    return;
                }

                this.init();
            }
            return;
        }

        var smallestDistanceIndex = this._getPaddleByMousePos(x, y);

        if (smallestDistanceIndex !== -1) {
            if (smallestDistanceIndex === this.selectedPaddleIndex) {
                this.selectedPaddleIndex = -1;
            } else {
                this.selectedPaddleIndex = smallestDistanceIndex;
            }
        }
    };

    this._getPaddleByMousePos = function(x, y) {
        if (x === -1 && y === -1 || TransitionManager.isTransitioning() || this.showingInstructions) {
            return -1;
        }
        var clickAngle = Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2);
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

        return smallestDistanceIndex;
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
    };

    this.increaseSpeed = function() {
        this.desiredRotateSpeed += 0.000003 / Math.pow(this.desiredRotateSpeed, 1.2) + 0.002;
        this.desiredBallSpeed += 0.0000625 / (2 * Math.pow(this.desiredBallSpeed, 1.2) + 0.02);
    };

    this.collided = function(index) {
        if (this.loser) {
            return;
        }

        if (this.selectedPaddleIndex !== -1) {
            if (this.selectedPaddleIndex === index) {
                this.createSparkles(index);
                if (this.paddleAngles.length < 12) {
                    this.breakPaddle(this.selectedPaddleIndex);
                }
                this.increaseSpeed();
                this.ballGlowOpacity = 1;
                // desired value is 0.6 when ball speed is 0.01
                this.shakeScreen(Math.pow(this.ballSpeed, 1.2) * 150.713185891);
                this.score++;
                this.selectedPaddleIndex = -1;
            } else {
                if (window.AdInterface) {
                    AdInterface.showAd();
                } else {
                    AdInitialize.show();
                    AdInitialize.refreshAd();
                }
                this.loser = true;
                this.loserStartTime = Date.now();
                setTimeout(this.clickToContinue.bind(this), 1600);
            }
        }
    };

    this.createSparkles = function(index) {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var radius = baseSize * this.CIRCLE_DIAMETER / 2;

        var collisionPaddles = this.getCollisionPaddles(radius);
        var paddle = collisionPaddles[index];

        var dir = [paddle[1][0] - paddle[0][0], paddle[1][1] - paddle[1][0]];
        var start = paddle[0];

        for (var i = 0; i < 200; i++) {
            var dist = Math.random();

            var pos = [start[0] + dir[0] * dist, start[1] + dir[1] * dist];
            this.sparkles.push(new Sparkle(this.ballPos[0], this.ballPos[1]));
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
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
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

        var baseSize = Math.min(window.innerWidth, window.innerHeight);
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

            var pos = [window.innerWidth / 2 + Math.cos(angle) * radius, window.innerHeight / 2 + Math.sin(angle) * radius];

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
        return window.innerWidth / 12;
    };

    this._getLoserFontHeight = function() {
        return window.innerWidth * 0.25;
    };

    this._getLoserFontSize = function() {
        return window.innerWidth / 5;
    };

    // dont know if this is accurate
    this._getLoserFontHeight = function() {
        return window.innerWidth * 0.25;
    };

    this._getPaddleColor = function(index) {
        var brightness = 0.71;
        var saturation = 0.66;
        var hue = ((index * 150) % 360) / 360;

        return GuiUtils.hslToRgb(hue, saturation, brightness);
    };

    this.clickToContinue = function() {
        this.clickToContinueOpacity = 0.01;
    };

    this.init = function() {
        if (window.AdInterface) {
            AdInterface.hideAd();
        } else {
            AdInitialize.hide();
        }

        if (Instructions.haveSeenInstructions === '0') {
            this.showingInstructions = true;
        }

        this.ballPos = [0, 0];
        this.ballSpeed = 0;
        this.desiredBallSpeed = 0.01;
        this.rotateSpeed = 0;
        this.desiredRotateSpeed = 0.02;

        this.selectedPaddleIndex = -1;

        this.ballAngle = Math.PI * 2 * Math.random();

        this.loser = false;
        this.clickToContinueOpacity = 0;

        this.PADDLE_GAP = 0.12;

        this.ballGlowOpacity = 0;

        this.sentScores = false;

        this.sparkles = [];

        this.paddleAngles = [
            Math.PI * 3 / 2 - Math.PI / 3,
            Math.PI * 13 / 6 - Math.PI / 3,
            Math.PI * 17 / 6 - Math.PI / 3
        ];

        this.score = 0;
    };
};

/**
 * Created by Trent on 9/27/2015.
 */

var Sparkle = function(x, y) {
    this.pos = [x, y];
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Game.ballSpeed * 1.5 + Math.random() * 0.02;

    this.update = function(delta) {
        this.pos[0] += Math.cos(this.angle) * delta * this.speed;
        this.pos[1] += Math.sin(this.angle) * delta * this.speed;
    };

    this.render = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var radius = baseSize * 0.01;
        ctx.drawImage(globalSparkle, this.pos[0] * baseSize + window.innerWidth / 2 - radius, this.pos[1] * baseSize + window.innerHeight / 2 - radius, radius * 2, radius * 2);
    };

    this.isDead = function() {
        var baseSize = Math.min(window.innerWidth, window.innerHeight);
        var radius = baseSize * 0.01;
        var x = this.pos[0] * baseSize + window.innerWidth / 2 - radius;
        var y = this.pos[1] * baseSize + window.innerHeight / 2 - radius;

        if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
            return true;
        }
        return false;
    };
};
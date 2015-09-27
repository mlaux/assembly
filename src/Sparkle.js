/**
 * Created by Trent on 9/27/2015.
 */

var Sparkle = function(x, y) {
    this.pos = [x, y];
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.01 + Math.random() * 0.01;

    this.update = function(delta) {
        this.pos[0] += Math.cos(this.angle) * delta * this.speed;
        this.pos[1] += Math.sin(this.angle) * delta * this.speed;
    };

    this.render = function() {
        var baseSize = Math.min(canvas.width, canvas.height);
        var radius = baseSize * 0.01;
        console.log(this.pos[0] * baseSize - radius, this.pos[1] * baseSize - radius);
        ctx.drawImage(globalSparkle, this.pos[0] * baseSize + canvas.width / 2 - radius, this.pos[1] * baseSize + canvas.height / 2 - radius, radius * 2, radius * 2);
    };

    this.isDead = function() {
        var baseSize = Math.min(canvas.width, canvas.height);
        var radius = baseSize * 0.01;
        var x = this.pos[0] * baseSize + canvas.width / 2 - radius;
        var y = this.pos[1] * baseSize + canvas.height / 2 - radius;

        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            return true;
        }
        return false;
    };
};
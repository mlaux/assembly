/**
 * Created by Trent on 9/26/2015.
 */

var StaticGameInput = function() {
    this.init = function() {
        canvas.addEventListener('mousedown', function(e) {
            console.log(e.clientX, e.clientY);
        });
    };
};
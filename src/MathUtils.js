/**
 * Created by Trent on 9/26/2015.
 */

var StaticMathUtils = function() {
    /**
     * Determines whether or not two 2d lines intersect and returns the intersect point
     * @param returnPoint (optional)
     * @param line1
     * @param line2
     * @returns {Boolean} whether or not the two lines intersect
     */
    this.intersectLines2D = function(returnPoint, line1, line2) {
        var x1 = line1[0][0];
        var y1 = line1[0][1];
        var x2 = line1[1][0];
        var y2 = line1[1][1];
        var x3 = line2[0][0];
        var y3 = line2[0][1];
        var x4 = line2[1][0];
        var y4 = line2[1][1];

        var d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (d == 0) {
            return false;
        }

        var yd = y1 - y3;
        var xd = x1 - x3;
        var ua = ((x4 - x3) * yd - (y4 - y3) * xd) / d;
        if (ua < 0 || ua > 1) {
            return false;
        }

        var ub = ((x2 - x1) * yd - (y2 - y1) * xd) / d;
        if (ub < 0 || ub > 1) {
            return false;
        }

        if (returnPoint != null && returnPoint.length != 0) {
            returnPoint[0] = x1 + (x2 - x1) * ua;
            returnPoint[1] = y1 + (y2 - y1) * ua;
        }

        return true;
    };

    this.radiansBetweenTwoAngles = function(angleFrom, angleTo) {
        angleFrom %= Math.PI * 2;
        angleTo %= Math.PI * 2;
        if (angleFrom > Math.PI) {
            angleFrom = -(Math.PI * 2 - angleFrom);
        }
        if (angleTo > Math.PI) {
            angleTo = -(Math.PI * 2 - angleTo);
        }

        if (angleTo < angleFrom) {
            if (angleFrom - angleTo > Math.PI) {
                return Math.PI * 2 - (angleFrom - angleTo);
            } else {
                return -(angleFrom - angleTo);
            }
        } else {
            if (angleTo - angleFrom > Math.PI) {
                return -(Math.PI * 2 - (angleTo - angleFrom));
            } else {
                return angleTo - angleFrom;
            }
        }
    }
};
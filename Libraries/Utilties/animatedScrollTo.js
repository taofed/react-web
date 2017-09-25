// Modified from https://github.com/madebysource/animated-scrollto/blob/master/animatedScrollTo.js

(function (window) {
    var requestAnimFrame = (function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};})();

    var easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    var animatedScrollTo = function (element, to, duration, callback) {
        var startY = element.scrollTop;
        var startX = element.scrollLeft;
        var changeY = to.y - startY;
        var changeX = to.x - startX;
        var animationStart = +new Date();
        var animating = true;
        var lastposX = null;
        var lastposY = null;

        var animateScroll = function() {
            if (!animating) {
                return;
            }
            requestAnimFrame(animateScroll);
            var now = +new Date();
            var valY = Math.floor(easeInOutQuad(now - animationStart, startY, changeY, duration));
            var valX = Math.floor(easeInOutQuad(now - animationStart, startX, changeX, duration));

            // If last position is not element's scroll position, maybe user was scrolled.
            if (lastposY === null ||
                (lastposY === element.scrollTop && lastposX === element.scrollLeft)) {
                lastposY = valY;
                lastposX = valX;
                element.scrollTop = valY;
                element.scrollLeft = valX;
            } else {
                animating = false;
            }
            if (now > animationStart + duration) {
                element.scrollTop = to.y;
                element.scrollLeft = to.x;
                animating = false;
                if (callback) { callback(); }
            }
        };
        requestAnimFrame(animateScroll);
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = animatedScrollTo;
    } else {
        window.animatedScrollTo = animatedScrollTo;
    }
})(window);

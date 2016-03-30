/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
var markit;
(function (markit) {
    var Paper = (function () {
        function Paper(svg) {
            this.svg = svg;
            this.snap = Snap(svg);
            this.svg.onmousedown = this.onmousedown.bind(this);
            this.svg.onmousemove = this.onmousemove.bind(this);
            this.svg.onmouseup = this.onmouseup.bind(this);
            this.svg.onmouseout = this.onmouseout.bind(this);
            this.activeElement = null;
            this.leftMouseButtonDown = false;
            this.elements = new Array();
        }
        Paper.prototype.onmousedown = function (e) {
            if (e.which == 1) {
                if (this.toolSettings.commandMode == markit.CommandMode.Line) {
                    this.leftMouseButtonDown = true;
                    console.log("lmb: " + this.toolSettings.commandMode);
                    this.activeElement = new markit.Line(this.snap, null);
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
            }
        };
        Paper.prototype.onmousemove = function (e) {
            if (this.leftMouseButtonDown) {
                if (this.toolSettings.commandMode == markit.CommandMode.Line) {
                    console.log("mouse move - draw line");
                    if (this.activeElement) {
                        this.activeElement.resize(this.toLocalCoords(e.clientX, e.clientY), false);
                    }
                }
            }
        };
        Paper.prototype.onmouseup = function (e) {
            this.leftMouseButtonDown = false;
            if (this.activeElement === undefined || this.activeElement === null) {
                return;
            }
            this.elements.push(this.activeElement);
            this.activeElement = null;
        };
        Paper.prototype.onmouseout = function (e) {
            console.log("mouse out: " + e.target.id + ", x: " + e.clientX + ", y: " + e.clientY);
            // containsPoint rewquired as chrome was misfiring event while still in the canvas
            if (this.containsPoint(e.clientX, e.clientY)) {
                console.log("mouseout misfire.");
                e.stopPropagation();
                return;
            }
            if (this.leftMouseButtonDown) {
                this.leftMouseButtonDown = false;
                if (this.activeElement) {
                    this.activeElement.remove();
                    this.activeElement = null;
                }
            }
        };
        Paper.prototype.toLocalCoords = function (x, y) {
            var rect = this.svg.getBoundingClientRect();
            console.log("rect: left: " + rect.left + ", top: " + rect.top + ", right: " + rect.right + ", bottom: " + rect.bottom);
            var localX = Math.round(x - rect.left);
            var localY = Math.round(y - rect.top);
            console.log("local coords: {x: " + localX + ", y: " + localY + "}}");
            return {
                x: localX,
                y: localY
            };
        };
        Paper.prototype.containsPoint = function (x, y) {
            var rect = this.svg.getBoundingClientRect();
            if (rect.left < x && x < rect.right && rect.top < y && y < rect.bottom) {
                return true;
            }
            return false;
        };
        return Paper;
    })();
    markit.Paper = Paper;
})(markit || (markit = {}));
//# sourceMappingURL=Paper.js.map
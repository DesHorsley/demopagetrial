/// <reference path="snap/snapsvg.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markit;
(function (markit) {
    var Shape = (function () {
        function Shape(theSurface, attr) {
            this.surface = theSurface;
            if (attr !== undefined && attr) {
                this.attributes = attr;
            }
            else {
                this.attributes = {
                    stroke: "#000",
                    strokeWidth: 1
                };
            }
        }
        Shape.prototype.remove = function () {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        };
        return Shape;
    })();
    markit.Shape = Shape;
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(theSurface, attr) {
            _super.call(this, theSurface, attr);
        }
        Line.prototype.resize = function (coords, fromOrigin) {
            if (fromOrigin === void 0) { fromOrigin = false; }
            var previousCoords;
            if (fromOrigin) {
                previousCoords = this.origin;
                this.origin = coords;
            }
            else {
                previousCoords = this.endpoint;
                this.endpoint = coords;
            }
            if (this.element === undefined || this.element === null) {
                this.element = this.surface.line(this.origin.x, this.origin.y, this.endpoint.x, this.endpoint.y);
                this.element.attr(this.attributes);
            }
            else {
                this.element.attr({ x2: this.endpoint.x, y2: this.endpoint.y });
            }
        };
        return Line;
    })(Shape);
    markit.Line = Line;
})(markit || (markit = {}));
//# sourceMappingURL=Shape.js.map
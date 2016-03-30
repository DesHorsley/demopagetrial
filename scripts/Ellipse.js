/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
/// <reference path="toolSettings.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markit;
(function (markit) {
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(theSurface, attr) {
            _super.call(this, theSurface, attr);
            this.flipX = false;
            this.flipY = false;
        }
        Ellipse.prototype.resize = function (coords, fromOrigin) {
            if (fromOrigin === void 0) { fromOrigin = false; }
            if (fromOrigin) {
                this.origin = coords;
            }
            else {
                this.endpoint = coords;
            }
            if (this.element === undefined || this.element == null) {
                this.element = this.surface.ellipse(this.origin.x, this.origin.y, 1, 1);
                this.element.attr(this.attributes);
            }
            else {
                var x, y, w, h;
                if (this.endpoint.x < this.origin.x) {
                    this.flipX = true;
                    x = this.endpoint.x;
                }
                else {
                    this.flipX = false;
                    x = this.origin.x;
                }
                if (this.endpoint.y < this.origin.y) {
                    this.flipY = true;
                    y = this.endpoint.y;
                }
                else {
                    this.flipY = false;
                    y = this.origin.y;
                }
                w = Math.abs(this.endpoint.x - this.origin.x);
                h = Math.abs(this.endpoint.y - this.origin.y);
                this.element.attr({
                    x: x,
                    y: y,
                    rx: w,
                    ry: h
                });
            }
        };
        Ellipse.prototype.flipCoords = function () {
            if (this.flipX) {
                var x = this.origin.x;
                this.origin.x = this.endpoint.x;
                this.endpoint.x = x;
            }
            if (this.flipY) {
                var y = this.origin.y;
                this.origin.y = this.endpoint.y;
                this.endpoint.y = y;
            }
        };
        return Ellipse;
    })(markit.Shape);
    markit.Ellipse = Ellipse;
})(markit || (markit = {}));
//# sourceMappingURL=Ellipse.js.map
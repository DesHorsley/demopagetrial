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
/// <reference path="ToolSettingsObserver.ts" />
/// <reference path="ToolsManager.ts" />
var markit;
(function (markit) {
    var MarkitEditor = (function () {
        function MarkitEditor() {
        }
        MarkitEditor.prototype.init = function (svgId) {
            var svg = document.getElementsByTagName("svg")[0];
            this.paper = new markit.Paper(svg);
            this.toolsManager = new markit.ToolsManager(this);
            this.toolsManager.init(svg);
        };
        MarkitEditor.prototype.setToolSettings = function (toolSettings) {
            this.paper.toolSettings = toolSettings;
            console.log("command: " + toolSettings.commandMode);
        };
        return MarkitEditor;
    })();
    markit.MarkitEditor = MarkitEditor;
})(markit || (markit = {}));
//# sourceMappingURL=MarkitEditor.js.map
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="ToolSettings.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Rectangle.ts" />
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
            if (this.toolSettings === undefined || this.toolSettings == null) {
                return; // toolsettings not set
            }
            if (e.which == 1) {
                console.log("lmb: " + this.toolSettings.commandMode);
                if (this.toolSettings.commandMode == markit.CommandMode.Line) {
                    this.leftMouseButtonDown = true;
                    this.activeElement = new markit.Line(this.snap, null);
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
                else if (this.toolSettings.commandMode == markit.CommandMode.Rectangle) {
                    this.leftMouseButtonDown = true;
                    this.activeElement = new markit.Rectangle(this.snap, { stroke: this.toolSettings.stroke, fill: this.toolSettings.fill, strokeWidth: this.toolSettings.strokeWidth });
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
                else if (this.toolSettings.commandMode == markit.CommandMode.Ellipse) {
                    this.leftMouseButtonDown = true;
                    this.activeElement = new markit.Ellipse(this.snap, { stroke: this.toolSettings.stroke, fill: this.toolSettings.fill, strokeWidth: this.toolSettings.strokeWidth });
                    var coords = this.toLocalCoords(e.clientX, e.clientY);
                    this.activeElement.origin = coords;
                    this.activeElement.resize(coords, false);
                }
            }
        };
        Paper.prototype.onmousemove = function (e) {
            if (this.leftMouseButtonDown) {
                if (this.toolSettings.commandMode == markit.CommandMode.Line ||
                    this.toolSettings.commandMode == markit.CommandMode.Rectangle ||
                    this.toolSettings.commandMode == markit.CommandMode.Ellipse) {
                    console.log("mouse move - draw " + this.toolSettings.commandMode);
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
            if (this.activeElement instanceof markit.Rectangle) {
                this.activeElement.flipCoords();
            }
            else if (this.activeElement instanceof markit.Ellipse) {
                this.activeElement.flipCoords();
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
/// <reference path="snap/snapsvg.d.ts" />
/// <reference path="Shape.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markit;
(function (markit) {
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        function Rectangle(theSurface, attr) {
            _super.call(this, theSurface, attr);
            this.flipX = false;
            this.flipY = false;
        }
        Rectangle.prototype.resize = function (coords, fromOrigin) {
            if (fromOrigin === void 0) { fromOrigin = false; }
            if (fromOrigin) {
                this.origin = coords;
            }
            else {
                this.endpoint = coords;
            }
            if (this.element === undefined || this.element === null) {
                this.element = this.surface.rect(this.origin.x, this.origin.y, 1, 1);
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
                    width: w,
                    height: h
                });
            }
        };
        Rectangle.prototype.flipCoords = function () {
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
        return Rectangle;
    })(markit.Shape);
    markit.Rectangle = Rectangle;
})(markit || (markit = {}));
//# sourceMappingURL=Rectangle.js.map
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
var markit;
(function (markit) {
    (function (CommandMode) {
        CommandMode[CommandMode["Select"] = 0] = "Select";
        CommandMode[CommandMode["Line"] = 1] = "Line";
        CommandMode[CommandMode["Rectangle"] = 2] = "Rectangle";
        CommandMode[CommandMode["Ellipse"] = 3] = "Ellipse";
    })(markit.CommandMode || (markit.CommandMode = {}));
    var CommandMode = markit.CommandMode;
    var ToolSettings = (function () {
        function ToolSettings() {
            this.commandMode = CommandMode.Select;
            this.width = 1;
            this.height = 1;
            this.strokeWidth = 1;
            this.stroke = "#000";
            this.fill = "none";
        }
        return ToolSettings;
    })();
    markit.ToolSettings = ToolSettings;
})(markit || (markit = {}));
//# sourceMappingURL=toolSettings.js.map
/// <reference path="ToolSettings.ts" />
//# sourceMappingURL=ToolSettingsObserver.js.map
/// <reference path="ToolSettings.ts" />
/// <reference path="ToolSettingsObserver.ts" />
var markit;
(function (markit) {
    var ToolsManager = (function () {
        function ToolsManager(tsManager) {
            this.toolSettingsManager = tsManager;
        }
        ToolsManager.prototype.init = function (svgElement) {
            var toolbar = document.createElement("div");
            this.tools = this.createTools();
            this.tools.forEach(function (e) {
                toolbar.appendChild(e);
            });
            svgElement.parentNode.insertBefore(toolbar, svgElement);
        };
        ToolsManager.prototype.createTools = function () {
            var tools = new Array();
            var btn = document.createElement("button");
            btn.id = "markit_btnPtr";
            btn.innerText = "Ptr";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnLine";
            btn.innerText = "Line";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_btnRect";
            btn.innerText = "Rectangle";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            btn = document.createElement("button");
            btn.id = "markit_Ellipse";
            btn.innerText = "Ellipse";
            btn.onclick = this.onclick.bind(this);
            tools.push(btn);
            return tools;
        };
        ToolsManager.prototype.onclick = function (e) {
            var toolSettings = new markit.ToolSettings();
            switch (e.target.id) {
                case "markit_btnPtr":
                    toolSettings.commandMode = markit.CommandMode.Select;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_btnLine":
                    toolSettings.commandMode = markit.CommandMode.Line;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_btnRect":
                    toolSettings.commandMode = markit.CommandMode.Rectangle;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
                case "markit_Ellipse":
                    toolSettings.commandMode = markit.CommandMode.Ellipse;
                    this.toolSettingsManager.setToolSettings(toolSettings);
                    break;
            }
        };
        return ToolsManager;
    })();
    markit.ToolsManager = ToolsManager;
})(markit || (markit = {}));
//# sourceMappingURL=ToolsManager.js.map
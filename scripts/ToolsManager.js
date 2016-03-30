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
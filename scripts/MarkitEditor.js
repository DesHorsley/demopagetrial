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
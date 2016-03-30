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
        }
        return ToolSettings;
    })();
    markit.ToolSettings = ToolSettings;
})(markit || (markit = {}));
//# sourceMappingURL=ToolSettings.js.map
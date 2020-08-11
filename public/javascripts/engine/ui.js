let UI = {
    closeAll: false,
    initInfobox: function () {        
        this.infoBox.image = fg.$new('img');
        this.infoBox.canvas = fg.$new("canvas");
    },
    mainForm: undefined,
    form: {
        type: "form",
        draw: function () {
            if (!this.visible) return;
            var fractionX = this.width / this.maxAnimation;
            var fractionY = this.height / this.maxAnimation;
            if (!this.animate) this.curAnimation = this.maxAnimation;
            var width = (fractionX * this.curAnimation);
            var height = (fractionY * this.curAnimation);
            fg.System.context.fillStyle = this.showBorder ? this.borderColor : this.fillColor;
            fg.System.context.fillRect(this.realX + this.x + ((this.width / 2) - (width / 2)), this.realY + this.y + ((this.height / 2) - (height / 2)), width, height);
            if (this.showBorder) {
                fg.System.context.fillStyle = this.fillColor;
                fg.System.context.fillRect(this.realX + this.x + ((this.width / 2) - (width / 2)) + 1, this.realY + this.y + ((this.height / 2) - (height / 2)) + 1, width - 2, height - 2);
            }

            if (this.curAnimation < this.maxAnimation)
                this.curAnimation++;
            else {
                for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.draw();
            }
        },
    },
    container: {
        type: "container",
        align: "center",
        direction: "vertical",
        positionRelative: false,
        draw: function () {
            if (this.showBorder) {
                fg.System.context.beginPath();
                fg.System.context.fillStyle = this.borderColor;
                fg.System.context.rect(this.realX + this.x, this.realY + this.y, this.width, this.height);
                fg.System.context.stroke();
            }
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.draw();
        },
        update: function () {
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) ctrl.update();
        },
        addControl: function (obj) {
            var _ctrl = fg.UI.control.addControl.call(this, obj)
            if (this.controls.length == 1) this.setHighlightedControl(obj);
            if (this.align == "center") {
                var totalHeight = 0;
                var totalWidth = 0;
                var startX = 0;
                var startY = 0;
                if (this.direction == "vertical") {
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        totalHeight += ctrl.height;
                    }
                    startY = (this.height - totalHeight) / 2;
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        ctrl.y = (this.height - startY) - totalHeight;
                        totalHeight -= ctrl.height;
                        ctrl.x = (this.width / 2) - (ctrl.width / 2);
                    }
                } else if (this.direction == "horizontal") {
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        totalWidth += ctrl.width;
                    }
                    startX = (this.width - totalWidth) / 2;
                    for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                        if (!ctrl.positionRelative) continue;
                        ctrl.x = (this.width - startX) - totalWidth;
                        totalWidth -= ctrl.width;
                        ctrl.y = (this.height / 2) - (ctrl.height / 2);
                    }
                }
            } else if (this.align == "grid") {

            }
        },
        changeHighlighted: function () {
            for (var i = 0, ctrl; ctrl = this.controls[i]; i++) {
                if (ctrl.controls.length > 0) {
                    ctrl.changeHighlighted();
                }
                if (!ctrl.highlighted || !this.active) continue;
                ctrl.highlighted = false;
                if (fg.Input.actions["right"] || fg.Input.actions["down"]) {
                    if (this.controls[i + 1])
                        this.controls[i + 1].highlighted = true;
                    else
                        this.controls[0].highlighted = true;
                    delete fg.Input.actions["right"];
                    delete fg.Input.actions["down"];
                    this.setHighlightedControl(this.controls[i + 1] || this.controls[0]);
                } else {
                    if (this.controls[i - 1])
                        this.controls[i - 1].highlighted = true;
                    else
                        this.controls[this.controls.length - 1].highlighted = true;
                    delete fg.Input.actions["left"];
                    delete fg.Input.actions["up"];
                    this.setHighlightedControl(this.controls[i - 1] || this.controls[this.controls.length - 1]);
                }
                break;
            }
        },
        setHighlightedControl: function (ctrl) {
            if (this.parent)
                this.parent.setHighlightedControl(ctrl);
            else
                this.highlightedControl = ctrl;
        },
        getActiveContainer: function () {
            return this.controls.find(function (e) { return e.type == "container" && e.active }) || this;
        },
        getHighlightedControl: function () {
            return this.getActiveContainer().controls.find(function (e) { return e.highlighted });
        }
    },
    draw: function () {
        this.mainForm.draw();
    },
    confirm: {
        id: "confirm",
        text: "confirm?",
        width: 180,
        height: 52,
        direction: "horizontal",
        showBorder: true,
        draw: function () {
            if (!this.visible) return;
            if (this.controls.length == 0) this.addButtons();
            fg.UI.form.draw.call(this);
            fg.System.context.textBaseline = "middle";
            fg.System.context.textAlign = "center";
            fg.System.context.font = "8px Arial";
            fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.text, this.realX + this.x + (this.width / 2), this.realY + this.y + 12 + 1);
        },
        addButtons: function () {
            this.addControl(Object.assign(Object.create(fg.UI.control), fg.UI.button, {
                id: "yes", text: "yes", highlighted: true, controls: [],
                click: function () {
                    this.parent.click(true);
                    return true;
                }
            }));
            this.addControl(Object.assign(Object.create(fg.UI.control), fg.UI.button, {
                id: "no", text: "no", highlighted: false, controls: [],
                click: function () {
                    this.parent.click(false);
                    return true;
                }
            }));
        },
        show: function () { this.visible = true; }
    },
    infoBox: {
        screen: undefined,
        update: function () {
            if (this.screen) {
                this.image.src = this.screen;
            }
        },
        draw: function () {
            var ctx = this.canvas.getContext('2d');
            ctx.drawImage(this.image, this.realX + this.x + 1, this.realY + this.y + 1, 160, 120);
        }
    },
    button: {
        type: "button",
        text: "myButton",
        draw: function () {
            fg.UI.control.draw.call(this);
            fg.System.context.textBaseline = "middle";
            fg.System.context.textAlign = "center";
            fg.System.context.font = "8px Arial";
            fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.text, this.realX + this.x + (this.width / 2), this.realY + this.y + (this.height / 2) + 1);
        }
    },
    control: {
        active: false,
        showBorder: false,
        animate: false,
        curAnimation: 0,
        maxAnimation: 30,
        fillColor: "black",
        borderColor: "white",
        highlightedColor: "lightGrey",
        index: 0,
        selected: false,
        highlighted: false,
        x: 0,
        y: 0,
        realX: 0,
        realY: 0,
        width: 48,
        height: 12,
        positionRelative: true,
        visible: true,
        draw: function () {
            if (!this.visible) return;
            var startX = this.positionRelative ? this.realX : 0;
            var startY = this.positionRelative ? this.realY : 0;
            fg.System.context.fillStyle = this.highlighted ? this.highlightedColor : this.fillColor;
            fg.System.context.fillRect(startX + this.x, startY + this.y, this.width, this.height);
            fg.System.context.fillStyle = this.fillColor;
            fg.System.context.fillRect(startX + this.x + 1, startY + this.y + 1, this.width - 2, this.height - 2);
        },
        parent: null,
        addControl: function (obj) {
            obj.parent = this;
            obj.realX = this.realX + this.x;
            obj.realY = this.realY + this.y;
            this.controls.push(obj);
            return obj;
        },
        reset: function () {
            this.curAnimation = 0;
        },
        click: function () { }
    },
    close: function () {
        var activeForms = this.mainForm.controls.filter(function (e) { return e.visible });
        if (activeForms.length > 1) {
            if (!fg.UI.closeAll) {
                activeForms[activeForms.length - 1].visible = false;
                activeForms[activeForms.length - 1].curAnimation = 0;
                delete fg.Input.actions["esc"];
                return;
            } else {
                while (this.mainForm.controls.filter(function (e) { return e.visible }).length > 1) {
                    activeForms = this.mainForm.controls.filter(function (e) { return e.visible });
                    activeForms[activeForms.length - 1].visible = false;
                    activeForms[activeForms.length - 1].curAnimation = 0;
                }
            }
        }
        fg.Game.paused = false;
        fg.Game.saving = false;
        this.closeAll = false;
        this.mainForm.reset();
    },
    activeForm: function () {
        return this.mainForm.controls.find(function (e) { return e.type == "form" && e.visible && e.active }) || this.mainForm;
    },
    update: function () {
        var visibleForms = this.mainForm.controls.filter(function (e) { return (e.type == "form" || e.type == "container") && e.visible });
        for (var i = 0, ctrl; ctrl = visibleForms[i]; i++)  ctrl.active = i == visibleForms.length - 1;
        if (fg.Input.actions["esc"]) {
            this.close();
        }
        if (this.mainForm.active) {
            if (fg.Input.actions["right"] || fg.Input.actions["left"] || fg.Input.actions["up"] || fg.Input.actions["down"]) this.mainForm.changeHighlighted();
            if (fg.Input.actions["enter"] || fg.Input.actions["jump"]) {
                if ((this.activeForm().getHighlightedControl() || { click: function () { } }).click()) this.close();
            }
        }
    }
}
export {UI};
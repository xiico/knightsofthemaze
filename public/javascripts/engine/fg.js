(function (window) {
    window.fg =
    {
        $: function (selector) {
            return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
        },
        $new: function (name) { return document.createElement(name); },
        loadScript: function (root, name, callBack, callBackParams) {
            var path = root + name.replace(/\./g, '/') + '.js';
            var script = fg.$new('script');
            script.type = 'text/javascript';
            script.src = path;
            script.onload = function (event) {
                callBack(callBackParams);
            };
            script.onerror = function () { throw ('Failed to load ' + name + ' at ' + path); };
            fg.$('head')[0].appendChild(script);
        }
    }
    //Polyfills
    if (typeof Object.assign != 'function') {
        (function () {
            Object.assign = function (target) {
                'use strict';
                // We must check against these specific cases.
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, "find", {
            value: function (predicate) {
                'use strict';
                if (this == null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
                return undefined;
            }
        });
    }
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());
}
)(window);


import {protoLevel} from './protoLevel.js';
import {protoEntity} from './protoEntity.js';
import {Camera} from './camera.js';
import Animation from './animation.js';
import {Render} from './render.js';
import {Active} from './active.js';
import {Switch} from './switch.js';
import {Game} from './game.js';
import {UI} from './ui.js'

let fg = window.fg;

fg.System =
{
    context: null,
    defaultSide: 16,//24
    searchDepth: 16,//16
    canvas: null,
    platform: {},
    init: function () {
        this.canvas = fg.$("canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.platform.iPhone = /iPhone/i.test(navigator.userAgent);
        this.platform.iPad = /iPad/i.test(navigator.userAgent);
        this.platform.android = /android/i.test(navigator.userAgent);
        this.platform.iOS = this.platform.iPhone || this.platform.iPad;
        this.platform.mobile = this.platform.iOS || this.platform.android;
        if (this.platform.mobile)
            this.renderMobileInput();
    },
    renderMobileInput: function () {
        var auxCanvas = document.createElement('canvas');
        auxCanvas.width = 64;
        auxCanvas.height = 64;
        var auxCanvasCtx = auxCanvas.getContext('2d');

        var imgLeft = document.getElementById("btnMoveLeft");
        auxCanvasCtx.beginPath();
        auxCanvasCtx.fillStyle = "#aaaaaa";
        auxCanvasCtx.fillRect(0, 0, auxCanvas.width, auxCanvas.height);
        auxCanvasCtx.fillStyle = "#000000";
        auxCanvasCtx.moveTo(48, 16);
        auxCanvasCtx.lineTo(48, 48);
        auxCanvasCtx.lineTo(16, 32);
        auxCanvasCtx.fill();
        imgLeft.src = auxCanvas.toDataURL("image/png");

        var imgDown = document.getElementById("btnMoveDown");
        auxCanvasCtx.beginPath();
        auxCanvasCtx.fillStyle = "#aaaaaa";
        auxCanvasCtx.fillRect(0, 0, auxCanvas.width, auxCanvas.height);
        auxCanvasCtx.fillStyle = "#000000";
        auxCanvasCtx.moveTo(16, 16);
        auxCanvasCtx.lineTo(48, 16);
        auxCanvasCtx.lineTo(32, 48);
        auxCanvasCtx.fill();
        imgDown.src = auxCanvas.toDataURL("image/png");

        var imgRight = document.getElementById("btnMoveRight");
        auxCanvasCtx.beginPath();
        auxCanvasCtx.fillStyle = "#aaaaaa";
        auxCanvasCtx.fillRect(0, 0, auxCanvas.width, auxCanvas.height);
        auxCanvasCtx.fillStyle = "#000000";
        auxCanvasCtx.moveTo(16, 16);
        auxCanvasCtx.lineTo(16, 48);
        auxCanvasCtx.lineTo(48, 32);
        auxCanvasCtx.fill();
        imgRight.src = auxCanvas.toDataURL("image/png");


        var imgUp = document.getElementById("btnMoveUp");
        auxCanvasCtx.beginPath();
        auxCanvasCtx.fillStyle = "#aaaaaa";
        auxCanvasCtx.fillRect(0, 0, auxCanvas.width, auxCanvas.height);
        auxCanvasCtx.fillStyle = "#000000";
        auxCanvasCtx.moveTo(32, 16);
        auxCanvasCtx.lineTo(48, 48);
        auxCanvasCtx.lineTo(16, 48);
        auxCanvasCtx.fill();
        imgUp.src = auxCanvas.toDataURL("image/png");

        var imgJump = document.getElementById("btnJump");
        auxCanvasCtx.beginPath();
        auxCanvasCtx.fillStyle = "#aaaaaa";
        auxCanvasCtx.fillRect(0, 0, auxCanvas.width, auxCanvas.height);
        auxCanvasCtx.fillStyle = "#000000";
        auxCanvasCtx.arc(auxCanvas.width / 2, auxCanvas.height / 2, 16, 0, 2 * Math.PI);
        auxCanvasCtx.fill();
        imgJump.src = auxCanvas.toDataURL("image/png");
    }
}

fg.protoLevel = protoLevel;
fg.protoEntity = protoEntity;
fg.Camera = Camera;
fg.Animation = Animation;
fg.Render = Render;
fg.Active = Active;
fg.Switch = Switch;
fg.Game = Game;
fg.UI = UI;

fg.Entity = function (id, type, x, y, cx, cy, index) {
    switch (type) {
        case TYPE.WALL:
            return fg.Wall(id, type, x, y, cx, cy, index);
        case TYPE.ACTOR:
            return fg.Actor(id, type, x, y, cx, cy, index);
        case TYPE.FLOOR:
            return fg.Floor(id, type, x, y, cx, cy, index);
        case TYPE.BOB:
            return fg.Bob(id, type, x, y, cx, cy, index);
        default:
            return Object.create(fg.protoEntity).init(id, type, x, y, cx, cy, index);
    }
}

fg.Input = {
    actions: {},
    bindings: {},
    KEY: { 'MOUSE1': -1, 'MOUSE2': -3, 'MWHEEL_UP': -4, 'MWHEEL_DOWN': -5, 'BACKSPACE': 8, 'TAB': 9, 'ENTER': 13, 'PAUSE': 19, 'CAPS': 20, 'ESC': 27, 'SPACE': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'LEFT_ARROW': 37, 'UP_ARROW': 38, 'RIGHT_ARROW': 39, 'DOWN_ARROW': 40, 'INSERT': 45, 'DELETE': 46, '_0': 48, '_1': 49, '_2': 50, '_3': 51, '_4': 52, '_5': 53, '_6': 54, '_7': 55, '_8': 56, '_9': 57, 'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70, 'G': 71, 'H': 72, 'I': 73, 'J': 74, 'K': 75, 'L': 76, 'M': 77, 'N': 78, 'O': 79, 'P': 80, 'Q': 81, 'R': 82, 'S': 83, 'T': 84, 'U': 85, 'V': 86, 'W': 87, 'X': 88, 'Y': 89, 'Z': 90, 'NUMPAD_0': 96, 'NUMPAD_1': 97, 'NUMPAD_2': 98, 'NUMPAD_3': 99, 'NUMPAD_4': 100, 'NUMPAD_5': 101, 'NUMPAD_6': 102, 'NUMPAD_7': 103, 'NUMPAD_8': 104, 'NUMPAD_9': 105, 'MULTIPLY': 106, 'ADD': 107, 'SUBSTRACT': 109, 'DECIMAL': 110, 'DIVIDE': 111, 'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116, 'F6': 117, 'F7': 118, 'F8': 119, 'F9': 120, 'F10': 121, 'F11': 122, 'F12': 123, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PLUS': 187, 'COMMA': 188, 'MINUS': 189, 'PERIOD': 190 },
    keydown: function (event) {
        if (fg.Input.bindings[event.keyCode]) {
            fg.Input.actions[fg.Input.bindings[event.keyCode]] = true;
            event.preventDefault();
        }
    },
    keyup: function (event) {
        if (fg.Input.bindings[event.keyCode]) {
            delete fg.Input.actions[fg.Input.bindings[event.keyCode]];
            event.preventDefault();
        }
    },
    initTouch: function (canvas) {
        canvas.addEventListener("touchstart", handleStart, false);
        canvas.addEventListener("touchend", handleEnd, false);
        canvas.addEventListener("touchcancel", handleCancel, false);
        canvas.addEventListener("touchmove", handleMove, false);
        log("initialized.");
    },
    handleStart: function (evt) {
        evt.preventDefault();
        log("touchstart.");
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            log("touchstart:" + i + "...");
            ongoingTouches.push(copyTouch(touches[i]));
            var color = colorForTouch(touches[i]);
            fg.System.context.beginPath();
            fg.System.context.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
            fg.System.context.fillStyle = color;
            fg.System.context.fill();
            log("touchstart:" + i + ".");
        }
    },
    initKeyboard: function () {
        window.addEventListener('keydown', this.keydown, false);
        window.addEventListener('keyup', this.keyup, false);
    },
    bind: function (key, action) {
        this.bindings[key] = action;
    },
    bindTouch: function (element, action) {
        element.addEventListener('touchstart', function (e) { fg.Input.touchStart(e, action); }, false);
        element.addEventListener('touchend', function (e) { fg.Input.touchEnd(e, action); }, false);
    },
    touchStart: function (e, action) {
        fg.Input.actions[action] = true;
        e.stopPropagation();
        e.preventDefault();
    },
    touchEnd: function (e, action) {
        delete fg.Input.actions[action]
        e.stopPropagation();
        e.preventDefault();
    }
}

fg.Timer = {
    showFPS: true,
    currentTime: null,
    lastTime: null,
    deltaTime: null,
    totalTime: 0,
    ticks: 0,
    fps: 0,
    timeInteval: 16,
    update: function () {
        var d = new Date();
        this.currentTime = d.getTime();
        if (!this.lastTime)
            this.lastTime = this.currentTime - 15;
        if (this.showFPS) {
            this.totalTime += Math.round(1000 / ((this.currentTime - this.lastTime)));
            if (this.ticks % 50 == 0) {
                this.fps = this.totalTime / 50;
                this.totalTime = 0;
            }

            // fg.System.context.font = "10px Arial";
            // fg.System.context.textAlign = "left";
            // if (fg.Game.paused) {
            //     fg.System.context.textBaseline = "alphabetic";
            //     fg.System.context.fillStyle = "black";
            //     fg.System.context.fillRect(9, 1, 30, 10);
            // }
            // fg.System.context.fillStyle = "white";
            fg.System.context.fillText(this.fps, 10, 10);
            //fg.UI.fonts.small.draw(this.fps,10,10);
        }
        this.deltaTime = this.timeInteval;//Math.floor((Math.max(this.currentTime - this.lastTime, 15) <= 30 ? this.currentTime - this.lastTime : 30) / 2) * 2;//16
        this.lastTime = this.currentTime;
        this.ticks++;
    }
}

fg.Platform = {
    height: 5,
    oneWay: true
}

fg.Tunnel = {
    backGround: false,
    foreGround: true
}

fg.Bouncer = {
    color: "red",
    bounceness: 1.4
}

fg.Interactive = {
    interactive: true,
    interacting: false,
    init: function () { },
    interact: function (obj) {
        this.interactor = obj;
        this.interacting = true;
    },
    update: function () {
        this.interacting = false;
        this.interactor = undefined;
    }
}

var TYPE = {
    WALL: "X",
    BOB: "b",
    ACTOR: "A",
    FLOOR: "F"
}
fg.TYPE = TYPE;

export {fg};
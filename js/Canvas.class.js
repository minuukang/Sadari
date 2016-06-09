!function () {
	"use strict";

	class SimpleCanvas {

		constructor (canvas) {
			this.canvas = canvas;
			this.ctx = this.canvas.getContext("2d");
			this.data = {};
		}

		setData (name, callback) {
			this.data[name] = typeof callback === "function" ? callback(this) : callback;
		}
		getData (name) {
			return this.data[name];
		}

		setOption (name, value) {
			this.ctx[name] = value;
		}

		drawLine (coor1, coor2) {
			this.ctx.beginPath();
			this.ctx.moveTo(coor1[0], coor1[1]);
			this.ctx.lineTo(coor2[0], coor2[1]);
			this.ctx.stroke();
			this.ctx.closePath();
		}

		setWidth (w) {
			this.canvas.width = w;
		}
		setHeight (h) {
			this.canvas.height = h;
		}

		getWidth () {
			return this.canvas.width;
		}
		getHeight () {
			return this.canvas.height;
		}

		clearAll () {
			this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
		}

	}

	window.SimpleCanvas = SimpleCanvas;

}();

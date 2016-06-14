!function () {

	function getRandomNumber (max) {
		return window.parseInt(Math.random() * max);
	}

	function HSVColor (h, s, v) {
		this.h = h;
		this.s = s;
		this.v = v;
	}

	HSVColor.prototype.toRGB = function () {
		var r, g, b;
		var i;
		var f, p, q, t;

		// Make sure our arguments stay in-range
		var h = Math.max(0, Math.min(360, this.h));
		var s = Math.max(0, Math.min(100, this.s));
		var v = Math.max(0, Math.min(100, this.v));

		// We accept saturation and value arguments from 0 to 100 because that's
		// how Photoshop represents those values. Internally, however, the
		// saturation and value are calculated from a range of 0 to 1. We make
		// That conversion here.
		s /= 100;
		v /= 100;

		if(s === 0) {
			// Achromatic (grey)
			r = g = b = v;
			return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
		}

		h /= 60; // sector 0 to 5
		i = Math.floor(h);
		f = h - i; // factorial part of h
		p = v * (1 - s);
		q = v * (1 - s * f);
		t = v * (1 - s * (1 - f));

		switch(i) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;

			case 1:
				r = q;
				g = v;
				b = p;
				break;

			case 2:
				r = p;
				g = v;
				b = t;
				break;

			case 3:
				r = p;
				g = q;
				b = v;
				break;

			case 4:
				r = t;
				g = p;
				b = v;
				break;

			default: // case 5:
				r = v;
				g = p;
				b = q;
		}

		return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
	};

	HSVColor.prototype.toString = function () {
		var rgb = this.toRGB();
		return "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
	};

	function ColorGenerator (initSetting) {
		this.data = [];
		this.init = initSetting || {
			h: [0, 360],
			s: [0, 100],
			v: [0, 100]
		};
	}

	ColorGenerator.prototype.abs = function (n) {
		//return n > 360 ? n - 360 : (n < 0 ? n + 360 : n);
		return n;
	}

	ColorGenerator.prototype.like = function ( oHSVColor ) {
		for (var i = 0, len = this.data.length; i < len; i ++) {
			if (
				(this.abs(this.data[i].h - 15) <= oHSVColor.h && oHSVColor.h <= this.abs(this.data[i].h + 15)) &&
				(
					(this.data[i].s - 30 < oHSVColor.s && oHSVColor.s < this.data[i].s + 30) &&
					(this.data[i].v - 15 < oHSVColor.v && oHSVColor.v < this.data[i].v + 15)
				)
			) {
				return true;
			}
		}
		return false;
	};


	ColorGenerator.prototype.get = function (index) {
		return this.data[index];
	};

	ColorGenerator.prototype.size = function () {
		return this.data.length;
	}

	ColorGenerator.prototype.create = function (callback) {
		var color, i = 100;
		do {
			color = new HSVColor(
				this.init.h[0] + getRandomNumber(this.init.h[1] - this.init.h[0]),
				this.init.s[0] + getRandomNumber(this.init.v[1] - this.init.s[0]),
				this.init.v[0] + getRandomNumber(this.init.v[1] - this.init.v[0])
			);
		} while (--i > 0 && (callback && callback(color, this)));
		if (i < 1) {
			throw new Error("duplicate color max");
		}
		this.data.push(color);
		return color;
	};

	//return ColorGenerator;
	window.ColorGenerator = ColorGenerator;


}();

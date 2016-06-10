!function () {

	function getRandomNumber (n, min) {
		return Math.floor(Math.random() * n) + (min || 0);
	}

	function ColorGenerator (n1, n2, n3) {
		var color = [];
		color[color.length] = getRandomNumber(n1[0], n1[1]);
		color[color.length] = getRandomNumber(n2[0], n2[1]);
		color[color.length] = getRandomNumber(n3[0], n3[1]);
		color = color.sort(function () {
			return .5 - Math.random();
		});
		this.push(color[0]);
		this.push(color[1]);
		this.push(color[2]);
	}

	ColorGenerator.prototype.push = Array.prototype.push;
	ColorGenerator.prototype.join = Array.prototype.join;
	ColorGenerator.prototype.toString = function () {
		return "rgb("+this.join(",")+")";
	};

	class ColorStorage {
		constructor () {
			this.data = [];
		}
		create (n1, n2, n3) {
			var g = null, max = 100000;
			do {
				g = new ColorGenerator(n1, n2, n3);
				if ( ! this.approach(g)) {
					break;
				} else {
					g = null;
				}
			} while(--max);
			if (g === null) {
				//console.log(colorStorage);
				throw new Error("더 이상 조합할 컬러가 없습니다.");
			}
			this.data.push(g);
			return g;
		}
		approach (g) {
			for (var i = 0, len = this.data.length; i < len; i ++) {
				var count = 0;
				for (var j = 0; j < 3; j ++) {
					if (this.data[i][j] - 30 <= g[j] && g[j] <= this.data[i][j] + 30) {
						count ++;
					}
				}
				if (count > 2) {
					return true;
				}
			}
			return false;
		}
		get (index) {
			return this.data[index];
		}
		reset () {
			this.data.length = 0;
		}
	}

	window.ColorStorage = ColorStorage;


}();

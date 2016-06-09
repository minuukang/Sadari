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

	var colorStorage = {
		_data: [],
		push: function (g) {
			this._data.push(g);
		},
		reset: function () {
			this._data.length = 0;
		},
		approach: function (g) {
			for (var i = 0, len = this._data.length; i < len; i ++) {
				var count = 0;
				for (var j = 0; j < 3; j ++) {
					if (this._data[i][j] - 15 <= g[j] && g[j] <= this._data[i][j] + 15) {
						count ++;
					}
				}
				// 이전 컬러는 2개도 안됨
				if (count >= 2) {
					return true;
				}
			}
			return false;
		}
	};
	window.colorStorage = colorStorage;
	window.generateRandomColor = function (n1, n2, n3) {
		var g = null, max = 10000;
		do {
			g = new ColorGenerator(n1, n2, n3);
			if ( ! colorStorage.approach(g)) {
				break;
			} else {
				g = null;
			}
		} while(--max);
		if (g === null) {
			console.log(colorStorage);
			throw new Error();
		}
		colorStorage.push(g);
		return g.toString();
	};


}();

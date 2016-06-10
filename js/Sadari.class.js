!function () {

	"use strict";

	/*
   * 배열 크기만큼 null로 초기화
	 */
	function ArrayInitialize (size) {
		for (var i = size, r = new Array(size); i --;) {
			r[i] = null;
		}
		return r;
	}

	/*
	 * 랜덤 숫자 값을 반환
	 */
	function getRandomNumber (number) {
		return parseInt(Math.random() * number, 10);
	}


	/*
	 * 랜덤 숫자가 구성되어 있는 배열을 반환
	 */
	function getRandomArray (min, max, range) {
		var r = [];
		for (var i = min + getRandomNumber(max - min); i --;) {
			while (1) {
				var number = getRandomNumber(range);
				if (!~r.indexOf(number)) {
					r.push(number);
					break;
				}
			}
		}
		return r;
	}

	class Sadari {
		constructor (startData, endData) {
			this.startData = startData;
			this.endData = endData;
			if (this.endData.length === 0) {
				throw new Error("빈 데이터는 존재 할 수 없습니다.");
			}
			if (this.startData.length < 2) {
				throw new Error("시작 데이터는 2개 이상 입력하셔야합니다.");
			}
			if (this.startData.length < this.endData.length) {
				throw new Error("종료데이터는 시작데이터보다 많을 수 없습니다.");
			}
			// 데이터 재정렬
			this.endData = this.endData.concat(ArrayInitialize(this.startData.length - this.endData.length)).sort(function () {
				return .5 - Math.random();
			});
			this.startData = this.startData.sort(function () {
				return .5 - Math.random();
			});
			// 단계 설정
			this.stack = 8;
			this.reset();
		}
		getSize () {
			return this.startData.length;
		}
		getStartData () {
			return this.startData;
		}
		getEndData () {
			return this.endData;
		}
		getLine (index) {
			return this.lines[index];
		}
		getLineSize () {
			return this.lines.length;
		}
		reset () {
			this.lines = [];
			// 단계별 스택설정
			let stackHalf = Math.floor(this.stack / 2);
			for (let i = 0, len = this.getSize() - 1; i < len; i ++) {
				let maxCount = 10000;
				while (--maxCount) {
					let newLine = [];
					// 랜덤값 도출
					let randomArray = getRandomArray(stackHalf - 2, stackHalf, this.stack);
					for (let j = 0; j < this.stack; j ++) {
						if (~randomArray.indexOf(j)) {
							newLine.push(1);
						} else {
							newLine.push(0);
						}
					}
					if (this.validateLine(newLine)) {
						this.lines.push(newLine);
						break;
					}
				}
				if (maxCount < 1) {
					throw new Error("j_j");
				}
			}
		}
		validateLine (line) {
			// 바로 이전의 라인과 유효성을 검사
			if (this.lines.length > 0) {
				var prevLine = this.lines[this.lines.length - 1];
					for (var i = 0, c = 0, len = line.length; i < len; i ++) {
					if (line[i] === 1) {
						if (prevLine[i] === line[i]) {
							return false;
						}
					}
				}
			}
			return true;
		}
		getLinePosition (index) {
			/* [index, direction] */
			var position = [];
			switch (index) {
				case 0:
					position.push([0, 1]);
					break;
				case this.startData.length - 1:
					position.push([this.lines.length - 1, 0]);
					break;
				default:
					position.push([index - 1, 0]);
					position.push([index, 1]);
			}
			return position;
		}
		move (index) {
			var moveData = [[index, 0, 0]];
			var goIndex = this.getLinePosition(index);
			for (var i = 0, ilen = this.stack; i < ilen; i ++) {
				var flag = false;
				for (var j = 0, jlen = goIndex.length; j < jlen; j ++) {
					var position = goIndex[j];
					var posIndex = position[0];
					var posDirection = position[1];
					var line = this.lines[posIndex];
					if (line[i] === 1) {
						moveData.push([index, i + 1, 0]);
						index = posIndex + posDirection;
						moveData.push([index, i + 1, 1]);
						goIndex = this.getLinePosition(index);
						flag = true;
						break;
					}
				}
				if (flag === false) {
					moveData.push([index, i + 1, 0]);
				}
			}
			moveData.push([index, ilen + 1, 0]);
			return moveData;
		}
		execute () {
			var result = [];
			for (var i = 0, len = this.startData.length; i < len; i ++) {
				result.push(this.move(i));
			}
			return result;
		}
	}

	window.Sadari = Sadari;


}();
/*
// 사다리 실행
var data;

data[data.length] = app.move(0);
data[data.length] = app.move(1);
data[data.length] = app.move(2);
data[data.length] = app.move(3);

// or

var data = app.execute();
*/

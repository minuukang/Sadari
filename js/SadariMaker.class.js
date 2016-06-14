!function (window, document, undefined) {

	class SadariMaker {
		constructor (appSadari, appCanvas, appView) {
			this.appCanvas = appCanvas;
			this.appSadari = appSadari;
			this.appView = appView;
			this.aniCtrl = new AnimationController;
			//this.colorGenerator = new ColorGenerator();
			this.reset();
		}
		reset () {
			this.aniCtrl.clear();
			this.moveData = [];
			this.colorGenerator = new ColorGenerator({
				h: [0, 360],
				s: [35, 75],
				v: [60, 100]
			});
		}
		chainMoveData (moveData) {
			let activeIndex = this.moveData.length;
			this.moveData.push(moveData);
			let [lastIndex] = moveData[moveData.length - 1];
			const startItems = this.appView.getStartData();
			const endItems = this.appView.getEndData();
			/*
			console.log(lastIndex);
			if (endItems[lastIndex].classList.contains("__active")) {
				startItems[activeIndex].classList.add("__active");
			}
			*/
			startItems[activeIndex].infoData = endItems[lastIndex].infoData = {
				endIndex: lastIndex,
				startIndex: activeIndex
			};
		}
		startInitialize () {
			this.reset();
			this.appCanvas.setData("ySize", 30);
			this.appCanvas.setWidth(window.innerWidth);
			this.appCanvas.setHeight((this.appSadari.stack + 1) * this.appCanvas.getData("ySize"));
			this.appCanvas.setData("part", (self) => {
				return self.getWidth() / this.appSadari.getSize();
			});
			this.drawBackground();
		}
		showDirect () {
			this.startInitialize();
			this.appSadari.execute().forEach((moveData, index) => {
				//let prevData = index && allData[index - 1];
				//this.setColor(index, generateRandomColor([125, 55], [125, 55], [125, 55]));
				//this.appCanvas.setOption("strokeStyle", this.getColor(index));
				const color = this.colorGenerator.create(this.colorCheck);
				this.appCanvas.setOption("strokeStyle", color.toString());
				moveData.forEach((data, index, allData) => {
					this.drawLineFromMoveData(data, index ? allData[index - 1][0] : -1, 1);
				});
				this.chainMoveData(moveData);
			});
		}
		showAnimation () {
			this.startInitialize();
			this.startAnimation();
		}
		startAnimation () {
			let activeIndex = 0;
			const startItems = this.appView.getStartData();
			const endItems = this.appView.getEndData();
			const nextAnimation = () => {
				this.aniCtrl.clear();
				if (activeIndex !== this.appSadari.getSize() - 1) {
					this.drawActiveAnimation(++activeIndex, nextAnimation);
				} else {
					// 대체
					//this.appView.
					//this.appCanvas.parentNode.classList.remove("__active");
				}
			};
			this.drawBackground();
			this.drawActiveAnimation(activeIndex, nextAnimation);
		}
		colorCheck (hsv, collect) {
			for (var i = 0, len = collect.size(); len && i < 5; i ++) {
				var color = collect.get(len - 1 - i);
				if (color && color.h - 30 < hsv.h && hsv.h < color.h + 30) {
					//throw ([color, hsv]);
					return true;
				}
			}
			return false;
		}
		drawActiveAnimation (index, callback) {
			this.chainMoveData(this.appSadari.move(index));
			const moveData = this.moveData[index];
			//var animationStack = [];
			//ctx.strokeStyle = generateRandomColor([125, 55], [125, 55], [125, 55]);
			//this.setColor(index, generateRandomColor([125, 55], [125, 55], [125, 55]));
			const color = this.colorGenerator.create(this.colorCheck);
			this.appCanvas.setOption("strokeStyle", color.toString());
			for (let i = 0, len = moveData.length; i < len; i ++) {
				this.aniCtrl.push((() => {
					let prevData = moveData[i - 1];
					let data = moveData[i];
					return (progress) => {
						this.drawLineFromMoveData(data, prevData ? prevData[0] : -1, progress);
					};
				})());
			}
			this.aniCtrl.start(callback);
		}
		drawLineFromMoveData (data, prevX, progress) {
			let [x, y, value] = data;
			const halfPart = this.appCanvas.getData("part") / 2;
			progress = typeof progress === "undefined" ? 1 : progress;
			if (value === 0) {
				let startX = (x * this.appCanvas.getData("part")) + halfPart;
				let startY = y === 0 ? 0 : ((y - 1) * this.appCanvas.getData("ySize"));
				this.appCanvas.drawLine(
					[startX, startY],
					[startX, startY + (this.appCanvas.getData("ySize") * progress)]
				);
			} else {
				let direction = prevX > x ? -1 : 1;
				let startX = (prevX * this.appCanvas.getData("part")) + halfPart;
				let startY = y * this.appCanvas.getData("ySize");
				this.appCanvas.drawLine(
					[startX, startY],
					[startX + (progress * this.appCanvas.getData("part") * direction), startY]
				);
			}
		}
		drawBackground () {
			this.appCanvas.clearAll();
			this.appCanvas.setOption("strokeStyle", "#ddd");
			this.appCanvas.setOption("lineWidth", 20);
			this.appCanvas.setOption("lineCap", "square");

			const partHalf = this.appCanvas.getData("part") / 2;

			for (let i = 0, len = this.appSadari.getSize(); i < len; i ++) {
				let x = (i * this.appCanvas.getData("part")) + partHalf;
				this.appCanvas.drawLine([x, 0], [x, this.appCanvas.getHeight()]);
			}

			for (let i = 0, len = this.appSadari.getLineSize(); i < len; i ++) {
				var lineData = this.appSadari.getLine(i);
				for (let j = 0, jlen = lineData.length; j < jlen; j ++) {
					if (lineData[j] === 1) {
						let y = this.appCanvas.getData("ySize") * (j + 1);
						this.appCanvas.drawLine(
							[(i * this.appCanvas.getData("part")) + partHalf, y],
							[((i + 1) * this.appCanvas.getData("part")) + partHalf, y]
						);
					}
				}
			}
			this.appCanvas.setOption("lineWidth", 10);
		}
	}

	window.SadariMaker = SadariMaker;

}(window, document);

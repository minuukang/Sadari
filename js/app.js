!function (window, document) {
	"use strict";
	document.addEventListener('DOMContentLoaded', () => {

		const sadariView = new SadariView();
		const sadariCanvas = new SimpleCanvas(sadariView.getCanvas());
		let sadariApp, sadariMaker;

		const openApp = ({startData = [], endData = [], hideMiddle = false, showDirect = false}) => {
			try {
				sadariApp = new Sadari(startData, endData);
				window.sadariMaker = sadariMaker = new SadariMaker(sadariApp, sadariCanvas, sadariView);
				if ( hideMiddle === true ) {
					sadariView.showResultHider();
				}
				sadariView.resultPageOpen();
				sadariView.createStartData(sadariApp.getStartData());
				sadariView.createEndData(sadariApp.getEndData());
				if ( showDirect === true ) {
					sadariMaker.showDirect();
				} else {
					sadariMaker.showAnimation();
				}
			} catch (e) {
				alert(e.message);
			//	throw e;
			}
		};

		sadariView.getForm().addEventListener("submit", (event) => {
			event.preventDefault();
			const startData = sadariView.getInput("#start-data");
			const endData = sadariView.getInput("#end-data");
			const hideMiddle = sadariView.getInput("#hide-middle");
			const showDirect = sadariView.getInput("#show-direct");
			openApp({
				startData: startData.value.split(","),
				endData: endData.value.split(","),
				hideMiddle: hideMiddle.checked,
				showDirect: showDirect.checked
			});
		});

		const badgeColorMatch = (event) => {
			const target = event.target;
			if (target.classList.contains("result-data-value")) {
				if (target.infoData) {
					const startItems = sadariView.getStartData();
					const endItems = sadariView.getEndData();
					const startData = startItems[target.infoData.startIndex];
					const endData = endItems[target.infoData.endIndex];

					switch (event.type) {
						case "mouseover":
							startData.style.backgroundColor =
							endData.style.backgroundColor = String(sadariMaker.colorGenerator.get(target.infoData.startIndex));
							startData.classList.add("__hover");
							endData.classList.add("__hover");
							break;
						case "mouseout":
							startData.style.backgroundColor = endData.style.backgroundColor = "";
							startData.classList.remove("__hover");
							endData.classList.remove("__hover");
							break;
					}
				}
			}
		};

		sadariView.getResult().addEventListener("mouseover", badgeColorMatch);
		sadariView.getResult().addEventListener("mouseout", badgeColorMatch);

		sadariView.getShowResultDirectBtn().addEventListener("click", (e) => {
			e.preventDefault();
			sadariMaker.showDirect();
		});

		sadariView.getHiderToggleBtn().addEventListener("click", (e) => {
			e.preventDefault();
			sadariView.toggleResultHider();
		});

		sadariView.getAppResetBtn().addEventListener("click", (e) => {
			//sadariView.getForm().reset();
			e.preventDefault();
			sadariView.introPageOpen();
			sadariMaker.reset();
		});

		/*
		var appIntroForm = document.querySelector("#app-intro");
		var appResult = document.querySelector("#app-result");

		var appStartData = document.querySelector("#sadari-start-data");
		var appEndData = document.querySelector("#sadari-end-data");

		var startItems;// = appStartData.querySelectorAll(".result-data");
		var endItems;// = appEndData.querySelectorAll(".result-data");

		var appCanvas;

		function getStartHtmlItems () {
			if (!startItems) {
				startItems = appStartData.querySelectorAll(".result-data");
			}
			return startItems;
		}
		function getEndHtmlItems () {
			if (!endItems) {
				endItems = appEndData.querySelectorAll(".result-data");
			}
			return endItems;
		}

		appResult.addEventListener("mouseover", (e) => {
			if (e.target.classList.contains("result-data")) {
				if (e.target.infoData) {
					var startItems = getStartHtmlItems();
					var endItems = getEndHtmlItems();

					var startData = startItems[e.target.infoData.startIndex];
					var endData = endItems[e.target.infoData.endIndex];
					startData.style.backgroundColor = endData.style.backgroundColor = colorStorage._data[e.target.infoData.startIndex].toString();
					startData.classList.add("__hover");
					endData.classList.add("__hover");
				}
			}
		});
		appResult.addEventListener("mouseout", (e) => {
			if (e.target.classList.contains("result-data")) {
				if (e.target.infoData) {
					var startItems = getStartHtmlItems();
					var endItems = getEndHtmlItems();

					var startData = startItems[e.target.infoData.startIndex];
					var endData = endItems[e.target.infoData.endIndex];
					startData.style.backgroundColor = endData.style.backgroundColor = "";
					startData.classList.remove("__hover");
					endData.classList.remove("__hover");
				}
			}
		});

		appIntroForm.addEventListener("submit", (e) => {
			e.preventDefault();
			var startData = document.querySelector("#start-data");
			var endData = document.querySelector("#end-data");
			var hideMiddle = document.querySelector("#hide-middle");
			openApp(startData.value.split(","), endData.value.split(","), hideMiddle.checked);
		});

		function playCanvas (app, hideMiddle) {
			var canvas = document.querySelector("#sadari-line");
			if (hideMiddle) {
				canvas.parentNode.classList.add("__active");
			}
			appCanvas = new SimpleCanvas(canvas);
			appCanvas.setData("ySize", 30);
			appCanvas.setWidth(window.innerWidth);
			appCanvas.setHeight((app.stack + 1) * appCanvas.getData("ySize"));
			appCanvas.setData("part", function (self) {
				return self.getWidth() / app.getSize();
			});

			function drawBackground () {
				appCanvas.clearAll();
				appCanvas.setOption("strokeStyle", "#ddd");
				appCanvas.setOption("lineWidth", 20);
				appCanvas.setOption("lineCap", "square");

				var partHalf = appCanvas.getData("part") / 2;

				for (var i = 0, len = app.getSize(); i < len; i ++) {
					var x = (i * appCanvas.getData("part")) + partHalf;
					appCanvas.drawLine([x, 0], [x, appCanvas.getHeight()]);
				}

				for (var i = 0, len = app.lines.length; i < len; i ++) {
					var lineData = app.lines[i];
					for (var j = 0, jlen = lineData.length; j < jlen; j ++) {
						if (lineData[j] === 1) {
							var y = appCanvas.getData("ySize") * (j + 1);
							appCanvas.drawLine(
								[(i * appCanvas.getData("part")) + partHalf, y],
								[((i + 1) * appCanvas.getData("part")) + partHalf, y]
							);
						}
					}
				}
				appCanvas.setOption("lineWidth", 10);
			}
			// 하나만 움직여볼까
			drawBackground();
			var activeIndex = 0;
			var startItems = getStartHtmlItems();
			var endItems = getEndHtmlItems();

			var animation = new AnimationController;

			drawActiveAnimation(activeIndex, function nextAnimation () {
				animation.clear();

				var moveData = app.move(activeIndex).pop();
				//console.log(moveData);
				if (endItems[moveData[0]].classList.contains("__active")) {
					startItems[activeIndex].classList.add("__active");
				}
				startItems[activeIndex].infoData = endItems[moveData[0]].infoData = {
					endIndex: moveData[0],
					startIndex: activeIndex
				};
				if (activeIndex !== app.getSize() - 1) {
					drawActiveAnimation(++activeIndex, nextAnimation);
				} else {
					canvas.parentNode.classList.remove("__active");
				}
			});

			function drawLineFromMoveData (data, prevX, progress) {
				var [x, y, value] = data;
				var halfPart = appCanvas.getData("part") / 2;
				progress = typeof progress === "undefined" ? 1 : progress;
				if (value === 0) {
					var startX = (x * appCanvas.getData("part")) + halfPart;
					var startY = y === 0 ? 0 : ((y - 1) * appCanvas.getData("ySize"));
					appCanvas.drawLine(
						[startX, startY],
						[startX, startY + (appCanvas.getData("ySize") * progress)]
					);
				} else {
					var direction = prevX > x ? -1 : 1;
					var startX = (prevX * appCanvas.getData("part")) + halfPart;
					var startY = y * appCanvas.getData("ySize");
					appCanvas.drawLine(
						[startX, startY],
						[startX + (progress * appCanvas.getData("part") * direction), startY]
					);
				}
			}

			function drawActiveAnimation (index, callback) {
				var moveData = app.move(index);
				//var animationStack = [];
				//ctx.strokeStyle = generateRandomColor([125, 55], [125, 55], [125, 55]);
				appCanvas.setOption("strokeStyle", generateRandomColor([125, 55], [125, 55], [125, 55]));
				for (var i = 0, len = moveData.length; i < len; i ++) {
					animation.push((function () {
						var prevData = moveData[i - 1];
						var data = moveData[i];
						return function (progress) {
							drawLineFromMoveData(data, prevData ? prevData[0] : -1, progress);
						};
					})());
				}
				animation.start(callback);
			}
		}

		function openApp (startData, endData, hideMiddle) {
			var app = new Sadari(startData, endData);
			// draw result data
			var html = appStartData.innerHTML = "";
			for (var i = 0, len = app.startData.length; i < len; i ++) {
				html += '<div class="result-data">'+app.startData[i]+'</div>';
			}
			appStartData.innerHTML = html;
			var html = appEndData.innerHTML = "";
			for (var i = 0, len = app.endData.length; i < len; i ++) {
				html += '<div class="result-data'+(app.endData[i] ? ' __active' : '')+'">'+(app.endData[i] ? app.endData[i] : "X")+'</div>';
			}
			appEndData.innerHTML = html;

			appIntroForm.classList.remove("__active");
			appResult.classList.add("__active");

			playCanvas(app, hideMiddle);

		}
		*/

	});
}(window, window.document);

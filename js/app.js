!function () {

	"use strict";

	document.addEventListener('DOMContentLoaded', () => {
		var appIntroForm = document.querySelector("#app-intro");
		var appResult = document.querySelector("#app-result");

		var appStartData = document.querySelector("#sadari-start-data");
		var appEndData = document.querySelector("#sadari-end-data");

		var startItems;// = appStartData.querySelectorAll(".result-data");
		var endItems;// = appEndData.querySelectorAll(".result-data");

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



		appEndData.addEventListener("click", (e) => {
			e.preventDefault();
			if (e.target.nodeName === "BUTTON") {
				e.target.classList.toggle("__active");
			}
		});

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
			var ySize = 30;
			var width = canvas.width = window.innerWidth;
			var height = canvas.height = (app.stack + 1) * ySize;
			var part = width / app.getSize();

			var ctx = canvas.getContext("2d");
			function drawBackground () {
				ctx.clearRect(0, 0, width, height);
				ctx.strokeStyle = "#ddd";
				ctx.lineWidth = 20;
				ctx.lineCap = "square";

				for (var i = 0, len = app.getSize(); i < len; i ++) {
					ctx.beginPath();
					ctx.moveTo((i * part) + (part / 2), 0);
					ctx.lineTo((i * part) + (part / 2), height);
					ctx.stroke();
					ctx.closePath();
				}
				for (var i = 0, len = app.lines.length; i < len; i ++) {
					var lineData = app.lines[i];
					for (var j = 0, jlen = lineData.length; j < jlen; j ++) {
						if (lineData[j] === 1) {
							ctx.beginPath();
							ctx.moveTo((i * part) + (part / 2), ySize * (j + 1));
							ctx.lineTo(((i + 1) * part) + (part / 2), ySize * (j + 1));
							ctx.stroke();
							ctx.closePath();
						}
					}
				}

				ctx.lineWidth = 10;
			}
			// 하나만 움직여볼까
			drawBackground();
			var activeIndex = 0;

			var startItems = getStartHtmlItems();
			var endItems = getEndHtmlItems();

			drawActiveAnimation(activeIndex, function nextAnimation () {
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
				var x = data[0],
						y = data[1],
						value = data[2];
				progress = progress || 1;
				if (value === 0) {
					var startX = (x * appCanvas.getData("part"));
					var startY = y === 0 ? 0 : ((y - 1) * appCanvas.getData("ySize"));
					appCanvas.drawLine(
						[startX, startY],
						[startX, startY + (appCanvas.getData("ySize") * progress)]
					);
				} else {
					var direction = prevX > x ? -1 : 1;
					var startX = (prevX * appCanvas.getData("part")) + (appCanvas.getData("part") / 2);
					var startY = y * appCanvas.getData("ySize");
					appCanvas.drawLine(
						[startX, startY],
						[startX + (progress * part * direction), startY]
					);
				}
			}


			function drawActiveAnimation (index, callback) {
				var moveData = app.move(index);
				var animationStack = [];
				ctx.strokeStyle = generateRandomColor([125, 55], [125, 55], [125, 55]);
				for (var i = 0, len = moveData.length; i < len; i ++) {
					!function () {
						var data = moveData[i],
								x = data[0],
								y = data[1],
								value = data[2];
						// 가로인가 세로인가
						if (value === 0) { // 세로
							animationStack.push(function (progress) {
								//drawBackground();
								ctx.beginPath();
								if (y === 0) {
									ctx.moveTo((x * part) + (part / 2), 0);
									ctx.lineTo((x * part) + (part / 2), (progress * ySize));
								} else {
									ctx.moveTo((x * part) + (part / 2), ((y - 1) * (ySize)));
									ctx.lineTo((x * part) + (part / 2), (((y - 1)) * (ySize)) + (ySize * progress));
								}
								ctx.stroke();
								ctx.closePath();
							});
						} else { // 가로
							var prevData = moveData[i - 1];
							var direction = prevData[0] > x ? -1 : 1;
							animationStack.push(function (progress) {
								//drawBackground();
								ctx.beginPath();
								ctx.moveTo((prevData[0] * part) + (part / 2), ((y) * (ySize)));
								ctx.lineTo((prevData[0] * part) + (part / 2) + (progress * part * direction), ((y) * (ySize)));
								ctx.stroke();
								ctx.closePath();
							});
						}
					}();
				}
				asyncCall(animationStack, callback);
			}

			function asyncCall (stack, end) {
				var index = 0;
				function calling () {
					var starttime;
					requestAnimationFrame(function animationFrame (timestamp) {
						if (!starttime) {
							starttime = timestamp;
						}
						var progress = (timestamp - starttime) / 100;
						stack[index](progress > 1 ? 1 : progress);
						if (progress < 1) {
							requestAnimationFrame(animationFrame);
						} else {
							++index;
							if (index === stack.length) {
								end && end();
							} else {
								calling();
							}
						}
					});
				}
				calling();
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

	});
	// 사람
	/*
	var person = ArrayInitialize(18);
	var result = ["당첨", "당첨","당첨"];
	var app = new Sadari(person, result);
	app.stack = 12;
	app.reset();

	function drawResult (target, data) {
	var $target = document.querySelector(target);
	var html = $target.innerHTML = '';
	for (var i = 0, len = data.length; i < len; i ++) {
		html += '<div class="result-data">'+data[i]+'</div>';
	}
	$target.innerHTML = html;
	}

	drawResult("#sadari-start-data", app.startData);
	drawResult("#sadari-end-data", app.endData);

	var canvas = document.querySelector("#sadari-line");
	var ySize = 40;
	var width = canvas.width = window.innerWidth;
	var height = canvas.height = (app.stack + 1) * ySize;
	var part = width / app.getSize();

	var ctx = canvas.getContext("2d");
	function drawBackground () {
		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = "#ddd";
		ctx.lineWidth = 20;
		ctx.lineCap = "square";

		for (var i = 0, len = app.getSize(); i < len; i ++) {
			ctx.beginPath();
			ctx.moveTo((i * part) + (part / 2), 0);
			ctx.lineTo((i * part) + (part / 2), height);
			ctx.stroke();
			ctx.closePath();
		}
		for (var i = 0, len = app.lines.length; i < len; i ++) {
			var lineData = app.lines[i];
			for (var j = 0, jlen = lineData.length; j < jlen; j ++) {
				if (lineData[j] === 1) {
					ctx.beginPath();
					ctx.moveTo((i * part) + (part / 2), ySize * (j + 1));
					ctx.lineTo(((i + 1) * part) + (part / 2), ySize * (j + 1));
					ctx.stroke();
					ctx.closePath();
				}
			}
		}

		ctx.lineWidth = 10;
	}
	// 하나만 움직여볼까
	drawBackground();
	var activeIndex = 0;

	drawActiveAnimation(activeIndex, function nextAnimation () {
		if (activeIndex !== app.getSize() - 1) {
			drawActiveAnimation(++activeIndex, nextAnimation);
		}
	});



	function drawActiveAnimation (index, callback) {
		var moveData = app.move(index);
		var animationStack = [];
		ctx.strokeStyle = generateRandomColor([125, 55], [125, 55], [125, 55]);
		for (var i = 0, len = moveData.length; i < len; i ++) {
			!function () {
				var data = moveData[i],
						x = data[0],
						y = data[1],
						value = data[2];
				// 가로인가 세로인가
				if (value === 0) { // 세로
					animationStack.push(function (progress) {
						//drawBackground();
						ctx.beginPath();
						if (y === 0) {
							ctx.moveTo((x * part) + (part / 2), 0);
							ctx.lineTo((x * part) + (part / 2), (progress * ySize));
						} else {
							ctx.moveTo((x * part) + (part / 2), ((y - 1) * (ySize)));
							ctx.lineTo((x * part) + (part / 2), (((y - 1)) * (ySize)) + (ySize * progress));
						}
						ctx.stroke();
						ctx.closePath();
					});
				} else { // 가로
					var prevData = moveData[i - 1];
					var direction = prevData[0] > x ? -1 : 1;
					animationStack.push(function (progress) {
						//drawBackground();
						ctx.beginPath();
						ctx.moveTo((prevData[0] * part) + (part / 2), ((y) * (ySize)));
						ctx.lineTo((prevData[0] * part) + (part / 2) + (progress * part * direction), ((y) * (ySize)));
						ctx.stroke();
						ctx.closePath();
					});
				}
			}();
		}
		asyncCall(animationStack, callback);
	}

	function asyncCall (stack, end) {
		var index = 0;
		function calling () {
			var starttime;
			requestAnimationFrame(function animationFrame (timestamp) {
				if (!starttime) {
					starttime = timestamp;
				}
				var progress = (timestamp - starttime) / 100;
				stack[index](progress > 1 ? 1 : progress);
				if (progress < 1) {
					requestAnimationFrame(animationFrame);
				} else {
					++index;
					if (index === stack.length) {
						end && end();
					} else {
						calling();
					}
				}
			});
		}
		calling();
	}
	*/
}();

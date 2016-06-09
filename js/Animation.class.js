!function () {

	class AnimationController {

		constructor () {
			this.pushStack = [];
			this.timer = null;
		}

		push ( animation ) {
			this.pushStack.push(animation);
		}

		clear () {
			this.stop();
			this.pushStack.length = 0;
		}

		stop () {
			cancelAnimationFrame(this.timer);
		}

		start ( finishCallback ) {
			var index = 0;
			var calling = () => {
				var starttime;
				var animationFrame = (timestamp) => {
					if (!starttime) {
						starttime = timestamp;
					}
					var progress = (timestamp - starttime) / 100;
					this.pushStack[index](progress > 1 ? 1 : progress);
					if (progress < 1) {
						this.timer = requestAnimationFrame(animationFrame);
					} else {
						++index;
						if (index === this.pushStack.length) {
							finishCallback && finishCallback();
						} else {
							calling();
						}
					}
				}
				this.timer = requestAnimationFrame(animationFrame);
			};
			calling();
		}

	}

	window.AnimationController = AnimationController;

}();

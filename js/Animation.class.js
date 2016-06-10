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
			let index = 0;
			const calling = () => {
				let starttime;
				const animationFrame = (timestamp) => {
					if (!starttime) {
						starttime = timestamp;
					}
					let progress = (timestamp - starttime) / 50;
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

if (typeof Object.create !== 'function') {
	Object.create = function(obj) {
		var F = function() {};
		F.prototype = obj;
		return new F();
	};
}


/* ---------------------------------------------------------- */

/* Required TweenLite and TweenLite Plugin CSSPlugin, EasePack and also Draggable Utility*/

;
(function($, window, document, undefined) {

	var ImgCarousel3d = {

		init: function(elm, options) {
			var self = this;
			self.$elm = $(elm);
			self.elm = elm;

			var mrqOptions = self.options = $.extend({}, $.fn.imgCarousel3d.defaults, options);

			self.$scrollbar = self.$elm.find('.imgs-scrollbar');
			self.$scroller = self.$scrollbar.find('.scroller');
			self.scrollbarWidth = self.$scrollbar.width();
			self.scrollerWidth = self.$scroller.width();

			self.isLessThenIe10 = $('html').hasClass('lt-ie10');

			self.totalImgToView = 5;
			self.imgDepthGap = 0.2;
			self.curImgViewIntervalId = 0;
			self.isScrollerDragging = false;
			self.intervalTime = 150;
			self.angleGap = 800;
			self.curLoadingQueueSign = 0; //loading sign for cur loading group

			self.initCarousel();

			self.initScrollbar();
			self.initController();
		},

		initCarousel: function() {
			var self = this;
			var selfOptions = self.options;

			if (self.$imgsContainer) {
				self.$imgsContainer.css('zIndex', 1);
			}

			var $imgsContainer = self.$imgsContainer = self.$elm.find('.imgs');
			if ($imgsContainer.length > 1) {
				self.$curActiveType = self.$elm.find('.imgs-type.active');
				var connectData = self.$curActiveType.data();

				if (connectData && connectData.connectId) {
					self.$imgsContainer = self.$elm.find('#' + connectData.connectId).css('zIndex', 2);

					self.setTypeSelection();

					if (!self.$imgsContainer.length) {
						self.logErorr('Ohh! Category "' + connectData.connectId + '" not found! o_O');
						return 0;
					}
				} else {
					self.logErorr('Multiple images categories found but connection for cotegories not found. There should be "data-connect-id" in ".imgs-type.active" node');
					self.logErorr('Selecting first categories for now');
					self.$imgsContainer = $imgsContainer.eq(0);

				}
			}

			self.$imgs = self.$imgsContainer.find('.img-container');
			self.totalImgs = self.$imgs.length;

			var curIndex = selfOptions.curIndex;
			selfOptions.curIndex = -5; //self.totalImgs + 5; // fake index for startup animation

			self.targetViewIndex = -1;

			self.initImgsLoadComplete = false;
			self.setPoints();
			self.showImgAt(curIndex);
			self.initImgsClick();



		},

		initImgsClick: function() {
			var self = this;
			var selfOptions = self.options;

			self.$imgs.find('.img-link').off('click');
			self.$imgs.find('.img-link').on('click', function(e) {
				var $this = $(this);
				var $parent = $this.parent().parent();
				if (!$parent.hasClass('active')) {
					e.preventDefault();
					self.showImgAt(self.$imgs.index($parent));
				}

			});
		},

		setPoints: function() {
			var self = this;
			var selfOptions = self.options;

			if (!self.isLessThenIe10) {
				TweenLite.set(self.$imgsContainer, {
					css: {
						transformStyle: 'preserve-3d',
						perspective: 1100,
						perspectiveOrigin: '50% 50%'
					}
				});
			}

			self.posArray = [];
			self.$imgs.each(function(i, item) {
				var angle = (i - selfOptions.curIndex) * self.imgDepthGap;

				var zPos = -Math.abs(angle * self.angleGap);
				var xPos = -Math.sin(angle) * selfOptions.radius;
				self.posArray.push({
					angle: angle,
					x: xPos,
					z: zPos
				});

			});
		},

		rotate: function() {
			var self = this;
			var selfOptions = self.options;
			var minusVal = self.targetViewIndex - selfOptions.curIndex > 0 ? -self.imgDepthGap : self.imgDepthGap;
			var easeObj;
			var tweenTime;

			if (Math.abs(self.targetViewIndex - selfOptions.curIndex) === 1) {
				easeObj = Quint.easeOut;
				tweenTime = 1;
			} else {
				easeObj = Linear.easeNone;
				tweenTime = self.intervalTime / 1000;
			}

			var $curImgItem;
			self.$imgs.each(function(i, item) {
				var pos = self.posArray[i];
				pos.angle = pos.angle + minusVal;
				var angleDistance = pos.angle * self.angleGap;
				var zPos = -Math.abs(angleDistance);
				var xPos = Math.sin(pos.angle) * selfOptions.radius;
				var imgAlpha = (Math.ceil(0.5 * self.totalImgToView) * self.imgDepthGap) * self.angleGap;

				imgAlpha = Math.ceil(Math.abs(zPos)) < Math.floor(Math.abs(imgAlpha)) ? 1 : 0;

				//rotation
				var rotDeg = 0;
				if (selfOptions.imgRotation) {
					rotDeg = Math.round(angleDistance) >= 0 ? -30 : 30;
					rotDeg = Math.round(angleDistance) === 0 ? 0 : rotDeg;
				}


				if (!self.isLessThenIe10) {

					TweenLite.to(item, tweenTime, {
						x: xPos,
						z: zPos,
						zIndex: zPos,
						ease: easeObj,
						autoAlpha: imgAlpha,
						rotationY: rotDeg
					});

				} else {

					TweenLite.to(item, tweenTime, {
						x: xPos,
						ease: easeObj,
						zIndex: parseInt(zPos, 10),
						autoAlpha: imgAlpha
					});

				}


				//tween content
				var $item = $(item);
				$item.removeClass('active');
				var $contentItem = $item.find('.img-content');

				//img loading 
				if (imgAlpha) {
					self.checkImgLoad($item);
				}

				if (Math.round(angleDistance) === 0) {

					$curImgItem = $item;

				} else {
					TweenLite.to($contentItem, 0.6, {
						borderColor: selfOptions.borderColor
					});

					TweenLite.to($contentItem.find('.img-info'), 0.3, {
						scaleY: 0,
						transformOrigin: 'bottom left',
						ease: Expo.easeOut

					});

					TweenLite.to($contentItem.find('.img-info div'), 0.1, {
						autoAlpha: 0,
						y: 10
					});

					var $imgBtn = $contentItem.find('a.img-btn');
					TweenLite.killTweensOf($imgBtn);
					TweenLite.to($imgBtn, 0.1, {
						autoAlpha: 0
					});

				}

			});

			minusVal > 0 ? selfOptions.curIndex-- : selfOptions.curIndex++;

			if (selfOptions.curIndex === self.targetViewIndex) {
				clearInterval(self.curImgViewIntervalId);
				var $curContentItem = $curImgItem && $curImgItem.find('.img-content');

				if ($curContentItem && $curContentItem.length) {
					$curImgItem.addClass('active');
					TweenLite.to($curContentItem, tweenTime, {
						borderColor: selfOptions.activeBorderColor
					});

					TweenLite.to($curContentItem.find('.img-info'), 0.6, {
						scaleY: 1,
						transformOrigin: 'bottom left',
						ease: Expo.easeOut
					});

					$curContentItem.find('.img-info div').each(function(i, item) {
						TweenLite.to(item, 0.3, {
							autoAlpha: 1,
							delay: i * 0.2,
							y: 0
						});
					});

					TweenLite.to($curContentItem.find('a.img-btn'), 0.3, {
						autoAlpha: 1,
						delay: 0.6
					});

				}

				//autoSlide
				self.resetNextImgTime();

			}
		},

		initAnimationInterval: function() {
			var self = this;
			var selfOptions = self.options;

			clearInterval(self.curImgViewIntervalId);
			self.curImgViewIntervalId = setInterval(function() {
				self.rotate();
			}, self.intervalTime);
		},

		showNext: function() {
			var self = this;
			var selfOptions = self.options;

			var curIndex = selfOptions.curIndex;
			curIndex++;
			if (curIndex >= self.totalImgs) {
				curIndex = selfOptions.loop ? 0 : self.totalImgs - 1;
			}
			self.showImgAt(curIndex);
		},

		showPrev: function() {
			var self = this;
			var selfOptions = self.options;

			var curIndex = selfOptions.curIndex;
			curIndex--;
			if (curIndex <= 0) {
				curIndex = selfOptions.loop ? self.totalImgs - 1 : 0;
			}
			self.showImgAt(curIndex);
		},

		showImgAt: function(index) {
			var self = this;
			var selfOptions = self.options;
			console.log(index, self.targetViewIndex);
			if (!self.checkInitImgsLoad(index)) {
				self.pendingImgViewIndex = index;
				return false;
			}

			if (index === self.targetViewIndex) {
				return;
			} else if (self.targetViewIndex >= self.totalImgs) {
				self.targetViewIndex = self.totalImgs - 1;
			} else if (self.targetViewIndex <= 0) {
				self.targetViewIndex = 0;
			}

			self.targetViewIndex = index;
			self.initAnimationInterval();

			if (!self.isScrollerDragging && !self.changingCategory) {
				var l = self.totalImgs - 1;
				var tIndex = self.targetViewIndex;
				if (tIndex > l) {
					tIndex = l;
				}

				var curScrollX = Math.abs(Math.round(tIndex * ((self.scrollbarWidth - self.scrollerWidth) / l)));
				var tweenTime = Math.abs((self.targetViewIndex - selfOptions.curIndex) * 0.2);
				TweenLite.to(self.$scroller, tweenTime, {
					x: curScrollX,
					ease: Sine.easeOut
				});
			}

		},

		imgLoadHandler: function(e) {
			var self = this;
			var $img = $(e.target);
			if (e.type === 'load') {
				TweenLite.to($img, 0.6, {
					autoAlpha: 1,
					ease: Sine.easeOut
				});
			} else {
				self.logErorr('Oops "' + e.target.src + '" image loading failed :(');
			}

			if (self.curLoadingQueueSign == $img.data().loadingQueueSign) {
				self.loadingImgIndex++;
				self.setInitImgsLoadComplete();
			}
		},

		setInitImgsLoadComplete: function() {
			var self = this;
			if (self.totalLoadingImgs === self.loadingImgIndex && !self.initImgsLoadComplete) {
				self.initImgsLoadComplete = true;
				self.showImgAt(self.pendingImgViewIndex);
			}
		},

		checkImgLoad: function($img) {
			var self = this;
			if (!$img.hasClass('loaded')) {
				$img.addClass('loaded');
				self.totalLoadingImgs += 1;

				var imgLoaded = function(e) {
					self.imgLoadHandler(e);
				}

				$img.find('.img-content img[data-src]').attr('data-loading-queue-sign', self.curLoadingQueueSign).load(imgLoaded).error(imgLoaded).css('opacity', 0);
				$img.find('img[data-src]').each(function() {
					$this = $(this);
					$this.parent();
					var thisData = $this.data();
					if (!$this.attr('src') && thisData.src) {
						$this.attr('src', thisData.src);
					}
				});

			}
		},

		checkInitImgsLoad: function(index) {
			var self = this;
			var selfOptions = self.options;
			var maxPlusLoadIndex = index + self.totalImgToView;

			maxPlusLoadIndex = maxPlusLoadIndex > self.totalImgs ? self.totalImgs : maxPlusLoadIndex;
			var curImgLoadIndex = index;

			self.totalLoadingImgs = 0;
			self.loadingImgIndex = 0;
			self.curLoadingQueueSign++;
			for (var i = 0; i < maxPlusLoadIndex; i++) {

				self.checkImgLoad(self.$imgs.eq(i));

			}

			self.setInitImgsLoadComplete();

			return self.initImgsLoadComplete;
		},

		initScrollbar: function() {
			var self = this;
			var selfOptions = self.options;

			var dragHandler = function() {
				var curImgIndex = Math.abs(Math.round(Math.round(this.x) / (self.scrollbarWidth / self.totalImgs)));
				if (!self.changingCategory) {
					self.targetViewIndex = curImgIndex;
					if (curImgIndex === selfOptions.curIndex) {
						return;
					}
					self.rotate();
				}
			};

			Draggable.create(self.$scroller, {
				type: 'x',
				bounds: {
					left: 0,
					top: 0,
					width: self.scrollbarWidth,
					height: 0
				},
				onDrag: function() {
					dragHandler.call(this);
				},
				onDragStart: function() {
					self.isScrollerDragging = true;
				},
				onDragEnd: function(e) {
					dragHandler.call(this);
					self.isScrollerDragging = false;
					self.resetNextImgTime();
				}
			});

			self.$scrollbar.on('click', function(e) {
				var posX = e.offsetX || e.originalEvent.layerX;
				var curImgIndex = Math.abs(Math.round(posX / (self.scrollbarWidth / self.totalImgs)));
				if (curImgIndex >= self.totalImgs) {
					curImgIndex = self.totalImgs - 1;
				}
				self.showImgAt(curImgIndex);
			});

			self.$scroller.on('click', function(e) {
				e.stopPropagation();
			});

		},

		initController: function() {
			var self = this;
			var selfOptions = self.options;
			self.changingCategory = false;

			self.$elm.find('.imgs-type').on('click', function() {
				var $this = $(this);

				if (self.$curActiveType) {
					self.$curActiveType.removeClass('active');
				}

				self.$curActiveType = $this;
				self.setTypeSelection();
				$this.addClass('active');

				if (!self.changingCategory) {

					var hideIndex = (self.totalImgs + self.totalImgToView + 5);

					self.changingCategory = true;
					self.showImgAt(hideIndex);

					setTimeout(function() {
						self.changingCategory = false;
						selfOptions.curIndex = 0;
						self.initCarousel();
					}, hideIndex * self.intervalTime);
				}
			});

			//swipe move
			var touchStart = 0;
			var touchEnd = 0;
			var touchDiff = 10;
			self.$elm.find('.imgs-container').bind('touchstart touchmove touchend touchcancel', function(e) {

				var curTouch = e.originalEvent.touches[0];
				var eType = e.type;

				if (eType === 'touchstart') {
					touchStart = curTouch.pageX;
				} else if (eType === 'touchmove') {
					touchEnd = curTouch.pageX;
					e.preventDefault();
				} else if (eType === 'touchend' || eType === 'touchcancel') {
					if (touchEnd > touchStart + touchDiff) {
						self.showPrev();
					} else if (touchEnd < touchStart - touchDiff) {
						self.showNext();
					}
				}

			});

		},

		resetNextImgTime: function() {
			var self = this;
			var selfOptions = self.options;

			//autoSlide
			clearTimeout(self.autoSlideTimeoutId);
			if (selfOptions.autoSlide && !self.changingCategory && !self.isScrollerDragging) {
				self.autoSlideTimeoutId = setTimeout(function() {
					self.showNext();
				}, selfOptions.autoSlideDelay * 1000);
			}

		},

		setTypeSelection: function() {
			var self = this;
			var selfOptions = self.options;

			TweenLite.to(self.$elm.find('.img-selectbar').eq(0), 0.8, {
				x: self.$curActiveType.position().left,
				ease: Expo.easeOut
			});
		},

		logErorr: function($msg) {
			if (console && typeof console.error === 'function') {
				console.error($msg);
			}
		}

	};



	$.fn.imgCarousel3d = function(options) {

		return this.each(function() {
			var imgCarousel3d = Object.create(ImgCarousel3d);
			imgCarousel3d.init(this, options);
		});

	};

	$.fn.imgCarousel3d.defaults = {
		viewableImgs: 5,
		curIndex: 0,
		radius: 960,
		borderColor: 'rgba(220, 220, 220,0)',
		activeBorderColor: 'rgba(220, 220, 220,1)',
		autoSlide: false,
		autoSlideDelay: 5, // in seconds		
		loop: false,
		imgRotation: true
	};


})(jQuery, window, document);
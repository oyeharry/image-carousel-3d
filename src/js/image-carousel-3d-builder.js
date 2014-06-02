;(function($, window, document, undefined) {

	var ImgCarousel3dBuilder = {

		init: function(elm, options) {
			var self = this;
			self.$elm = $(elm);
			self.elm = elm;

			var mrqOptions = self.options = $.extend({}, $.fn.buildImgCarousel3d.defaults, options);
			mrqOptions.dataFileUrl = typeof options === 'string' ? options : mrqOptions.dataFileUrl;

			mrqOptions.dataFileUrl = mrqOptions.dataFileUrl || mrqOptions.dataPath + mrqOptions.dataFile;

			self.loadData();
		},

		loadData: function() {
			var self = this;
			var selfOptions = self.options;

			$.ajax({
				url: selfOptions.dataFileUrl,
				dataType: selfOptions.jsonp ? 'jsonp' : 'json',
			}).done(function(d) {

				self.carouselData = d;

				self.parseData();
				self.buildDom();
			});


		},

		parseData: function() {
			var self = this;
			var selfOptions = self.options;

			$(self.carouselData.list).each(function(i, item) {

				$(item.list).each(function(j, jItem) {

					jItem.img = selfOptions.assetPath + jItem.img;

					if (!jItem.target) {
						jItem.target = jItem.link.match(window.location.host) ? '_self' : '_blank';
					}
				});

			});

		},

		buildDom: function() {
			var self = this;
			var selfOptions = self.options;

			self.$template = $('#' + selfOptions.templateId);

			//woohooooooooooooo Hogan is awesomeeeeeeeeeeee !!!!!!!!!! 
			var hogan = Hogan.compile(self.$template.html());
			self.$elm.html(hogan.render(self.carouselData)); //and html is build

			self.$elm.imgCarousel3d(selfOptions);
		}

	};



	$.fn.buildImgCarousel3d = function(options) {

		return this.each(function() {
			var imgCarousel3dBuilder = Object.create(ImgCarousel3dBuilder);
			imgCarousel3dBuilder.init(this, options);
		});

	};

	$.fn.buildImgCarousel3d.defaults = {
		dataFile: 'ps_plus_data.json',
		dataFileUrl: '',
		dataPath: '',
		assetPath: '',
		jsonp: false,				
		templateId: ''
	};


})(jQuery, window, document);
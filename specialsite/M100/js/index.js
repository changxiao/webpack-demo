(function($){
	$(function(){
		var Slider = window.Slider;
		var bannerSlider = new Slider($('#banner_tabs'), {
			time: 3000,
			delay: 400,
			event: 'hover',
			auto: true,
			mode: 'fade',
			controller: $('#bannerCtrl'),
			activeControllerCls: 'active'
		});
		$('#banner_tabs .flex-prev').click(function () {
			bannerSlider.prev();
		});
		$('#banner_tabs .flex-next').click(function () {
			bannerSlider.next();
		});

		var pageCtr = function(){
			this.pages = $('.page');
			this.dt = [];
			this.init();
			this.scroll();
			$(window).resize(function(){
				this.dt = [];
				this.init();
			});
			setTimeout(() => {
				this.dt = [];
				this.init();
			}, 1000);
		};
		pageCtr.prototype = {
			init:function(){
				var pages = this.pages;
				for(var i = 0 ;i<pages.length;i++){
					this.dt.push({
						P:pages.eq(i).offset().top,
						H:pages.eq(i).height(),
					});
				}
			},
			scroll:function(){
				var _this = this;
				$(window).scroll(function() {
					var sTop = $(window).scrollTop();
					for(var i = 0 ;i<_this.dt.length;i++){
						var H = _this.dt[i].H;
						var P = _this.dt[i].P;
						if(sTop >= P - H/2 && sTop <= P + H){
							_this.pages.eq(i).addClass('pageshow');
						}else{
							_this.pages.eq(i).removeClass('pageshow');
						}
					}
				});
			}
		};
		new pageCtr();

		// 相机换皮肤
		var Camera = function(){
			var c1 = $('.ca');
			var c2 = $('.caName');
			var f1 = $('.pf');
			var f2 = $('.pfName');
			c1.click(function(){
				c1.removeClass('on');
				$(this).addClass('on');
				c2.removeClass('on');
				c2.eq( $(this).index() - 1).addClass('on');
				f2.removeClass('on');
			});
			f1.click(function(){
				f1.removeClass('on');
				$(this).addClass('on');
				f2.removeClass('on');
				f2.eq( $(this).index() - 1).addClass('on');
			});
		};
		new Camera();

		//弹层
		var pop =function(){
			var btn = $('.y_gz');
			var mask = $('.y_mask');
			var off = $('.y_off');
			btn.click(function(){
				mask.css('display','block');
			});
			off.click(function(){
				mask.css('display','none');
			});
		};
		new pop();
		//
		// $('.y_zhan').click(function(){
		// 	$(this).addClass('on')
		// })
		//
		var myVid = document.getElementById('my_video');
		myVid.muted=true;

		var $popwin = $('.pnpopwin');
		var $popclose = $('.btnclosepn');
		var $pnleft = $('.pnleft');
		var $pnright = $('.pnright');
		var $actBtn = $('.btn_pn');
		var $ul = $('.pnul');
		var pnjudge = 0;
		var pntime = false;
		var pnspeed = 300;
		$actBtn.click(function() {
			$popwin.show('slow');
		});
		$popclose.click(function() {
			$popwin.hide('slow');
		});

		$pnright.click(function () {
			if (pntime) {
				return;
			}

			pntime = true;
			pnjudge = pnjudge % 2;
			if (pnjudge == 0) {
				$ul.css({
					marginLeft: '0'
				}).animate({
					marginLeft: '-820px'
				}, pnspeed,function () {
					pntime = false;
				});
			}
			if (pnjudge == 1) {
				$ul.animate({
					marginLeft: '-1640px'
				}, pnspeed, function () {
					pntime = false;
				});
			}
			pnjudge = pnjudge + 1;
		});
		$pnleft.click(function () {

			if (pntime) {
				return;
			}
			pntime = true;
			pnjudge = pnjudge % 2;
			if (pnjudge == 0) {
				$ul.css({
					marginLeft: '-1640px'
				}).animate({
					marginLeft: '-820px'
				}, pnspeed, function () {
					pntime = false;
				});
			}
			if (pnjudge == 1) {
				$ul.animate({
					marginLeft: '0'
				}, pnspeed, function () {
					pntime = false;
				});
			}
			pnjudge = pnjudge - 1;
			if( pnjudge < 0) {
				pnjudge = 2 + pnjudge;
			}
		});
	});
})(jQuery);
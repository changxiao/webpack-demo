/**
 * 页面功能集成
 * date  : 2013.01.18
 * author: zhangliang
 * */
(function (window, $) {
	var option = {
		'eventElement': 'openvideo',//绑定元素
		'actionEvent': 'click',//event
		'swfpath': '8A93F9E061BB808F'//播放器路径
	};	

	function video(config) {
		this.config = $.extend(option, config||{});
	}

	$.extend(video.prototype, {
		init: function() {
			this._bindEvent();
		},
		_bindEvent: function() {//bind event
			var self = {'self':this};
			$('[action-type='+ this.config.eventElement +']').bind(this.config.actionEvent, self, this._showpop);

			$(window).resize(function() {
			    var width = $(this).width();
			    var height = $(this).height();
			    
			    $('[node-type=popup_mask_layer]').css({'height': height+'px'});
			    self.self._repop();
			    //console.log(width+'=='+height);
			});
		},
		_showpop: function(e) {//POP弹出
			var self = e.data.self,
			strhtml = '',
			elementData = '';

			$('[node-type=popup_show_video]').remove();
			self._getElementData($(this));
			elementData = $('body').data('uriData');
			strhtml = self.popupHtml({
				'title': $(this).attr('node-type-title') || '',
				'swf_arr': elementData
			});
			$('body').append(strhtml);

			//给暗色背景设置高度
			$('[node-type=popup_mask_layer]').css({'height': $(document).height()+'px'});
			//页面渲染成功 绑定相关事件
			self._getIdArr();
			(function() {
				setTimeout(function() {
					self._getApi(0);
				}, '400');
			})();

			self._close();
			//self._switchSwf();

			$('[node-type=popup_mask_layer]').css({
				height: self._getPageSize(1),
				width: self._getPageSize(0),
				opacity: 0.8,
				display: 'block'
			}).fadeIn();

			self._repop();
			return false;
		},
		_repop: function(idx) {//重绘
			var self = this,
			pageScroll = self._showpopPageScroll(),
			elementData = $('body').data('uriData');

			if(typeof(elementData) == 'undefined') return false;
			if(!idx) idx = 0;
			//console.log(self._getPageSize()[2]/2);
			var h=($(window).height() - (elementData[idx].height*1 + 80))/2+$(window).scrollTop();
			if(h<1){
				h=1;
			}
			$('[node-type=popup_show_video]').css({
				top:h,
				//top: ($(window).height() - (elementData[idx].height*1 + 80))/2+$(window).scrollTop(),
				//left: ($(window).width() - (elementData[idx].width*1 + 80))/2,
				left: ($(window).width() - (elementData[idx].width*1 + 80))/2,
				width:elementData[idx].width*1 + 80,
				height:elementData[idx].height*1 + 80
			}).show();
		},
		_getElementData: function(_this) {//videoid:345|width:200|height:200|listid:1231|autoplay:1
		/*
			var arrData = [], objData = {}, objIdData =[];
			for(var i=1; i<= 6; i++) {
				var uri = _this.attr('node-type-uri'+i);
				if(!uri) break;
				var sp_uri = uri.split('|');

				objData = {index: i-1,videoid:sp_uri[0], width:sp_uri[1], height: sp_uri[2], listid:sp_uri[3], autoplay:sp_uri[4], size_str: sp_uri[1]+'*'+sp_uri[2]};
				objIdData.push(sp_uri[0]);//videoid
				arrData.push(objData);
			}
			$('body').data('uriData', arrData).data('videoid', objIdData.join(','));
		*/
			var arrData = [], objData = {}, objIdData =[];
			var _videoid = _this.attr('node-type-videoid'),
			_definition = _this.attr('node-type-definition'),
			_autoplay = _this.attr('node-type-autoplay'),
			_listid = _this.attr('node-type-listid'),
			_width=_this.attr('node-type-width'),
			_height=_this.attr('node-type-height');
			//_width = 720,
			//_height = 406;
       if(_definition=="hd")
		   {
			   _definition="2";
		   }
			else
		   {
			   _definition="1";
		   }
			if(_autoplay=="1")
			{
				_autoplay = "true";
			}
			else
			{
				_autoplay = "false";
			}
			objData= {index: 0,videoid:_videoid, listid:_listid, autoplay:_autoplay, width:_width, height:_height, size_str: _width+'*'+_height, definition:_definition};
			arrData.push(objData);
			$('body').data('uriData', arrData);
		},
		_close: function() {//关闭pop和背投
			$('[action-type=close]').bind('click', function() {
				$('[node-type=popup_show_video]').remove();
				$('[node-type=popup_mask_layer]').remove();
				return false;
			});
		},
		_switchSwf: function() {//业务更改此方法暂时作废   切换SWF事件绑定
			var self = this;
			$('[action-type=switch_swf]').bind('click', function() {
				var idx = $(this).attr('node-type-index');
				self._getApi(idx);
			});
		},
		_getIdArr: function () {
			var videoid = $('body').data('videoid');

		},
		_getApi: function(elementNum) {//获取API数据
			var idx = elementNum,
			data = $('body').data('uriData'),
			//apiData = $('body').data('phpapiData'),
			self = this;

			$('[node-type=popup_show_video]').find('.adminyeazone_video_body').css({width:data[idx].width, height:data[idx].height});

			self._createSwf(idx, ''/* apiData['videoid_' + data[idx].videoid]*/, self);
			//JSONP获取异步数据  传值用GET形式
			//$.getJSON('http://js.com/x.php?callback=?&id='+data[idx].videoid, function(re) {
				//self._createSwf(idx, re.uri, self);
			//});
		},
		_createSwf: function(elementNum, swfurl, self) {//创建SWF元素

				var data = $('body').data('uriData'),
 		flashvars = {//给flash 传值的参数
					//siteid: data[elementNum].videoid,
					//vid: data[elementNum].listid
				},
				params = {'allowScriptAccess':'always', 'allowFullScreen': "true"},
				attributes = {'name':this.config.swfpath,'id':this.config.swfpath};
                 //使用地址传值，播放器使用默认值
				var playpath='http://p.bokecc.com/flash/single/'+data[elementNum].listid+'_'+data[elementNum].videoid+'_'+data[elementNum].autoplay+'_'+this.config.swfpath+'_'+data[elementNum].definition+'/player.swf';

         // var swfobj=new SWFObject(this.config.swfpath, 'playerswf', '100%', '100%', '8');
       //	swfobj.addVariable( "userid" ,data[elementNum].listid);	//	partnerID,用户id
    	//swfobj.addVariable( "videoid" , data[elementNum].videoid);	//	spark_videoid,视频所拥有的 api id
	  // swfobj.addVariable( "mode" , "api");	//	mode, 注意：必须填写，否则无法播放
    	//swfobj.addVariable( "autostart" , "true");	//	开始自动播放，true/false
	 // swfobj.addVariable( "jscontrol" , "true");	//	开启js控制播放器，true/false
	
	  //swfobj.addParam('allowFullscreen','false');
	 // swfobj.addParam('allowScriptAccess','always');
	  //swfobj.addParam('wmode','transparent');
    	//swfobj.write('swfvideo');

       

				 //console.log(data[elementNum].definition);
				// alert(data[elementNum].videoid);
				// alert(data[elementNum].listid);
				//self._repop(elementNum);
                
			swfobject.embedSWF(playpath, 'swfvideo', '100%', '100%', "10.1.0",  null, flashvars, params, attributes);
          
				//swfobject.embedSWF(this.config.swfpath, 'swfvideo', data[elementNum].width, data[elementNum].height, "9.0.0",  null, flashvars, params, attributes);
				//更改弹窗黑色元素大小
		},
		changeFlashSize: function(width, height) {
			$('.adminyeazone_video_body').css({'width': width,'height': height});
		},
		pageGlim: function(opacityNum) {//背投关灯
			$('[node-type=popup_mask_layer]').css({
				opacity: opacityNum,
				display: 'block'
			});
		},
		_showpopPageScroll: function() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;
			}
			arrayPageScroll = new Array(xScroll,yScroll);

			return arrayPageScroll;
		},
		_getPageSize: function () {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth;
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else {
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){
				pageWidth = xScroll;
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);


			return arrayPageSize;
		},
		popupHtml: function(obj) {//popup模板
			var swflist = '',
			tpl_html = '';

			for(var i=0, max = obj.swf_arr.length; i < max; i++) {
				swflist += ['<a href="javascript:;" action-type="switch_swf" node-type-index="',obj.swf_arr[i].index,'">',obj.swf_arr[i].size_str,'</a>'].join('');
				if(i != (obj.swf_arr.length*1-1))
					swflist += ['<span class="v01">|</span>'].join('');
			}

			tpl_html = '<div class="adminyeazone_mask_layer" node-type="popup_mask_layer">&nbsp;</div>\
			<div class="adminyeazone_show_video" node-type="popup_show_video" style="display: none;">\
				<div class="adminyeazone_c1">\
					<div class="adminyeazone_close" >\
						<a href="javascript:;" id="adminyeazone_closeDrag" action-type="close">关闭</a>\
						<!--<a href="javascript:;" onclick="changeVideoSize(300,180)">改变大小1</a>-->\
						<!--<a href="javascript:;" onclick="changeVideoSize(400,280)">改变大小2</a>-->\
						<!--<a href="javascript:;" onclick="changeVideoTitle(123)">改变标题</a>-->\
					</div>\
					<div class="adminyeazone_video_body" style="width: 480px; height: 270px;">\
					<span id="swfvideo"></span>\
					</div>\
					<div class="adminyeazone_video_bom">\
						<span class="adminyeazone_left">[广告] </span>\
						<p class="adminyeazone_left" node-type-title="jianeng_title">'+obj.title+'</p>\
						<p class="adminyeazone_right">\
							<!--'+swflist+'-->\
						</p>\
					</div>\
				</div>\
			</div>';

			return tpl_html;
		}

	});

	window.showbox= video;
})(window, jQuery);



//actions
jQuery(document).ready(function () {
	(new showbox()).init();
   
});

//关灯 开灯
function glim(status) {
	var _showbox = new showbox();
	//console.log('000123');
	switch(status) {
		case 'close':
			_showbox.pageGlim(1.0);
		break;
		case 'open':
			_showbox.pageGlim(0.8);
		break;
		default:
		break;
	}
}

//改变弹窗大小
function changeVideoSize(width, height) {
	var data = jQuery('body').data('uriData');

	//console.log(width +'=='+height);
	data[0].width = width;
	data[0].height = height;
	data[0].size_str = width+'*'+height;
	//console.log(data);
	(new showbox())._repop();
	(new showbox()).changeFlashSize(width,height);
	//(new showbox())._getApi(0);
}

//改变标题
//function changeVideoTitle(title) {
//	$('[node-type-title=jianeng_title]').html(title);
//}
function SHCanonTtile(title){
	jQuery('[node-type-title=jianeng_title]').html(title);
}

//更新视频播放器外部信息
function updateVideoInfo() {

}

//变换视频的类型
function changeVideoType(quality) {
	if(quality==1){
		changeVideoSize(720,406);
	}
	if(quality==2){
		changeVideoSize(960,540);
	}
	if(quality==3){
		changeVideoSize(1080,608);
	}
	
}

//跳转网址(分享)
function openwindow(url){
		window.open(url);
}
function on_spark_player_ready() {
		 //alert("播放器加载完毕");
	}
 function player_pause() { //	调用播放器暂停函数
		swfvideo["spark_player_pause"];
	}
 

  function on_cc_player_init(vid, objectId ){
	  
  var config = {};
  //alert("播放器加载完毕");
  //关闭右侧菜单
  //config.rightmenu_enable = 1;
  config.on_player_seek = "custom_seek";
  config.on_player_ready = "custom_player_ready";
  config.on_player_start = "custom_player_start";
  config.on_player_pause = "custom_player_pause";
  config.on_player_resume = "custom_player_resume";
  config.on_player_stop = "custom_player_stop";
  config.on_player_setquality="changeVideoType";
  
 
  var player = getSWF(objectId);
  //设置清晰度和大小
  player.setQuality("1");
  //changeVideoSize(720,406);
  player.setConfig(config);
  
}
function getSWF(swfID) { 
  if (window.document[ swfID ]) {
    return window.document[ swfID ];
  } else if (navigator.appName.indexOf("Microsoft") == -1) {
    if (document.embeds && document.embeds[ swfID ]) {
      return document.embeds[ swfID ];
    }
  } else {
    return document.getElementById( swfID );
  }
}

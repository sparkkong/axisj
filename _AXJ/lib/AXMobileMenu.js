﻿/*!
 * axisJ Javascript Library Version 1.0
 * http://axisJ.com
 * 
 * 아래 소스의 라이선스는 axisJ.com 에서 확인 하실 수 있습니다.
 * http://axisJ.com/license
 * axisJ를 사용하시려면 라이선스 페이지를 확인 및 숙지 후 사용 하시기 바람니다. 무단 사용시 예상치 못한 피해가 발생 하실 수 있습니다.
 */

var AXMobileMenu = Class.create(AXJ, {
    version: "AXMobileMenu V0.1",
    author: "tom@axisj.com",
	logs: [
		"2013-12-13 오전 10:53:43"
	],
    initialize: function(AXJ_super) {
		AXJ_super();
		
		this.moveSens = 0;
		this.config.moveSens = 1;
		this.touchMode;
		this.selectedPoi = null;
		this.config.width = 300;
		this.config.height = 388;
		this.config.reserveKeys = {
			labelKey:"label",
			urlKey:"url",
			targetKey:"target",
			addClassKey:"addClass",
			subMenuKey:"cn"
		};
    },
    init: function() {
		var cfg = this.config;
		
		/* 이벤트 대소문자 확장 */
		if(!cfg.onclick) cfg.onclick = cfg.onClick;
		
		//var close = this.close.bind(this);
		this.modal = new AXMobileModal();
		this.modal.setConfig({
			addClass:"AXMobileMenu",
			height: cfg.height,
			width: cfg.width,
			head:{
				close:{
					onclick:function(){
						
					}
				}
			},
			onclose: function(){
				//close();
			}
		});
		
    },
    open: function(){
    	var cfg = this.config;
    	/*
    	var obj = this.modal.open();
    	this.initMenu(obj);
    	*/
    	var onLoad = this.initMenu.bind(this);
    	this.modal.open(null, onLoad);
    },
    initMenu: function(obj){
    	var cfg = this.config;
    	this.modalObj = obj;
    	this.modalID = obj.jQueryModal.get(0).id;
    	
    	if(this.selectedPoi){
    		var lpoi = this.selectedPoi.last();
    		var apoi = this.selectedPoi.concat();
    		apoi.pop();
    		var menu = cfg.menu;
			jQuery.each(apoi, function(idx, P){
				if(idx == 0){
					menu = menu[P];
				}else{
					menu = menu[cfg.reserveKeys.subMenuKey][P];
				}
			});
			
			if(menu[cfg.reserveKeys.subMenuKey][lpoi][cfg.reserveKeys.subMenuKey] && menu[cfg.reserveKeys.subMenuKey][lpoi][cfg.reserveKeys.subMenuKey].length > 0){
				apoi.push(lpoi);
				var tpl = this.getMenu(this.modalID, menu[cfg.reserveKeys.subMenuKey][lpoi], apoi);
			}else{
				var tpl = this.getMenu(this.modalID, menu, apoi);
			}			
    	}else{
    		var tpl = this.getMenu(this.modalID, cfg.menu);
    	}
    	
		if(AXUtil.browser.mobile){
			//obj.modalBody.unbind("touchstart.AXMobileMenu").bind("touchstart.AXMobileMenu", this.touchstart.bind(this));
			var modalBodyID = obj.modalBody.get(0).id;
			var touchstart = this.touchstart.bind(this);
			this.touchstartBind = function () {
				touchstart();
			};
			if (document.addEventListener) {
				AXgetId(modalBodyID).addEventListener("touchstart", this.touchstartBind, false);
			}
		}else{
			obj.modalBody.unbind("mousedown.AXMobileMenu").bind("mousedown.AXMobileMenu", this.touchstart.bind(this));
		}

		obj.modalBody.attr("onselectstart", "return false");
		obj.modalBody.addClass("AXUserSelectNone");
		obj.modalBody.bind("click.AXMobileMenu", this.onclickModalBody.bind(this));
		
    	/* drag cancle */
    	//obj.modalBody.unbind("dragstart.AXMobileMenu").bind("dragstart.AXMobileMenu", this.cancelEvent.bind(this));
    	this.printMenu(tpl);
    },
    printMenu: function(tpl){
    	var obj = this.modalObj;
    	
    	obj.modalHead.empty();
    	obj.modalHead.append(tpl.headPo);
    	obj.modalBody.empty();
    	obj.modalBody.append(tpl.bodyPo);
    	obj.modalFoot.empty();
    	obj.modalFoot.append(tpl.pagePo);
    	
    	/*
    	obj.modalBody.hide();
    	obj.modalBody.fadeIn("300");
    	*/
    	obj.modalHead.find(".mobileMenuHome").bind("click", this.onclickHome.bind(this));
    	obj.modalHead.find(".mobileMenuPrev").bind("click", this.onclickPrev.bind(this));
    	
		this.menuPageWidth = obj.modalBody.find(".mobileMenuBodyPage").width() + 9;
    	this.mobileMenuBodyScroll = obj.modalBody.find(".mobileMenuBodyScroll");
    	obj.modalBody.find(".mobileMenuBodyScroll").css({width:tpl.pageNum * this.menuPageWidth});
    },
    getMenu: function(modalID, _menu, poi){    	
    	var cfg = this.config;
    	var countPerBlock = 9;
    	var menu = _menu;
    	var menuTitle = "";
    	if(poi == undefined || poi.length == 0) poi = [];
    	else{
    		menuTitle = menu[cfg.reserveKeys.labelKey];
    		menu = menu[cfg.reserveKeys.subMenuKey];
    	}

    	var headPo = [];
    	/* 현재 선택된 메뉴 선택 하는 기능구현 필요 */
    	headPo.push('<a ' + cfg.href + ' class="mobileMenuHome">home</a>');
    	if(menuTitle != ""){
    		headPo.push('<a ' + cfg.href + ' class="mobileMenuPrev" id="', modalID ,'_AX_menuTitle_AX_', poi.join("_"),'">', menuTitle,'</a>');
    	}
    	    	
    	var bodyPo = [];
    	bodyPo.push('<div class="mobileMenuBody">');
    	bodyPo.push('	<div class="mobileMenuBodyScroll" id="', modalID ,'_AX_bodyScroll">');
    	bodyPo.push('		<div class="mobileMenuBodyPage">');
    	
    	var ppoi = poi.join("_");
    	if(ppoi != "") ppoi += "_";
    	
    	var selectedPoi = "";
    	if(this.selectedPoi){
    		selectedPoi = this.selectedPoi.join("_");
    	}
    	
    	jQuery.each(menu, function(midx, M){
    		if(midx % countPerBlock == 0 && midx > 0){
    			bodyPo.push('	</div>');
    			bodyPo.push('	<div class="mobileMenuBodyPage">');
    		}
    		var addClass = [];
    		if(this[cfg.reserveKeys.addClassKey]){
    			addClass.push(this[cfg.reserveKeys.addClassKey]);
    		}
    		if(this[cfg.reserveKeys.subMenuKey] && this[cfg.reserveKeys.subMenuKey].length > 0){
    			addClass.push("hasSubMenu");
    		}
    		if(selectedPoi == (ppoi + midx)){
    			addClass.push("selected");
    		}
    		bodyPo.push('<a ' + cfg.href + ' class="mobileMenuItem ' + addClass.join(" ") + '" id="', modalID,'_AX_', ppoi, midx,'">');
    		bodyPo.push(this[cfg.reserveKeys.labelKey]);
    		bodyPo.push('</a>');
    	});
    	bodyPo.push('		</div>');
    	bodyPo.push('	</div>');
    	bodyPo.push('</div>');

		var pageNum = (menu.length / countPerBlock).floor();
		this.pageNo = 0;
		this.pageNum = pageNum;
    	var pagePo = [];
    	pagePo.push('<div class="mobileMenuFoot">');
    	jQuery.each(pageNum.rangeFrom(), function(pidx, p){
    		if(pidx == 0) pagePo.push('<div class="pageNav on" ');
    		else pagePo.push('<div class="pageNav" ');
    		pagePo.push(' id="', modalID ,'_AX_pageNav_AX_', pidx ,'"></div>');
    	});
    	pagePo.push('</div>');
    	
    	return {
    		headPo : headPo.join(''),
    		bodyPo : bodyPo.join(''),
    		pagePo : pagePo.join(''),
    		pageNum : (pageNum+1)
    	};
    },    
    close: function(){
    	var cfg = this.config;
    	this.modal.close();
    },
    setHighLight: function(menuID){
    	var cfg = this.config;
		
		var menu = cfg.menu;
		var pois = "";
		
		var treeFn = function(subTree, parentPoi){
			jQuery.each(subTree, function(idx, M){
				if(M[cfg.reserveKeys.primaryKey] == menuID){
					pois = parentPoi + "_" + idx;
					return false;
				}else{
					if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], parentPoi + "_" + idx);
				}
			});
		};
		
		jQuery.each(menu, function(idx, M){
			if(M[cfg.reserveKeys.primaryKey] == menuID){
				pois = idx;
				return false;
			}else{
				if(M[cfg.reserveKeys.subMenuKey] && M[cfg.reserveKeys.subMenuKey].length > 0) treeFn(M[cfg.reserveKeys.subMenuKey], idx);
			}
		});

		var poi = pois.split(/_/g);
		this.selectedPoi = poi;
    },
    onclickModalBody: function(event){
    	var cfg = this.config;
		var eid = event.target.id.split(/_AX_/g);
		var eventTarget = event.target;
		var myTarget = this.getEventTarget({
			evt : eventTarget, evtIDs : eid,
			until:function(evt, evtIDs){ return ($(evt.parentNode).hasClass("mobileMenuBodyScroll")) ? true:false; },
			find:function(evt, evtIDs){ return ($(evt).hasClass("mobileMenuItem")) ? true : false; }
		});
		
		if(myTarget){
			//something
			//trace(myTarget.id);
			var poi = myTarget.id.split(/_AX_/g).last();
			var menu = cfg.menu;
			var apoi = poi.split(/_/g);
			jQuery.each(apoi, function(idx, P){
				if(idx == 0){
					menu = menu[P];
				}else{
					menu = menu[cfg.reserveKeys.subMenuKey][P];
				}
			});
			
			if(menu[cfg.reserveKeys.subMenuKey] && menu[cfg.reserveKeys.subMenuKey].length > 0){
				/* animated menu */
				var menuItem = this.modalObj.modalBody.find("#"+myTarget.id);
				var menuItemPos = menuItem.position();
				trace(menuItemPos);
				var mobileMenuBody = this.modalObj.modalBody.find(".mobileMenuBodyScroll");
				var bodyPos = mobileMenuBody.position();
				var cloneMenuItem = jQuery("<div class='mobileMenuItemGhost' id='"+this.modalID+"_AX_cloneMenuItem'>" + menuItem.html() + "</div>");
				mobileMenuBody.append(cloneMenuItem);
				cloneMenuItem.css({
					position:"absolute",
					left:menuItemPos.left,
					top:menuItemPos.top
				});

				var getMenuBind = this.getMenu.bind(this);
				var printMenuBind = this.printMenu.bind(this);
				var modalID = this.modalID;
				cloneMenuItem.animate({left:9 - bodyPos.left, top:0, width:270, height:270}, 300, "expoOut").animate({opacity:0}, 100, "expoOut", function () {
					var tpl = getMenuBind(modalID, menu, apoi);
					printMenuBind(tpl);
				});
				//alert(AXgetId(this.modalID+"_AX_cloneMenuItem"));
				//menuItem.animate({width:300, height:300});
				
				return;
				var tpl = this.getMenu(this.modalID, menu, apoi);
				this.printMenu(tpl);
			}else{
				if(cfg.onclick){
					cfg.onclick.call(menu, menu);
				}
			}
		}
    },
    onclickHome: function(event){
    	var cfg = this.config;
    	var tpl = this.getMenu(this.modalID, cfg.menu);
    	this.printMenu(tpl);
    },
    onclickPrev: function(event){
    	var cfg = this.config;
    	var poi = event.target.id.split(/_AX_/g).last();
		var menu = cfg.menu;
		var apoi = poi.split(/_/g);
		apoi.pop();
		
		jQuery.each(apoi, function(idx, P){
			if(idx == 0){
				menu = menu[P];
			}else{
				menu = menu[cfg.reserveKeys.subMenuKey][P];
			}
		});
    	
    	var tpl = this.getMenu(this.modalID, menu, apoi);
    	this.printMenu(tpl);
    },
    /* 메뉴 터치 이동관련 함수 - s */
	touchstart: function (e) {
		var cfg = this.config;

		var touch;
		var event = window.event;
		if (AXUtil.browser.mobile){
			touch = event.touches[0];
			if (!touch.pageX) return;
		}else{
			var event = e;
			touch = {
				pageX : e.pageX, 
				pageY : e.pageY
			};
		}
		
		this.touchStartXY = {
			sTime: ((new Date()).getTime() / 1000),
			sLeft:  this.mobileMenuBodyScroll.position().left,
			x: touch.pageX,
			y: touch.pageY
		};

		if(AXUtil.browser.mobile){
			var event = window.event;
			var touchEnd = this.touchEnd.bind(this);
			this.touchEndBind = function () {
				touchEnd(event);
			};	
			var touchMove = this.touchMove.bind(this);
			this.touchMoveBind = function () {
				touchMove(event);
			};
			if (document.addEventListener) {
				document.addEventListener("touchend", this.touchEndBind, false);
				document.addEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			jQuery(document.body).bind("mouseup.AXMobileMenu", this.touchEnd.bind(this));
			jQuery(document.body).bind("mousemove.AXMobileMenu", this.touchMove.bind(this));
		}
		
		this.mobileMenuBodyScroll.stop();
	},
	touchMove: function (e) {
		if (this.touhEndObserver) clearTimeout(this.touhEndObserver); //닫기 명령 제거
		var cfg = this.config;
		
		var touch;
		var event = window.event;
		if (AXUtil.browser.mobile){
			touch = event.touches[0];
			if (!touch.pageX) return;
		}else{
			var event = e;
			touch = {
				pageX : e.pageX, 
				pageY : e.pageY
			};
		}
		
		if ((this.touchStartXY.x - touch.pageX).abs() < (this.touchStartXY.y - touch.pageY).abs()) {
			//this.touchMode = ((this.touchStartXY.y - touch.pageY) <= 0) ? "up" : "dn"; /* 위아래 이동 */
		} else if ((this.touchStartXY.x - touch.pageX).abs() > (this.touchStartXY.y - touch.pageY).abs()) {
			//this.touchMode = ((this.touchStartXY.x - touch.pageX) <= 0) ? "lt" : "rt"; /* 좌우 이동 */
			
			this.moveBlock(touch.pageX - this.touchStartXY.x);
			if (event.preventDefault) event.preventDefault();
			else return false;
			
		}
		if (((this.touchStartXY.x - touch.pageX).abs() - (this.touchStartXY.y - touch.pageY).abs()).abs() < 5) {
			//this.touchSelecting = true;
		}
	},
	touchEnd: function (e) {
		var cfg = this.config;
		var event = window.event || e;
		//this.moveSens = 0;
		//this.touchMode = false;
		
		if(AXUtil.browser.mobile){
			if (document.removeEventListener) {
				document.removeEventListener("touchend", this.touchEndBind, false);
				document.removeEventListener("touchmove", this.touchMoveBind, false);
			}
		}else{
			jQuery(document.body).unbind("mouseup.AXMobileMenu");
			jQuery(document.body).unbind("mousemove.AXMobileMenu");
		}
		
		var moveEndBlock = this.moveEndBlock.bind(this);
		this.touhEndObserver = setTimeout(function () {
			moveEndBlock();
		}, 10);
	},
	moveBlock: function(moveX){
		var cfg = this.config;
		var newLeft = (this.touchStartXY.sLeft + (moveX * 1.5));
		if(newLeft > this.menuPageWidth*0.5){
			newLeft = this.menuPageWidth*0.5;
		}else if(newLeft < ( - this.mobileMenuBodyScroll.width()) * 0.8){
			newLeft = ( - this.mobileMenuBodyScroll.width()) * 0.8;
		}
		this.mobileMenuBodyScroll.css({left: newLeft});
	},
	moveEndBlock: function(){
		/* 관성발동여부 체크 */
		if(!this.touchStartXY) return;
		var sTime = this.touchStartXY.sTime;
		var eTime = ((new Date()).getTime() / 1000);
		var dTime = eTime - sTime;
		var eLeft = this.mobileMenuBodyScroll.position().left;
		var dLeft = eLeft - this.touchStartXY.sLeft;
		var velocity = Math.ceil((dLeft/dTime)/10); // 속력= 거리/시간
		var endLeft = Math.ceil(eLeft + velocity); //스크롤할때 목적지
		/*trace({eLeft: eLeft, velocity:velocity, endLeft:endLeft});*/
		if(endLeft > 0){
			endLeft = 0;
		}		
		var calLeft = (endLeft.abs() % this.menuPageWidth);
		var absPage = (endLeft.abs() / this.menuPageWidth).floor();
		var newLeft = 0;
		if(calLeft < this.menuPageWidth/2){
		}else{
			absPage += 1;
		}
		if(absPage > this.pageNum) absPage = this.pageNum;
		newLeft = this.menuPageWidth * absPage;
		
		//trace(absPage);
		this.touchStartXY.sLeft = -newLeft;

		this.mobileMenuBodyScroll.animate({left: -newLeft}, (this.mobileMenuBodyScroll.position().left + newLeft).abs(), "cubicOut", function () {});
		this.modalObj.modalFoot.find('#' + this.modalID + '_AX_pageNav_AX_' + this.pageNo).removeClass("on");
		this.modalObj.modalFoot.find('#' + this.modalID + '_AX_pageNav_AX_' + absPage).addClass("on");
		
		this.pageNo = absPage;
		
		this.touchStartXY = null;
	},
	/* 메뉴 터치 이동관련 함수 - e */
	
	cancelEvent: function (event) {
		event.stopPropagation(); // disable  event
		return false;
	}
});
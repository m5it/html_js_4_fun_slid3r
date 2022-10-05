/**
  * 4.10.22 (pure JS)
  * ------------------------------------------------------------
  * Slid3r() thing by t3ch aka B.K. aka grandekos etc...
  --------------------------------------------------------
  * first time used to control remote car with mobile and ESP32 wroom
  --------------------------------------------------------------
  * Example usage:
  * (new Slid3r({
  *      doubleside:true,
  *      element   :document.querySelector(".slider.hor .field"),
  *      onscroll  :function(e,pR,result) {
  *          document.querySelector(".slider.hor .info").innerText = result+" speed.";
  *      },
  *  }));
  * 
  */
var Slid3r = function( opt ) {
	//
	var opt_elm        = ( typeof(opt)=='object' && typeof(opt['element'])!='undefined'?opt.element:null );
	var opt_onscroll   = ( typeof(opt)=='object' && typeof(opt['onscroll'])=='function'?opt.onscroll:null );
	var opt_onstart    = ( typeof(opt)=='object' && typeof(opt['onstart'])=='function'?opt.onstart:null );
	var opt_onend      = ( typeof(opt)=='object' && typeof(opt['onend'])=='function'?opt.onend:null );
	var opt_onended    = ( typeof(opt)=='object' && typeof(opt['onended'])=='function'?opt.onended:null );
	var opt_vertical   = ( typeof(opt)=='object' && typeof(opt['vertical'])!='undefined'?opt.vertical:false );     // default=false=horisontal OR vertical=true
	var opt_doubleside = ( typeof(opt)=='object' && typeof(opt['doubleside'])!='undefined'?opt.doubleside:false ); // doubleside=true then cursor is centered in middle=0, bottom=-255, top=255 or horizontal left,right,center..
	var opt_maxresult  = ( typeof(opt)=='object' && typeof(opt['maxresult'])!='undefined'?opt.maxresult:255 );
	//
	if( opt_elm==null ) {
		console.warn("Error: you didn't define opt.element.",opt);
		return false;
	}
	//
	var _this      = this,
	    sWH        = null/*scrollWidth|scrollHeight -> depend on opt_vertical*/, 
	    oWH        = null/*offsetWidth|offsetHeight -> depend on opt_vertical*/, 
	    sTL        = null/*scrollLeft|scrollTop     -> depend on opt_vertical*/, 
	    pR         = null/*calculate percentage*/, 
	    valueOfOne = null, 
	    result     = 0,
	    scrollSize = null/*size of scroll space*/,
	    // events when fired scroll is centered. (opt_doubleside=true)
	    events=["mouseup","touchend","mousedown","touchstart"],
	    check_ended=false;
	//
	this.getResult = function() {
		return result;
	}
	//
	function calcResult() {
		scrollSize = sWH - oWH;
		//
		if( opt_doubleside ) {
			var tmp = 0;
			if( sTL<( scrollSize/2 ) ) {
				tmp =  (scrollSize/2)-sTL;
			}
			else {
				tmp =  sTL-(scrollSize/2);
			}
			pR = ((tmp*2)*100)/(sWH-oWH);
		}
		else {
			pR = (sTL*100)/(sWH-oWH);         // current percent depend on scrollWidth
		}
		result = Math.ceil(pR*valueOfOne);
		// Make value negative so we know what side scroll is dragged
		if( opt_doubleside && ((!opt_vertical && sTL<( scrollSize/2 )) || (opt_vertical && sTL>( scrollSize/2 ))) ) {
			result = result * (-1);
		}
	}
	//
	function centerScroll() {
		//
		if( opt_vertical ) opt_elm.scrollTop  = scrollSize/2;
		else               opt_elm.scrollLeft = scrollSize/2;
	}
	//
	sWH        = (opt_vertical?opt_elm.scrollHeight:opt_elm.scrollWidth);
	oWH        = (opt_vertical?opt_elm.offsetHeight:opt_elm.offsetWidth);
	sTL        = (opt_vertical?opt_elm.scrollTop:opt_elm.scrollLeft);
	valueOfOne = opt_maxresult/100;    // 255 = max analog value, 100 = percent
	calcResult();
	
	// on initialization, Center cursor if double side
	if( opt_doubleside ) {
		centerScroll();
	}
	
	// init events to center scroll when button is released
	for(var i=0; i<events.length;i++) {
		(function(i) {
			opt_elm.addEventListener(events[i],function(e) {
				if     (opt_doubleside && (e.type=="mouseup" || e.type=="touchend"))        centerScroll();
				else if(opt_onstart!=null && (e.type=="mousedown" || e.type=="touchstart")) {
					opt_onstart(_this);
					check_ended = false;
				}
				if     (opt_onend!=null && (e.type=="mouseup" || e.type=="touchend"))       {
					opt_onend(_this);
					check_ended = true;
				}
			});
		})(i);
	}
	
	// init onscroll event.
	opt_elm.onscroll = function(e) {
		//
		sWH     = (opt_vertical?opt_elm.scrollHeight:opt_elm.scrollWidth);
		oWH     = (opt_vertical?opt_elm.offsetHeight:opt_elm.offsetWidth);
		sTL     = (opt_vertical?opt_elm.scrollTop:opt_elm.scrollLeft);
		//
		calcResult();
		
		//console.warn("Slid3r() sWH: "+sWH+", oWH: "+oWH+", sTL: "+sTL+", valueOfOne: "+valueOfOne+", pR: "+pR+", result: "+result);
		//
		if( check_ended && result==0 && opt_onended!=null ) opt_onended(_this);
		// Fire opt_onscroll() if defined.
		if(opt_onscroll!=null) opt_onscroll(_this);
	}
}

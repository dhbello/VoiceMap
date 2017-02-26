//>>built
define("esri/dijit/Print","dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/has dojo/dom dojo/dom-class dojo/dom-construct dijit/Menu dijit/MenuItem dijit/form/Button dijit/form/ComboButton ../tasks/PrintTask ../tasks/PrintParameters ../kernel ../domUtils ../Evented dojo/i18n!../nls/jsapi".split(" "),function(f,c,l,m,n,p,g,h,q,r,s,t,u,v,w,k,x,y){f=f([x],{declaredClass:"esri.dijit.Print",_eventMap:{"print-complete":["result"],error:!0,"print-start":!0},onPrintComplete:function(){},
onError:function(){},onPrintStart:function(){},constructor:function(a,b){a=a||{};this.url=a.url;this.async=a.async;this.map=a.map;this.templates=a.templates;this.extraParams=a.extraParameters;var e=y.widgets.print;this._printText=e.NLS_print;this._printingText=e.NLS_printing;this._printoutText=e.NLS_printout;this.templates||(this.templates=[{label:this._printText,format:"PNG32",layout:"MAP_ONLY",exportOptions:{width:800,height:1100,dpi:96}}]);this.printDomNode=h.create("div");g.add(this.printDomNode,
"esriPrint");b=p.byId(b);b.appendChild(this.printDomNode)},startup:function(){this._createPrintButton()},destroy:function(){this.map=null;h.destroy(this.printDomNode)},hide:function(){k.hide(this.printDomNode)},show:function(){k.show(this.printDomNode)},printMap:function(a){this.onPrintStart();this._printButton.setAttribute("label",this._printingText);this._printButton.setAttribute("disabled",!0);var b=this.map,e=new u(this.url,{async:this.async}),d=new v;d.map=b;d.template=a;d.extraParameters=this.extraParams;
e.execute(d,c.hitch(this,this._printComplete),c.hitch(this,this._printError))},_createPrintButton:function(){var a=this.templates;if(1===a.length)this._printButton=new s({label:this._printText,onClick:c.hitch(this,function(){this.printMap(a[0])})}),this.printDomNode.appendChild(this._printButton.domNode);else{this._printButton=new t({label:this._printText,onClick:c.hitch(this,function(){this.printMap(a[0])})});this.printDomNode.appendChild(this._printButton.domNode);var b=new q({style:"display: none;"});
m.forEach(a,function(a){var d=new r({label:a.label,onClick:c.hitch(this,function(){this.printMap(a)})});b.addChild(d)},this);this._printButton.setAttribute("dropDown",b)}g.add(this._printButton.domNode,"esriPrintButton")},_printComplete:function(a){this.onPrintComplete(a);this._printButton.domNode.style.display="none";a=h.create("a",{href:a.url,target:"_blank",innerHTML:this._printoutText});l.connect(a,"onclick",c.hitch(this,this._hyperlinkClick));this._removeAllChildren(this.printDomNode);g.add(a,
"esriPrintout");this.printDomNode.appendChild(a)},_printError:function(a){this._removeAllChildren(this.printDomNode);this._createPrintButton();console.error(a);this.onError(a)},_hyperlinkClick:function(){this._removeAllChildren(this.printDomNode);this._createPrintButton()},_removeAllChildren:function(a){for(;a.hasChildNodes();)a.removeChild(a.lastChild)}});n("extend-esri")&&c.setObject("dijit.Print",f,w);return f});
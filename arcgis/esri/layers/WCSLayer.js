//>>built
define("esri/layers/WCSLayer","dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/Deferred dojo/when dojo/io-query dojo/has ../kernel ../request ../deferredUtils ./BaseRasterLayer ./WCSConnection ./Raster ./rasterFormats/ImageCanvasDecoder ./pixelFilters/StretchFilter ../geometry/Extent ../geometry ../graphic".split(" "),function(x,h,y,s,E,F,G,H,I,w,q,J,z,K,L,A,u,M){var B=function(a,d){var b;for(b=0;b<a.length;b++)if(d(a[b]))return b;return-1},N=function(a,d){var b;for(b=0;b<a.length;b++)if(d(a[b]))return a[b]},
t=function(a,d,b){var c;if(b)for(c=0;c<a.length;c++){if(a[c][b].toLowerCase()===d.toLowerCase())return a[c]}else for(c=0;c<a.length;c++)if(a[c].toLowerCase()===d.toLowerCase())return a[c]},D={parse:function(a){var d={isMultiPart:!0,data:null},b=this._getMultiPartHeader(a);b?(d.isMultiPart=!0,d.data=this._getParts(a.data,b)):(d.isMultiPart=!1,d.data=a.data);return d},_getParts:function(a,d){var b=0,c=0,e=b=0,f=[],h=[],k=[],g=[],m,p;m="--"+d.boundary;p="--"+d.boundary+"\n";for(var v="\n--"+d.boundary+
"--",l=[10],C=[13,10],b=0;b<m.length;b++)h.push(m.charCodeAt(b));for(b=0;b<p.length;b++)k.push(p.charCodeAt(b));for(b=0;b<v.length;b++)g.push(v.charCodeAt(b));m=m.length;k=new Uint8Array(a);p=Math.min(1E4,k.length);for(b=0;b<p;b++)k[b]===h[e]?e===m-1?(e=0,c&&f.push(this._parsePart(k.subarray(c,b+1-m),d)),k[b+1]===l[0]?b+=1:k[b+1]===C[0]&&k[b+2]===C[1]&&(b+=2),c=b+1):e++:e=0;for(b=k.length-g.length-2;b<k.length;b++)if(k[b]===g[e])if(e===g.length-1){b=b-g.length+1;f.push(this._parsePart(k.subarray(c,
b),d));break}else e++;else e=0;return f},_getMultiPartHeader:function(a){var d,b,c=a.getHeader("Content-Type").split(";");if("multipart/related"===c[0]||"multipart/mixed"===c[0]){d={boundary:"",start:"",type:""};for(a=1;a<c.length;a++)b=c[a].split("\x3d"),d[b[0].trim()]=b[1].trim().slice(1,b[1].length-1)}return d},_parsePart:function(a,d){var b=String.fromCharCode.apply(null,a.subarray(0,Math.min(300,a.length))).split("\n"),c=0,e=0,f,h=Math.min(b.length,7);f={contentType:null,contentDescription:null,
contentTransferEncoding:null,contentID:null,contentDisposition:null,contentData:null,contentLocation:null};for(var k,g,c=0;c<h;c++)if(4>b[c].length)e=e+b[c].length+1;else if("content"===b[c].slice(0,7).toLowerCase()){if(e=e+b[c].length+1,-1!==b[c].indexOf(":")&&(k=b[c].substring(0,b[c].indexOf(":")).trim(),g=b[c].substring(b[c].indexOf(":")+1).trim(),k))switch(k.toLowerCase()){case "content-type":f.contentType=g;break;case "content-description":f.contentDescription=g;break;case "content-transfer-encoding":f.contentTransferEncoding=
g;break;case "content-id":f.contentID=g;break;case "content-disposition":f.contentDisposition=g;break;case "content-location":f.contentLocation=g}}else if(f.contentDisposition&&4<=b[c].length&&-1<f.contentType.toLowerCase().indexOf("image")){b=new ArrayBuffer(a.length-e);c=new Uint8Array(b);c.set(a.subarray(e,a.length));f.contentData=b;break}else if((""===d.start||f.contentID===d.start)&&f.contentType)if(-1<f.contentType.indexOf("text")){f.contentData=String.fromCharCode.apply(null,a.subarray(e,a.length));
break}else f.contentData=a.subarray(e,a.length);return f}};q=x([q],{declaredClass:"esri.layers.WCSLayer",format:null,interpolation:null,bandIds:null,optionalParameters:null,multidimensionalDefinition:null,projectedFullExtent:null,wcsConnection:null,version:null,coverageId:null,coverageDescription:null,extent:null,timeInfo:null,pixelType:null,_projectedResolution:null,_WEB_MERCATOR:[102100,3857,102113,900913],_REVERSED_LAT_LONG_RANGES:[[4001,4999],[2044,2045],[2081,2083],[2085,2086],[2093,2093],[2096,
2098],[2105,2132],[2169,2170],[2176,2180],[2193,2193],[2200,2200],[2206,2212],[2319,2319],[2320,2462],[2523,2549],[2551,2735],[2738,2758],[2935,2941],[2953,2953],[3006,3030],[3034,3035],[3058,3059],[3068,3068],[3114,3118],[3126,3138],[3300,3301],[3328,3335],[3346,3346],[3350,3352],[3366,3366],[3416,3416],[20004,20032],[20064,20092],[21413,21423],[21473,21483],[21896,21899],[22171,22177],[22181,22187],[22191,22197],[25884,25884],[27205,27232],[27391,27398],[27492,27492],[28402,28432],[28462,28492],
[30161,30179],[30800,30800],[31251,31259],[31275,31279],[31281,31290],[31466,31700]],_pivotServerGridOrigin110:!1,constructor:function(a,d){this._pixelValueReadPromise=this._rasterReadPromise=null},_initialize:function(a,d){this._params={};x.safeMixin(this,d);this.optionalParameters=this.optionalParameters||{};this.bandIds=this.bandIds||null;var b=this.url.indexOf("?");-1<b&&b<=this.url.length-1&&(this.optionalParameters=h.mixin(this.optionalParameters,F.queryToObject(this.url.substring(b+1,this.url.length))),
this.url=this.url.substring(0,b));this.coverageId=this.coverageId||this.coverage||this.identifiers||this.optionalParameters.coverage||this.optionalParameters.coverageId||this.optionalParameters.identifiers;b=h.mixin({},{version:this.version,token:this.token,coverageId:this.coverageId},this.optionalParameters);b=this.wcsConnection||(new J(this.url,b))._connectPromise;E(b,h.hitch(this,this._initialized),this._errorHandler)},_initialized:function(a){var d;this.wcsConnection=a;this.version=this.version||
a.version;this.coverageId=this.coverageId||a.coverages[0].id;var b=t(a.coverages,this.coverageId,"id");this.coverageDescription=b;this.coverageDescription.supportedInterpolations=this.coverageDescription.supportedInterpolations||a.supportedInterpolations;this.extent=this.extent||b.extent;this.timeInfo=b.timeInfo;!this.bandIds&&this.coverageDescription.bandInfo&&(this.bandIds=Object.keys(this.coverageDescription.bandInfo).map(function(a){return parseInt(a,10)}));if((void 0===this.format||null===this.format||
""===this.format||"tiff"===this.format)&&b.supportedFormats)for(d=0;d<b.supportedFormats.length;d++)if(-1<b.supportedFormats[d].toLowerCase().indexOf("tiff")){this.format=b.supportedFormats[d];break}this.format=this.format||"image/tiff";this._findCredential();(this.credential&&this.credential.ssl||a&&a._ssl)&&this._useSSL();this._params.token=this._getToken();this.loaded=!0;this.onLoad(this);if(a=this._loadCallback)delete this._loadCallback,a(this)},onRasterReadComplete:function(){},setInfoTemplate:function(a){this.infoTemplate=
a},identify:function(a){var d=new s;this._identifyPixelValue(a).then(h.hitch(this,function(a){var c=[];if((this.infoTemplate&&this.infoTemplate.info&&this.infoTemplate.info.layerOptions&&this.infoTemplate.info.layerOptions.hasOwnProperty("showNoDataRecords")?this.infoTemplate.info.layerOptions.showNoDataRecords:1)||"NoData"!==a.value){var e=new M;e.setInfoTemplate(this.infoTemplate);e._layer=this;e.geometry=this.projectedFullExtent;e.attributes={ObjectId:0,"Raster.ServicePixelValue":a.pixelValues.map(function(a){return a.toString()})};
c.push(e)}d.resolve(c)}),h.hitch(this,function(a){d.reject(a)}));return d.promise},setUseMapTime:function(a,d){this.useMapTime=a;this._toggleTime();!d&&this._map&&this.refresh(!0)},_setMap:function(a,d){a.extent?(this.projectedFullExtent=(this.projectedFullExtent=this.projectedFullExtent||this._convertExtentToMap(this.coverageDescription.lonLatEnvelope,a.extent.spatialReference,1E-4))||this._convertExtentToMap(this.coverageDescription.extent,a.extent.spatialReference,1E-4),this._projectedResolution=
this._projectedResolution||{x:(this.projectedFullExtent.xmax-this.projectedFullExtent.xmin)/this.coverageDescription.columns,y:(this.projectedFullExtent.ymax-this.projectedFullExtent.ymin)/this.coverageDescription.rows}):this.projectedFullExtent=this.projectedFullExtent||this.coverageDescription.extent;return this.inherited(arguments)},_convertExtentToNative:function(a){if(!a)return null;var d=null,b=this.coverageDescription.lonLatEnvelope.spatialReference.wkid,c=a.spatialReference.wkid;b===c||-1<
this._WEB_MERCATOR.indexOf(b)&&-1<this._WEB_MERCATOR.indexOf(c)?d=a:4326===b&&-1<this._WEB_MERCATOR.indexOf(c)?d=u.webMercatorUtils.webMercatorToGeographic(a):4326===c&&-1<this._WEB_MERCATOR.indexOf(b)&&(d=u.webMercatorUtils.geographicToWebMercator(a));return d},_convertExtentToMap:function(a,d,b){if(!a)return null;var c=null;d=d?d.wkid:this._map.extent.spatialReference.wkid;var e=a.spatialReference.wkid;d===e||-1<this._WEB_MERCATOR.indexOf(d)&&-1<this._WEB_MERCATOR.indexOf(e)?c=a:4326===d&&-1<this._WEB_MERCATOR.indexOf(e)?
c=u.webMercatorUtils.webMercatorToGeographic(a):4326===e&&-1<this._WEB_MERCATOR.indexOf(d)&&(c=u.webMercatorUtils.geographicToWebMercator(a));c&&(c.spatialReference.wkid&&-1<this._WEB_MERCATOR.indexOf(c.spatialReference.wkid))&&(c.spatialReference.wkid=3857);if(b&&c&&c.spatialReference.wkid)if(3857===c.spatialReference.wkid)c.xmin+=b,c.ymin+=b,c.xmax-=b,c.ymax-=b;else if(4326===c.spatialReference.wkid||180>=Math.abs(c.xmin)&&180>=Math.abs(c.xmax))a=1/111111,c.xmin+=b*a,c.ymin+=b*a,c.xmax-=b*a,c.ymax-=
b*a;return c},_constructGetCoverageParams:function(a,d,b,c){var e=this.projectedFullExtent;if(a.xmax<=e.xmin||a.xmin>=e.xmax||a.ymax<=e.ymin||a.ymin>=e.ymax)return null;var f=new A(a);f.xmin=Math.max(f.xmin,e.xmin);f.xmax=Math.min(f.xmax,e.xmax);f.ymin=Math.max(f.ymin,e.ymin);f.ymax=Math.min(f.ymax,e.ymax);d=Math.round((f.xmax-f.xmin)/(a.xmax-a.xmin)*d);b=Math.round((f.ymax-f.ymin)/(a.ymax-a.ymin)*b);a=this._params;h.mixin(a,{extent:f,width:d,height:b,crs:"EPSG:"+e.spatialReference.wkid,epsgNSCRS:"urn:ogc:def:crs:EPSG::"+
e.spatialReference.wkid,coverageId:this.coverageId,format:this.format,interpolation:this.interpolation});c&&h.mixin(a,c);a.multidimensionalDefinition||(a.multidimensionalDefinition=this.multidimensionalDefinition);a.interpolation||(this.interpolation?a.interpolation=this.interpolation:this.coverageDescription.supportedInterpolations&&0<this.coverageDescription.supportedInterpolations.length&&(a.interpolation=this.coverageDescription.supportedInterpolations[0]));c=["nearest neighbor","bilinear","bicubic"];
e=["nearest","linear","cubic"];f=["nearest-neighbor","linear","cubic"];if(0===a.interpolation||1===a.interpolation||2===a.interpolation)"1.0.0"===this.version?a.interpolation=c[a.interpolation]:"1.1.0"===this.version||"1.1.1"===this.version||"1.1.2"===this.version?a.interpolation=e[a.interpolation]:"2.0.1"===this.version&&(a.interpolation="http://www.opengis.net/def/interpolation/OGC/1/"+f[a.interpolation]);this.bandIds&&(a.bandIds=this.bandIds.map(h.hitch(this,function(a){return this.coverageDescription.bandInfo[a]})));
!a.time&&this.coverageDescription.timeInfo&&"2.0.1"!==this.version&&(a.time=this.coverageDescription.timeInfo.timeExtent.endTime.toISOString());return a},_requestData:function(a,d,b){this._rasterReadPromise&&this._rasterReadPromise.cancel();var c=this._constructGetCoverageParams(a,d,b);if(c){var e=this,f=new z("");this._requestExtent=c.extent;var r;this._useBrowserDecoding()&&(a=new K({ctx:this._context}),r=h.hitch(a,"decode"));var k=new s(w._dfdCanceller);k._pendingDfd=this._getCoverage(c);var g,
m,p,v=this._requestExtent;k._pendingDfd.then(function(a){a=D.parse(a);if("1.0.0"===e.version)a=a.data;else if(a.isMultiPart)p=B(a.data,function(a){return null!=a.contentType&&-1<a.contentType.toLowerCase().indexOf("image")}),p=-1===p?a.data.length-1:p,a=a.data[p].contentData;else{m=Error("not a valid multipart coverage response");e._resolve([m],null,h.hitch(e,e._requestDataErrorHandler),k,!0);return}f.decode(a,{width:c.width,height:c.height,planes:null,pixelType:"UNKNOWN",decodeFunc:r}).then(function(a){e.pixelType=
e.pixelType||a.pixelType;if(!e.pixelFilter){var b=e._getDefaultFilter();e.pixelFilter=b.filter;e._pixelFilterArgs=b}g={pixelBlock:a,extent:v};e._resolve([g],"onRasterReadComplete",h.hitch(e,e._requestDataHandler),k,!1)},function(a){e._resolve([a],null,h.hitch(e,e._requestDataErrorHandler),k,!0)})},function(a){e._resolve([a],null,h.hitch(e,e._requestDataErrorHandler),k,!0)});this._rasterReadPromise=k.promise}else this.clear()},_requestDataHandler:function(a){if(!this._rasterReadPromise||!this._rasterReadPromise.isCanceled())this.originalPixelData=
a,this.hasDataChanged=!0,this._setPixelData(a)},_setPixelData:function(a){a=this._clonePixelData(a);this.pixelFilter&&this.pixelFilter(a);this.pixelData=a;if(!this._rasterReadPromise||!this._rasterReadPromise.isCanceled())this._drawPixelData(),this._rasterReadPromise=null},_useBrowserDecoding:function(){var a=this._requestExtent,d=this._map.width,b=this._map.height,c=this.getCurrentResolution();return Math.round((a.xmax-a.xmin)/c.x)===d&&Math.round((a.ymax-a.ymin)/c.y)===b&&(void 0===this.pixelFilter||
null===this.pixelFilter)&&("jpeg"===this.format.toLowerCase()||"jpg"===this.format.toLowerCase()||-1<this.format.toLowerCase().indexOf("png"))},_clonePixelData:function(a){if(null===a||void 0===a)return a;var d={};a.extent&&(d.extent=h.clone(a.extent));a=a.pixelBlock;if(null===a||void 0===a)return d;d.pixelBlock=a.clone();return d},_resolve:function(a,d,b,c,e){d&&this[d].apply(this,a);b&&b.apply(null,a);c&&w._resDfd(c,a,e)},_getDefaultFilter:function(){var a=0;"U8"!==this.pixelType&&(a=6);return new L({stretchType:a,
min:0,max:255,dRA:!0,minPercent:0.2,maxPercent:0.2,useGamma:!1})},_getCoverage:function(a){var d=this.version,b=this.coverageDescription,c,e=function(a){return a.toISOString()},f=h.hitch(this,function(){c={request:"GetCoverage",service:"WCS",version:d,coverage:a.coverageId,format:a.format||"GEOTIFF",crs:a.crs,bbox:a.extent.xmin+","+a.extent.ymin+","+a.extent.xmax+","+a.extent.ymax,width:a.width,height:a.height,time:a.time,interpolation:a.interpolation,band:a.bandIds?a.bandIds.join(","):null}}),r=
h.hitch(this,function(){var m,f=this.coverageDescription.nativeCoverageDescription.domain.spatialDomain,g=f.origin.x<=f.envelope.xmin&&f.origin.y<=f.envelope.ymin;m=this._pivotServerGridOrigin110&&g?[(a.extent.xmax-a.extent.xmin)/a.width,(a.extent.ymax-a.extent.ymin)/a.height]:[(a.extent.xmax-a.extent.xmin)/a.width,(a.extent.ymin-a.extent.ymax)/a.height];var l=N(b.nativeCoverageDescription.range,function(a){return a.axis.some(function(a){return"band"===a.identifier.toLowerCase()})}),k,h,n,f=l&&a.interpolation&&
a.bandIds?l.identifier+":"+a.interpolation+"["+l.axis[0].identifier+"["+a.bandIds.join(",")+"]]":null;if(a.multidimensionalDefinition)for(k=0;k<a.multidimensionalDefinition.length;k++)if(n=a.multidimensionalDefinition[k].values,0<n.length)if(-1<a.multidimensionalDefinition[k].dimensionName.toLowerCase().indexOf("time"))n=n.map(e).join(","),a.time=n;else if(l=t(b.nativeCoverageDescription.range,a.multidimensionalDefinition[k].variableName,"identifier"))if(a.interpolation||(a.interpolation=l.supportedInterpolations[0]),
h=t(l.axis,a.multidimensionalDefinition[k].dimensionName,"identifier"))n=n.join(","),f=l.identifier+":"+a.interpolation+"["+h.identifier+"["+n+"]]";l=this._pivotServerGridOrigin110&&g?[a.extent.xmin,a.extent.ymin]:[a.extent.xmin,a.extent.ymax];this.coverageDescription._useEPSGAxis&&this._useLatLong(a.extent.spatialReference.wkid)?(g=a.extent.ymin+","+a.extent.xmin+","+a.extent.ymax+","+a.extent.xmax+","+a.epsgNSCRS,l=l[1]+","+l[0],m=m[1]+","+m[0]):(g=a.extent.xmin+","+a.extent.ymin+","+a.extent.xmax+
","+a.extent.ymax+","+a.epsgNSCRS,l=l[0]+","+l[1],m=m[0]+","+m[1]);c={request:"GetCoverage",service:"WCS",version:d,identifier:a.coverageId,format:a.format||"image/tiff",crs:a.crs,boundingbox:g,GridBaseCRS:a.epsgNSCRS,GridCS:"urn:ogc:def:cs:OGC:0.0:Grid2dSquareCS",GridType:"urn:ogc:def:method:WCS:1.1:2dGridIn2dCrs",GridOrigin:l,GridOffsets:m,time:a.time,rangeSubset:f}}),k=h.hitch(this,function(){var f=[],g,k,l=b.nativeCoverageDescription.domainSet.axisLabels;"x"===l[0].toLowerCase()||"x"===l[1].toLowerCase()?
(f.push("x,http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.xmin+","+a.extent.xmax+")"),f.push("y,http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.ymin+","+a.extent.ymax+")"),g="x",k="y"):-1<l[0].toLowerCase().indexOf("lat")||-1<l[0].toLowerCase().indexOf("north")?(f.push(l[1]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.xmin+","+a.extent.xmax+")"),f.push(l[0]+",http://www.opengis.net/def/crs/EPSG/0/"+
a.extent.spatialReference.wkid+"("+a.extent.ymin+","+a.extent.ymax+")"),g=l[1],k=l[0]):-1<l[0].toLowerCase().indexOf("lon")||-1<l[0].toLowerCase().indexOf("east")?(f.push(l[0]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.xmin+","+a.extent.xmax+")"),f.push(l[1]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.ymin+","+a.extent.ymax+")"),g=l[0],k=l[1]):this._useLatLong(a.extent.spatialReference.wkid)?(f.push(l[1]+",http://www.opengis.net/def/crs/EPSG/0/"+
a.extent.spatialReference.wkid+"("+a.extent.xmin+","+a.extent.xmax+")"),f.push(l[0]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.ymin+","+a.extent.ymax+")"),g=l[1],k=l[0]):(f.push(l[0]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.xmin+","+a.extent.xmax+")"),f.push(l[1]+",http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid+"("+a.extent.ymin+","+a.extent.ymax+")"),g=l[0],k=l[1]);2<l.length&&(f.push(l[2]+
",http://www.opengis.net(2014/04/08 00:00:00)"),f.push(l[3]+",http://www.opengis.net(0)"));var h=null,r,n,q=[],s=[];if(a.multidimensionalDefinition){for(h=0;h<b.nativeCoverageDescription.rangeType.length;h++)s=s.concat(b.nativeCoverageDescription.rangeType[h].map(function(a){return a.name}));for(h=0;h<a.multidimensionalDefinition.length;h++)r=t(l,a.multidimensionalDefinition[h].dimensionName),n=t(s,a.multidimensionalDefinition[h].variableName),-1===q.indexOf(n)&&q.push(n),r&&(n=a.multidimensionalDefinition[h].values,
0<n.length&&(n[0]instanceof Array&&(n=n[0]),n=-1<r.toLowerCase().indexOf("time")?n.map(e).join(","):n.join(","),-1===B(f,function(a){return 0===a.indexOf(r)})&&f.push(r+",http://www.opengis.net("+n+")")));h=0<q.length?q.join(","):null}l="http://www.opengis.net/def/crs/EPSG/0/"+a.extent.spatialReference.wkid;f=f.join("\x26subset\x3d");c={request:"GetCoverage",service:"WCS",version:d,coverageId:a.coverageId,rangesubset:h,interpolation:a.interpolation,scaleSize:g+"("+a.width+"),"+k+"("+a.height+")",
subset:f,extension:null,format:a.format||"image/tiff",outputcrs:l}});switch(d){case "1.0.0":f();break;case "1.1.0":case "1.1.1":case "1.1.2":r();break;case "2.0.1":k()}h.mixin(c,this.optionalParameters);a.token&&(c.token=a.token);var g=this.wcsConnection.onlineResources.getCoverage||this.url;-1===g.indexOf("?")&&(g+="?");Object.keys(c).forEach(function(a){void 0!==c[a]&&null!==c[a]&&(g+=a,g+="\x3d",g+=c[a],g+="\x26")});g=g.substring(0,g.length-1);return I({url:g,handleAs:"arraybuffer"},{returnFullResponse:!0})},
_identifyPixelValue:function(a){var d=new s,b={objectId:0,name:"Pixel",value:null,location:a,pixelValues:null};this._pixelValueReadPromise&&this._pixelValueReadPromise.cancel();var c=this.projectedFullExtent,e=this._projectedResolution,f=c.xmin+Math.floor((a.x-c.xmin)/e.x)*e.x,c=c.ymin+Math.floor((a.y-c.ymin)/e.y)*e.y,h=new A;h.spatialReference=a.spatialReference;h.xmin=f;h.ymin=c;h.xmax=f+2*e.x;h.ymax=c+2*e.y;var k=this._constructGetCoverageParams(h,2,2),g=this;if(!k)return d.resolve(b),g._pixelValueReadPromise=
null,d;var m=new z(""),p;a=new s(w._dfdCanceller);a._pendingDfd=this._getCoverage(k);a._pendingDfd.then(function(a){a=D.parse(a);if("1.0.0"===g.version)a=a.data;else if(a.isMultiPart)a=a.data[a.data.length-1].contentData;else{p=Error("not a valid multipart coverage response");d.reject(p);g._pixelValueReadPromise=null;return}m.decode(a,{width:k.width,height:k.height,planes:null,pixelType:"UNKNOWN"}).then(function(a){a&&a.pixels&&(!a.mask||a.mask[0]?a.pixels&&(b.pixelValues=a.pixels.map(function(a){return a[0]}),
b.value=b.pixelValues.join(" ")):(b.value="NoData",b.pixelValues=[NaN]));d.resolve(b);g._pixelValueReadPromise=null},function(a){d.reject(a);g._pixelValueReadPromise=null})},function(a){d.reject(a);g._pixelValueReadPromise=null});return this._pixelValueReadPromise=d.promise},_useLatLong:function(a){if(!a)return!1;var d,b,c;for(b=0;b<this._REVERSED_LAT_LONG_RANGES.length;b++)if(c=this._REVERSED_LAT_LONG_RANGES[b],a>=c[0]&&a<=c[1]){d=!0;break}return d},_toggleTime:function(){var a=this._map;this.timeInfo&&
this.useMapTime&&a&&!this.suspended?(this._timeConnect||(this._timeConnect=y.connect(a,"onTimeExtentChange",this,this._onTimeExtentChangeHandler)),this._setTime(a.timeExtent)):(y.disconnect(this._timeConnect),this._timeConnect=null,this._setTime(null))},_setTime:function(a){var d;this._params&&(a?(d=[],a.startTime&&d.push(a.startTime.toISOString()),a.endTime&&d.push(a.endTime.toISOString()),this._params.time=d.join(",")):this._params.time=null)},_onTimeExtentChangeHandler:function(a){this.suspended||
(this._setTime(a),this.refresh(!0))}});h.mixin(q,{INTERPOLATION_NEARESTNEIGHBOR:0,INTERPOLATION_BILINEAR:1,INTERPOLATION_CUBICCONVOLUTION:2});G("extend-esri")&&h.setObject("layers.WCSLayer",q,H);return q});
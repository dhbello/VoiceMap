//>>built
define("esri/geometry/Point","dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../lang ../SpatialReference ./Geometry ../srUtils".split(" "),function(d,e,r,m,n,u,s,t){function g(a,b){89.99999<b?b=89.99999:-89.99999>b&&(b=-89.99999);var c=b*p;return[a*p*f,f/2*Math.log((1+Math.sin(c))/(1-Math.sin(c)))]}function h(a,b,c){a=a/f*k;if(c)return b=q/2-2*Math.atan(Math.exp(-1*b/f)),[a,b*k];c=a-360*Math.floor((a+180)/360);b=q/2-2*Math.atan(Math.exp(-1*b/f));return[c,b*k]}var f=6378137,q=3.141592653589793,
k=57.29577951308232,p=0.017453292519943,l={type:"point",x:0,y:0};d=d(s,{declaredClass:"esri.geometry.Point",constructor:function(a,b,c){e.mixin(this,l);e.isArray(a)?(this.x=a[0],this.y=a[1],this.spatialReference=b):e.isObject(a)?(e.mixin(this,a),n.isDefined(this.latitude)&&(this.y=this.latitude),n.isDefined(this.longitude)&&(this.x=this.longitude),this.spatialReference&&(this.spatialReference=t.createSpatialReference(this.spatialReference))):(this.x=a,this.y=b,this.spatialReference=c);this.verifySR()},
offset:function(a,b){return new this.constructor(this.x+a,this.y+b,this.spatialReference)},setX:function(a){this.x=a;this.clearCache();return this},setY:function(a){this.y=a;this.clearCache();return this},setLongitude:function(a){var b=this.spatialReference;b&&(b._isWebMercator()?this.setX(g(a,this.y)[0]):4326===b.wkid&&this.setX(a));return this},setLatitude:function(a){var b=this.spatialReference;b&&(b._isWebMercator()?this.setY(g(this.x,a)[1]):4326===b.wkid&&this.setY(a));return this},getLongitude:function(){var a=
this.spatialReference,b;a&&(a._isWebMercator()?b=h(this.x,this.y)[0]:4326===a.wkid&&(b=this.x));return b},getLatitude:function(){var a=this.spatialReference,b;a&&(a._isWebMercator()?b=h(this.x,this.y)[1]:4326===a.wkid&&(b=this.y));return b},update:function(a,b){this.x=a;this.y=b;this.clearCache();return this},normalize:function(){var a=this.x,b=this.spatialReference;if(b){var c=b._getInfo();if(c){var d=c.valid[0],e=c.valid[1],c=2*e;a>e?(d=Math.ceil(Math.abs(a-e)/c),a-=d*c):a<d&&(d=Math.ceil(Math.abs(a-
d)/c),a+=d*c)}}return new this.constructor(a,this.y,b)},toJson:function(){var a={x:this.x,y:this.y},b=this.spatialReference;b&&(a.spatialReference=b.toJson());return a}});d.lngLatToXY=g;d.xyToLngLat=h;d.defaultProps=l;r("extend-esri")&&(e.setObject("geometry.Point",d,m),m.geometry.defaultPoint=l);return d});
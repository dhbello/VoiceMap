//>>built
define("esri/tasks/FeatureSet","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../kernel ../lang ../graphic ../SpatialReference ../graphicsUtils ../geometry/jsonUtils ../symbols/jsonUtils".split(" "),function(m,s,w,x,y,z,A,B,C,q,D){m=m(null,{declaredClass:"esri.tasks.FeatureSet",constructor:function(a){if(a){s.mixin(this,a);var b=this.features,e=a.spatialReference,t=q.getGeometryType(a.geometryType),e=this.spatialReference=new B(e);this.geometryType=a.geometryType;a.fields&&(this.fields=
a.fields);w.forEach(b,function(a,d){var n=a.geometry&&a.geometry.spatialReference;b[d]=new A(t&&a.geometry?new t(a.geometry):null,a.symbol&&D.fromJson(a.symbol),a.attributes);b[d].geometry&&!n&&b[d].geometry.setSpatialReference(e)});this._hydrate()}else this.features=[]},displayFieldName:null,geometryType:null,spatialReference:null,fieldAliases:null,toJson:function(a){var b={};this.displayFieldName&&(b.displayFieldName=this.displayFieldName);this.fields&&(b.fields=this.fields);this.spatialReference?
b.spatialReference=this.spatialReference.toJson():this.features[0]&&this.features[0].geometry&&(b.spatialReference=this.features[0].geometry.spatialReference.toJson());this.features[0]&&(this.features[0].geometry&&(b.geometryType=q.getJsonType(this.features[0].geometry)),b.features=C._encodeGraphics(this.features,a));b.exceededTransferLimit=this.exceededTransferLimit;b.transform=this.transform;return z.fixJson(b)},_hydrate:function(){var a=this.transform,b=this.geometryType;if(a&&b)for(var e=this.features,
t=a.translate[0],m=a.translate[1],d=a.scale[0],n=a.scale[1],v=function(a,b,r){if("esriGeometryPoint"===a)return function(a){a.x=b(a.x);a.y=r(a.y)};if("esriGeometryPolyline"===a||"esriGeometryPolygon"===a)return function(a){a=a.rings||a.paths;var k,l,c,f,g,h,u,d;k=0;for(l=a.length;k<l;k++){g=a[k];c=0;for(f=g.length;c<f;c++)h=g[c],0<c?(u+=h[0],d+=h[1]):(u=h[0],d=h[1]),h[0]=b(u),h[1]=r(d)}};if("esriGeometryEnvelope"===a)return function(a){a.xmin=b(a.xmin);a.ymin=r(a.ymin);a.xmax=b(a.xmax);a.ymax=r(a.ymax)};
if("esriGeometryMultipoint"===a)return function(a){a=a.points;var k,l,c,f,g;k=0;for(l=a.length;k<l;k++)c=a[k],0<k?(f+=c[0],g+=c[1]):(f=c[0],g=c[1]),c[0]=b(f),c[1]=r(g)}}(b,function(a){return a*d+t},function(a){return m-a*n}),a=0,b=e.length;a<b;a++)e[a].geometry&&v(e[a].geometry);this.transform=null},quantize:function(a){if(!this.geometryType)return this.transform=null,this;var b=a.translate[0],e=a.translate[1],m=a.scale[0],s=a.scale[1],d=this.features,n=function(a,b,k){var l,c,f,g,h,d,e=[];l=0;for(c=
a.length;l<c;l++)if(f=a[l],0<l){if(d=b(f[0]),f=k(f[1]),d!==g||f!==h)e.push([d-g,f-h]),g=d,h=f}else g=b(f[0]),h=k(f[1]),e.push([g,h]);return 0<e.length?e:null},v=function(a,b,d){if("esriGeometryPoint"===a)return function(a){a.x=b(a.x);a.y=d(a.y);return a};if("esriGeometryPolyline"===a||"esriGeometryPolygon"===a)return function(a){var c,f,g,h,e;g=a.rings||a.paths;e=[];c=0;for(f=g.length;c<f;c++)h=g[c],(h=n(h,b,d))&&e.push(h);return 0<e.length?(a.rings?a.rings=e:a.paths=e,a):null};if("esriGeometryMultipoint"===
a)return function(a){var c;c=n(a.points,b,d);return 0<c.length?(a.points=c,a):null};if("esriGeometryEnvelope"===a)return function(a){return a}}(this.geometryType,function(a){return Math.round((a-b)/m)},function(a){return Math.round((e-a)/s)}),p,q;p=0;for(q=d.length;p<q;p++)d[p].geometry&&(v(d[p].geometry)||d[p].setGeometry(null));this.transform=a;return this}});x("extend-esri")&&s.setObject("tasks.FeatureSet",m,y);return m});
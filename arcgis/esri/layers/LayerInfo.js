//>>built
define("esri/layers/LayerInfo",["dojo/_base/declare","dojo/_base/lang","dojo/has","../kernel","../lang"],function(a,b,c,d,e){a=a(null,{declaredClass:"esri.layers.LayerInfo",constructor:function(a){b.mixin(this,a)},toJson:function(){return e.fixJson({defaultVisibility:this.defaultVisibility,id:this.id,maxScale:this.maxScale,minScale:this.minScale,name:this.name,parentLayerId:this.parentLayerId,subLayerIds:this.subLayerIds})}});c("extend-esri")&&b.setObject("layers.LayerInfo",a,d);return a});
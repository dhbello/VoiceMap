//>>built
define("dojo/i18n","./_base/kernel require ./has ./_base/array ./_base/config ./_base/lang ./_base/xhr ./json module".split(" "),function(f,n,q,r,y,p,l,z,A){q.add("dojo-preload-i18n-Api",1);l=f.i18n={};var B=/(^.*(^|\/)nls)(\/|$)([^\/]*)\/?([^\/]*)/,C=function(a,b,d,c){var e=[d+c];b=b.split("-");for(var h="",k=0;k<b.length;k++)if(h+=(h?"-":"")+b[k],!a||a[h])e.push(d+h+"/"+c),e.specificity=h;return e},m={},w=function(a,b,d){d=d?d.toLowerCase():f.locale;a=a.replace(/\./g,"/");b=b.replace(/\./g,"/");
return/root/i.test(d)?a+"/nls/"+b:a+"/nls/"+d+"/"+b},D=f.getL10nName=function(a,b,d){return A.id+"!"+w(a,b,d)},F=function(a,b,d,c,e,h){a([b],function(k){var g=p.clone(k.root||k.ROOT),t=C(!k._v1x&&k,e,d,c);a(t,function(){for(var a=1;a<t.length;a++)g=p.mixin(p.clone(g),arguments[a]);m[b+"/"+e]=g;g.$locale=t.specificity;h()})})},G=function(a){var b=y.extraLocale||[],b=p.isArray(b)?b:[b];b.push(a);return b},v=function(a,b,d){var c=a.split("*"),e="preload"==c[1];if(q("dojo-preload-i18n-Api")){e&&(m[a]||
(m[a]=1,H(c[2],z.parse(c[3]),1,b)),d(1));if(!(c=e))s&&u.push([a,b,d]),c=s;if(c)return}else if(e){d(1);return}a=B.exec(a);var h=a[1]+"/",k=a[5]||a[4],g=h+k,c=(a=a[5]&&a[4])||f.locale||"",t=g+"/"+c;a=a?[c]:G(c);var E=a.length,n=function(){--E||d(p.delegate(m[t]))};r.forEach(a,function(a){var c=g+"/"+a;q("dojo-preload-i18n-Api")&&x(c);m[c]?n():F(b,g,h,k,a,n)})};q("dojo-preload-i18n-Api");var I=l.normalizeLocale=function(a){a=a?a.toLowerCase():f.locale;return"root"==a?"ROOT":a},s=0,u=[],H=l._preloadLocalizations=
function(a,b,d,c){function e(a,b){c([a],b)}function h(a,b){for(var c=a.split("-");c.length;){if(b(c.join("-")))return;c.pop()}b("ROOT")}function k(){for(--s;!s&&u.length;)v.apply(null,u.shift())}function g(d){d=I(d);h(d,function(g){if(0<=r.indexOf(b,g)){var f=a.replace(/\./g,"/")+"_"+g;s++;e(f,function(a){for(var b in a){var e=a[b],f=b.match(/(.+)\/([^\/]+)$/),l;if(f&&(l=f[2],f=f[1]+"/",e._localized)){var q;if("ROOT"===g){var r=q=e._localized;delete e._localized;r.root=e;m[n.toAbsMid(b)]=r}else q=
e._localized,m[n.toAbsMid(f+l+"/"+g)]=e;g!==d&&function(a,b,e,g){var f=[],l=[];h(d,function(c){g[c]&&(f.push(n.toAbsMid(a+c+"/"+b)),l.push(n.toAbsMid(a+b+"/"+c)))});f.length?(s++,c(f,function(){for(var c=f.length-1;0<=c;c--)e=p.mixin(p.clone(e),arguments[c]),m[l[c]]=e;m[n.toAbsMid(a+b+"/"+d)]=p.clone(e);k()})):m[n.toAbsMid(a+b+"/"+d)]=e}(f,l,e,q)}}k()});return!0}return!1})}c=c||n;g();r.forEach(f.config.extraLocale,g)},x=function(){};new Function("__bundle","__checkForLegacyModules","__mid","__amdValue",
"var define \x3d function(mid, factory){define.called \x3d 1; __amdValue.result \x3d factory || mid;},\t   require \x3d function(){define.called \x3d 1;};try{define.called \x3d 0;eval(__bundle);if(define.called\x3d\x3d1)return __amdValue;if((__checkForLegacyModules \x3d __checkForLegacyModules(__mid)))return __checkForLegacyModules;}catch(e){}try{return eval('('+__bundle+')');}catch(e){return e;}");x=function(a){for(var b,d=a.split("/"),c=f.global[d[0]],e=1;c&&e<d.length-1;c=c[d[e++]]);c&&((b=c[d[e]])||
(b=c[d[e].replace(/-/g,"_")]),b&&(m[a]=b));return b};l.getLocalization=function(a,b,d){var c;a=w(a,b,d);v(a,n,function(a){c=a});return c};return p.mixin(l,{dynamic:!0,normalize:function(a,b){return/^\./.test(a)?b(a):a},load:v,cache:m,getL10nName:D})});
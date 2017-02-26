//>>built
define("dojox/date/buddhist",["dojox/main","dojo/_base/lang","dojo/date","./buddhist/Date"],function(m,n,k,l){var h=n.getObject("date.buddhist",!0,m);h.getDaysInMonth=function(b){return k.getDaysInMonth(b.toGregorian())};h.isLeapYear=function(b){return k.isLeapYear(b.toGregorian())};h.compare=function(b,d,a){return k.compare(b,d,a)};h.add=function(b,d,a){var e=new l(b);switch(d){case "day":e.setDate(b.getDate(!0)+a);break;case "weekday":var c;(d=a%5)?c=parseInt(a/5):(d=0<a?5:-5,c=0<a?(a-5)/5:(a+5)/
5);var f=b.getDay(),g=0;6==f&&0<a?g=1:0==f&&0>a&&(g=-1);f+=d;if(0==f||6==f)g=0<a?2:-2;e.setDate(b.getDate(!0)+(7*c+d+g));break;case "year":e.setFullYear(b.getFullYear()+a);break;case "week":a*=7;e.setDate(b.getDate(!0)+a);break;case "month":e.setMonth(b.getMonth()+a);break;case "hour":e.setHours(b.getHours()+a);break;case "minute":e._addMinutes(a);break;case "second":e._addSeconds(a);break;case "millisecond":e._addMilliseconds(a)}return e};h.difference=function(b,d,a){d=d||new l;a=a||"day";var e=
d.getFullYear()-b.getFullYear(),c=1;switch(a){case "weekday":e=Math.round(h.difference(b,d,"day"));c=parseInt(h.difference(b,d,"week"));a=e%7;if(0==a)e=5*c;else{var f=0;b=b.getDay();var g=d.getDay(),c=parseInt(e/7);a=e%7;d=new l(d);d.setDate(d.getDate(!0)+7*c);d=d.getDay();if(0<e)switch(!0){case 5==b:f=-1;break;case 6==b:f=0;break;case 5==g:f=-1;break;case 6==g:f=-2;break;case 5<d+a:f=-2}else if(0>e)switch(!0){case 5==b:f=0;break;case 6==b:f=1;break;case 5==g:f=2;break;case 6==g:f=1;break;case 0>
d+a:f=2}e=e+f-2*c}c=e;break;case "year":c=e;break;case "month":a=d.toGregorian()>b.toGregorian()?d:b;f=d.toGregorian()>b.toGregorian()?b:d;c=a.getMonth();g=f.getMonth();if(0==e)c=a.getMonth()-f.getMonth();else{c=12-g+c;e=f.getFullYear()+1;a=a.getFullYear();for(e;e<a;e++)c+=12}d.toGregorian()<b.toGregorian()&&(c=-c);break;case "week":c=parseInt(h.difference(b,d,"day")/7);break;case "day":c/=24;case "hour":c/=60;case "minute":c/=60;case "second":c/=1E3;case "millisecond":c*=d.toGregorian().getTime()-
b.toGregorian().getTime()}return Math.round(c)};return h});
//>>built
define("esri/arcade/arcade","require exports ./arcadeRuntime ./parser ./Feature ./arcadeCompiler dojo/has".split(" "),function(k,c,d,e,f,g,h){c.compileScript=function(a,b){return h("csp-restrictions")?function(b,c){return d.executeScript(a,b,c)}:g.compileScript(a,b)};c.constructFeature=function(a){return f.fromFeature(a)};c.parseScript=function(a){return e.parseScript(a)};c.validateScript=function(a,b){return e.validateScript(a,b,"simple")};c.scriptCheck=function(a,b,c){return e.scriptCheck(a,b,c,
"full")};c.parseAndExecuteScript=function(a,b,c){return d.executeScript(e.parseScript(a),b,c)};c.executeScript=function(a,b,c){return d.executeScript(a,b,c)};c.referencesMember=function(a,b){return d.referencesMember(a,b)};c.referencesFunction=function(a,b){return d.referencesFunction(a,b)};c.extractFieldLiterals=function(a,b){void 0===b&&(b=!1);return e.extractFieldLiterals(a,b)}});
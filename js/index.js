var myApp = new Framework7({
    fastClicks: false
});
var $$ = Dom7;
var devicePlatform;

var map;
var mapDetalle;

var marker;
var markerG;

var glPoint;
var glPoint2;
var glPointG;

var _Map;
var _Basemaps;
var _ArcGISTiledMapServiceLayer;
var _GraphicsLayer;
var _PictureMarkerSymbol;
var _Point;
var _Polyline;
var _Graphic;
var _screenUtils;
var _scaleUtils;
var _webMercatorUtils;
var _geometryEngine;
var _Hammer;

var currentPointX;
var currentPointY;
var currentPoint;
var currentPointChat;

var currentUser;
var currentChats;
var currentChat;

var registrationData = null;
var cachePath;
var cacheParticipantes;

var photoURLS = new Array();
var msgtitle = "VoiceMap";
var baseMapUrl = "http://serviciosgis.eastus.cloudapp.azure.com/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer";

var _url_registro = 'https://voicemap-153216.appspot.com/Registro?';
var _url_conversacion = 'https://voicemap-153216.appspot.com/Conversacion?';
var _url_mensajes = 'https://voicemap-153216.appspot.com/Mensaje?';
var _url_photo = 'https://voicemap-153216.appspot.com/Imagen?';
var _url_audio = 'https://voicemap-153216.appspot.com/Audio?';

gotoLogin();

if (isPhoneGapExclusive()) {
    document.addEventListener("deviceready", onDeviceReady, false);
    window.addEventListener('resize', updateSize);
} else {
    $(document).ready(function () {
        init();
    });
};

function onDeviceReady() {
    $(document).ready(function () {
        init();
    });
}

function init() {
    if (isPhoneGapExclusive()) {
        devicePlatform = device.platform;
        try {
            if ((navigator.connection.type == 0) || (navigator.connection.type == 'none')) {
                sendAlert('Esta aplicaci&oacute;n requiere conexi&oacute;n a internet.');
            }
            var push = PushNotification.init({
                android: {
                    senderID: "394219421908"
                },
                ios: {
                    senderID: "394219421908",
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            });

            push.on('registration', function (data) {
                registrationData = devicePlatform + ":" + data.registrationId;
            });

            push.on('notification', function (data) {
                //alert(JSON.stringify(data));
                // data.additionalData
                updateUser();
                if ($("#chatDiv").is(":visible")) {
                    gotoChat(currentChat);
                };
            });

            push.on('error', function (e) {
                //alert(JSON.stringify(e));
                // e.message
            });

            slogin();

        } catch (err) {
            //alert(err);
        }
    } else {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'height': 50,
            'width': 'auto',
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': onLoginSuccess,
            'onfailure': onLoginFailure
        });

    }
}

function initMap() {
    try {
        require(
            [
                "esri/map",
                "esri/basemaps",
                "esri/layers/ArcGISTiledMapServiceLayer",
                "esri/layers/GraphicsLayer",
                "esri/symbols/PictureMarkerSymbol",
                "esri/geometry/geometryEngine",
                "esri/geometry/Point",
                "esri/geometry/Polyline",
                "esri/graphic",
                "esri/geometry/screenUtils",
                "esri/geometry/scaleUtils",
                "esri/geometry/webMercatorUtils",
                "hammer"
            ], function (
                __Map,
                __Basemaps,
                __ArcGISTiledMapServiceLayer,
                __GraphicsLayer,
                __PictureMarkerSymbol,
                __geometryEngine,
                __Point,
                __Polyline,
                __Graphic,
                __screenUtils,
                __scaleUtils,
                __webMercatorUtils,
                __Hammer) {
                _Map = __Map;
                _Basemaps = __Basemaps;
                _ArcGISTiledMapServiceLayer = __ArcGISTiledMapServiceLayer;
                _GraphicsLayer = __GraphicsLayer;
                _PictureMarkerSymbol = __PictureMarkerSymbol;
                _geometryEngine = __geometryEngine;
                _Point = __Point;
                _Polyline = __Polyline;
                _Graphic = __Graphic;
                _screenUtils = __screenUtils;
                _scaleUtils = __scaleUtils;
                _webMercatorUtils = __webMercatorUtils;
                _Hammer = __Hammer;
                initMap2();
            });
    } catch (err) {

    };
}

function initMap2() {
    _Basemaps.myBasemap = {
        baseMapLayers: [
          {
              url: "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer"
          },
          {
              url: "http://serviciosgis.eastus.cloudapp.azure.com/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer"
          }          
        ],
        title: "My Basemap"
    };
    map = new _Map("map", {
        zoom: 14,
        center: new _Point(-74.0668084, 4.600885262127369),
        autoresize: false,
        slider: false,
        basemap: "myBasemap"
    });
    mapDetalle = new _Map("mapDetalle", {
        zoom: 14,
        center: new _Point(-74.0668084, 4.600885262127369),
        autoresize: false,
        slider: false,
        basemap: "myBasemap"
    });
    mapDetalle.on("update-end", function (evt) {
        if (currentPointChat != null) {
            mapDetalle.centerAt(currentPointChat);
        }
    });
    dojo.connect(map, "onClick", function (evt) {
        if (evt.graphic != null) {
            gotoChat(evt.graphic.attributes.conversacionId);           
        }        
    });
    var hammertime = _Hammer(document.getElementById('map'));
    hammertime.on("hold", function (evt) {
        var x, y, point, mapPoint;
        x = evt.gesture.center.pageX;
        y = evt.gesture.center.pageY;
        point = new _Point(x, y);
        mapPoint = _screenUtils.toMapPoint(
          map.extent,
          map.width,
          map.height,
          point
        );
        newPoint(mapPoint);
    });

    marker = new _PictureMarkerSymbol();
    marker.setHeight(44);
    marker.setWidth(28);
    marker.setUrl("css/Location_Icon.png");

    markerG = new _PictureMarkerSymbol();
    markerG.setHeight(44);
    markerG.setWidth(28);
    markerG.setUrl("css/Marker_Icon.png");

    glPoint = new _GraphicsLayer();
    map.addLayer(glPoint, 0);
    glPointG = new _GraphicsLayer();
    map.addLayer(glPointG, 0);

    glPoint2 = new _GraphicsLayer();
    mapDetalle.addLayer(glPoint2, 0);

    updateSize();
    initLocationGPS();
    updateUser();
    zoomPoints();
}

function initLocationGPS() {
    try {

        navigator.geolocation.getCurrentPosition(function (position) {
            currentPointX = position.coords.longitude;
            currentPointY = position.coords.latitude;
            currentPoint = new _Point(currentPointX, currentPointY);
            glPoint.clear();
            glPoint.add(new _Graphic(currentPoint, marker), null, null);
            map.centerAt(currentPoint);
            if (currentChats != null) {
                updateUser();
            }
        },
            function (error) {

            },
            { timeout: 30000, enableHighAccuracy: true, maximumAge: 75000 });
    } catch (err) {

    }
}

function updateSize() {
    var the_height = window.innerHeight - $("#header").height();
    $("#map").height(the_height);
    if (map) {
        //map.resize();
        //map.reposition();
    };
};

function newPoint(evt) {
    myApp.showPreloader('Ubicando punto...');
    var currentPoint = _webMercatorUtils.webMercatorToGeographic(new _Point(evt.x, evt.y));
    currentPointX = currentPoint.x;
    currentPointY = currentPoint.y;
    currentChat = null;
    $("#ftitulo").val("");
    $("#fdireccion").val("");
    cacheParticipantes = [];
    cacheParticipantes.push(currentUser.email);
    updateParticipantes();

    var strParticipantes = "";
    var strId;
    if (currentChat == null) {
        strId = new Date().getTime();
    } else {
        strId = currentChat;
    }
    for (var i = 0; i < cacheParticipantes.length; i++) {
        strParticipantes = strParticipantes + "&participante=" + cacheParticipantes[i];
    };
    $.ajax({
        url: _url_conversacion + "cmd=update&idToken=" + currentUser.idToken + "&id=" + strId + "&titulo=" + encodeURIComponent($("#ftitulo").val()) + "&direccion=" + encodeURIComponent($("#fdireccion").val()) + "&latitud=" + currentPointY + "&longitud=" + currentPointX + strParticipantes,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            myApp.hidePreloader();
            currentChats = response.conversaciones;
            updateUser();
            gotoChat(response.id);
            if (isPhoneGapExclusive()) {
                sendAudio();
            }
        },
        error: function () {
            myApp.hidePreloader();
            sendAlert("Error actualizando conversacion.");
        }
    });
}

function hideAll() {
    $("#mapDiv").css("left", "-8000px");
    $("#mapDiv").css("position", "absolute");
    $("#map-toolbar").hide();
    $("#speed-dial").hide();

    $("#loginDiv").hide();
    $("#login-toolbar").hide();
    $("#listadoDiv").hide();
    $("#listado-toolbar").hide();
    $("#chatDiv").hide();
    $("#chat-toolbar").hide();
    $("#settingsDiv").hide();
    $("#settings-toolbar").hide();

    myApp.hideToolbar(".toolbar");
};

function slogin() {
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.trySilentLogin({
                    'webClientId': "394219421908-hsc5q45ah24ppo7i2bhhga2cc1k3nncb.apps.googleusercontent.com"
                },
                function (obj) {
                    try {
                        myApp.showPreloader('Iniciando sesi&oacute;n');
                        obj.registrationId = registrationData;
                        currentUser = obj;
                        var registroURL = _url_registro + "idToken=" + currentUser.idToken + "&registrationId=" + encodeURIComponent(currentUser.registrationId);
                        $.ajax({
                            url: registroURL,
                            type: 'GET',
                            dataType: 'json',
                            success: function (response) {
                                initMap();
                                myApp.hidePreloader();
                                currentChats = response.conversaciones;
                                hideAll();
                                gotoMap();
                            },
                            error: function () {
                                myApp.hidePreloader();
                                setTimeout(function () {
                                    sendAlert("Error en el inicio de session (100).");
                                }, 1500);
                            }
                        });
                    } catch (err) {
                        myApp.hidePreloader();
                        setTimeout(function () {
                            sendAlert("Error en el inicio de session (500).");
                        }, 1500);
                    }                    
                },
                function (msg) {
                    login();
                }
             );
    };
}

function login() {
    myApp.showPreloader('Iniciando sesi&oacute;n');
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.login({
                    'webClientId': "394219421908-hsc5q45ah24ppo7i2bhhga2cc1k3nncb.apps.googleusercontent.com"
                },
                function (obj) {
                    try {
                        obj.registrationId = registrationData;
                        currentUser = obj;
                        var registroURL = _url_registro + "idToken=" + currentUser.idToken + "&registrationId=" + encodeURIComponent(currentUser.registrationId);
                        $.ajax({
                            url: registroURL,
                            type: 'GET',
                            dataType: 'json',
                            success: function (response) {
                                initMap();
                                myApp.hidePreloader();
                                currentChats = response.conversaciones;
                                hideAll();
                                gotoMap();
                            },
                            error: function () {
                                myApp.hidePreloader();
                                setTimeout(function () {
                                    sendAlert("Error en el inicio de session (200).");
                                }, 1500);
                            }
                        });
                    } catch (err) {
                        myApp.hidePreloader();
                        setTimeout(function () {
                            sendAlert("Error en el inicio de session (400).");
                        }, 1500);
                    }                   
                },
                function (msg) {
                    myApp.hidePreloader();
                    setTimeout(function () {
                        sendAlert("Error en el inicio de session (300).");
                    }, 1500);
                });

    };
};

function onLoginSuccess(googleUser) {
    myApp.showPreloader('Iniciando sesi&oacute;n');
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    currentUser = { email: googleUser.getBasicProfile().getEmail(), idToken: googleUser.getAuthResponse().id_token, registrationId: null }
    var registroURL = _url_registro + "idToken=" + currentUser.idToken + "&registrationId=" + currentUser.registrationId;
    $.ajax({
        url: registroURL,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            initMap();
            myApp.hidePreloader();
            currentChats = response.conversaciones;
            hideAll();
            gotoMap();
        },
        error: function () {
            myApp.hidePreloader();
            setTimeout(function () {
                sendAlert("Error en el inicio de session.");
            }, 1500);
        }
    });
}
function onLoginFailure(error) {
    sendAlert("Error en el inicio de session.");
}

function gotoLogin() {
    if (isPhoneGapExclusive()) {
        $("#my-signin2").hide();
        $("#my-signin").show();
    } else {
        $("#my-signin").hide();
        $("#my-signin2").show();
    }
    hideAll();
    $("#loginDiv").show();
    $("#login-toolbar").show();
}

function gotoMap() {
    cachePath = "map";
    hideAll();
    $("#mapDiv").css("left", "0px");
    $("#mapDiv").css("position", "");
    $("#map-toolbar").show();
    $("#speed-dial").show();
    updateSize();
};

function gotoListado() {
    cachePath = "listado";
    hideAll();
    $("#listadoDiv").show();
    $("#listado-toolbar").show();
}

function gotoSettings() {
    var currentC = null;
    for (var i = 0; i < currentChats.length; i++) {
        if (currentChat == currentChats[i].id) {
            currentC = currentChats[i];
        };
    };
    if (currentC.owner == currentUser.email) {
        $("#btnDeleteConversacion").show();
    } else {
        $("#btnDeleteConversacion").hide();
    }
    $("#ftitulo").val(currentC.titulo);
    $("#fdireccion").val(currentC.direccion);
    cacheParticipantes = currentC.participantes.slice();
    updateParticipantes();
    hideAll();
    $("#settingsDiv").show();
    $("#settings-toolbar").show();
}

function acceptSettings() {
    var strParticipantes = "";
    var strId;
    if (currentChat == null) {
        strId = new Date().getTime();
    } else {
        strId = currentChat;
    }
    for (var i = 0; i < cacheParticipantes.length; i++) {
        strParticipantes = strParticipantes + "&participante=" + cacheParticipantes[i];
    };
    $.ajax({
        url: _url_conversacion + "cmd=update&idToken=" + currentUser.idToken + "&id=" + strId + "&titulo=" + encodeURIComponent($("#ftitulo").val()) + "&direccion=" + encodeURIComponent($("#fdireccion").val()) + /*"&latitud=" + currentPointY + "&longitud=" + currentPointX +*/ strParticipantes,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            currentChats = response.conversaciones;
            updateUser();
            gotoChat(response.id);
        },
        error: function () {
            sendAlert("Error actualizando conversacion.");
        }
    });
}

function cancelSettings() {
    if (currentChat == null) {
        gotoMap();
    } else {
        gotoChat(currentChat);
    };
}

function gotoBack() {
    if (cachePath == "map") {
        gotoMap();
    } else {
        gotoListado();
    };
};

function gotoChat(id) {
    if (currentChat != id) {
        $("#listadoMensajes").html("<br />");
    };
    currentChat = id;
    glPoint2.clear();
    for (var i = 0; i < currentChats.length; i++) {
        if (currentChats[i].id == id) {
            currentPointChat = new _Point(currentChats[i].longitud, currentChats[i].latitud);
            glPoint2.add(new _Graphic(currentPointChat, markerG), null, null);
            $("#dirDetalle").html("Direcci&oacute;n (aproximada): " + currentChats[i].direccion);
            mapDetalle.centerAt(currentPointChat);
        }
    }
    $.ajax({
        url: _url_conversacion + "cmd=get&idToken=" + currentUser.idToken + "&conversacionId=" + currentChat,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            for (var i = response.mensajes.length - 1; i >= 0; i--) {
                if ($("#msg_" + response.mensajes[i].id).length == 0){
                    var strHtml = "<div id='msg_" + response.mensajes[i].id + "' class='card facebook-card'>";
                    strHtml = strHtml + "<div class='card-header no-border'>";

                    var strUser = null;
                    for (var j = 0; j < response.usuarios.length; j++) {
                        if (response.mensajes[i].email == response.usuarios[j].email) {
                            strUser = response.usuarios[j];
                        }
                    }

                    if (strUser == null) {
                        strHtml = strHtml + "<div class='facebook-avatar'><img src='images/Profile.jpg' width='34' height='34'></div>";
                        strHtml = strHtml + "<div class='facebook-name'>" + response.mensajes[i].email + "</div>";
                    } else {
                        strHtml = strHtml + "<div class='facebook-avatar'><img src='" + strUser.imageUrl + "' width='34' height='34'></div>";
                        strHtml = strHtml + "<div class='facebook-name'>" + strUser.displayName + "</div>";
                    }

                    strHtml = strHtml + "<div class='facebook-date'>" + response.mensajes[i].timestamp + "</div>";
                    strHtml = strHtml + "</div>";
                    strHtml = strHtml + "<div class='card-content'>";
                    strHtml = strHtml + response.mensajes[i].contenido;
                    strHtml = strHtml + "</div>";
                    strHtml = strHtml + "</div>";
                    $("#listadoMensajes").prepend(strHtml);
                }
            }
            mapDetalle.centerAt(currentPointChat);
        },
        error: function () {
            sendAlert("Error en el inicio de session.");
        }
    });
    hideAll();
    $("#chatDiv").show();
    $("#chat-toolbar").show();
    if (isPhoneGapExclusive()) {
        $("#btnSendPhoto").show();
        $("#btnSendAudio").show();
    } else {
        $("#btnSendPhoto").hide();
        $("#btnSendAudio").hide();
    }
    myApp.showToolbar(".toolbar");
}

function sendText() {
    var strTxt = $("#txtMsg").val();
    $("#txtMsg").val("");
    $.ajax({
        url: _url_mensajes + "cmd=create&idToken=" + currentUser.idToken + "&conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&contenido=" + strTxt,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            gotoChat(currentChat);
        },
        error: function () {

        }
    });
}

function sendPhoto() {
    myApp.modal({
        title: 'VoiceMap',
        text: 'De donde quieres cargar la foto',
        buttons: [
          {
              text: 'Camara',
              onClick: function () {
                  addPhotos(Camera.PictureSourceType.CAMERA);
              }
          },
          {
              text: 'Galeria',
              onClick: function () {
                  addPhotos(Camera.PictureSourceType.SAVEDPHOTOALBUM);
              }
          }
        ]
    });
}

function sendAudio() {
    navigator.device.capture.captureAudio(captureAudioSuccess, captureAudioFail, {
        limit: 1, duration: 30
    });
}

function captureAudioSuccess(audioURI) {
    myApp.showPreloader("Cargando audio, por favor, espere.");

    var fail, ft, options, params, win;
    options = new FileUploadOptions();
    options.fileKey = "nva_audio";
    options.fileName = "audio_" + new Date().getTime();
    ft = new FileTransfer();
    ft.upload(audioURI[0].localURL, _url_audio + "filename=" + audioURI[0].localURL + "&conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&idToken=" + currentUser.idToken, uploadAudioSuccessFT, uploadAudioFail, options);
}

function captureAudioFail(audioURI) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("Error en la captura del audio");
    }, 1500);
}

function uploadAudioSuccessFT(response) {
    myApp.hidePreloader();
    gotoChat(currentChat);
};

function uploadAudioFail(error) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("No se pudo cargar el audio, por favor, intente m&aacute;s tarde.");
    }, 1500);
};


function addPhotos(sourceType) {
    navigator.camera.getPicture(captureImagenSuccess, captureImagenFail, {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        quality: 50,
        targetHeight: 1024,
        targetWidth: 1024,
        encodingType: Camera.EncodingType.JPEG
    });
};

function captureImagenSuccess(imageURI) {
    myApp.showPreloader("Cargando foto, por favor, espere.");

    var fail, ft, options, params, win;
    options = new FileUploadOptions();
    options.fileKey = "nva_imagen";
    options.fileName = "imagen_" + new Date().getTime() + ".jpg";
    ft = new FileTransfer();
    ft.upload(imageURI, _url_photo + "conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&idToken=" + currentUser.idToken, uploadImagenSuccessFT, uploadImagenFail, options);
}

function captureImagenFail(imageURI) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("Error en la captura de la imagen");
    }, 1500);
}

function uploadImagenSuccessFT(response) {
    myApp.hidePreloader();
    gotoChat(currentChat);
};

function uploadImagenFail(error) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("No se pudo cargar la foto, por favor, intente m&aacute;s tarde.");
    }, 1500);
};

function dial() {
    if ($("#speed-dial").hasClass('speed-dial-opened')) {
        $('#speed-dial').removeClass('speed-dial-opened');
    } else {
        $('#speed-dial').addClass('speed-dial-opened');
    }
};

function nuevoParticipante() {
    myApp.prompt('', 'Nuevo participante', function (value) {
        if (value != "") {
            cacheParticipantes.push(value);
            updateParticipantes();
        }
    });
    $(".modal-in :input").attr("placeholder", "Correo electronico");    
};

function updateUser() {
    $("#user_name").html(currentUser.displayName);
    $("#user_email").html(currentUser.email);
    $("#listadoConversaciones").html("");
    glPointG.clear();
    var puntos = [ currentPoint ];

    if ($("#btnSortDate").hasClass("button-fill")) {
        currentChats.sort(function (a, b) {
            if (new Date(a.timestamp) < new Date(b.timestamp)) return 1;
            if (new Date(a.timestamp) > new Date(b.timestamp)) return -1;
            return 0;
        });
    }
    if ($("#btnSortTitle").hasClass("button-fill")) {
        currentChats.sort(function (a, b) {
            if (a.titulo < b.titulo) return -1;
            if (a.titulo > b.titulo) return 1;
            return 0;
        });
    }
    if ($("#btnSortDistance").hasClass("button-fill")) {
        currentChats.sort(function (a, b) {
            var d1 = _geometryEngine.distance(currentPoint, new _Point(a.longitud, a.latitud));
            var d2 = _geometryEngine.distance(currentPoint, new _Point(b.longitud, b.latitud));
            if (d1 < d2) return -1;
            if (d1 > d2) return 1;
            return 0;
        });
    }

    for (var i = 0; i < currentChats.length; i++) {
        var strHtml = "<li>";
        strHtml = strHtml + "<a href='#' class='item-link item-content' onclick='gotoChat(\"" + currentChats[i].id + "\");'>";
        //strHtml = strHtml + "<div class='item-media'>";
        //strHtml = strHtml + "<img src='images/Map.png' style='width: 150px;' />";
        //strHtml = strHtml + "</div>";
        strHtml = strHtml + "<div class='item-inner'>";
        strHtml = strHtml + "<div class='item-title-row'>";
        strHtml = strHtml + "<div class='item-title'>" + currentChats[i].titulo + "</div>";
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "<div class='item-subtitle'>Direcci&oacute;n:" + currentChats[i].direccion + "</div>";
        strHtml = strHtml + "<div class='item-text'>" + currentChats[i].timestamp + "</div>";
        if (currentPoint != null) {
            var distancia = (_geometryEngine.distance(currentPoint, new _Point(currentChats[i].longitud, currentChats[i].latitud)) * _scaleUtils.getUnitValueForSR({ wkid: 4326 })) / 1000;
            strHtml = strHtml + "<div class='item-text'>Distancia: " + distancia.toFixed(1) + " Kms.</div>";
        }
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</a>";
        strHtml = strHtml + "</li>";
        $("#listadoConversaciones").append(strHtml);

        try {
            var _currentPoint = new _Point(currentChats[i].longitud, currentChats[i].latitud);
            var currentPointG = new _Graphic(_currentPoint, markerG);
            puntos.push(_currentPoint);
            currentPointG.setAttributes({ conversacionId: currentChats[i].id });
            glPointG.add(currentPointG);
        } catch (err) {

        }


    }
};

function zoomPoints() {
    var puntos = [currentPoint];

    for (var i = 0; i < currentChats.length; i++) {        
        try {
            var _currentPoint = new _Point(currentChats[i].longitud, currentChats[i].latitud);
            puntos.push(_currentPoint);
        } catch (err) {

        }
    }
    if (puntos.length > 0) {
        var poly = new _Polyline();
        poly.addPath(puntos);
        map.setExtent(poly.getExtent().expand(1.5));
    }
};

function updateParticipantes() {
    $("#listadoParticipantes").html("");
    for (var i = 0; i < cacheParticipantes.length; i++) {
        var strHtml = "<li>";
        strHtml = strHtml + "<div class='item-content'>";
        //strHtml = strHtml + "<div class='item-media'><img src='images/Profile.jpg' width='34' height='34'></div>";
        strHtml = strHtml + "<div class='item-inner'>";
        strHtml = strHtml + "<div class='item-title-row'>";
        strHtml = strHtml + "<div class='item-title'>" + cacheParticipantes[i] + "</div>";
        strHtml = strHtml + "<div class='item-subtitle'><a href='#' onclick='deleteParticipante(" + i + ");' class=''><i class='fa fa-trash' aria-hidden='true'></i></a></div>";
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</li>";
        $("#listadoParticipantes").append(strHtml);
    };
};

function sortByDate() {
    $("#btnSortDate,#btnSortTitle,#btnSortDistance").removeClass("button-fill");
    $("#btnSortTitle,#btnSortDistance").addClass("button-raised");
    $("#btnSortDate").addClass("button-fill");
    updateUser();
};

function sortByTitle() {
    $("#btnSortDate,#btnSortTitle,#btnSortDistance").removeClass("button-fill");
    $("#btnSortDate,#btnSortDistance").addClass("button-raised");
    $("#btnSortTitle").addClass("button-fill");    
    updateUser();
};

function sortByDistance() {
    $("#btnSortDate,#btnSortTitle,#btnSortDistance").removeClass("button-fill");
    $("#btnSortDate,#btnSortTitle").addClass("button-raised");
    $("#btnSortDistance").addClass("button-fill");    
    updateUser();
};

function deleteParticipante(pos) {
    cacheParticipantes.splice(pos, 1);
    updateParticipantes();
}

function deleteConversacion() {
    myApp.confirm('Esta seguro de eliminar la conversaci&oacute;n?', '', function () {
        myApp.showPreloader('Eliminado conversaci&oacute;n...');
        $.ajax({
            url: _url_conversacion + "cmd=delete&idToken=" + currentUser.idToken + "&id=" + currentChat,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                myApp.hidePreloader();
                currentChats = response.conversaciones;
                updateUser();
                gotoListado();
            },
            error: function () {
                myApp.hidePreloader();
                sendAlert("Error actualizando conversacion.");
            }
        });


    });
}

function logout() {
    myApp.closePanel('right');
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.logout(
            function (msg) {
                currentUser = null;
                gotoLogin();
            },
            function (msg) {

            }
        );
    } else {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            currentUser = null;
            gotoLogin();
        });
    }
};

function sendAlert(text) {
    myApp.alert(text, msgtitle);
}


function isPhoneGapExclusive() {
    try {
        return (cordova || PhoneGap || phonegap);
    } catch (err) {
        return false;
    }
}
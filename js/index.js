var myApp = new Framework7({
    fastClicks: false
});
var $$ = Dom7;
var devicePlatform;

var map;
var mapDetalle;

var mapLayer;
var mapLayer2;

var marker;
var markerG;

var glPoint;
var glPoint2;
var glPointG;

var _Map;
var _ArcGISTiledMapServiceLayer;
var _GraphicsLayer;
var _PictureMarkerSymbol;
var _Point;
var _Polyline;
var _Graphic;
var _screenUtils;
var _webMercatorUtils;
var _Hammer;

var currentPointX;
var currentPointY;
var currentPoint;
var currentPointChat;

var currentUser;
var currentChats;
var currentChat;

var registrationData;
var cachePath;
var cacheParticipantes;

var photoURLS = new Array();
var msgtitle = "VoiceMap";
var baseMapUrl = "http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Base/MapServer";

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
                slogin();
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
                alert(JSON.stringify(e));
                // e.message
            });

        } catch (err) {
            alert(err);
        }
    } else {
        slogin();
    }
}

function initMap() {
    try {
        require(
            [
                "esri/map",
                "esri/layers/ArcGISTiledMapServiceLayer",
                "esri/layers/GraphicsLayer",
                "esri/symbols/PictureMarkerSymbol",
                "esri/geometry/Point",
                "esri/geometry/Polyline",
                "esri/graphic",
                "esri/geometry/screenUtils",
                "esri/geometry/webMercatorUtils",
                "hammer"
            ], function (
                __Map,
                __ArcGISTiledMapServiceLayer,
                __GraphicsLayer,
                __PictureMarkerSymbol,
                __Point,
                __Polyline,
                __Graphic,
                __screenUtils,
                __webMercatorUtils,
                __Hammer) {
                _Map = __Map;
                _ArcGISTiledMapServiceLayer = __ArcGISTiledMapServiceLayer;
                _GraphicsLayer = __GraphicsLayer;
                _PictureMarkerSymbol = __PictureMarkerSymbol;
                _Point = __Point;
                _Polyline = __Polyline;
                _Graphic = __Graphic;
                _screenUtils = __screenUtils;
                _webMercatorUtils = __webMercatorUtils;
                _Hammer = __Hammer;
                initMap2();
            });
    } catch (err) {

    };
}

function initMap2() {
    map = new _Map("map", {
        zoom: 7,
        center: new _Point(-74.0668084, 4.600885262127369, { wkid: 4686 }),
        autoresize: false,
        slider: false
    });
    mapDetalle = new _Map("mapDetalle", {
        zoom: 7,
        center: new _Point(-74.0668084, 4.600885262127369, { wkid: 4686 }),
        autoresize: false,
        slider: false
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

    mapLayer = new _ArcGISTiledMapServiceLayer("http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Base/MapServer/");
    map.addLayer(mapLayer);
    glPoint = new _GraphicsLayer();
    map.addLayer(glPoint, 0);
    glPointG = new _GraphicsLayer();
    map.addLayer(glPointG, 0);

    mapLayer2 = new _ArcGISTiledMapServiceLayer("http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Base/MapServer/");
    mapDetalle.addLayer(mapLayer2);
    glPoint2 = new _GraphicsLayer();
    mapDetalle.addLayer(glPoint2, 0);

    updateSize();
    initLocationGPS();
    updateUser();
}

function initLocationGPS() {
    try {

        navigator.geolocation.getCurrentPosition(function (position) {
            currentPointX = position.coords.longitude;
            currentPointY = position.coords.latitude;
            currentPoint = new _Point(currentPointX, currentPointY, { wkid: 4686 });
            glPoint.clear();
            glPoint.add(new _Graphic(currentPoint, marker), null, null);
            map.centerAt(currentPoint);
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
        map.resize();
        map.reposition();
    };
};

function newPoint(evt) {
    myApp.showPreloader('Ubicando punto...');
    currentPointX = evt.x;
    currentPointY = evt.y;
    var currentPoint = new _Point(currentPointX, currentPointY, { wkid: 4686 });
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
        url: _url_conversacion + "cmd=update&email=" + currentUser.email + "&id=" + strId + "&titulo=" + encodeURIComponent($("#ftitulo").val()) + "&direccion=" + encodeURIComponent($("#fdireccion").val()) + "&latitud=" + currentPointY + "&longitud=" + currentPointX + strParticipantes,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            myApp.hidePreloader();
            currentChats = response.conversaciones;
            updateUser();
            gotoChat(response.id);
            sendAudio();
        },
        error: function () {
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
        window.plugins.googleplus.trySilentLogin({},
                function (obj) {
                    myApp.showPreloader('Iniciando sesi&oacute;n');
                    obj.registrationId = registrationData;
                    currentUser = obj;
                    var registroURL = _url_registro + "email=" + encodeURIComponent(currentUser.email)
                      + "&userId=" + currentUser.userId + "&displayName=" + encodeURIComponent(currentUser.displayName) + "&imageUrl=" + encodeURIComponent(currentUser.imageUrl) + "&registrationId=" + encodeURIComponent(currentUser.registrationId);
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
                            zoomPoints();
                        },
                        error: function () {
                            myApp.hidePreloader();
                            setTimeout(function () {
                                sendAlert("Error en el inicio de session.");
                            }, 1500);
                        }
                    });
                },
                function (msg) {
                    myApp.hidePreloader();
                }
             );
    } else {
        currentUser = { userId: 109917423592778214535, email: "dbello@catastrobogota.gov.co", displayName: "David Hernando Bello Ladino", imageUrl: "https://lh4.googleusercontent.com/-yrsxwsfx9jQ/AAAAAAAAAAI/AAAAAAAAAAk/dBZAfoGLEU8/photo.jpg", registrationId: null }
        var registroURL = _url_registro + "email=" + encodeURIComponent(currentUser.email)
          + "&userId=" + currentUser.userId + "&displayName=" + encodeURIComponent(currentUser.displayName) + "&imageUrl=" + encodeURIComponent(currentUser.imageUrl) + "&registrationId=" + encodeURIComponent(currentUser.registrationId);
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
                zoomPoints();
            },
            error: function () {
                myApp.hidePreloader();
                setTimeout(function () {
                    sendAlert("Error en el inicio de session.");
                }, 1500);
            }
        });
    }
}

function login() {
    myApp.showPreloader('Iniciando sesi&oacute;n');
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.login({
                    'webClientId': "394219421908-hsc5q45ah24ppo7i2bhhga2cc1k3nncb.apps.googleusercontent.com",
                    offline: true
                },
                function (obj) {
                    obj.registrationId = registrationData;
                    currentUser = obj;
                    var registroURL = _url_registro + "email=" + encodeURIComponent(currentUser.email)
                      + "&userId=" + currentUser.userId + "&displayName=" + encodeURIComponent(currentUser.displayName) + "&imageUrl=" + encodeURIComponent(currentUser.imageUrl) + "&registrationId=" + encodeURIComponent(currentUser.registrationId);
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
                            zoomPoints();
                        },
                        error: function () {
                            myApp.hidePreloader();
                            setTimeout(function () {
                                sendAlert("Error en el inicio de session.");
                            }, 1500);
                        }
                    });
                },
                function (msg) {
                    myApp.hidePreloader();
                    setTimeout(function () {
                        sendAlert("Error en el inicio de session.");
                    }, 1500);
                });

    };
};

function gotoLogin() {
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
        url: _url_conversacion + "cmd=update&email=" + currentUser.email + "&id=" + strId + "&titulo=" + encodeURIComponent($("#ftitulo").val()) + "&direccion=" + encodeURIComponent($("#fdireccion").val()) + "&latitud=" + currentPointY + "&longitud=" + currentPointX + strParticipantes,
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
            currentPointChat = new _Point(currentChats[i].longitud, currentChats[i].latitud, { wkid: 4686 });
            glPoint2.add(new _Graphic(currentPointChat, markerG), null, null);
            $("#dirDetalle").html("Direcci&oacute;n (aproximada): " + currentChats[i].direccion);
            mapDetalle.centerAt(currentPointChat);
        }
    }
    $.ajax({
        url: _url_conversacion + "cmd=get&conversacionId=" + currentChat,
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
    myApp.showToolbar(".toolbar");
}

function sendText() {
    var strTxt = $("#txtMsg").val();
    $("#txtMsg").val("");
    $.ajax({
        url: _url_mensajes + "cmd=create&conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&email=" + encodeURIComponent(currentUser.email) + "&contenido=" + strTxt,
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
    ft.upload(audioURI[0].localURL, _url_audio + "filename=" + audioURI[0].localURL + "&conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&email=" + encodeURIComponent(currentUser.email), uploadAudioSuccessFT, uploadAudioFail, options);
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
    ft.upload(imageURI, _url_photo + "conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&email=" + encodeURIComponent(currentUser.email), uploadImagenSuccessFT, uploadImagenFail, options);
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
    myApp.prompt('Correo del nuevo participante', 'VoiceMap', function (value) {
        cacheParticipantes.push(value);
        updateParticipantes();
    });
};

function updateUser() {
    $("#user_name").html(currentUser.displayName);
    $("#user_email").html(currentUser.email);
    $("#listadoConversaciones").html("");
    glPointG.clear();
    var puntos = [ currentPoint ];

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
        //strHtml = strHtml + "<div class='item-text'>Ultimo mensaje: Fecha y texto...</div>";        
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</a>";
        strHtml = strHtml + "</li>";
        $("#listadoConversaciones").append(strHtml);

        try {
            var _currentPoint = new _Point(currentChats[i].longitud, currentChats[i].latitud, { wkid: 4686 });
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
            var _currentPoint = new _Point(currentChats[i].longitud, currentChats[i].latitud, { wkid: 4686 });
            puntos.push(_currentPoint);
        } catch (err) {

        }
    }
    if (puntos.length > 0) {
        var poly = new _Polyline({ wkid: 4686 });
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

function deleteParticipante(pos) {
    cacheParticipantes.splice(pos, 1);
    updateParticipantes();
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
        currentUser = null;
        gotoLogin();
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
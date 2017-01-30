var myApp = new Framework7({
    fastClicks: false
});
var $$ = Dom7;
var devicePlatform;

var map;
var view;
var mapLayer;

var marker;
var markerG;

var glPoint;
var glPointG;

var currentPointX;
var currentPointY;
var currentPoint;
var currentUser;
var currentChats;
var currentChat;

var registrationData;
var cachePath;
var cacheParticipantes;

var modeManual = false;
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
        gotoLogin();
        try {
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
                alert(JSON.stringify(data));
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
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

        if ((navigator.connection.type == 0) || (navigator.connection.type == 'none')) {
            sendAlert('Esta aplicaci&oacute;n requiere conexi&oacute;n a internet.');
            $("#bienvenida-toolbar").hide();
        }
    } else {
        if (window.localStorage.getItem("user") == null) {
            gotoLogin();
        } else {
            gotoMap();
            updateUser();
        };
    }
    initMap();
}

function initMap() {
    try {
        dojo.require("esri.map");
        dojo.require("esri.layers.MapImageLayer");
        dojo.require("esri.layers.MapImage");
        dojo.require("esri.graphic");
        dojo.require("esri.graphicsUtils");
        dojo.require("esri.symbols.PictureMarkerSymbol");
        dojo.require("esri.geometry.webMercatorUtils");
        dojo.addOnLoad(initMap2);
    } catch (err) {

    };
}

function initMap2() {
    map = new esri.Map("map", {
        zoom: 7,
        center: new esri.geometry.Point(-74.0668084, 4.600885262127369, { wkid: 4686 }),
        autoresize: false,
        slider: false
    });
    dojo.connect(map, "onClick", function (evt) {
        if (evt.graphic != null) {
            gotoChat(evt.graphic.attributes.conversacionId);
        };
        setLocationPoint(evt);
    });
    marker = new esri.symbol.PictureMarkerSymbol();
    marker.setHeight(44);
    marker.setWidth(28);
    marker.setUrl("css/Location_Icon.png");

    markerG = new esri.symbol.PictureMarkerSymbol();
    markerG.setHeight(44);
    markerG.setWidth(28);
    markerG.setUrl("css/Marker_Icon.png");

    mapLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Base/MapServer/");
    map.addLayer(mapLayer);
    glPoint = new esri.layers.GraphicsLayer();
    map.addLayer(glPoint, 0);
    glPointG = new esri.layers.GraphicsLayer();
    map.addLayer(glPointG, 0);
    updateSize();
    initLocationGPS();
}

function initLocationGPS() {
    $("#buttonLocation").css("background-color", "#004167");
    modeManual = false;
    try {

        navigator.geolocation.getCurrentPosition(function (position) {
            currentPointX = position.coords.longitude;
            currentPointY = position.coords.latitude;
            var currentPoint = new esri.geometry.Point(currentPointX, currentPointY, { wkid: 4686 });
            glPoint.clear();
            glPoint.add(new esri.Graphic(currentPoint, marker), null, null);
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

function setLocation() {
    if (modeManual) {
        $("#buttonLocation").css("background-color", "#004167");
        modeManual = false;
    } else {
        $("#buttonLocation").css("background-color", "grey");
        modeManual = true;
    }
};

function setLocationPoint(evt) {
    if (modeManual) {
        modeManual = false;
        $("#buttonLocation").css("background-color", "#004167");
        currentPointX = evt.mapPoint.x;
        currentPointY = evt.mapPoint.y;
        var currentPoint = new esri.geometry.Point(currentPointX, currentPointY, { wkid: 4686 });
        glPoint.clear();
        glPoint.add(new esri.Graphic(currentPoint, marker), null, null);
        map.centerAt(currentPoint);
    }
}

function hideAll() {
    $("#mapDiv").css("left", "-6000px");
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

function login() {
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.trySilentLogin({},
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
                            currentChats = response.conversaciones;
                            hideAll();
                            gotoMap();
                            updateUser();
                        },
                        error: function () {
                            sendAlert("Error en el inicio de session.");
                        }
                    });
                },
                function (msg) {
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
                                currentChats = response.conversaciones;
                                hideAll();
                                gotoMap();
                                updateUser();
                            },
                            error: function () {
                                sendAlert("Error en el inicio de session.");
                            }
                        });
                        hideAll();
                        gotoMap();
                        updateUser();
                    },
                    function (msg) {
                        alert("error: " + msg);
                    }
                 );
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
                currentChats = response.conversaciones;
                hideAll();
                gotoMap();
                updateUser();
            },
            error: function () {
                sendAlert("Error en el inicio de session.");
            }
        });
    }
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

    modeManual = false;
    $("#buttonLocation").css("background-color", "#004167");
};

function gotoListado() {
    cachePath = "listado";
    hideAll();
    $("#listadoDiv").show();
    $("#listado-toolbar").show();
}

function gotonewChat() {
    currentChat = null;
    $("#ftitulo").val("");
    cacheParticipantes = [];
    cacheParticipantes.push(currentUser.email);
    updateParticipantes();
    hideAll();
    $("#settingsDiv").show();
    $("#settings-toolbar").show();
};

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
        url: _url_conversacion + "cmd=update&email=" + currentUser.email + "&id=" + strId + "&titulo=" + encodeURIComponent($("#ftitulo").val()) + "&direccion=" + encodeURIComponent($("#fdireccion").val()) + "&latitud=" + currentPointX + "&longitud=" + currentPointY + strParticipantes,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            currentChats = response.conversaciones;
            updateUser();
            gotoChat(response.id);
        },
        error: function () {
            sendAlert("Error actualizando/creando conversacion.");
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
    currentChat = id;
    $("#listadoMensajes").html("");
    $.ajax({
        url: _url_conversacion + "cmd=get&conversacionId=" + currentChat,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            for (var i = 0; i < response.mensajes.length; i++) {
                var strHtml = "<div class='card facebook-card'>";
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
                $("#listadoMensajes").append(strHtml);
            }
            $("#listadoMensajes").append("<br />");
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
    ft.upload(audioURI[0].localURL, _url_audio + "filename=" + audioURI[0].name + "&conversacionId=" + currentChat + "&id=" + new Date().getTime() + "&email=" + encodeURIComponent(currentUser.email), uploadAudioSuccessFT, uploadAudioFail, options);
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
    myApp.prompt('Correo del nuevo participante?', 'VoiceMap', function (value) {
        cacheParticipantes.push(value);
        updateParticipantes();
    });
};

function updateUser() {
    $("#user_name").html(currentUser.displayName);
    $("#user_email").html(currentUser.email);
    $("#listadoConversaciones").html("");
    var localExtent;
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
        strHtml = strHtml + "<div class='item-subtitle'>" + currentChats[i].direccion + "</div>";
        //strHtml = strHtml + "<div class='item-text'>Ultimo mensaje: Fecha y texto...</div>";        
        strHtml = strHtml + "</div>";
        strHtml = strHtml + "</a>";
        strHtml = strHtml + "</li>";
        $("#listadoConversaciones").append(strHtml);


        glPointG.clear();
        try {
            var currentPoint = new esri.geometry.Point(currentChats[i].latitud, currentChats[i].longitud, { wkid: 4686 });
            var currentPointG = new esri.Graphic(currentPoint, markerG);
            currentPointG.setAttributes({ conversacionId: currentChats[i].id });
            glPointG.add(currentPointG, null, null);
            /*
            if (localExtent == null) {
                localExtent = new esri.geometry.Extent(currentPointG.geometry.getExtent());
            } else {
                localExtent = localExtent.union(currentPointG.geometry.getExtent());
            }*/
        } catch (err) {

        }


    }
    /*
    if (localExtent != null) {
        map.setExtent(localExtent.getExtent());
    }
    */
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
                window.localStorage.removeItem("user");
                gotoLogin();
            },
            function (msg) {

            }
        );
    } else {
        currentUser = null;
        window.localStorage.removeItem("user");
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
var myApp = new Framework7({
    fastClicks: false
});
var $$ = Dom7;

var map;
var view;
var mapLayer;
var marker;
var glPoint;
var glPointG;
var currentPoint;
var currentUser;
var imageCache;

var modeManual = false;
var photoURLS = new Array();
var msgtitle = "VoiceMap";
var baseMapUrl = "http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/Mapa_Base/MapServer";

var _url_photo = 'https://dinamica-147714.appspot.com/Imagen';
var _url_msg = 'https://20161105t160625-dot-dinamica-147714.appspot.com/Registro?';
var _url_user = 'https://20161105t160625-dot-dinamica-147714.appspot.com/UsuarioRegistro?';
var _url_balance = 'https://20161105t160625-dot-dinamica-147714.appspot.com/UsuarioBalance?';

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
    currentUser = window.localStorage.getItem("user");
    if (isPhoneGapExclusive()) {
        login();
        try {
            var push = PushNotification.init({
                android: {
                    senderID: "394219421908"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                }
            });

            push.on('registration', function (data) {
                alert(JSON.stringify(data));
                // data.registrationId
            });

            push.on('notification', function (data) {
                alert(JSON.stringify(data));
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData
            });

            push.on('error', function (e) {
                alert(JSON.stringify(e));
                // e.message
            });
        } catch (err) {
            alert("error:" + JSON.stringify(err));
        }

        if ((navigator.connection.type == 0) || (navigator.connection.type == 'none')) {
            sendAlert('Esta aplicaci&oacute;n requiere conexi&oacute;n a internet.');
            $("#bienvenida-toolbar").hide();
        }
    } else {
        gotoLogin();
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
        dojo.require("esri.symbols.PictureMarkerSymbol");
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
        setLocationPoint(evt);
    });
    marker = new esri.symbol.PictureMarkerSymbol();
    marker.setHeight(44);
    marker.setWidth(28);
    marker.setUrl("css/Location_Icon.png");

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
};

function login() {
    if (isPhoneGapExclusive()) {
        window.plugins.googleplus.trySilentLogin({
            'webClientId': "394219421908-hsc5q45ah24ppo7i2bhhga2cc1k3nncb.apps.googleusercontent.com"
        },
                function (obj) {
                    alert(JSON.stringify(obj));
                    hideAll();
                    gotoMap();
                    updateUser();
                },
                function (msg) {
                    alert("error: " + msg);
                }
             );
    } else {
        hideAll();
        gotoMap();
        updateUser();
    }    
};

function gotoLogin() {
    hideAll();
    $("#loginDiv").show();
    $("#login-toolbar").show();
}

function gotoMap() {
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
    hideAll();
    $("#listadoDiv").show();
    $("#listado-toolbar").show();
}

function gotoChat() {
    hideAll();
    $("#chatDiv").show();
    $("#chat-toolbar").show();
}

function dial() {
    if ($("#speed-dial").hasClass('speed-dial-opened')) {
        $('#speed-dial').removeClass('speed-dial-opened');
    } else {
        $('#speed-dial').addClass('speed-dial-opened');
    }
};

function addPhotos(sourceType) {
    navigator.camera.getPicture(captureSuccess, captureFail, {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        quality: 50,
        targetHeight: 1024,
        targetWidth: 1024,
        encodingType: Camera.EncodingType.JPEG
    });
};

function captureSuccess(imageURI) {
    myApp.showPreloader("Cargando foto, por favor, espere.");

    var fail, ft, options, params, win;
    options = new FileUploadOptions();
    options.fileKey = "nva_imagen";
    options.fileName = "imagen_" + new Date().getTime() + ".jpg";
    ft = new FileTransfer();
    imageCache = imageURI;
    ft.upload(imageURI, _url_photo, uploadSuccessFT, uploadFail, options);
}

function captureFail(imageURI) {
    sendAlert("Error en la captura de la imagen");
}

function uploadSuccessFT(response) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("Foto cargada exitosamente.");
    }, 1500);
    var objResponse;
    objResponse = response.response;
    photoURLS.push(objResponse);
    //$('#photolist').append('<img class="image_thumb" src="' + imageCache + '" />');
};

function uploadFail(error) {
    myApp.hidePreloader();
    setTimeout(function () {
        sendAlert("No se pudo cargar la foto, por favor, intente m&aacute;s tarde.");
    }, 1500);
};

function submitMsg() {

};

function updateUser() {

};

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
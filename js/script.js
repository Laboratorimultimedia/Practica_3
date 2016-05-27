/**
 * Created by Black Phoenix on 13/05/2016.
 */


//////////////////////////// classe Punt ///////////////////////////
function Punt(x,y){
    this.x=x;
    this.y=y;
}
////// Mètodes estàtics
Punt.distanciaPuntPunt=function(p1,p2){
    var incX= p2.x-p1.x;
    var incY= p2.y-p1.y;
    return Math.sqrt(incX*incX+incY*incY);
    // return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2));
}
//////////////////////////////////////////////////////////////////

//////////////////////////// classe Cercle ///////////////////////
function Cercle(centre,radi,color){
    this.centre = centre;  // és un Punt
    this.radi = radi;
    this.color = color || "rgba(200, 200, 100, .9)";
}
Cercle.prototype.dibuixar = function(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.centre.x, this.centre.y, this.radi, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}
//////////////////////////////////////////////////////////////////

///////////////////////////// classe Segment /////////////////////
function Segment(p1, p2, gruix, color) {
    this.p1 = p1;  // és un Punt
    this.p2 = p2;
    this.gruix = gruix;
    this.color = color || "#cfc";
}
////// Mètodes públics
Segment.prototype.dibuixar = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x,this.p1.y);
    ctx.lineTo(this.p2.x,this.p2.y);
    ctx.lineWidth = this.gruix;
    ctx.strokeStyle = this.color;
    ctx.stroke();
}
////// Mètodes estàtics
Segment.esTallen=function (segment1, segment2) {
    var p1=segment1.p1;
    var p2=segment1.p2;
    var p3=segment2.p1;
    var p4=segment2.p2;
    if(p1==p3||p1==p4||p2==p3||p2==p4){
        return false;
    }
    else {
        return Segment.check(p1, p2, p3) != Segment.check(p1, p2, p4) && Segment.check(p3, p4, p1) != Segment.check(p3, p4, p2);
    }
};
Segment.check=function(p1,p2,p3){
    return (p3.y-p1.y)*(p2.x-p1.x) > (p2.y-p1.y)*(p3.x-p1.x);
};

////// Classe estàtica  //////
function Utilitats(){


}
/// Mètodes estàtics //////

Utilitats.setLv=function setLv(Lv){localStorage.setItem('currentLv', Lv);}
Utilitats.getLv=function getLv(Lv){return localStorage.getItem('currentLv');}

Utilitats.nombreAleatoriEntre= function(a,b){
    return Math.floor(Math.random()*(b-a+a)) + a;
}

//////////////////////////////////////////////////////////////////
// NAMESPACE ///
var jocDesenredar = {
    cercles: [],
    cercleClicat: undefined,
    liniaPrima: 1,
    linies: []
};
var temporitzador;  // animacions
var començar=false; //true si ha començat la partida
var segons=180; //el temps de partida des de que ha començat
var seg1=0;
var seg2=0;
var min=0;
var currentLv=1;
var customMode=false;
var user;

var nivells= [
    {
        "nivell" : 1,
        "cercles" : [{"x" : 400, "y" : 156},
            {"x" : 381, "y" : 241},
            {"x" : 84 , "y" : 233},
            {"x" : 88 , "y" : 73 }],
        "connexions" : {"0" : {"connectaAmb" : [1,2]},
            "1" : {"connectaAmb" : [3]},
            "2" : {"connectaAmb" : [3]}}
    },
    {
        "nivell" : 2,
        "cercles" : [{"x" : 401, "y" : 73 },
            {"x" : 400, "y" : 240},
            {"x" : 88 , "y" : 241},
            {"x" : 84 , "y" : 72 }],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    },
    {
        "nivell" : 3,
        "cercles" : [{"x" : 92 , "y" : 85 },
            {"x" : 253, "y" : 13 },
            {"x" : 393, "y" : 86 },
            {"x" : 390, "y" : 214},
            {"x" : 248, "y" : 275}],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3,4]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    },
    {
        "nivell" : 4,
        "cercles" : [{"x" : 92 , "y" : 85 },
            {"x" : 253, "y" : 13 },
            {"x" : 393, "y" : 86 },
            {"x" : 390, "y" : 214},
            {"x" : 248, "y" : 275}],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3,4]},
            "1" : {"connectaAmb" : [2,4]},
            "3" : {"connectaAmb" : [4]}}
    }

];

///////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){

    $("#joc").hide();
    $("#customMenu").hide();
    jocDesenredar.canvas = document.getElementById("canvas");  // afegim a la variable global jocDesenredar
    jocDesenredar.ctx = jocDesenredar.canvas.getContext("2d");
    
    // construim la xarxa de tres nusos

    // Events per arrossegar els cercles
    $("#canvas").on({
            "mousedown": function (e) {
                // posició del clic
                var ratoli = new Punt(e.pageX - canvas.offsetLeft || 0, e.pageY - canvas.offsetTop || 0);

                // TODO - Crear cercle a la posició clicada
                if(customMode) new Cercle(new Punt(e.pageX - canvas.offsetLeft || 0, e.pageY - canvas.offsetTop || 0),10);

                // mirem si el clic ha estat interior a un cercle
                for (var i = 0; i < jocDesenredar.cercles.length && !jocDesenredar.cercleClicat; i++) {
                    var cercle = jocDesenredar.cercles[i];
                    if (Punt.distanciaPuntPunt(ratoli, cercle.centre) < cercle.radi) {
                        jocDesenredar.cercleClicat = i;
                    }
                }
            },
            "mousemove": function (e) {
                if (jocDesenredar.cercleClicat != undefined) {
                    var ratoli = new Punt(e.pageX - canvas.offsetLeft || 0, e.pageY - canvas.offsetTop || 0);
                    jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.x = ratoli.x;
                    jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.y = ratoli.y;
                }
            },
            "mouseup": function (e) {
                jocDesenredar.cercleClicat = undefined;
            }

    });
    // actualització del fotograma
    setInterval(actualitzaFotograma, 1000/30);	// 30 fps
    setInterval(rellotge,1000); //cada 1 segon executa la funcio rellotge
    

    function rellotge() { //cronometre o temporitzador
        if(començar) {
            if (segons == 0) {
                //$("#fin").show(); //quan s'acaba el temps
                començar=false;
            }
            else {
                segons--;
            }
            min=parseInt(segons/60);
            seg1=parseInt((segons%60)/10);
            seg2=parseInt((segons%60)-seg1*10);
            document.getElementById('seg2').src ="data/rellotge/"+seg2+".jpg";
            document.getElementById('seg1').src ="data/rellotge/"+seg1+".jpg";
            document.getElementById('minut').src ="data/rellotge/"+min+".jpg";
        }
    }

});



function construirXarxa() {

    jocDesenredar.cercles = [];

    switch(currentLv){
        case 1:{
            for (var i=0; i<4; i++) {
                jocDesenredar.cercles.push(new Cercle(new Punt(nivells[0].cercles[i].x ,nivells[0].cercles[i].y ), 10));
                
            }
        }break;
        case 2:{
            for (var i=0; i<4; i++) {
                jocDesenredar.cercles.push(new Cercle(new Punt(nivells[1].cercles[i].x ,nivells[1].cercles[i].y ), 10));
            }
        }break;
        case 3:{
            for (var i=0; i<5; i++) {
                jocDesenredar.cercles.push(new Cercle(new Punt(nivells[2].cercles[i].x ,nivells[2].cercles[i].y ), 10));
            }
        }break;
        case 4:{
            for (var i=0; i<5; i++) {
                jocDesenredar.cercles.push(new Cercle(new Punt(nivells[3].cercles[i].x ,nivells[3].cercles[i].y ), 10));
            }
        }break;
        default:{
            for (var i=0; i<currentLv+3; i++) {
                jocDesenredar.cercles.push(new Cercle(new Punt(Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.width-10),
                    Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.height-10)), 10));
                    connectarCercles();
            }
        }
    }


}

function connectarCercles(){
    jocDesenredar.linies.length = 0;  // buidem l'array de segments
    var plus=1;
    for (var i=0; i<2;i++){
        for(var j=plus; j<currentLv+3;j++){
            jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[j].centre, jocDesenredar.cercles[i].centre));
        }
        plus++;
    }
    for(var i=2; i<currentLv+2;i++){
        jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[i].centre, jocDesenredar.cercles[i+1].centre));
    }
}

function actualitzaFotograma() {
    var canvas = jocDesenredar.canvas;
    var ctx = jocDesenredar.ctx;
    // esborrem el canvas
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    // dibuixem totes les línies
    gruixArestes();
    for(var i=0;i<jocDesenredar.linies.length;i++) {
        jocDesenredar.linies[i].dibuixar(ctx);
    }
    // dibuixem tots els cercles
    for(var i=0;i<jocDesenredar.cercles.length;i++) {
        jocDesenredar.cercles[i].dibuixar(ctx);
    }
}

function gruixArestes() {
    for(var k=0;k<jocDesenredar.linies.length;k++){
        jocDesenredar.linies[k].gruix = 2;
    }
    for(var i=0;i<jocDesenredar.linies.length;i++) {
        for(var j = i+1; j<jocDesenredar.linies.length; j++) {
            if (Segment.esTallen(jocDesenredar.linies[i], jocDesenredar.linies[j])) {
                //console.log(jocDesenredar.linies[i],jocDesenredar.linies[j]);
                jocDesenredar.linies[i].gruix = 5;
                jocDesenredar.linies[j].gruix = 5;
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////

  ///////////////////
 /// Interface  ////
///////////////////

$("#start").click(function(e) {
    user = $("#user").value;
    if(user==null) alert("user= "+ user); //alert("Has d'indicar un nom d'usuari");
    else {

    }
    $("#menu").hide();
    $("#joc").show();
    començar = true;
    construirXarxa();
});

$("#custom").click(function(e) {
    $("#menu").hide();
    $("#joc").show();
    $("#customMenu").show();
    customMode=true;
    user = $("#user").value;
});
$("#startCustom").click(function(e) {
    $("#customMenu").hide();
    customMode=false;
    començar=true;
    user = $("#user").value;
});

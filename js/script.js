/**
 * Created by Black Phoenix on 13/05/2016.
 */

// Inteface variables
var currentLv=1;
var user;

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
    this.color = color || "rgba(255, 255, 255, .8)";
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
    this.color = color || "#AADDFF";
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
Segment.esTallen=function (segment1, segment2){



}

Segment.contePunt=function(segment, punt){

}

////// Classe estàtica  //////
function Utilitats(){

    var Nivell_1 = {
        "nivell" : 1,
        "cercles" : [{"x" : 400, "y" : 156},
            {"x" : 381, "y" : 241},
            {"x" : 84 , "y" : 233},
            {"x" : 88 , "y" : 73 }],
        "connexions" : {"0" : {"connectaAmb" : [1,2]},
            "1" : {"connectaAmb" : [3]},
            "2" : {"connectaAmb" : [3]}}
    };

    var Nivell_2={
        "nivell" : 2,
        "cercles" : [{"x" : 401, "y" : 73 },
            {"x" : 400, "y" : 240},
            {"x" : 88 , "y" : 241},
            {"x" : 84 , "y" : 72 }],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    };

    var Nivell_3={
        "nivell" : 3,
        "cercles" : [{"x" : 92 , "y" : 85 },
            {"x" : 253, "y" : 13 },
            {"x" : 393, "y" : 86 },
            {"x" : 390, "y" : 214},
            {"x" : 248, "y" : 275}],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3,4]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    };

    var Nivell_4={
        "nivell" : 4,
        "cercles" : [{"x" : 92 , "y" : 85 },
            {"x" : 253, "y" : 13 },
            {"x" : 393, "y" : 86 },
            {"x" : 390, "y" : 214},
            {"x" : 248, "y" : 275}],
        "connexions" : {"0" : {"connectaAmb" : [1,2,3,4]},
            "1" : {"connectaAmb" : [2,4]},
            "3" : {"connectaAmb" : [4]}}
    };


}
/// Mètodes estàtics //////

Utilitats.setLv=function setLv(Lv){localStorage.setItem('nivell', Lv);}
Utilitats.getLv=function getLv(Lv){return localStorage.getItem('nivell');}

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


///////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    $("#joc").hide();
    jocDesenredar.canvas = document.getElementById("canvas");  // afegim a la variable global jocDesenredar
    jocDesenredar.ctx = jocDesenredar.canvas.getContext("2d");

    // Nivell 1
    construirXarxa();

    // Events per arrossegar els cercles
    $("#canvas").on({
        "mousedown":function(e) {
            // posició del clic
            var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);
            // mirem si el clic ha estat interior a un cercle
            for(var i=0;i<jocDesenredar.cercles.length && !jocDesenredar.cercleClicat;i++){
                var cercle = jocDesenredar.cercles[i] ;
                if(Punt.distanciaPuntPunt(ratoli,cercle.centre) < cercle.radi){
                    jocDesenredar.cercleClicat = i;
                }
            }
        },
        "mousemove":function(e) {
            if (jocDesenredar.cercleClicat != undefined){
                var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);
                jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.x=ratoli.x;
                jocDesenredar.cercles[jocDesenredar.cercleClicat].centre.y=ratoli.y;
            }
        },
        "mouseup": function(e) {
            jocDesenredar.cercleClicat = undefined;
        }
    });
    // actualització del fotograma
    setInterval(actualitzaFotograma, 1000/30);	// 30 fps
});

function construirXarxa() {
    switch(currentLv){
        case 1:
        case 2:
        case 3:
        case 4:
        default:
    }
    jocDesenredar.cercles = [];
    for (var i=0; i<3; i++) {
        jocDesenredar.cercles.push(new Cercle(new Punt(Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.width-10),
            Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.height-10)), 10));
    }

    connectarCercles();
}

function connectarCercles(){
    jocDesenredar.linies.length = 0;  // buidem l'array de segments
    jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[0].centre, jocDesenredar.cercles[1].centre));
    jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[1].centre, jocDesenredar.cercles[2].centre));
    jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[2].centre, jocDesenredar.cercles[0].centre));
}

function actualitzaFotograma() {
    var canvas = jocDesenredar.canvas;
    var ctx = jocDesenredar.ctx;
    // esborrem el canvas
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    // dibuixem totes les línies
    for(var i=0;i<jocDesenredar.linies.length;i++) {
        jocDesenredar.linies[i].dibuixar(ctx);
    }
    // dibuixem tots els cercles
    for(var i=0;i<jocDesenredar.cercles.length;i++) {
        jocDesenredar.cercles[i].dibuixar(ctx);
    }
}




  ///////////////////
 /// Interface  ////
///////////////////

$("#start").click(function(e) {
        $("#menu").hide();
        $("#joc").show();
        user = $("#user").value;

    var w= $(document).width();
    var h= $(document).heigth();

    codiImatge = '<canvas id="canvas" width="'+w+'" height="'+h+'"/>'; console.log(codiImatge);

    $("#joc").append(codi);
    
    /*
     <canvas id="canvas" width="1920" height="1080">
     Em sap greu, el teu navegador no disposa de l'element HTML5 canvas.
     </canvas>

     */
});

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
Segment.esTallen=function (segment1, segment2){

}

Segment.contePunt=function(segment, punt){

}

////// Classe estàtica  //////
function Utilitats(){
}
/// Mètodes estàtics //////
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
var començar=true; //true si ha començat la partida
var segons=180; //el temps de partida des de que ha començat
var seg1=0;
var seg2=0;
var min=0;
var nivell=6;

///////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    jocDesenredar.canvas = document.getElementById("canvas");  // afegim a la variable global jocDesenredar
    jocDesenredar.ctx = jocDesenredar.canvas.getContext("2d");

    // construim la xarxa de tres nusos
    construirXarxa3Nusos();

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
    setInterval(rellotge,1000); //cada 1 segon executa la funcio rellotge
    

    function rellotge() { //cronometre o temporitzador
        if(començar) {
            if (segons == 0) {
                //$("#fin").show(); //quan s'acaba el temps
                alert("CACA");
                començar=false;
            }
            else {
                segons--;
            }
            min=parseInt(segons/60);
            seg1=parseInt((segons%60)/10);
            seg2=parseInt((segons%60)-seg1*10);
            document.getElementById('seg2').src ="imatges/rellotge/"+seg2+".jpg";
            document.getElementById('seg1').src ="imatges/rellotge/"+seg1+".jpg";
            document.getElementById('minut').src ="imatges/rellotge/"+min+".jpg";
        }
    }

});



function construirXarxa3Nusos() {
    jocDesenredar.cercles = [];
    for (var i=0; i<nivell+3; i++) {
        jocDesenredar.cercles.push(new Cercle(new Punt(Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.width-10),
            Utilitats.nombreAleatoriEntre(10,jocDesenredar.canvas.height-10)), 10));
    }

    connectarCercles();
}

function connectarCercles(){
    jocDesenredar.linies.length = 0;  // buidem l'array de segments
    var plus=1;
    for (var i=0; i<2;i++){
        for(var j=plus; j<nivell+3;j++){
            jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[j].centre, jocDesenredar.cercles[i].centre));
        }
        plus++;
    }
    for(var i=2; i<nivell+2;i++){
        jocDesenredar.linies.push(new Segment(jocDesenredar.cercles[i].centre, jocDesenredar.cercles[i+1].centre));
    }
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


//////////////////////////////////////////////////////////////////////////////////////
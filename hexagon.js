/**
 * Created by Maci on 2016.01.31..
 */

function pointsDistanceSquare(x1,y1,x2,y2){
    return Math.pow(x1-x2,2)+Math.pow(y1-y2,2);
}
Object.prototype.hasFunction = function(name){
    return (typeof this[name]) == "function";
};
function CanvasController(selector){
    var canvas = document.querySelector(selector);
    var context  = canvas.getContext("2d");
    var started = false;

    var width = canvas.width;
    var height = canvas.height;

    var controllers = [];
    var clear = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    var draw = function(){
        for(var i = 0;i<controllers.length;i++){
            if(controllers[i].hasFunction("draw")){
                controllers[i].draw(context);
            }
        }
    };
    var update = function(){

    };
    var queue = function(){
        if(started) window.requestAnimationFrame(loop);
    };
    var loop = function() {
        clear();
        update();
        draw();
        queue();
    };

    this.start = function(){
        started = true;
        loop();
    };
    this.stop = function(){
        started = false;
    };
    this.addController = function(controller){
        controllers.push(controller);
    };
    this.setControllers = function(controller){
        controllers = controller;
    };
    this.getWidth = function(){
        return width;
    };
    this.getHeight = function(){
        return height;
    };
};
function HexagonController(x,y, radius){
    this.center = {
        x: x,
        y: y
    };
    this.radius = radius;
    this.color = "#000"; //TODO: Ennek még utna kell nézni, hogy hogyan lehet border-t rajzolni.
    this.fillColor = "#fff";
    this.draw = function(ctx){
        var radius = [0,60, 120];
        var points = [
            [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: 0},
                {x: 0, y: 0}
            ]
        ];
        var x0 = this.center.x;
        var y0 = this.center.y;
        var r = this.radius;
        for(var i = 0;i<3;i++){
            var tan = Math.tan(radius[i]/180*Math.PI);
            //console.log(tan);
            var preTan = Math.pow(tan, 2) + 1;
            //var x1 = (2*x0*preTan+Math.sqrt(Math.pow(2*x0*preTan,2)-4*preTan*(preTan*x0*x0-r*r)))/2*preTan;
            var x1 = x0+Math.sqrt(r*r/preTan);
            var y1 = tan*(x1-x0)+y0;

            console.log(Math.sqrt(Math.pow(2*x0*preTan,2)-4*preTan*(preTan*x0*x0-r*r)));

            //var x2 = (2*x0*preTan-Math.sqrt(Math.pow(2*x0*preTan,2)-4*preTan*(preTan*x0*x0-r*r)))/2*preTan;
            var x2 = x0 - Math.sqrt(r*r/preTan);
            var y2 = tan*(x2-x0)+y0;


           /* if(i != 0){
                var predicate = pointsDistanceSquare(
                        points[0][i-1].x, points[0][i-1].y,x1,y1
                    ) > pointsDistanceSquare(
                        points[0][i-1].x, points[0][i-1].y,x2,y2
                    );
                if(predicate){
                    points[1][i].x = x1;
                    points[1][i].y = y1;

                    points[0][i].x = x2;
                    points[0][i].y = y2;
                }else{
                    points[0][i].x = x1;
                    points[0][i].y = y1;

                    points[1][i].x = x2;
                    points[1][i].y = y2;
                }
            }*/

            points[0][i].x = x1;
            points[0][i].y = y1;

            points[1][i].x = x2;
            points[1][i].y = y2;

        }

        var startX = this.center.x - points[0][0].x;
        var startY = this.center.y - points[0][0].y;

        ctx.fillStyle = this.color;
        ctx.moveTo(startX, startY);
        ctx.beginPath();

        for(var i = 0;i<points[1].length;i++){
            ctx.lineTo(points[1][i].x, points[0][i].y);
        }
        for(var i = points[0].length - 1;i>=0;i--){
            ctx.lineTo(points[0][i].x, points[1][i].y);
        }
        ctx.closePath();
        ctx.fill();
        console.log("Stop");
    }
}
window.onload = function(){
    var canvasController = new CanvasController("canvas");
    var hexagonTest = new HexagonController(canvasController.getWidth() / 2, canvasController.getHeight()/2,30);
    canvasController.addController(hexagonTest);
    canvasController.start();
    canvasController.stop();
};

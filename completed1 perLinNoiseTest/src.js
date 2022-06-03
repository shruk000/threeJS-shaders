const canvas=document.querySelector(".canvas")

let filterStrength = 20;
let frameTime = 0, lastLoop = new Date, thisLoop;
// Report the fps only every second, to only lightly affect measurements
let fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = (1000/frameTime).toFixed(1) + " fps";
},1000);



// canvas.width=window.innerWidth-300;
canvas.width=window.innerWidth;
canvas.height=700;

const scale=10;


function map(x, in_min,  in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

const ctx=canvas.getContext("2d");
noise.seed(Math.random());
const gap=100;
const width=canvas.width;
const height=canvas.height;
const factor=canvas.width*2;
const speed=1/100;
let offsetX=0;
let offsetY=0;

const arrowHead=[];
const arrowLength=gap-1;

for(let i=1;i<width/gap-1;i++){
  for(let j=1;j<height/gap-1;j++){
    const arrow={
      x:gap*i,
      y:gap*j
    }
    arrowHead.push(arrow);

  }


}
function rotateAndDrawArrow(arrow){
  ctx.beginPath();
  ctx.moveTo(arrow.x,arrow.y);
  ctx.lineWidth=3;
  ctx.strokeStyle=arrow.color;
  const nextpoint={
    x:arrow.x+arrowLength*Math.cos(arrow.currentAngle),
    y:arrow.y+arrowLength*Math.sin(arrow.currentAngle),
  }
  ctx.lineTo(nextpoint.x,nextpoint.y);
  ctx.stroke();
  ctx.closePath();
}

let timeSlice=0;
let delta=.4;



function updateArrowHead(){
// offsetX+=10;
  timeSlice+=delta;
  if(timeSlice>800)delta=-.4;
  if(timeSlice<0)delta=.4
arrowHead.forEach(arrow=>{
  const v=noise.perlin3((offsetX+arrow.x)/factor,(offsetY+arrow.y)/factor,timeSlice*speed);
  arrow.color=`hsla(${v*360},90%,30%,.91)`;
  arrow.currentAngle=v*Math.PI*2;
  rotateAndDrawArrow(arrow);
})




}











function init(){
    ctx.fillStyle="hsla(0,100%,100%,.1)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    updateArrowHead();
  






}



function animate(){
  init();


window.requestAnimationFrame(animate);
let thisFrameTime = (thisLoop=new Date) - lastLoop;
frameTime+= (thisFrameTime - frameTime) / filterStrength;
lastLoop = thisLoop;

}

animate();























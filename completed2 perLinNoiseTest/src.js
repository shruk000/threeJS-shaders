const canvas = document.querySelector(".canvas");

let filterStrength = 20;
let frameTime = 0,
     lastLoop = new Date(),
     thisLoop;
// Report the fps only every second, to only lightly affect measurements
let fpsOut = document.getElementById("fps");
setInterval(function () {
     fpsOut.innerHTML = (1000 / frameTime).toFixed(1) + " fps";
}, 1000);

// canvas.width=window.innerWidth-300;
canvas.width = window.innerWidth;
canvas.height = 700;

const scale = 30;

function map(x, in_min, in_max, out_min, out_max) {
     return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const ctx = canvas.getContext("2d");
noise.seed(Math.random());
const gap = 60;
const width = canvas.width;
const height = canvas.height;
const factor = canvas.width / 20; // how much area of perline noise to take at time
const speed = 1 / 70;
let xStart = 200;
let yStart = 400;
let offsetX = 10;
let offsetY = 0;
let heightFactor = 100;

const strings = [];
const stringLength = 800;
const noOfStrings = 3;

function plotPoint(point) {
     ctx.fillStyle = point.color;
     ctx.fillRect(point.x, point.y, 2, 2);
}

for (let i = 0; i < noOfStrings; i++) {
     const str = [];
     for (let j = 0; j < stringLength; j++) {
          const coordinate = xStart + j;
          const f1 = Math.abs(
               stringLength / 2 - Math.abs(j - stringLength / 2)
          );
          const MoveFactor = f1 / 100;
          str.push({ x: coordinate, MoveFactor });
     }
     strings.push(str);
}

canvas.addEventListener("mousedown",(event=>{
  console.log(event.offsetX,event.offsetY);

}))


let timeSlice = 0;
let delta = 0.4;


console.log(strings);

function update() {
     timeSlice++; 
    //  offsetX+=1; 
     if (timeSlice > 800) delta = -0.4;
     else if (timeSlice < 1) {
          delta = 0.4;
     }

     const stringIndex = 30;

     strings.forEach((string, it) => {
          string.forEach((point, index) => {
               // const v=noise.perlin2((offsetX+point.x)/factor, (index)/factor );
               // console.log(point);
               const v = noise.perlin3(
                    (offsetX + it *stringIndex) / factor,
                    point.x / (factor),
                    timeSlice * speed
               );
               point.y = yStart + v * point.MoveFactor * heightFactor;
               point.color = `hsla(${(point.x+timeSlice)},50%,50%,.8)`;
               point.v=v;
               plotPoint(point);
          });
     });
}

update();

function init() {
     ctx.fillStyle = "hsla(0,100%,100%,.5)";
     ctx.fillRect(0, 0, canvas.width, canvas.height);
     // updateArrowHead();
     update();
}

function animate() {
     init();

     window.requestAnimationFrame(animate);
     let thisFrameTime = (thisLoop = new Date()) - lastLoop;
     frameTime += (thisFrameTime - frameTime) / filterStrength;
     lastLoop = thisLoop;
}

animate();

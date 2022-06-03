// console.log(THREE);
import * as THREE from "three";
import { TextureLoader, Vector2 } from "three";
// import * as THREE from "./JS/three.module.js";
import * as Orbit from "./JS/OrbitControls.js";

const vShader=`
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec3 pp;
varying vec2 vuv;

void main(){
    vec3 pp=position;
    if(pp.x>2.5){
      pp.x=-.9;
    }
    vec4 modelPosition = modelMatrix * vec4(pp,1.0);
  /*  modelPosition=vec4(modelPosition.x,cos(modelPosition.x),modelPosition.z,modelPosition.a);
*/
    
    gl_Position= projectionMatrix * viewMatrix * modelPosition;
    pp=position;
    vuv=uv;

}

`
const fShader=`
/*
precision mediump float;
varying vec3 pp;
varying vec2 vuv;
void main(){

    gl_FragColor=vec4(vuv,1,1);

}
*/
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+10.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
    }





float circleShape(vec2 position, float radius){
    return step(radius, length(position));
}
uniform sampler2D u_texture;
varying vec2 vuv;
void main(){
    vec2 position = gl_FragCoord.xy / u_resolution;
    
    float va= u_time/10.0;
    position=position*100.0;
    float ik=snoise(vec3(position.x*va,position.y,.4));
    // float circle = circleShape(position,abs(ik));
    // vec3 color = vec3(abs(ik*1.1));
    // gl_FragColor = vec4(color, 1.0);

    if(vuv.x<0.2&&vuv.y<0.3){
      gl_FragColor=texture(u_texture,vuv);
    // if(gl_FragCoord.x/u_resolution.x<vuv.x){
    // if(gl_FragCoord.x<735.5*1.25-10.0){
    // gl_FragColor = vec4(1,0,0, 1.0);
    // gl_FragColor = vec4(1,0,0, 1.0);
    }else gl_FragColor=vec4(1,1,1,1.0);
} 
`



let FACTOR=.5;
let WIDTH=1080;
let HEIGHT=720;
const RATIO=WIDTH/HEIGHT;
const axis=new THREE.AxesHelper(1);
console.log(window.devicePixelRatio);

const canvas=document.querySelector("#canvas");
const camera=new THREE.PerspectiveCamera(75,WIDTH/HEIGHT);
camera.position.z=5;

const orbitControl=new Orbit.OrbitControls(camera,canvas);
orbitControl.autoRotate=true;
const box=new THREE.BoxGeometry(1,1,1);
box.translate(1,1,1);
const sph=new THREE.SphereGeometry(1,10,10);
const selfMade=new THREE.BufferGeometry();

const array=sph.getAttribute("position");
console.log(array);
selfMade.setAttribute("position",new THREE.BufferAttribute(array.array,3));
const pointMaterial=new THREE.PointsMaterial({size:0.02,sizeAttenuation:true});



function geometryCreate(startAngle){ 
    const totalParticle=100000;
    const arc=.7;// min angle of arc.. max cause minimum angle..
    const maxLength=100;// length of end of the arc..
    const array=new Float32Array(totalParticle*3);
    const looprun=totalParticle*3;
    for(let i=0;i<looprun;i=i+3){
        array[i]=10+(i*maxLength/(looprun))*Math.cos(startAngle + i*Math.PI/(looprun*arc))+ Math.random()*10*Math.sin(i*Math.PI/(looprun));
        array[i+2]=10+(i*maxLength/(looprun))*Math.sin(startAngle + i*Math.PI/(looprun*arc)) +Math.random()*10*Math.sin(i*Math.PI/(looprun));
        array[i+1]=Math.random()*10;
        
    }
    const bufferAttrib=new THREE.BufferAttribute(array,3);

    return new THREE.BufferGeometry().setAttribute("position",bufferAttrib);

}


function galaxyGenerator(){


}

// const dottedSph=new THREE.Points(geometryCreate(0),pointMaterial);
// const dottedSph1=new THREE.Points(geometryCreate(3),pointMaterial);
// const dottedSph2=new THREE.Points(geometryCreate(4),pointMaterial);
const material=new THREE.MeshBasicMaterial({color:"red",

wireframe:true

});
const scene=new THREE.Scene();
const mesh=new THREE.Mesh(box,material);



scene.add(
    mesh,
    camera,
    axis,
    // dottedSph,
    // dottedSph1,
    // dottedSph2
    );
const renderer=new THREE.WebGLRenderer({canvas});


// (()=>{
//     WIDTH=1080*FACTOR;
//     HEIGHT=720*FACTOR;
//     RATIO=WIDTH/HEIGHT;
// })();

const shaderPlanGeometery=new THREE.PlaneBufferGeometry(5,5,5,5);

console.log(shaderPlanGeometery.getAttribute("position"));
console.log("uv",shaderPlanGeometery.getAttribute("uv"));

const time=new THREE.Clock();
const fg= (new THREE.TextureLoader()).load("/Images/a.png");
console.log(fg);
const uniforms={
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_time:{type:"f",value:time.getElapsedTime()},
    u_texture:{value:fg},

}

const shaderMaterial=new THREE.RawShaderMaterial({
    vertexShader:vShader,
    fragmentShader:fShader,
    transparent:true,
    uniforms:uniforms,


    side: THREE.DoubleSide,

})

const teMat=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});

teMat.map=fg;

// const shaderMesh=new THREE.Mesh(shaderPlanGeometery,shaderMaterial);
const shaderMesh1=new THREE.Mesh(shaderPlanGeometery,teMat);
const shaderMesh2=new THREE.Mesh(shaderPlanGeometery,shaderMaterial);

shaderMesh1.rotateX(Math.PI/2);
shaderMesh2.position.setY(2);
shaderMesh2.rotateX(Math.PI/2);

scene.add(shaderMesh1,shaderMesh2);
















window.onresize=Resized;
function Resized(event){
        renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
        WIDTH=(document.body.clientWidth)*FACTOR;
        HEIGHT=WIDTH/RATIO;
        camera.aspect=WIDTH/HEIGHT;
        renderer.setSize(WIDTH,HEIGHT);
        camera.updateProjectionMatrix();
        console.log(WIDTH,HEIGHT);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

}
Resized();
renderer.render(scene,camera);







const speed=.1;
const clock=new THREE.Clock(true);
const radius=3;
// orbitControl.target=mesh.position;
// orbitControl.target=axis.position;
camera.position.setY(1);    // to better look at the plan..


function init(){


// camera.position.x=radius*Math.cos(Math.PI*clock.elapsedTime*speed);
// camera.position.z=radius*Math.sin(Math.PI*clock.elapsedTime*speed);

// mesh.rotateX(Math.PI*clock.getDelta()*.1);
// camera.lookAt(mesh.position);


// clock.elapsedTime
// console.log(Math.PI*clock.getElapsedTime()*speed);


uniforms.u_time.value=time.getElapsedTime();
// console.log(uniforms.u_time.value/10);
// orbitControl.update();
}









animate();
function animate(){

    init();
// console.log("hels");
renderer.render(scene,camera);
window.requestAnimationFrame( animate);
}


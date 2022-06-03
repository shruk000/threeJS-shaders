// console.log(THREE);
import * as THREE from "three";
import { TetrahedronBufferGeometry, TextureLoader, Vector2 } from "three";
// import * as THREE from "./JS/three.module.js";
import * as Orbit from "./JS/OrbitControls.js";

const container = document.querySelector(".container");

const vertexShader=`
#ifdef GL_ES
precision mediump float;
#endif

// attribute vec3 position;
varying vec2 vuv;
uniform float u_time;
void main(){
  vuv=uv;
  vec3 newPos=position;
  float dis=length(position.xy);
  
  newPos.z=   sin(dis*1.0 -u_time*3.0/1.0);
  // newPos.z=   sin(dis*2.0*u_time/5.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

}


`;
const fragmentShader=`
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vuv;

float circle(vec2 center,float radius){
  vec2 relativePos=center-vuv;
  return 1.0-step(radius,length(relativePos));
}

// top corner .. origin
float box(vec2 origin,vec2 widthHeight){
  float w= sign(fract(smoothstep(0.0, widthHeight.x ,(vuv.x - origin.x))));
  float h= sign(fract(smoothstep(0.0, widthHeight.y ,-vuv.y + origin.y)));
  
  return w*h;

}

float line(vec2 start,vec2 end,float width){
  
  vec2 relativeVec=-vuv+start;
  vec2 lineVec=end-start;
  if(length(relativeVec)>length(lineVec))return 0.0;

  float len=length(relativeVec);
  float angleCos=dot(normalize(relativeVec),normalize(lineVec));
  if(abs(len*angleCos)<(width/2.0))return 1.0;  


  // float angle=atan(relativeVec.y/relativeVec.x);
  // float l=length(relativeVec);
  // if(l*cos(angle)<width/2.0) return 1.0;

  
  // float pointSlope=(start.y-vuv.y)/(start.x-vuv.x);
  // float lineSlope=(end.y-start.y)/(end.x-start.x);
  
return 0.0;

}



void main(){
  // vec2 st = gl_FragCoord.xy / u_resolution;
  
  // gl_FragColor=vec4(circle(vec2(0.5,0.5), 0.2),1.0, 1.0, 1.0);
  

  // gl_FragColor=vec4(box(vec2(0.5,0.5),vec2(0.3,0.1)),1.0, 1.0, 1.0);
  gl_FragColor=vec4( line( vec2(0.5,0.5),vec2(0.7,0.5),.1)       ,1.0, 1.0, 1.0);

}

`;






class sketch {
  constructor(options) {
    this.container = container;
    this.time = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      100
    );
    this.camera.position.z =9;
    this.camera.position.y =2;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
    
    this.orbitControl = new Orbit.OrbitControls(this.camera, this.canvas);
    this.orbitControl.autoRotate = true;

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.addObject();
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  resize() {
    console.log(container.clientHeight, container.clientWidth);
    this.height = container.offsetHeight;
    this.width = container.offsetWidth;
    this.camera.aspect = this.width / this.height;
    this.renderer.setSize(this.width, this.height);

    this.camera.updateProjectionMatrix();
  }



  addObject() {
    this.geometry = new THREE.PlaneBufferGeometry(10,10 ,40,40);
    this.uniform={
      u_time:{value:this.time.elapsedTime}
    }
    this.material = new THREE.ShaderMaterial({
      wireframe: true,
      // color: "red",
      side: THREE.DoubleSide,
      fragmentShader:fragmentShader,
      vertexShader:vertexShader,
      uniforms:this.uniform
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    const axis = new THREE.AxesHelper(1);
    this.mesh.rotation.x=Math.PI*.5;
    this.scene.add(this.mesh, axis);
  }





  render() {
    // console.log(this.mesh);
    // this.mesh.rotation.x = this.time.getElapsedTime()/ 2;
    // this.mesh.rotation.y = this.time.getElapsedTime()/ 1;
    this.uniform.u_time.value=this.time.getElapsedTime();
    this.orbitControl.update();
    this.renderer.render(this.scene, this.camera);
  }
}

new sketch();

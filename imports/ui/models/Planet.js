import React, { Component } from 'react'
import * as THREE from 'three';
//import OBJLoader from 'three-obj-loader';
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

export class Planet extends Component {

    componentDidMount = () => {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        this.asts = []
        //ADD SCENE
        this.scene = new THREE.Scene()
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(75,width / height,0.1,20000);
        this.camera.position.z = 7200;
        this.camera.position.x = 0;
        this.camera.position.y = 2200;
        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setSize(width, height)
        this.mount.appendChild(this.renderer.domElement)
        //ADD PLANET
        OBJLoader(THREE);
        let mtlLoader = new MTLLoader();
        let objLoader = new OBJLoader();
        mtlLoader.load('/res/obj/planet01.mtl',(materials) => {
            materials.preload()
            objLoader.setMaterials(materials)
            objLoader.load('/res/obj/planet01.obj', (object) => {
                object.scale.set(250,250,250);
                object.name = "planet";
                this.scene.add(object);
            })
        })
        //CREATE LIGHT
        let light = new THREE.HemisphereLight(0xffffff, 0xffffff, .4)
	    let shadowLight = new THREE.DirectionalLight(0xffffff, .8);
	    shadowLight.position.set(200, 200, 200);
	    shadowLight.castShadow = true;
	    let backLight = new THREE.DirectionalLight(0xffffff, .3);
	    backLight.position.set(-100, 200, 50);
	    backLight.castShadow = true;
	    this.scene.add(backLight);
	    this.scene.add(light);
        this.scene.add(shadowLight);
        //ADD ASTEROID
        this.asts = []
        for(let n=0;n<50;n++){
            const astGeometry = new THREE.IcosahedronGeometry(Math.floor((Math.random() * (80 - 40 + 1)) + 40), 0)
            const astMaterial = new THREE.MeshLambertMaterial ({color:0xc7ecee ,wireframe: false,flatShading :THREE.FlatShading});
            let ast = new THREE.Mesh(astGeometry, astMaterial)
            ast.distance = Math.floor((Math.random() * (4200 - 3500 + 1)) + 3500);
            ast.position.set(
                Math.floor(Math.random() * ast.distance) - ast.distance * Math.cos(2 * Math.PI / 1000),
                Math.floor(Math.random() * 120) - 120 * Math.sin(2 * Math.PI / 1000),
                Math.floor(Math.random() * ast.distance) - ast.distance * Math.sin(2 * Math.PI / 1000)
            );            
            ast.theta = Math.floor(Math.random() * Math.floor(360)) * (Math.PI/180);
            ast.progress = Math.floor(Math.random() * Math.floor(360)) * (Math.PI/180); 
            this.asts.push(ast.id);  
            this.scene.add(ast);    
        }
        for(let n=0;n<80;n++){
            const astGeometry = new THREE.IcosahedronGeometry(Math.floor((Math.random() * (50 - 30 + 1)) + 30), 0)
            const astMaterial = new THREE.MeshLambertMaterial ({color:0xc7ecee ,wireframe: false,flatShading :THREE.FlatShading});
            let ast = new THREE.Mesh(astGeometry, astMaterial)
            ast.distance = Math.floor((Math.random() * (5500 - 4200 + 1)) + 4200);
            ast.position.set(
                Math.floor(Math.random() * ast.distance) - ast.distance * Math.cos(2 * Math.PI / 1000),
                Math.floor(Math.random() * 50) - 50 * Math.sin(2 * Math.PI / 1000),
                Math.floor(Math.random() * ast.distance) - ast.distance * Math.sin(2 * Math.PI / 1000)
            );            
            ast.theta = Math.floor(Math.random() * Math.floor(360)) * (Math.PI/180);
            ast.progress = Math.floor(Math.random() * Math.floor(360)) * (Math.PI/180); 
            this.asts.push(ast.id);  
            this.scene.add(ast);    
        }
        //SET SCENE
        //this.controls = OrbitControls(this.camera,this.renderer);
        this.camera.lookAt(0,0,0);
        this.start();
    }

    getRISR = axis => {
        let ranges = [];
        if(axis == "y"){
            return Math.floor((Math.random() * (80 - -80 + 1)) + -80);
        }else{
            ranges = [{
                min: -550,
                max: -350
            }, {
                min: 350,
                max: 550
            }];
            const r = ranges[Math.floor(Math.random() * Math.floor(2))]
            return Math.floor((Math.random() * (r.max - r.min + 1)) + r.min);
        }
    }
    
    componentWillUnmount(){
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        const p = this.scene.getObjectByName("planet");
        if(p !== undefined){
            p.rotation.y += 0.005
        }
        this.asts.forEach(id => {
            let ast = this.scene.getObjectById(id,true);
            ast.theta -= 2 * Math.PI / 6000;
            ast.progress -= 2 * Math.PI / 6000;
            ast.position.x = 0 - ast.distance * Math.cos(ast.theta);
            ast.position.z = 0 - ast.distance * Math.sin(ast.theta);
            ast.position.y = -400 + ((Math.abs((Math.PI - Math.cos(ast.progress) % (2*Math.PI)))/Math.PI ) * 800)
        });
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
      this.renderer.render(this.scene, this.camera)
    }

  render() {
    return (
        <div style={{ width: '100vw', height: '100vh' }} ref={(mount) => { this.mount = mount }}/>
    )
  }
}

export default Planet

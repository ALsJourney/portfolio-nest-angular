import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs',
  templateUrl: './three-jscomponent.component.html',
  styleUrls: ['./three-jscomponent.component.css']
})
export class ThreeJSComponentComponent implements OnInit {

  @ViewChild('container', {static: true})
  container!: ElementRef<HTMLDivElement>;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  ngOnInit() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.render();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }
  private initCamera() {
    const aspect = this.container.nativeElement.offsetWidth / this.container.nativeElement.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);
  }

  private render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }


}

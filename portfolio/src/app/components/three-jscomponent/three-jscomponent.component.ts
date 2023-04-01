import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs',
  templateUrl: './three-jscomponent.component.html',
  styleUrls: ['./three-jscomponent.component.css']
})
export class ThreeJSComponentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container', {static: true})
  container!: ElementRef<HTMLDivElement>;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  animationFrameId!: number;

  ngOnInit() {
    this.initScene();
    this.initCamera();
  }

  ngAfterViewInit() {
    this.initRenderer();
    this.render();
  }


  ngOnDestroy() {
    if (this.animationFrameId != null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
  }

  @HostListener('window:resize')
  onWindowResize(){
    const container = this.container.nativeElement;
    const aspect = container.offsetWidth / container.offsetHeight;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
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
    const container = this.container.nativeElement;
    console.log(container.offsetWidth, container.offsetHeight);
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(this.renderer.domElement);
  }

  private render() {
    this.animationFrameId = requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }


}

import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {AmbientLight, Mesh, MeshPhongMaterial} from "three";
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
  pointLight!: THREE.PointLight;

  ngOnInit() {
    this.initScene();
    this.initCamera();
  }

  ngAfterViewInit() {
    this.initRenderer();
    this.animate();
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

    this.pointLight = new THREE.PointLight(0xffffff, 1, 10);
    this.pointLight.position.set(0,0,0);
    this.scene.add(this.pointLight);

    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const loader = new FontLoader();
    loader.load('assets/fonts/Righteous_Regular.json', (font) => {
      this.createText(font)
    });
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


  createText(font: any): void {
    const geometry = new TextGeometry("ALsJourney", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false,
    });

    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const offsetX = 0.5 * (boundingBox!.max.x - boundingBox!.min.x);
    const offsetY = 0.5 * (boundingBox!.max.y - boundingBox!.min.y);
    geometry.translate(-offsetX, -offsetY, 0);

    const material = new MeshPhongMaterial({
      color: 0xff23f2
    });
    const textMesh = new Mesh(geometry, material);
    this.scene.add(textMesh);
  }

  onContainerClick(event: MouseEvent): void {
    // Convert the click coordinates to normalized device coordinates
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const x :number = (event.clientX - containerRect.left) / containerRect.width * 2 - 1;
    const y :number = -(event.clientY - containerRect.top) / containerRect.height * 2 + 1;

    // Create a Raycaster and set the click position
    const raycaster : THREE.Raycaster = new THREE.Raycaster();
    const mouse :THREE.Vector2 = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, this.camera);

    // Find the intersected objects
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    for (const intersect of intersects) {
      if (intersect.object instanceof Mesh && intersect.object.geometry instanceof TextGeometry) {
        intersect.object.userData['spinSpeed'] = (intersect.object.userData['spinSpeed'] || 0.01) + 0.02;

        // Change the color
        const randomColor = new THREE.Color(Math.random() * 0xfff);
        (intersect.object.material as MeshPhongMaterial).color.set(randomColor);
      }
    }

  }
  animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Animation of the text

    this.scene.traverse((object) => {
      if (object instanceof Mesh && object.geometry instanceof TextGeometry) {
        const spinSpeed = object.userData['spinSpeed'] || 0.01;
        object.rotation.y += spinSpeed;

        if (spinSpeed > 0.001) {
          object.userData['spinSpeed'] -= 0.0001;
        } else {
          object.userData['spinSpeed'] = 0;
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  onContainerMouseMove(event: MouseEvent): void {
    // Convert the mouse coordinates to normalized device coordinates
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const x :number = (event.clientX - containerRect.left) / containerRect.width * 2 - 1;
    const y :number = -(event.clientY - containerRect.top) / containerRect.height * 2 + 1;

    // Raycaster and set mouse position
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x,y);
    raycaster.setFromCamera(mouse, this.camera);

    // Find the intersect objects
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      // If the mouse is over an object
      // move the light to that object
      const intersect = intersects[0];
      this.pointLight.position.copy(intersect.point);
      this.pointLight.position.z += 3;
    } else {
      // If the mouse is not over any object,
      // move the point light far away
      this.pointLight.position.set(0,0,-100);
    }

  }



}

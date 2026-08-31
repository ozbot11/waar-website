import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/drones/waar-01.glb';

export type DroneModel = {
  group: THREE.Group;
  props: THREE.Object3D[];
  beacon: THREE.Mesh | null;
};

function paint(mat: THREE.Material) {
  const m = mat as THREE.MeshStandardMaterial;
  m.side = THREE.FrontSide;
  m.transparent = false;
  m.opacity = 1;
  m.depthWrite = true;
  m.depthTest = true;
  m.emissive = new THREE.Color(0x000000);
  m.emissiveIntensity = 0;
  if (m.metalness !== undefined) m.metalness = Math.min(m.metalness ?? 0.25, 0.35);
  if (m.roughness !== undefined) m.roughness = Math.max(m.roughness ?? 0.5, 0.42);
}

/** Loads the competition airframe from the SolidWorks STEP export. */
export async function loadDrone(): Promise<DroneModel> {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(MODEL_URL);

  const group = new THREE.Group();
  group.add(gltf.scene);

  gltf.scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(paint);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
  });

  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  gltf.scene.position.sub(center);

  return { group, props: [], beacon: null };
}

/** Neutral studio lighting so CAD colors (grey / blue / black / terracotta) read clearly. */
export function addStudioLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0xf2f0ea, 0x3a3548, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(5, 9, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8e4f4, 1.0);
  fill.position.set(-6, 4, -3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.7);
  rim.position.set(0, 3, -8); scene.add(rim);
}

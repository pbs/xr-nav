import {
  HemisphericLight,
  MeshBuilder,
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  StandardMaterial,
  Color3,
  PointerEventTypes,
} from '@babylonjs/core';

const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas');

const engine = new Engine(canvas, true);

const scene = new Scene(engine);
scene.clearColor = Color3.Gray().toColor4();
const camera = new FreeCamera('camera', new Vector3(0, 1, -10), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(true);

new HemisphericLight('light', new Vector3(0, 1, 0), scene);
const red = new StandardMaterial('red-mat', scene);
red.diffuseColor = new Color3(1, 0.2, 0.2);
const blue = new StandardMaterial('blue-mat', scene);
blue.diffuseColor = new Color3(0.2, 0.2, 1);

const box = MeshBuilder.CreateBox('box', {size: 2}, scene);
box.position.y = 3;
box.material = red;

const ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, scene);
ground.material = blue;

// const enterXrButton = document.querySelector<HTMLButtonElement>('#enter-xr');
// enterXrButton.addEventListener('click', async () => {
//   const helper = await WebXRExperienceHelper.CreateAsync(scene);
//   const sessionManager = await helper.enterXRAsync('immersive-vr', 'local');
// });

scene.registerBeforeRender(() => {
  box.rotation.y += 0.01;
});

engine.runRenderLoop(() => {
  scene.render();
});

scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
    if (pointerInfo.pickInfo?.hit) {
      const mesh = pointerInfo.pickInfo.pickedMesh!;
      if (mesh.name !== 'box') return;
      if (mesh.material?.name === 'red-mat') {
        window.location.href = '/red/';
      } else if (mesh.material?.name === 'blue-mat') {
        window.location.href = '/blue/';
      }
    }
  }
});

let promise = scene.createDefaultXRExperienceAsync({
  floorMeshes: [ground],
});

// @ts-ignore
navigator.xr.addEventListener('sessiongranted', async (event) => {
  console.log('SESSION GRANTED', event);
  const defaultExperience = await promise;
  defaultExperience.baseExperience.enterXRAsync('immersive-vr', 'local-floor');
});

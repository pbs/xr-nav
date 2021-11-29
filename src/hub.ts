import {
  MeshBuilder,
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  StandardMaterial,
  Color3,
  PointerEventTypes,
  Mesh,
  ShadowGenerator,
  DirectionalLight,
} from '@babylonjs/core';

interface LinkMesh extends Mesh {
  href: string;
}

const canvas = document.querySelector<HTMLCanvasElement>('#renderCanvas');

const engine = new Engine(canvas, true);

const scene = new Scene(engine);
scene.clearColor = Color3.Gray().toColor4();
const camera = new FreeCamera('camera', new Vector3(0, 1, -10), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(true);
const light = new DirectionalLight('dir-light', new Vector3(0, -2, 0), scene);
light.position = new Vector3(0, 10, 0);

const ground = MeshBuilder.CreateGround('ground', {width: 100, height: 100}, scene);
ground.receiveShadows = true;

function createLinkCube(hexColor: string, href: string, position: Vector3) {
  const mat = new StandardMaterial(`cube-mat-${hexColor}`, scene);
  const color = Color3.FromHexString(hexColor);
  mat.diffuseColor = color;
  mat.emissiveColor = color;

  const box = MeshBuilder.CreateBox('box', {size: 2}, scene) as LinkMesh;
  box.position = position;
  box.material = mat;
  box.href = href;
  box.renderOutline = true;
  box.outlineColor = Color3.Black();
  return box;
}

const redBox = createLinkCube('#f54257', '/red/', new Vector3(-4, 2, 0));
const blueBox = createLinkCube('#4287f5', '/blue/', new Vector3(4, 2, 0));

const shadowGenerator = new ShadowGenerator(2048, light);
shadowGenerator.usePoissonSampling = true;
shadowGenerator.useExponentialShadowMap = true;
shadowGenerator.addShadowCaster(redBox);
shadowGenerator.addShadowCaster(blueBox);

scene.registerBeforeRender(() => {
  redBox.rotation.y += 0.01;
  blueBox.rotation.y += 0.01;
});

engine.runRenderLoop(() => {
  scene.render();
});

scene.onPointerObservable.add((pointerInfo) => {
  if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
    if (pointerInfo.pickInfo?.hit) {
      const mesh = pointerInfo.pickInfo.pickedMesh! as LinkMesh;
      if (mesh.href) {
        window.location.href = mesh.href;
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

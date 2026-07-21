import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.pure.js'
import type { Engine } from '@babylonjs/core/Engines/engine.pure.js'
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight.pure.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.pure.js'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.pure.js'
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color.pure.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.pure.js'
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder.pure.js'
import { CreateCapsule } from '@babylonjs/core/Meshes/Builders/capsuleBuilder.pure.js'
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder.pure.js'
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder.pure.js'
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder.pure.js'
import { CreatePolyhedron } from '@babylonjs/core/Meshes/Builders/polyhedronBuilder.pure.js'
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder.pure.js'
import type { Mesh } from '@babylonjs/core/Meshes/mesh.pure.js'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode.pure.js'
import { Scene } from '@babylonjs/core/scene.pure.js'

export interface GrayboxSceneContext {
  scene: Scene
  camera: ArcRotateCamera
  player: TransformNode
}

function material(scene: Scene, name: string, color: Color3): StandardMaterial {
  const result = new StandardMaterial(name, scene)
  result.diffuseColor = color
  result.specularColor = Color3.Black()
  return result
}

function addCrystal(scene: Scene, position: Vector3, crystalMaterial: StandardMaterial): Mesh {
  const crystal = CreatePolyhedron('aether-crystal', { type: 1, size: 0.85 }, scene)
  crystal.position = position
  crystal.scaling.y = 2.2
  crystal.material = crystalMaterial
  crystal.rotation.y = Math.PI / 4
  return crystal
}

export function createGrayboxScene(engine: Engine): GrayboxSceneContext {
  const scene = new Scene(engine)
  scene.clearColor = new Color4(0.04, 0.09, 0.11, 1)
  scene.ambientColor = new Color3(0.2, 0.25, 0.22)

  const camera = new ArcRotateCamera('exploration-camera', -Math.PI / 2.35, 1.05, 23, new Vector3(0, 0, 3), scene)
  camera.lowerRadiusLimit = 23
  camera.upperRadiusLimit = 23
  camera.lowerBetaLimit = 1.05
  camera.upperBetaLimit = 1.05
  camera.inputs.clear()

  const skyLight = new HemisphericLight('sky-light', new Vector3(0, 1, 0), scene)
  skyLight.intensity = 0.78
  skyLight.groundColor = new Color3(0.18, 0.22, 0.16)

  const sun = new DirectionalLight('sun', new Vector3(-0.55, -1, 0.45), scene)
  sun.position = new Vector3(12, 20, -12)
  sun.intensity = 1.2
  const grassMaterial = material(scene, 'grass-material', new Color3(0.24, 0.43, 0.24))
  const pathMaterial = material(scene, 'path-material', new Color3(0.56, 0.49, 0.34))
  const stoneMaterial = material(scene, 'stone-material', new Color3(0.32, 0.36, 0.34))
  const woodMaterial = material(scene, 'wood-material', new Color3(0.29, 0.19, 0.11))
  const tealMaterial = material(scene, 'crystal-material', new Color3(0.08, 0.72, 0.82))
  tealMaterial.emissiveColor = new Color3(0.02, 0.28, 0.34)
  const loganMaterial = material(scene, 'logan-material', new Color3(0.05, 0.32, 0.42))
  const darkMaterial = material(scene, 'dark-material', new Color3(0.12, 0.1, 0.08))

  const ground = CreateGround('route-ground', { width: 30, height: 38 }, scene)
  ground.material = grassMaterial
  ground.receiveShadows = true

  for (let z = -14; z <= 15; z += 2.3) {
    const slab = CreateBox(`path-slab-${z}`, { width: 4.2 + Math.sin(z) * 0.45, height: 0.12, depth: 1.9 }, scene)
    slab.position = new Vector3(Math.sin(z * 0.32) * 1.2, 0.08, z)
    slab.rotation.y = Math.sin(z) * 0.08
    slab.material = pathMaterial
    slab.receiveShadows = true
  }

  for (let index = 0; index < 26; index += 1) {
    const side = index % 2 === 0 ? -1 : 1
    const z = -15 + index * 1.2
    const rock = CreatePolyhedron(`route-rock-${index}`, { type: 2, size: 0.65 + (index % 4) * 0.12 }, scene)
    rock.position = new Vector3(side * (4.2 + (index % 3) * 1.35), 0.55, z)
    rock.rotation = new Vector3(index * 0.12, index * 0.3, 0)
    rock.material = stoneMaterial
  }

  for (let index = 0; index < 18; index += 1) {
    const tree = CreateCylinder(`tree-${index}`, { height: 4 + (index % 3), diameterTop: 0.45, diameterBottom: 0.78 }, scene)
    const side = index % 2 === 0 ? -1 : 1
    tree.position = new Vector3(side * (7 + (index % 4)), tree.getBoundingInfo().boundingBox.extendSize.y, -14 + index * 1.75)
    tree.material = woodMaterial

    const crown = CreateIcoSphere(`crown-${index}`, { radius: 1.8 + (index % 2) * 0.45, subdivisions: 1 }, scene)
    crown.position = tree.position.add(new Vector3(0, 2.5 + tree.scaling.y, 0))
    crown.scaling.y = 1.35
    crown.material = grassMaterial
  }

  addCrystal(scene, new Vector3(-5.7, 1.2, -5), tealMaterial)
  addCrystal(scene, new Vector3(6.2, 1.15, 7.2), tealMaterial)
  addCrystal(scene, new Vector3(-7.8, 0.9, 11.5), tealMaterial)

  const outpost = CreateCylinder('outpost', { height: 3.4, diameter: 7, tessellation: 8 }, scene)
  outpost.position = new Vector3(1.5, 1.7, 13.5)
  outpost.material = stoneMaterial

  const roof = CreateCylinder('outpost-roof', { height: 2.1, diameterTop: 0.8, diameterBottom: 8.3, tessellation: 8 }, scene)
  roof.position = new Vector3(1.5, 4.25, 13.5)
  roof.material = tealMaterial

  const player = new TransformNode('logan-player-root', scene)
  player.position = new Vector3(0, 0, -7)

  const body = CreateCapsule('logan-graybox', { height: 2.2, radius: 0.45 }, scene)
  body.position = new Vector3(0, 1.1, 0)
  body.parent = player
  body.material = loganMaterial

  const head = CreateSphere('logan-head-graybox', { diameter: 0.72 }, scene)
  head.position = new Vector3(0, 2.4, 0)
  head.parent = player
  head.material = darkMaterial

  scene.activeCamera = camera
  return { scene, camera, player }
}

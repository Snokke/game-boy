import * as THREE from 'three';
import { GAME_BOY_PART_TYPE, GAME_BOY_ACTIVE_PARTS } from './data/game-boy-data';
import Loader from '../../../core/loader';
import { SCENE_OBJECT_TYPE } from '../data/game-boy-scene-data';

export default class GameBoy extends THREE.Group {
  constructor() {
    super();

    this._parts = [];
    this._allMeshes = [];
    this._sceneObjectType = SCENE_OBJECT_TYPE.GameBoy;

    this._init();
  }

  onClick(object) {
    const objectPartType = object.userData['partType'];

    console.log(objectPartType);
  }

  getAllMeshes() {
    return this._allMeshes;
  }

  _init() {
    this._initGameBoyParts();
    this._addMaterials();
  }

  _initGameBoyParts() {
    const gameBoyModel = Loader.assets['game-boy'].scene;

    for (const partName in GAME_BOY_PART_TYPE) {
      const partType = GAME_BOY_PART_TYPE[partName];
      const part = gameBoyModel.children.find(child => child.name === partType);

      part.userData['partType'] = partType;
      part.userData['sceneObjectType'] = this._sceneObjectType;
      part.userData['isActive'] = GAME_BOY_ACTIVE_PARTS.includes(partType);

      this._parts[partType] = part;
      this._allMeshes.push(part);
      this.add(part);
    }
  }

  _addMaterials() {
    this._addBakedMaterial();
    this._addScreenMaterial();
  }

  _addBakedMaterial() {
    const texture = Loader.assets['baked-game-boy'];
    texture.flipY = false;

    const bakedMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    this._allMeshes.forEach(mesh => {
      mesh.material = bakedMaterial;
    });
  }

  _addScreenMaterial() {
    const screen = this._parts[GAME_BOY_PART_TYPE.Screen];

    const material = new THREE.MeshBasicMaterial({
      color: 0xaaffaa,
    });

    screen.material = material;
  }
}

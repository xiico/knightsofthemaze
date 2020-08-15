import {protoEntity} from '../engine/protoEntity.js';
import {Roam} from '../behaviors/roam.js'
let Bob = {};
Object.assign(Bob,protoEntity,Roam);
export {Bob};
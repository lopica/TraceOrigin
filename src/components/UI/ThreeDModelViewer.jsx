// src/components/ThreeDModelViewer.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Canvas3D from '../Canvas3D';
import { convertLinkToBase64 } from '../../utils/convertLinkToBase64';

const ThreeDModelViewer = () => {

  return(
  <div>
         <Canvas3D full modelBase64={('https://storage.googleapis.com/storagetraceorigin/cah7v3tejt3cai13juuw.stl')} />
  </div>
  )
};

export default ThreeDModelViewer;
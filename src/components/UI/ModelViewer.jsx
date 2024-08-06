import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const ModelViewer = ({ modelFile }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!modelFile) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const loader = new STLLoader();
    loader.load(URL.createObjectURL(modelFile), (geometry) => {
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [modelFile]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ModelViewer;

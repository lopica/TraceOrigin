import { PresentationControls, Stage, useTexture } from "@react-three/drei"
import { Canvas, useLoader, useThree } from "@react-three/fiber"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import { useState, useRef, useEffect } from 'react'

function VideoBackground() {
  const { scene } = useThree();
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();
        videoRef.current = videoElement;

        const videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        scene.background = videoTexture;  // Apply the video texture as the background
      } catch (error) {
        console.error('Unable to access the camera/webcam.', error);
      }
    }

    if (!videoRef.current) {
      setupWebcam();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [scene]);  // Dependency on 'scene' to ensure it's loaded before applying the background

  return null;  // This component does not render anything itself
}

// function ScrollZoom() {
//   const { camera } = useThree();
//   const [zoom, setZoom] = useState(1);
//   const handleWheel = (event) => {
//     const delta = -event.deltaY * 0.01;
//     setZoom((prev) => {
//       const newZoom = prev + delta;
//       return Math.max(0.5, Math.min(newZoom, 5));  // Constrain zoom to reasonable values
//     });
//   };

//   useEffect(() => {
//     camera.position.z = 5 / zoom;  // Adjust this based on your scene scale
//     camera.updateProjectionMatrix();
//   }, [zoom, camera]);

//   return null;
// }

function Model() {
  const stl = useLoader(STLLoader, '/cah7v3tejt3cai13juuw.stl'); // Load the STL file
  // const ply = useLoader(PLYLoader, '/Tam-Nen-Phai-V6.4.ply');
  return (
    <mesh geometry={stl}>
      <meshStandardMaterial attach="material" color={'gray'} />
    </mesh>
  );
}

function Canvas3D() {
  return <Canvas style={{ height: '50svh', touchAction: 'none' }} dpr={[1, 2]} camera={{ fov: 45 }}>
    <PresentationControls
      speed={1.5}
      global
      polar={[-Math.PI, Math.PI]}  // Full vertical rotation from top to bottom
      azimuth={[-Infinity, Infinity]}  // Infinite horizontal rotation
    >
      <Stage environment={'city'}><Model /></Stage>
      <VideoBackground />
      {/* <ScrollZoom /> */}
    </PresentationControls>
  </Canvas>
}

export default Canvas3D
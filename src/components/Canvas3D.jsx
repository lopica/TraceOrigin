import { PresentationControls, Stage, useTexture } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { twMerge } from 'tailwind-merge';

function VideoBackground() {
  const { scene } = useThree();
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        videoElement.play();
        videoRef.current = videoElement;

        const videoTexture = new THREE.VideoTexture(videoElement);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        scene.background = videoTexture; // Apply the video texture as the background
      } catch (error) {
        console.error("Unable to access the camera/webcam.", error);
      }
    }

    if (!videoRef.current) {
      setupWebcam();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [scene]); // Dependency on 'scene' to ensure it's loaded before applying the background

  return null; // This component does not render anything itself
}

function Model({ modelUrl }) {
  const stl = useLoader(STLLoader, modelUrl); // Load the STL file
  return (
    <mesh geometry={stl}>
      <meshStandardMaterial attach="material" color={"gray"} />
    </mesh>
  );
}
 
function Canvas3D({ modelBase64 }) {
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    if (modelBase64) {
      const byteCharacters = atob(modelBase64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/sla" });
      const url = URL.createObjectURL(blob);
      setModelUrl(url);

      // Clean up URL object when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  }, [modelBase64]);

  return (
      <Canvas style={{touchAction: 'none'}} dpr={[1, 2]} camera={{ fov: 45 }}>
        <PresentationControls
          speed={1.5}
          global
          polar={[-Math.PI, Math.PI]} // Full vertical rotation from top to bottom
          azimuth={[-Infinity, Infinity]} // Infinite horizontal rotation
        >
          <Stage environment={"city"}>
            {modelUrl && <Model modelUrl={modelUrl} />}
          </Stage>
          <VideoBackground />
        </PresentationControls>
      </Canvas>
  );
}

export default Canvas3D;

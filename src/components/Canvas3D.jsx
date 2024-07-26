import {
  Environment,
  OrbitControls,
  PresentationControls,
  Stage,
  useTexture,
} from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./UI/Button";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MdOutlineZoomInMap } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";
import useShow from "../hooks/use-show";
import Modal from "./UI/Modal";

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
      <meshStandardMaterial attach="material"  />
    </mesh>
  );
}

function Canvas3D({ modelBase64, full }) {
  const { show, handleFlip, handleClose } = useShow(false);
  const { show: background, handleFlip: flipBackground } = useShow(false);
  const [modelUrl, setModelUrl] = useState(null);

  const handleZoomModal = (e) => {
    e.preventDefault();
    handleFlip();
  };

  const stopPropagation = (e) => {
    console.log("Event: ", e.type);
    e.stopPropagation();
    e.preventDefault();
  };

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
    <div className="h-full w-full relative ">
      {show && (
        <Modal onClose={handleClose} full>
          <Button
            className="rounded-full absolute bottom-2 right-2 z-30 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
            onClick={handleZoomModal}
          >
            {!show ? (
              <MdOutlineZoomOutMap color="white" className="h-10 w-10" />
            ) : (
              <MdOutlineZoomInMap color="white" className="h-10 w-10" />
            )}
          </Button>
          <Button
            className="rounded-full absolute bottom-2 left-2 z-30 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
            onClick={(e)=>{
            e.preventDefault()
            flipBackground()
          }}
          >
            {!background ? (
              <FaVideo color="white" className="h-10 w-10" />
            ) : (
              <IoMdImage color="white" className="h-10 w-10" />
            )}
          </Button>
          <Canvas
            style={{ touchAction: "none" }}
            dpr={[1, 2]}
            camera={{ fov: 45 }}
            onClick={stopPropagation}
            onMouseDown={stopPropagation}
            onMouseMove={stopPropagation}
            onTouchStart={stopPropagation}
            onTouchMove={stopPropagation}
            onTouchEnd={stopPropagation}
          >
            <OrbitControls />
            <Stage environment={"city"}>
              {modelUrl && <Model modelUrl={modelUrl} />}
            </Stage>
            {background ? (
              <VideoBackground />
            ) : (
              <Environment background files={"/modern_buildings_2_4k.hdr"} />
            )}
          </Canvas>
        </Modal>
      )}
      {full && (
        <Button
          className="rounded-full absolute bottom-2 right-2 z-10 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={handleZoomModal}
        >
          {!show ? (
            <MdOutlineZoomOutMap color="white" className="h-10 w-10" />
          ) : (
            <MdOutlineZoomInMap color="white" className="h-10 w-10" />
          )}
        </Button>
      )}
      {full && (
        <Button
          className="rounded-full absolute bottom-2 left-2 z-10 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={(e)=>{
            e.preventDefault()
            flipBackground()
          }}
        >
          {!background ? (
            <FaVideo color="white" className="h-10 w-10" />
          ) : (
            <IoMdImage color="white" className="h-10 w-10" />
          )}
        </Button>
      )}
      <Canvas style={{ touchAction: "none" }} dpr={[1, 2]} camera={{ fov: 45 }}>
        <OrbitControls />
        <Stage environment={"city"}>
          {modelUrl && <Model modelUrl={modelUrl} />}
        </Stage>
        {background ? (
          <VideoBackground />
        ) : (
          <Environment background files={"/modern_buildings_2_4k.hdr"} />
        )}
      </Canvas>
    </div>
  );
}

export default Canvas3D;

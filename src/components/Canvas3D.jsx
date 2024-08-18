import { Environment, OrbitControls, Stage } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
import { Box3, Vector3 } from "three";
import * as THREE from "three";
import { useState, useRef, useEffect, Suspense } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./UI/Button";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { MdOutlineZoomInMap } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";
import useShow from "../hooks/use-show";
import Modal from "./UI/Modal";
import { getExtension, getMimeTypeFromBase64 } from "../utils/getExtention";
import useToast from "../hooks/use-toast";

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

function Model({ modelUrl, extension }) {
  const modelRef = useRef();

  let model;
  if (extension) {
    console.log(extension);
    switch (extension) {
      case "obj":
        model = useLoader(OBJLoader, modelUrl);
        return <primitive ref={modelRef} object={model} />;
      case "3ds":
        model = useLoader(TDSLoader, modelUrl);
        return <primitive ref={modelRef} object={model} />;
      case "fbx":
        model = useLoader(FBXLoader, modelUrl);
        return <primitive ref={modelRef} object={model} />;
      case "stl":
        model = useLoader(STLLoader, modelUrl);
        return (
          <mesh ref={modelRef} geometry={model}>
            <meshStandardMaterial attach="material" />
          </mesh>
        );
      case "ply":
        model = useLoader(PLYLoader, modelUrl);
        return (
          <mesh ref={modelRef} geometry={model}>
            <meshStandardMaterial attach="material" />
          </mesh>
        );
      case "gltf":
      case "glb":
        model = useLoader(GLTFLoader, modelUrl);
        // console.log(model);
        return <primitive ref={modelRef} object={model.scene} />;
      default:
        console.error(`Unsupported file extension: ${extension}`);
        return null;
    }
  }
}

function Canvas3D({ modelBase64, full }) {
  const { show, handleFlip, handleClose } = useShow(false);
  const { show: background, handleFlip: flipBackground } = useShow(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [extension, setExtension] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getToast } = useToast();

  const handleZoomModal = (e) => {
    e.preventDefault();
    handleFlip();
  };

  const stopPropagation = (e) => {
    e.preventDefault();
    // console.log(e)
    e.stopPropagation();
  };

  useEffect(() => {
    if (modelBase64) {
      setIsLoading(true);
      const byteCharacters = atob(modelBase64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      const mimeType = getMimeTypeFromBase64(modelBase64);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const newBlob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(newBlob);
      setExtension(getExtension(modelBase64));
      setModelUrl(url);
      setIsLoading(false);

      // Clean up URL object when component unmounts
      return () => {
        console.log("vo day");
        URL.revokeObjectURL(url);
      };
    }
  }, [modelBase64]);

  return (
    <div className="h-full w-full relative">
    {show && (
      <Modal onClose={handleClose} full>
        <Button
          className="rounded-full absolute bottom-2 right-2 z-30 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={handleZoomModal}
        >
          <MdOutlineZoomInMap color="white" className="h-10 w-10" />
        </Button>
        <Button
          className="rounded-full absolute bottom-2 left-2 z-30 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={(e) => {
            e.preventDefault();
            flipBackground();
          }}
        >
          {!background ? (
            <FaVideo color="white" className="h-10 w-10" />
          ) : (
            <IoMdImage color="white" className="h-10 w-10" />
          )}
        </Button>

        {/* Render Canvas when modal is shown */}
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
            <Suspense fallback={null}>
              {modelUrl && <Model modelUrl={modelUrl} extension={extension} />}
            </Suspense>
          </Stage>
          {background ? (
            <VideoBackground />
          ) : (
            <Environment background files={"/modern_buildings_2_4k.hdr"} />
          )}
        </Canvas>
      </Modal>
    )}

    {/* Render smaller version when modal is not shown */}
    {!show && full && (
      <>
        <Button
          className="rounded-full absolute bottom-2 right-2 z-10 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={handleZoomModal}
        >
          <MdOutlineZoomOutMap color="white" className="h-10 w-10" />
        </Button>
        <Button
          className="rounded-full absolute bottom-2 left-2 z-10 opacity-70 h-12 w-12 bg-slate-500 hover:bg-slate-400"
          onClick={(e) => {
            e.preventDefault();
            flipBackground();
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
            <Suspense fallback={null}>
              {modelUrl && <Model modelUrl={modelUrl} extension={extension} />}
            </Suspense>
          </Stage>
          {background ? (
            <VideoBackground />
          ) : (
            <Environment background files={"/modern_buildings_2_4k.hdr"} />
          )}
        </Canvas>
      </>
    )}
  </div>
  );
}

export default Canvas3D;

import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import DropzoneDemo from "./DropzoneDemo";
import { Camera } from "react-camera-pro";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MOBILE_NET_INPUT_HEIGHT = 224;
const MOBILE_NET_INPUT_WIDTH = 224;

export default function ImageClassification() {
  const [step, setStep] = useState("choose");
  const [predictionResult, setPredictionResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [cameraType, setCameraType] = useState("environment");
  const videoContainerRef = useRef(null);
  const [camerasAvailable, setCamerasAvailable] = useState({
    user: false,
    environment: false,
  });
  const customModelRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const animationFrameId = useRef(null);
  const { aiList } = useSelector((state) => state.historySearchSlice);

  // Check for camera availability
  const checkCameraAvailability = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );

    const hasUser = videoInputs.some((device) =>
      device.label.toLowerCase().includes("front")
    );
    const hasEnvironment = videoInputs.some((device) =>
      device.label.toLowerCase().includes("back")
    );

    setCamerasAvailable({ user: hasUser, environment: hasEnvironment });
  };

  // Handle camera change
  const handleCameraChange = (event) => {
    setCameraType(event.target.value);
  };

  // Handle image file change
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageUrl(URL.createObjectURL(file));
      setImageLoaded(false);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post("http://localhost:3001/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPredictionResult(response.data.productName);
        setConfidence(response.data.confidence);
        setImageLoaded(true);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Predict video frame
  const predictVideoFrame = async () => {
    if (videoContainerRef.current) {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const video = videoContainerRef.current.querySelector("video");

        if (!video) {
          console.error("Video element not found");
          return;
        }

        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Calculate crop dimensions (center of the video)
        const cropWidth = video.videoWidth / 2;
        const cropHeight = video.videoHeight / 2;
        const cropX = (video.videoWidth - cropWidth) / 2;
        const cropY = (video.videoHeight - cropHeight) / 2;

        // Draw image from center of the video to canvas
        ctx.drawImage(video, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('image', blob, 'image.png');

          try {
            const response = await axios.post("http://localhost:3001/upload", formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            setPredictionResult(response.data.productName);
            setConfidence(response.data.confidence);
          } catch (error) {
            console.error("Error predicting video frame:", error);
          }
        }, 'image/png');
      } catch (error) {
        console.error("Error capturing video frame:", error);
      }

      // Delay to reduce lag
      setTimeout(() => {
        animationFrameId.current = requestAnimationFrame(predictVideoFrame);
      }, 1000);
    }
  };

  // Load model and handle predictions
  useEffect(() => {
    const loadImageAndPredict = async () => {
      try {
        tf.tidy(() => {
          let tensor = tf.browser.fromPixels(imageRef.current).div(255);
          let resizedTensorImage = tf.image.resizeBilinear(
            tensor,
            [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH],
            true
          );
          let prediction = customModelRef.current
            .predict(resizedTensorImage.expandDims())
            .squeeze();
          let highestIndex = prediction.argMax().arraySync();
          let predictionArray = prediction.arraySync();

          setPredictionResult(classNamesRef.current[highestIndex]);
          setConfidence(Math.floor(predictionArray[highestIndex] * 100));
        });
      } catch (error) {
        console.error("Failed to load image or make prediction:", error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (imageLoaded && customModelRef.current) {
      tf.setBackend("cpu").then(() => {
        loadImageAndPredict();
      });
    }
  }, [imageLoaded]);

  // Load custom model
  useEffect(() => {
    async function loadCustomModel() {
      try {
        const url = "https://storage.googleapis.com/storagetraceorigin/model.json";
        const model = await tf.loadLayersModel(url);
        console.log("Custom model loaded successfully!");
        customModelRef.current = model;
        model.summary();
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }

    loadCustomModel();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Check camera availability on component mount
  useEffect(() => {
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    if (videoContainerRef.current) {
      videoContainerRef.current.querySelector("video").onloadeddata = () => {
        console.log("Video loaded");
        animationFrameId.current = requestAnimationFrame(predictVideoFrame);
      };
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [step]);

  return (
    <section className="mb-4">
      <h2 className="text-center pt-4 text-3xl pb-2">Nhận diện hình ảnh</h2>
      {step === "choose" && (
        <div className="flex justify-around mt-4 mx-auto max-w-2xl">
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setStep("image")}
          >
            <FaCamera className="w-14 h-14" />
            <p className="text-center">Chọn ảnh</p>
          </div>
          <div
            className="bg-slate-200 border h-40 w-40 rounded-md hover:bg-slate-400 flex flex-col justify-center items-center p-4 cursor-pointer"
            onClick={() => setStep("video")}
          >
            <IoVideocam className="w-14 h-14" />
            <p>Quay trực tiếp</p>
          </div>
        </div>
      )}
      {step === "image" && (
        <div className="mb-4">
          <Button
            primary
            outline
            onClick={() => setStep("choose")}
            className="mb-4"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          {!imageUrl && (
            <>
              <DropzoneDemo
                className="max-w-4xl lg:mx-auto h-[20svh] mx-2"
                setImageUrl={setImageUrl}
                setPredictionResult={setPredictionResult}
                setConfidence={setConfidence}
                setImageLoaded={setImageLoaded}
              />
              <div className="mt-8 pl-4">
                <h3 className="">Lịch sử tìm kiếm</h3>
                <ul className="pl-8 flex gap-4 mt-2">
                  {aiList.map((product) => (
                    <Link key={product.id} to={product.url}>
                      <Button secondary rounded>
                        {product.id}
                      </Button>
                    </Link>
                  ))}
                  {aiList.length === 0 && (
                    <p>Bạn chưa tìm kiếm sản phẩm nào.</p>
                  )}
                </ul>
              </div>
            </>
          )}
          {imageUrl && (
            <div className="flex">
              <div className="flex-1 flex flex-col items-center p-2">
                <img
                  src={imageUrl}
                  ref={imageRef}
                  onLoad={() => setImageLoaded(true)}
                  alt="upload image"
                  className=" h-[40svh] object-contain"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={handleImageChange}
                />
                <p
                  className="text-center underline text-slate-500 w-full py-2 hover:cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Chọn ảnh khác
                </p>
              </div>
              <div className="flex-1 w-1/2 p-4">
                {!imageLoaded ? (
                  <p>Loading prediction...</p>
                ) : (
                  <>
                    <h3 className="text-center text-3xl mb-6">
                      {predictionResult}
                    </h3>
                    <div className="flex justify-between max-w-md mx-auto">
                      <div className="flex">
                        <div className="flex flex-col">
                          <div className="stat-title">Độ chính xác</div>
                          <div className="font-medium">{confidence}%</div>
                        </div>
                      </div>
                      <p className="underline cursor-pointer">Manufacturer</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {step === "video" && (
        <div className="flex flex-col sm:flex-row pb-4">
          <div className="flex-1 max-w-full sm:max-w-[50%]">
            <div
              ref={videoContainerRef}
              className="relative w-full pt-[56.25%] bg-sky-200"
            >
              <Camera
                facingMode={cameraType}
                showFocus={false}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            <select
              className="mt-2 block w-full text-gray-700 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={handleCameraChange}
              value={cameraType}
            >
              <option value="user" disabled={!camerasAvailable.user}>
                Front Camera
              </option>
              <option
                value="environment"
                disabled={!camerasAvailable.environment}
              >
                Rear Camera
              </option>
            </select>
          </div>
          <div className="flex-1 mx-auto sm:max-w-md lg:max-w-sm">
            <Button
              primary
              outline
              onClick={() => setStep("choose")}
              className="mb-4"
            >
              <IoIosArrowBack />
              Quay lại
            </Button>
            <h3 className="text-center text-3xl mb-6">{predictionResult}</h3>
            <div className="flex justify-between gap-2 mx-2">
              <div className="flex ">
                <div className="flex flex-col">
                  <div className="stat-title">Độ chính xác</div>
                  <div className="font-medium">{confidence}%</div>
                </div>
              </div>
              <p className="underline cursor-pointer">Manufacturer</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
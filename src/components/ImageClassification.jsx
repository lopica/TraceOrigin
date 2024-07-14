import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import Dropzone from "./Dropzone";
import { Camera } from "react-camera-pro";

const MOBILE_NET_INPUT_HEIGHT = 224,
  MOBILE_NET_INPUT_WIDTH = 224;
// let model, customModel;
export default function ImageClassification() {
  const [step, setStep] = useState("choose");
  const [predictionResult, setPredictions] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const classNamesRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [cameraType, setCameraType] = useState("environment");
  const [camerasAvailable, setCamerasAvailable] = useState({
    user: false,
    environment: false,
  });
  const modelRef = useRef(null);
  const customModelRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const checkCameraAvailability = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );
    // navigator.mediaDevices.enumerateDevices().then((devices) => {
    //   devices.forEach((device) => {
    //     if (device.kind === "videoinput") {
    //       console.log(device.label); // Log the label to see how it is described
    //     }
    //   });
    // });

    const hasUser = videoInputs.some((device) =>
      device.label.toLowerCase().includes("front")
    );
    const hasEnvironment = videoInputs.some((device) =>
      device.label.toLowerCase().includes("back")
    );

    setCamerasAvailable({ user: hasUser, environment: hasEnvironment });
  };

  const handleCameraChange = (event) => {
    setCameraType(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageUrl(URL.createObjectURL(file));
      setImageLoaded(false);
    } else {
      alert("Please select an image file.");
    }
  };

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

          setPredictions(classNamesRef.current[highestIndex]);
          setConfidence(Math.floor(predictionArray[highestIndex] * 100));
          console.log(classNamesRef.current[highestIndex]);
          console.log(Math.floor(predictionArray[highestIndex] * 100));
        });
      } catch (error) {
        console.error("Failed to load image or make prediction:", error);
      } finally {
      }
    };

    if (imageLoaded) {
      tf.setBackend("cpu").then(() => {
        loadImageAndPredict();
      });
    }
  }, [imageLoaded]);

  

  useEffect(() => {
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    // Define the async function inside useEffect
    async function loadCustomModel() {
      try {
        const url = "http://localhost:8081/models/model.json";
        const model = await tf.loadLayersModel(url);
        console.log("Custom model loaded successfully!");
        customModelRef.current = model;
        model.summary();
      } catch (error) {
        console.log(error);
      }
    }

    async function loadMobilenetModel() {
      try {
        const url =
          "https://www.kaggle.com/models/google/mobilenet-v3/TfJs/large-100-224-feature-vector/1";
        const mobilenet_v3 = await tf.loadGraphModel(url, { fromTFHub: true });
        console.log("MobileNet v3 loaded successfully!");
        modelRef.current = mobilenet_v3;
        tf.tidy(() => {
          let answer = model.predict(
            tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3])
          );
          console.log(answer.shape);
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchClassNames() {
      try {
        const response = await fetch(
          "http://localhost:8081/models/classNames.json"
        );
        const classNames = await response.json();
        classNamesRef.current = classNames;
        console.log("Class names loaded successfully!");
      } catch (error) {
        console.error("Failed to load class names:", error);
      }
    }

    // Call the async functions
    // loadMobilenetModel();
    loadCustomModel();
    fetchClassNames();

    // Optional: Return a cleanup function
    return () => {
      // Cleanup code here (if necessary)
    };
  }, []);

  //image or video -> predict -> navigate
  return (
    <section>
      <h2 className="text-center pt-4 text-xl pb-2">Nhận diện hình ảnh</h2>
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
            <Dropzone
              className="max-w-4xl lg:mx-auto h-[20svh] mx-2"
              setImageUrl={setImageUrl}
            />
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
                    <div className="flex justify-between  max-w-md mx-auto">
                      <div className="flex">
                        <div className="flex flex-col">
                          <div className="stat-title">Độ chính xác</div>
                          <div className="font-medium">{confidence}%</div>
                          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                        </div>
                        <div className="stat-figure text-secondary"></div>
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
        <div>
          <Button
            primary
            outline
            onClick={() => setStep("choose")}
            className="mb-4"
          >
            <IoIosArrowBack />
            Quay lại
          </Button>
          <div className="flex flex-col sm:flex-row pb-4">
            <div className="flex-1 max-w-full sm:max-w-[50%]">
              <div className="relative w-full pt-[56.25%] bg-sky-200">
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
              <h3 className="text-center text-3xl mb-6">Predict</h3>
              <div className="flex justify-between gap-2 mx-2">
                <div className="flex ">
                  <div className="flex flex-col">
                    <div className="stat-title">Độ chính xác</div>
                    <div className="font-medium">58%</div>
                    {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                  </div>
                  <div className="stat-figure text-secondary"></div>
                </div>
                <p className="underline cursor-pointer">Manufacturer</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

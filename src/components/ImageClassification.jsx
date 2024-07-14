import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import Dropzone from "./Dropzone";

const MOBILE_NET_INPUT_HEIGHT = 224,
  MOBILE_NET_INPUT_WIDTH = 224;
export default function ImageClassification() {
  const [step, setStep] = useState("choose");
  const [predictions, setPredictions] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      alert("Please select an image file.");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const imageElement = imageRef.current;

    const reader = new FileReader();
    reader.onload = async () => {
      imageElement.src = reader.result;
      const tensor = tf.browser
        .fromPixels(imageElement)
        .resizeBilinear([MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH])
        .div(255)
        .expandDims();
      const feature = model.predict(tensor);
      const predict = customModel.predict(feature).squeeze();
      setPredictions(prediction);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Define the async function inside useEffect
    async function loadCustomModel() {
      try {
        const url = "http://localhost:8081/models/model.json";
        const model = await tf.loadLayersModel(url);
        console.log("Custom model loaded successfully!");

        model.summary();
      } catch (error) {
        console.log(error);
      }
    }

    async function loadMobilenetModel() {
      try {
        const url =
          "https://www.kaggle.com/models/google/mobilenet-v3/TfJs/large-100-224-feature-vector/1";
        const model = await tf.loadGraphModel(url, { fromTFHub: true });
        console.log("MobileNet v3 loaded successfully!");

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
        setClassNames(classNames);
        console.log("Class names loaded successfully!");
      } catch (error) {
        console.error("Failed to load class names:", error);
      }
    }

    // Call the async functions
    loadMobilenetModel();
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
              <div className="flex-1 flex flex-col items-center  p-2">
                <img
                  src={imageUrl}
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
                <p className="text-center underline text-slate-500 w-full py-2 hover:cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                  Chọn ảnh khác
                </p>
              </div>
              <div className="flex-1 mx-8">
                <h3 className="text-center text-3xl mb-6">Predict</h3>
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="flex flex-col">
                      <div className="stat-title">Độ chính xác</div>
                      <div className="font-medium">58%</div>
                      {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                    </div>
                    <div className="stat-figure text-secondary"></div>
                  </div>
                  <p className="underline">Manufacturer</p>
                </div>
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
        </div>
      )}
    </section>
  );
}

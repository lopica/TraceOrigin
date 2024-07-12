import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";


const MOBILE_NET_INPUT_HEIGHT = 224,
  MOBILE_NET_INPUT_WIDTH = 224;
export default function ImageClassification() {
  const [predictions, setPredictions] = useState([]);
  const imageRef = useRef(null);

  useEffect(() => {
    // Define the async function inside useEffect
    async function loadCustomModel() {
      try {
        const url = "http://localhost:8081/api/model?bin=true";
        const model = await tf.loadLayersModel(url);
        console.log("Custom model loaded successfully!");

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

    async function loadMobilenetModel() {
      try {
        const url = "https://www.kaggle.com/models/google/mobilenet-v3/TfJs/large-100-224-feature-vector/1";
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

    // Call the async functions
    loadMobilenetModel();
    loadCustomModel();

    // Optional: Return a cleanup function
    return () => {
      // Cleanup code here (if necessary)
    };
  }, []);

  return <div></div>;
}

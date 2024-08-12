import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import * as tf from '@tensorflow/tfjs-node';
import { fileURLToPath } from 'url';

// Constants
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, 'uploads');
const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DATABASE_NAME = 'imageRetrievalDB';
const COLLECTION_NAME = 'imageFeatures';
const MOBILE_NET_INPUT_HEIGHT = 224;
const MOBILE_NET_INPUT_WIDTH = 224;

// Express app setup
const app = express();
const port = 3000;

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

let model, baseModel;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load MobileNet model
async function loadMobileNetFeatureModel() {
  const url = 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/mobilenet-v2/model.json';
  model = await tf.loadLayersModel(url);
  console.log('MobileNetV2 model loaded successfully!');
  const layer = model.getLayer('global_average_pooling2d_1');
  baseModel = tf.model({ inputs: model.inputs, outputs: layer.output });
  baseModel.summary();
}

// Preprocess image
function preprocess(imageBuffer) {
  return tf.tidy(() => {
    let imageAsTensor = tf.node.decodeImage(imageBuffer, 3);
    let resizedTensorImage = tf.image.resizeBilinear(
      imageAsTensor,
      [MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH],
      true
    );
    let normalizedTensorImage = resizedTensorImage.div(255.0);
    return normalizedTensorImage.expandDims(0);
  });
}

// Extract features
async function extractFeature(imageBuffer) {
  return tf.tidy(() => {
    let processedImage = preprocess(imageBuffer);
    let imageFeatures = baseModel.predict(processedImage);
    let featuresArray = imageFeatures.squeeze().arraySync();
    console.log('Extracted Features:', featuresArray);
    return featuresArray;
  });
}

// Save features to MongoDB
async function saveFeaturesToMongoDB(features, label) {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    await collection.insertOne({ label, features });
    console.log('Features saved to MongoDB.');
  } finally {
    await client.close();
  }
}

// Cosine similarity function
function cosineSimilarity(tensorA, tensorB) {
  const dotProduct = tf.tidy(() => tf.sum(tf.mul(tensorA, tensorB)).arraySync());
  const normA = tf.tidy(() => tf.norm(tensorA).arraySync());
  const normB = tf.tidy(() => tf.norm(tensorB).arraySync());
  return dotProduct / (normA * normB);
}

// Classify image
async function classifyImage(features) {
  await loadMobileNetFeatureModel();
  
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const allImages = await collection.find().toArray();

    if (allImages.length === 0) {
      console.error('No images found in the database.');
      return { productName: 'Not Determined', confidence: 0 };
    }

    const similarImages = allImages.map(image => {
      const featureTensor = tf.tensor(image.features);
      const featuresTensor = tf.tensor(features);

      if (featureTensor.shape[0] !== featuresTensor.shape[0]) {
        return { ...image, distance: Infinity };
      }

      const similarity = cosineSimilarity(featuresTensor, featureTensor);
      const distance = 1 - similarity;
      return { ...image, distance };
    });

    similarImages.sort((a, b) => a.distance - b.distance);

    const bestPrediction = similarImages[0];
    const distance = bestPrediction ? bestPrediction.distance : 1;
    const confidence = isNaN(distance) ? 0 : Math.max(0, 100 - (distance * 100));
    if (confidence >= 50) {
      const productName = confidence >= 60 ? bestPrediction.label : 'Not Determined';
      return { productName, confidence };
    } else {
      return { productName: 'Not Determined', confidence };
    }
  } finally {
    await client.close();
  }
}

// Endpoint to handle image upload and classification
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const features = await extractFeature(req.file.buffer);
    const result = await classifyImage(features);
    res.json(result);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

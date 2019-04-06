import * as tf from "@tensorflow/tfjs";

const WIDTH = 12;
const HEIGHT = 9;
const ARR_LENGTH = 432;

const loadModel = async () => {
  return await tf.loadLayersModel("assets/model/brightness-predictor.json");
};

const predictBrightness = async rgbarray => {
  const model = await loadModel();

  if (model) {
    return await tf.tidy(() => {
      const xs = [Array.from(rgbarray)];
      const inputXS = tf.tensor2d(xs, [xs.length, ARR_LENGTH]);

      const preds = model.predict(inputXS);

      preds.print();

      const out = preds.arraySync()[0][0];

      return out;
    });
  }
};

export default predictBrightness;

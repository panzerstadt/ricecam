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

      console.log(inputXS);

      const preds = model.predict(inputXS);

      preds.print();

      const out = preds.arraySync()[0][0];

      return out;
    });
  }
};

// sml model learning bright and dark
export const isBright = async canvas => {
  const clrs = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);

  console.log(clrs);

  const flat = clrs.data;
  const res = await predictBrightness(flat);
  console.log(res);
  return res > 0.6 ? true : false;
};

export default isBright;

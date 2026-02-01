import bikeModel from "../../models/scans/bikeModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import tagModel from "../../models/scans/tagModel.js";



const MAP = {
  C: carModel,
  B: bikeModel,
  T: tagModel,
  K: keyModel,
  U: businessCardModel,
  P: petTagModel,
};

export function resolveModel(serial) {
  const prefix = serial[0];
  const model = MAP[prefix];
  if (!model) throw new Error("INVALID_SERIAL_PREFIX");
  return { model, tagType: model.modelName };
}
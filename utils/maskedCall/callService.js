import callSessionModel from "../../models/callSessionModel.js";
import { resolveModel } from "./serialResolverForCall.js";


export async function initiateCall({ from, serialNumber }) {
  const serial = serialNumber
  
  const { model, tagType } = resolveModel(serial);
  const item = await model.findOne({ serialNumber: serial });

  if (!item) throw new Error("TAG_NOT_FOUND");
  if (item.callDisabled || item.paused || item.isDeleted) {
    throw new Error("CALL_NOT_ALLOWED");
  }

  const validUntil = new Date(Date.now() + 10 * 60 * 1000);

  const session = await callSessionModel.create({
    serialNumber: serial,
    tagType,
    fromE164: from,
    toE164: item.phone.e164,
    validUntil,
  });

  return session;
}

import callSessionModel from "../../models/callSessionModel.js";
import { resolveModel } from "./serialResolverForCall.js";


function normalizeToExotelLocal(from) {
  if (!from) throw new Error("INVALID_PHONE");

  let n = from.toString().trim();

  if (n.startsWith("+91")) n = n.slice(3);
  if (n.startsWith("91") && n.length === 12) n = n.slice(2);
  if (!n.startsWith("0")) n = `0${n}`;

  return n;
}

export async function initiateCall({ from, serialNumber }) {
  if (!serialNumber) {
    throw new Error("SERIAL_NUMBER_REQUIRED");
  }

  // 🔥 THIS FIXES TAG_NOT_FOUND
  const serial = serialNumber.trim().toUpperCase();

  const { model, tagType } = resolveModel(serial);

  console.log("Looking for serial:", serial, "in", model.modelName);

  const item = await model.findOne({ serialNumber: serial });

  if (!item) {
    throw new Error("TAG_NOT_FOUND");
  }

  if (item.callDisabled || item.paused || item.isDeleted) {
    throw new Error("CALL_NOT_ALLOWED");
  }

  const validUntil = new Date(Date.now() + 10 * 60 * 1000);

  const session = await callSessionModel.create({
    serialNumber: serial,
    tagType,
    fromE164: normalizeToExotelLocal(from),
    toE164: item.phone.e164,
    validUntil,
  });

  return session;
}
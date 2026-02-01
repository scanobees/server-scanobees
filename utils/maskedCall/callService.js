import callSessionModel from "../../models/callSessionModel.js";
import { resolveModel } from "./serialResolverForCall.js";

function normalizeToE164(from) {
  if (!from) throw new Error("INVALID_PHONE");

  let n = from.toString().trim();

  if (n.startsWith("+")) return n;

  if (n.startsWith("0")) n = n.slice(1);

  if (!n.startsWith("91")) n = `91${n}`;

  return `+${n}`;
}

export async function initiateCall({ from, serialNumber }) {
  const serial = serialNumber;

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

    // 🔥 THIS FIXES EVERYTHING
    fromE164: normalizeToE164(from),

    toE164: item.phone.e164,
    validUntil,
  });

  return session;
}
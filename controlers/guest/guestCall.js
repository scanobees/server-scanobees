import callLogModel from "../../models/callLogModel.js";
import callSessionModel from "../../models/callSessionModel.js";
import { initiateCall } from "../../utils/maskedCall/callService.js";
import { ensureCallWindow } from "../../utils/maskedCall/callWindow.js";
import { connectXML } from "../../utils/maskedCall/xmlCall.js";


function normalizeToE164(from) {
  if (!from) return null;

  let n = from.toString().trim();
  if (n.startsWith("+")) return n;
  if (n.startsWith("0")) n = n.slice(1);
  if (!n.startsWith("91")) n = `91${n}`;

  return `+${n}`;
}

export const initiateMaskedCall = async (req, res) => {
  const session = await initiateCall(req.body);

  res.json({
    success: true,
    callSessionId: session._id,
    expiresInSeconds: 600,
    message: "Calling owner. This call is masked.",
  });
};






export const connectCall = async (req, res) => {
  try {
    // Exotel sends caller number here
    const rawFrom =
      req.query.From ||
      req.query.CallFrom;

    if (!rawFrom) {
      return res.status(400).json({ error: "From number missing" });
    }

    // Normalize to match DB
    const fromE164 = normalizeToE164(rawFrom);

    // Find active call session
    const session = await callSessionModel.findOne({
      fromE164,
      status: "initiated",
      validUntil: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(404).json({ error: "No active call session found" });
    }

    // Enforce 10-minute validity
    ensureCallWindow(session.validUntil);

    // Idempotency protection
    if (session.startedAt) {
      return res.status(409).json({ error: "Call already connected" });
    }

    // Update session
    session.status = "connected";
    session.startedAt = new Date();
    session.exotelCallSid = req.query.CallSid;
    await session.save();

    // ✅ EXOTEL CONNECT APPLET JSON RESPONSE
    return res.json({
      fetch_after_attempt: false,

      destination: {
        numbers: [session.toE164], // OWNER NUMBER (E.164)
      },

      // Your Exotel virtual number (E.164)
      outgoing_phone_number: "04954263008",

      record: true,
      recording_channels: "dual",

      max_ringing_duration: 45,
      max_conversation_duration: 3600,

      music_on_hold: {
        type: "operator_tone",
      },

      start_call_playback: {
        playback_to: "both",
        type: "text",
        value: "This is a masked call. Please do not share personal information.",
      },
    });

  } catch (err) {
    console.error("connectCall error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const callStatus = async (req, res) => {
  const { CallSid, Status, Duration } = req.body;

  const session = await callSessionModel.findOne({ exotelCallSid: CallSid });
  if (!session) return res.sendStatus(200);

  session.status = Status.toLowerCase();
  session.endedAt = new Date();
  await session.save();

  await callLogModel.create({
    callSessionId: session._id,
    event: Status,
    duration: Duration,
    payload: req.body,
  });

  res.sendStatus(200);
};
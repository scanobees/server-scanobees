import axios from "axios";

export const maskedCall = async (req, res) => {
  try {
    const { callerNumber, ownerNumber } = req.body;

    const url = `https://${process.env.EXOTEL_SID}:${process.env.EXOTEL_API_TOKEN}` +
      `@api.exotel.com/v1/Accounts/${process.env.EXOTEL_SID}/Calls/connect.json`;

    const response = await axios.post(
      url,
      new URLSearchParams({
        From: callerNumber,              // Finder
        To: ownerNumber,                 // Asset Owner
        CallerId: process.env.EXOTEL_CALLER_ID,
        CallType: "trans",
        TimeLimit: 50                   
      })
    );

    return res.json({
      success: true,
      message: "Masked call initiated",
      callSid: response.data.Call?.Sid
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Call failed"
    });
  }
};

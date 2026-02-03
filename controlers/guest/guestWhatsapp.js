

export const testApi = (req, res) => {
  console.log("✅ Test API hit");

  res.json({
    success: true,
    message: "hi",
  });
};

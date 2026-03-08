import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import reviewCardModel from "../../models/scans/reviewCardModel.js";
import { s3 } from "../../config/s3.js";


export const uploadReviewCardLogo = async (req, res) => {
  try {

    const { serialNumber } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file required",
      });
    }

    /* convert to WEBP */

    const processedImage = await sharp(req.file.buffer)
      .resize(600, 600, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${serialNumber}-logo.webp`;

    /* upload to S3 */

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `review-cards/${fileName}`,
      Body: processedImage,
      ContentType: "image/webp",
    });

    await s3.send(uploadCommand);

    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/review-cards/${fileName}`;

    /* update model */

    await reviewCardModel.findOneAndUpdate(
      { serialNumber },
      { logo: fileUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      logo: fileUrl,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};
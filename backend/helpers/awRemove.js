const {
  S3Client,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

const awsRemove = async (img) => {
    try {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: img.photo,
      };
      
      console.log("Delete Parameters:", params);
      
      const command = new DeleteObjectCommand(params);
      const response = await s3.send(command);
      
      console.log("Delete Response:", response);
      return response;  // Ensure the response is returned
    } catch (error) {
    //   console.error("Error deleting object:", error);
    throw new Error(error)
    }
  }

module.exports = awsRemove 
const AWS = require("aws-sdk");
const ck = require('ckey');

AWS.config.update({
  accessKeyId: ck.AWS_ACCESS_KEY,
  secretAccessKey: ck.AWS_SECRET_KEY,
  region: ck.AWS_REGION,
});

const s3 = new AWS.S3();

module.exports = s3;

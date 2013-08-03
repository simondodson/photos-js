var aws = require('aws-sdk');

// Configure AWS
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Export the init function
module.exports = {
    s3: new aws.S3(),
    sqs: new aws.SQS({region: process.env.AWS_REGION}),
    sqsQueueUrl: process.env.AWS_SQS_QUEUE
};

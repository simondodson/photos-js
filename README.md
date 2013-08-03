photos.js
=========

A node.js powered Photo Gallery

![photos-js-screenshot](http://taeram.github.io/media/photos-js-screenshot.png)

Requirements
============

* A [Heroku](https://www.heroku.com/) account
* An [Amazon AWS](http://aws.amazon.com/) account
* Your Amazon AWS Access Key and Secret Key
* An [Amazon S3](http://aws.amazon.com/s3/) bucket, for storing the images
* An [Amazon SQS](http://aws.amazon.com/sqs/) queue, for the thumbnail daemon
* A deployed copy of [thumbd](https://github.com/bcoe/thumbd) (the thumbnail daemon)

### Configuration
Add the MongoDB addon:

```bash
heroku addons:add mongohq:sandbox
```

Login to MongoHQ, and create a collection called "photos".

Configure Heroku:

```bash
heroku config:set AWS_ACCESS_KEY_ID=secret \
                  AWS_SECRET_ACCESS_KEY=secret \
                  AWS_REGION=us-east-1 \
                  AWS_SQS_QUEUE=https://sqs.us-east-1.amazonaws.com/12345/abcdef
                  PLACEHOLDER_IMAGE_URL=https://example.com/placeholder.png \
                  S3_BUCKET_NAME=my-gif-bucket \
                  THUMBNAIL_SUFFIX="thumb" \
                  ADMIN_USERNAME="foo" \
                  ADMIN_PASSWORD="bar" \
                  MAX_UPLOAD_SIZE=10485760 \
                  MONGO_DB_NAME=photos \
                  SESSION_SECRET="super-random-secret"
```

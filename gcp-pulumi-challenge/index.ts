import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as fs from "fs";
import * as mime from "mime";


// STEP 2
// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("mybucket", {
    location: "US"
});

// Make sure bucket is private
// NOOP


// STEP 3
// Create a GCP resource (Storage Bucket)
const staticWebsiteDirectory = "website";

fs.readdirSync(staticWebsiteDirectory).forEach((file) => {
  const filePath = `${staticWebsiteDirectory}/${file}`;
  const fileContent = fs.readFileSync(filePath).toString();

  new gcp.storage.BucketObject(file, {
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset(filePath),
    contentType: mime.getType(filePath) || undefined,
    //acl: aws.s3.PublicReadAcl,
    //acl: gcp.storage.BucketACL()
  });

});

// Export the DNS name of the bucket
export const bucketName = bucket.url;

export const readme = 'startup-in-a-box: Created bucket';

export const bucket;

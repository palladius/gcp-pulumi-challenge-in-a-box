import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("mybucket", {
    location: "US"
});

// Make sure bucket is private
// NOOP

// Export the DNS name of the bucket
export const bucketName = bucket.url;

export const readme = 'startup-in-a-box: Created bucket';

export const bucket;

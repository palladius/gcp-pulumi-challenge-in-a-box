import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as synced_folder from "@pulumi/synced-folder";


//////////////////////////////////////////////////////
// STEP 2 BEGIN
//////////////////////////////////////////////////////

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("mybucket", {
    location: "US"
});

// Create an IAM binding to allow public read access to the bucket.
const bucketIamBinding = new gcp.storage.BucketIAMBinding("bucket-iam-binding", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"],
});
//////////////////////////////////////////////////////
// STEP 2 END
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// STEP 3 BEGIN Working with Local Files
//////////////////////////////////////////////////////

const config = new pulumi.Config();
const path = config.get("path") || "./website";
// Use a synced folder to manage the files of the website.
const syncedFolder = new synced_folder.GoogleCloudFolder("synced-folder", {
    path: path,
    bucketName: bucket.name,
});

//////////////////////////////////////////////////////
// STEP 3 END
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// STEP 4 BEGIN: Enable the storage bucket as a CDN.
//////////////////////////////////////////////////////
// 
const backendBucket = new gcp.compute.BackendBucket("backend-bucket", {
    bucketName: bucket.name,
    enableCdn: true,
});

// Provision a global IP address for the CDN.
const ip = new gcp.compute.GlobalAddress("ip", {});

// Create a URLMap to route requests to the storage bucket.
const urlMap = new gcp.compute.URLMap("url-map", {defaultService: backendBucket.selfLink});

// Create an HTTP proxy to route requests to the URLMap.
const httpProxy = new gcp.compute.TargetHttpProxy("http-proxy", {urlMap: urlMap.selfLink});

// Create a GlobalForwardingRule rule to route requests to the HTTP proxy.
const httpForwardingRule = new gcp.compute.GlobalForwardingRule("http-forwarding-rule", {
    ipAddress: ip.address,
    ipProtocol: "TCP",
    portRange: "80",
    target: httpProxy.selfLink,
});

// Export the URLs and hostnames of the bucket and CDN.
export const originURL = pulumi.interpolate`https://storage.googleapis.com/${bucket.name}/index.html`;
export const originHostname = pulumi.interpolate`storage.googleapis.com/${bucket.name}`;
export const cdnURL = pulumi.interpolate`http://${ip.address}`;
export const cdnHostname = ip.address;



//////////////////////////////////////////////////////
// STEP 4 END
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
// STEP 5 BEGIN
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
// STEP 5 END
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
// STEP 6 BEGIN
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// STEP 6 END
//////////////////////////////////////////////////////



//////////////////////////////////////////////////////
// STEP 7 BEGIN
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// STEP 7 END
//////////////////////////////////////////////////////

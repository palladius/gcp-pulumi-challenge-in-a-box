import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as fs from "fs";
import * as mime from "mime";
import { Config } from "@pulumi/gcp/runtimeconfig";


//////////////////////////////////////////////////////
// STEP 2 BEGIN
//////////////////////////////////////////////////////

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("mybucket", {
    location: "US"
});

// Make sure bucket is private
// NOOP

//////////////////////////////////////////////////////
// STEP 2 END
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// STEP 3 BEGIN Working with Local Files
//////////////////////////////////////////////////////

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

  // ricc: not sure why object gets pseudorandom addon :/
  // note all files will have pseudo-random names, eg:
    // gs://mybucket-830f466/index.html-7c0a60b
    // gs://mybucket-830f466/normalize.css-b568868
    // gs://mybucket-830f466/style.css-c8fa397

    // TODO(): export the names
});

// Export the DNS name of the bucket
export const bucketName = bucket.url;
//export const bucket;

//////////////////////////////////////////////////////
// STEP 3 END
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// STEP 4 BEGIN: Creating a CDN
//////////////////////////////////////////////////////

    // [ricc] Not sure if we need Cloud CDN, I presume what
    // we really want here is a Backend Bucket? As per
    // https://www.pulumi.com/registry/packages/gcp/api-docs/compute/backendbucket/

    // copied this fix from https://github.com/pulumi/pulumi-gcp/issues/675
    const projectCompute = new gcp.projects.Service("compute-api", {
        disableDependentServices: true,
        project: new pulumi.Config('gcp').require("project"),
        service: "compute.googleapis.com",
    });

    const policy = new gcp.compute.SecurityPolicy("policy", {
        description: "basic security policy",
        type: "CLOUD_ARMOR_EDGE",
    });

    // ERROR: requires enabling GCE APIs: gcloud services enable compute.googleapis.com. I believe its a pulumi bug.
    // see above for solution
    const websiteBackend = new gcp.compute.BackendBucket(
        "website-backend", {
            description: "Contains beautiful static files",
            bucketName: bucket.name,
            enableCdn: true,
            edgeSecurityPolicy: policy.id,
    });
    //     defaultRootObject: "index.html",

    export const websiteBackendName = websiteBackend.name;



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



// Addons
// These are not part of the orgiinal but seems googly to add them

export const readme = fs.readFileSync("./Pulumi.README.md").toString();
export const projectId = new pulumi.Config('gcp').require("project");
export const bucketDepuredName = bucket.name // without gs://

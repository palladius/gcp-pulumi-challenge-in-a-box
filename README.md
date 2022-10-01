# gcp-pulumi-challenge-in-a-box

[This repo](https://github.com/palladius/gcp-pulumi-challenge-in-a-box) contains the GCP version of Challenge in a Box (https://www.pulumi.com/challenge/startup-in-a-box/).

Currently *work in progress*. Status:

* ✅ Step 1
* ✅ Step 2
* ✅ Step 3
* ✅ Step 4 (implemented and tested): find them in `index-pre-refactor.ts`
* ✅ Step 5 (refactored in the new `index.ts` + `cdn-website.ts`)
* ❌ Step 6
* ❌ Step 7

## Step 1. Your First Pulumi Program

You will learn how to create a new Pulumi program using our Pulumi templates,
specifically for `GCP` with TypeScript.

Create a new directory called `pulumi-challenge` and run the following inside of it:

    # set up environment
    pulumi new gcp-typescript
    # Set up your project id and possibly the region
    pulumi config set gcp:project gcp-pulumi-challenge-in-a-box # or whatever your porjectid is
    pulumi config set gcp:region europe-west1

## Step 2. Creating Your First Resource

Now that we have a base GCP project configured, we need to create our first resource.
In this instance, we’ll create a new GCS bucket which will allow us to store our static website.
We’ll also ensure that this bucket is private.

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

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
```
## Step 3. Working with Local Files

`TODO(): description`

Code:

```typescript
import * as synced_folder from "@pulumi/synced-folder";

const config = new pulumi.Config();
const path = config.get("path") || "./website";
// Use a synced folder to manage the files of the website.
const syncedFolder = new synced_folder.GoogleCloudFolder("synced-folder", {
    path: path,
    bucketName: bucket.name,
});
```


# Appendix

Similar code which can be used for inspiration:

* https://github.com/jaxxstorm/pulumi-gcp-workshop (found in Lee Briggs [video](https://www.pulumi.com/resources/getting-started-with-google-cloud-platform/))
* static-website-gcp-typescript [code](https://github.com/pulumi/templates/blob/master/static-website-gcp-typescript/index.ts)

Self: https://github.com/palladius/gcp-pulumi-challenge-in-a-box

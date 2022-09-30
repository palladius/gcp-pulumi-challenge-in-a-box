# gcp-pulumi-challenge-in-a-box

[This repo](https://github.com/palladius/gcp-pulumi-challenge-in-a-box) contains the GCP version of Challenge in a Box (https://www.pulumi.com/challenge/startup-in-a-box/).

Currently *work in progress*. Status:

* ✅ Step 1
* ✅ Step 2
* ✅ Step 3
* ✅ Step 4 (implemented and tested)
* ❌ Step 5
* ❌ Step 6
* ❌ Step 7

## Step 1. Your First Pulumi Program

You will learn how to create a new Pulumi program using our Pulumi templates,
specifically for `GCP` with TypeScript.

Create a new directory called `pulumi-challenge` and run the following inside of it:

    pulumi new gcp-typescript

## Step 2. Creating Your First Resource

Now that we have a base GCP project configured, we need to create our first resource.
In this instance, we’ll create a new GCS bucket which will allow us to store our static website.
We’ll also ensure that this bucket is private.

    // creae bucket
    const bucket = new gcp.storage.Bucket("my-public-bucket", {
        location: "US"
    });
    // make it public
    const publicRule = new gcp.storage.BucketAccessControl("publicRule", {
        bucket: bucket.name,
        role: "READER",
        entity: "allUsers",
    });

## Step 3. TODO





# Appendix

Similar code which can be used for inspiration:

* https://github.com/jaxxstorm/pulumi-gcp-workshop (found in Lee Briggs [video](https://www.pulumi.com/resources/getting-started-with-google-cloud-platform/))
* static-website-gcp-typescript [code](https://github.com/pulumi/templates/blob/master/static-website-gcp-typescript/index.ts)

Self: https://github.com/palladius/gcp-pulumi-challenge-in-a-box

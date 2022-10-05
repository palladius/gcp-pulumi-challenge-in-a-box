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


## Startup in a Box

Thinking about turning that side project into a little something more? Follow along to stand up a website for your startup on Google Cloud Storage with GCP Load Balancer and Checkly, all using Pulumi. When you're done, we'll send you a fancy drink tumbler with a special Pulumipus on it, just for this Challenge!

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
Pulumi lets you use your favourite programming language to define your infrastructure. 
From GCP we can use a synced folder to manage the files of the website.

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
We need our actual website too, though. Create a directory called website at `pulumi-challenge/website`, and inside it, add `index.html`, `style.css`, and `normalize.css`.

For `index.html`, we have the structure of a simple website, with places to put links to your project’s GitHub and Twitter, as well as your LinkedIn:
```html
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Pulumi Challenge</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="normalize.css">
    </head>
    <body>
    <header>
        <!-- The logo here is pulled from FontAwesome. Replace it with your own if you like! -->
        <div class="logo">
        <ul>
        <li><i class="fas fa-feather"></i></li>
        <li><p>Company Name</p></li>
        </ul>
        </div>
        <ul class="social">
        <!-- Add your GitHub and social links here! -->
                    <li><a href="http://github.com/" target="_blank"><i class="fab fa-github-alt"></i></a></li>
                    <li><a href="http://twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a></li>
                    <li><a href="http://linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a></li>
                </ul>
    </header>
    <div class="banner">
    <!-- Fill in the blanks for your startup's pitch! -->
        <h1>Your Startup Name Here</h1>
        <h3>Your Tagline</h3>
        <p>We're $CompanyName, and we're changing what it means to $Task. Our innovative use of $Technology makes life easier for $JobTitles, so they can focus on what they're really good at instead of wasting time and effort on $MenialOrDifficultTask. Streamline your $TaskProcess with $Product and take to the skies!</p>
    </div>
    </body>
    <script src="https://kit.fontawesome.com/b4747495ea.js" crossorigin="anonymous"></script>
    </html>
```
Both `style.css` and `normalize.css` files can be copied from our [GitHub](https://github.com/palladius/gcp-pulumi-challenge-in-a-box/tree/main/gcp-pulumi-challenge/website) CHANGE TO FINAL GITHUB PAGE (PSO PUBLIC?)

## Step 4. Creating a CDN
TODO(): description

# Appendix

Similar code which can be used for inspiration:

* https://github.com/jaxxstorm/pulumi-gcp-workshop (found in Lee Briggs [video](https://www.pulumi.com/resources/getting-started-with-google-cloud-platform/))
* static-website-gcp-typescript [code](https://github.com/pulumi/templates/blob/master/static-website-gcp-typescript/index.ts)

Self: https://github.com/palladius/gcp-pulumi-challenge-in-a-box

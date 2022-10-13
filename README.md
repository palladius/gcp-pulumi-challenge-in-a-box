# gcp-pulumi-challenge-in-a-box

[This repo](https://github.com/palladius/gcp-pulumi-challenge-in-a-box) contains the GCP version of Challenge in a Box (https://www.pulumi.com/challenge/startup-in-a-box/).

Currently *work in progress*. Status:

* ✅ Step 1
* ✅ Step 2
* ✅ Step 3
* ✅ Step 4 (implemented and tested): find them in `index-pre-refactor.ts`
* ✅ Step 5 (refactored in the new `index.ts` + `cdn-website.ts`)
* ✅ Step 6
* ✅ Step 7


## Startup in a Box

Thinking about turning that side project into a little something more? Follow along to set up a website for your startup on Google Cloud Storage behind a Google Cloud Load Balancer and Checkly, all using Pulumi. When you're done, we'll send you a fancy drink tumbler with a special Pulumipus on it, just for this Challenge!

## Step 1. Your First Pulumi Program

You will learn how to create a new Pulumi program using our Pulumi templates,
specifically for `GCP` with TypeScript.

Create a new directory called `pulumi-challenge` and run the following inside of it:
```cli
    # create the directory
    mkdir -p pulumi-challenge && cd pulumi-challenge

    # set up environment
    pulumi new gcp-typescript

    # Set up your project id and possibly the region. For example:
    pulumi config set gcp:project `gcp-pulumi-challenge-in-a-box` 
    pulumi config set gcp:region europe-west1
```

## Step 2. Creating Your First Resource

Now that we have a base GCP project configured, we need to create our first resource.
In this instance, we’ll create a new GCS bucket which will allow us to store our static website.

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Create a GCP resource (Storage Bucket) and configure it to host static web assets.
const bucket = new gcp.storage.Bucket("mybucket", {
    location: "US"
    website: {
      mainPageSuffix: "index.html",
    },
});

// Create an IAM binding to allow public read access to the bucket.
const bucketIamBinding = new gcp.storage.BucketIAMBinding("bucket-iam-binding", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"],
});
```
## Step 3. Working with Local Files
Pulumi lets you use your favourite programming language to define your infrastructure. Today, we’re using TypeScript, which means we have access to the Node API. This includes discovering directories and files.
From GCP we can use a synced folder to manage the files of the website.

We need to add the synced-folder package from npm, to easiyl upload files to the Cloud Storage Bucket.

```cli
npm install @pulumi/synced-folder
```

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
Next, we want to front our Cloud Storage Bucket with a Load Balancer and enable its CDN capabilities. 

```typescript
// Configure the storage bucket as a backend bucket for load balancing.
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
```
## Step 5. Introducing Component Resources
Now… we can continue to add resource after resource, but Pulumi is more than that. We can build our own reusable components. Let’s refactor what we have above into a CdnWebsite component at [gcp-pulumi-challenge/cdn-website.ts](./gcp-pulumi-challenge/cdn-website.ts)
```typescript
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as synced_folder from "@pulumi/synced-folder";

export class CdnWebsite extends pulumi.ComponentResource {
    private bucket: gcp.storage.Bucket;
    private backendBucket: gcp.compute.BackendBucket;
    private ip: gcp.compute.GlobalAddress;
    private httpForwardingRule: gcp.compute.GlobalForwardingRule;

    constructor(name: string, args: any, opts?: pulumi.ComponentResourceOptions) {
        super("pulumi:challenge:CdnWebsite", name, args, opts);

        this.bucket = new gcp.storage.Bucket("mybucket", {
            location: "US"
        });

        const bucketIamBinding = new gcp.storage.BucketIAMBinding("bucket-iam-binding", {
            bucket: this.bucket.name,
            role: "roles/storage.objectViewer",
            members: ["allUsers"],
        });

        const config = new pulumi.Config();
        const path = config.get("path") || "./website";

        const syncedFolder = new synced_folder.GoogleCloudFolder("synced-folder", {
            path: path,
            bucketName: this.bucket.name,
        });

        // Configure the storage bucket as a backend bucket for load balancing.
        this.backendBucket = new gcp.compute.BackendBucket("backend-bucket", {
            bucketName: this.bucket.name,
            enableCdn: true,
        });

        // CDN Configuration
        this.ip = new gcp.compute.GlobalAddress("ip", {});
        const urlMap = new gcp.compute.URLMap("url-map", { defaultService: this.backendBucket.selfLink });
        const httpProxy = new gcp.compute.TargetHttpProxy("http-proxy", { urlMap: urlMap.selfLink });

        this.httpForwardingRule = new gcp.compute.GlobalForwardingRule("http-forwarding-rule", {
            ipAddress: this.ip.address,
            ipProtocol: "TCP",
            portRange: "80",
            target: httpProxy.selfLink,
        });

        // We also need to register all the expected outputs for this
        // component resource that will get returned by default.
        this.registerOutputs({
            bucketName: this.bucket.id,
            cdnUrl: pulumi.interpolate`http://${this.ip.address}`
        });
    }

    get url(): pulumi.Output<string> {
        return pulumi.interpolate`http://${this.ip.address}`;
    }
}
```

Now we can consume this! Awesome. Back in [gcp-pulumi-challenge/index.ts](./gcp-pulumi-challenge/index.ts), we now have this:
```typescript
// Deploy Website to Google Cloud Storage with CDN
// Also shows the challenger how to build a ComponentResource.
import { CdnWebsite } from "./cdn-website";

const website = new CdnWebsite("your-startup", {});
export const cdnUrl = website.url;
```

## Step 6. Adding Another Provider
Now that we have our website being delivered as fast as possible via our CdnWebsite component and Cloud CDN, how do we know that what we’ve deployed actually works? We could leverage a fantastic service, such as [Checkly](https://www.checklyhq.com/), to ensure our website passes some sanity checks.


First, we need to add a new provider:
```cli
npm install @checkly/pulumi

# API KEY: https://app.checklyhq.com/settings/account/api-keys
pulumi config set checkly:apiKey --secret

# AccountID: https://app.checklyhq.com/settings/account/general
pulumi config set checkly:accountId
```
Next, we can use this in our code.

```typescript
import * as checkly from "@checkly/pulumi";
import * as fs from "fs";

new checkly.Check("index-page", {
  activated: true,
  frequency: 10,
  type: "BROWSER",
   // Change to your region if it's not eu-west-2
  locations: ["eu-west-2"],
  script: websiteUrl.apply((url) =>
    fs
      .readFileSync("checkly-embed.js")
      .toString("utf8")
      .replace("{{websiteUrl}}", url)
  ),
});
```
You’ll notice we use fs.readFileSync from fs. That’s because we’re keeping our Checkly code, which is also Node based, inside its own file where it can get good auto-completion and syntax highlighting, rather than storing as a string object within our existing code. Neat, huh? Add the following to [gcp-pulumi-challenge/checkly-embed.js](./gcp-pulumi-challenge/checkly-embed.js):

```typescript
const playwright = require("playwright");
const expect = require("expect");

const browser = await playwright.chromium.launch();
const page = await browser.newPage();

await page.goto("https://{{websiteUrl}}");
expect(await page.title()).toBe("Pulumi Challenge");

await browser.close();
```

## Step 7. Introducing the Dynamic Swag Provider
Everyone likes SWAG and we want to give you some for completing this challenge. To do so, we’re going to handle this via Pulumi with a Dynamic Provider. Create a new directory and file at [gcp-pulumi-challenge/swag-provider/index.ts](./gcp-pulumi-challenge/swag-provider/index.ts):

For this dynamic provider, we can only use CommonJS modules. For making an HTTP request, we can use got version 11.8.0:
```typescript
npm install got@11.8.0
```

```typescript
import * as pulumi from "@pulumi/pulumi";

const submittionUrl: string =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/apptZjyaJx5J2BVri/wflmg3riOP6fPjCII/wtr3RoDcz3mTizw3C";

interface SwagInputs {
  name: string;
  email: string;
  address: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
}

interface SwagCreateResponse {
  success: boolean;
}

interface SwagOutputs extends SwagInputs {
  id: string;
}

class SwagProvider implements pulumi.dynamic.ResourceProvider {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async create(props: SwagInputs): Promise<pulumi.dynamic.CreateResult> {
    const got = (await import("got")).default;

    let data = await got
      .post(submittionUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        json: {
          ...props,
        },
      })
      .json<SwagCreateResponse>();

    return { id: props.email, outs: props };
  }
}

export class Swag extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    props: SwagInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(new SwagProvider(name), name, props, opts);
  }
}
```

Now, add this final block to [gcp-pulumi-challenge/index.ts](./gcp-pulumi-challenge/index.ts) and run pulumi up. Enjoy your SWAG!

```typescript
import { Swag } from "./swag-provider";

const swag = new Swag("your-startup", {
  name: "YOUR NAME",
  email: "YOUR EMAIL",
  address: "YOUR ADDRESS",
  // Change to your size, such as "S" or "M"
  size: SIZE,
});
```

Congratulations! You completed the first Pulumi Challenge. If you’d like to tear down all of these resources, run pulumi destroy. Otherwise, enjoy the new website! Change it around and make it your own. Your swag will be in the mail shortly!

Wanna yell it from the rooftops? Write a blog or post a quick video about it? Let us know and we’ll send you an extra, super secret piece of swag! Tag us on social media, or email us at da@pulumi.com.

# Appendix

Similar code which can be used for inspiration:

* https://github.com/jaxxstorm/pulumi-gcp-workshop (found in Lee Briggs [video](https://www.pulumi.com/resources/getting-started-with-google-cloud-platform/))
* static-website-gcp-typescript [code](https://github.com/pulumi/templates/blob/master/static-website-gcp-typescript/index.ts)

Self: https://github.com/palladius/gcp-pulumi-challenge-in-a-box

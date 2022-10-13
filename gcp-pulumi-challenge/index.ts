// Deploy Website to Google Cloud Storage with CDN
// Also shows the challenger how to build a ComponentResource.
import { CdnWebsite } from "./cdn-website";

const website = new CdnWebsite("your-startup", {});
export const cdnUrl = website.url;

// Monitoring with Checkly
// Demonstrates Standard Package usage
import * as checkly from "@checkly/pulumi";
import * as fs from "fs";

new checkly.Check("index-page", {
  activated: true,
  frequency: 10,
  type: "BROWSER",
  // Change to your region if it's not eu-west-2
  locations: ["eu-west-2"],
  script: cdnUrl.apply((url) =>
    fs
      .readFileSync("checkly-embed.js")
      .toString("utf8")
      .replace("{{websiteUrl}}", url)
  ),
});


// Introducing the Dynamic Swag Provider
import { Swag } from "./swag-provider";

const swag = new Swag("your-startup", {
  name: "YOUR NAME",
  email: "YOUR EMAIL",
  address: "YOUR ADDRESS",
  // Change to your size, such as "S" or "M"
  size: SIZE,
});

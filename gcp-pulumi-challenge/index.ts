// Deploy Website to Google Cloud Storage with CDN
// Also shows the challenger how to build a ComponentResource.
import { CdnWebsite } from "./cdn-website";

const website = new CdnWebsite("your-startup", {});
export const cdnUrl = website.url;

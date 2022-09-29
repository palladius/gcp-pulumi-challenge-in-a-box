import * as fs from "fs";
import * as mime from "mime";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

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

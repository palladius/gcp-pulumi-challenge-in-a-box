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

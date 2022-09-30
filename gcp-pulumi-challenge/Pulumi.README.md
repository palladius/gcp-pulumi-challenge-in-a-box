# Stack README
Config:

* ProjectId: **${outputs.projectId}**.

Created resources:

* Bucket:  **${outputs.bucketName}**
* CDN BucketBE: **${outputs.websiteBackendName}**. This needs a LB to work with it.
* FwdRule with our Public Website: **http://${outputs.fwdrulePublicIp}/index.html** (it works!)

Cloud console URLs for lazy folks like Riccardo:

* CDN: https://console.cloud.google.com/net-services/cdn/list?project=${outputs.projectId}
* Bucket Listing: https://console.cloud.google.com/storage/browser/${outputs.bucketDepuredName}
* Public IP: http://${outputs.websitePublicIpAddress}/ (useless)
* Roberto's LB Component View: https://console.cloud.google.com/net-services/loadbalancing/advanced/forwardingRules/list?project=${outputs.projectId}

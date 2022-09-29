# Stack README
Config:

* ProjectId: **${outputs.projectId}**.

Created resources:

* Bucket:  **${outputs.bucketName}**
* CDN BucketBE: **${outputs.websiteBackendName}**. This works but probably would need a LB to work with it.

Cloud console URLs for lazy folks like Riccardo:

* CDN: https://console.cloud.google.com/net-services/cdn/list?project=${outputs.projectId}
* Bucket Listing: https://console.cloud.google.com/storage/browser/${outputs.bucketDepuredName}
* Public IP: http://${outputs.websitePublicIpAddress}/ (useless)
<<<<<<< HEAD
* FwdRule: http://${outputs.fwdrulePublicIp}/website/index.html (it works!),
  or maybe without websites/ : http://${outputs.fwdrulePublicIp}/index.html
* Roberto's LB Component View: https://console.cloud.google.com/net-services/loadbalancing/advanced/forwardingRules/list?project=${outputs.projectId}
=======
* FwdRulwe: http://${outputs.fwdrulePublicIp}/index.html (it works!)
>>>>>>> ce6573d (works)

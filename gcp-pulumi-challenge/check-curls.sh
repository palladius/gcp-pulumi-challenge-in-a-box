
	echo FWDRULE IP: `pulumi stack output fwdrulePublicIp`
FWDRULE_IP=$(pulumi stack output fwdrulePublicIp)

set -x

curl -s https://$FWDRULE_IP/index.html
curl -s https://$FWDRULE_IP/website/index.html
curl -s http://$FWDRULE_IP/index.html
curl -s http://$FWDRULE_IP/website/index.html

echo Done.

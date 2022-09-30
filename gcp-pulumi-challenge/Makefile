init:
	pulumi stack select dev

up:
	pulumi up --yes

lookup-gcs-files:
	gsutil ls `pulumi stack output bucketName`

# TODO
#lint:
#	npm run lint

curls:
	./check-curls.sh


down:
# this takes a lot of time but finds the discrepancy between State and Reality.
	time pulumi refresh
	pulumi destroy
#echo Also try: pulumi destroy --target-dependents --yes --skip-preview --disable-integrity-checking

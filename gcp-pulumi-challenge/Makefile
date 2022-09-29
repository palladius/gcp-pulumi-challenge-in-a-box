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



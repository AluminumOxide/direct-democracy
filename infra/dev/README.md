# Local Development Mode

## Location
```
cd infra/dev
```

## Pre-reqs
You should have installed:
- [nodejs](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [docker](https://docs.docker.com/engine/install/)
- [terraform](https://developer.hashicorp.com/terraform/install)


## Initialize
If it's your first time running this:
```
sudo ./init_build.sh
terraform init
```

## Run
To run dev mode:
```
terraform apply
```
To list containers:
```
docker ps
```


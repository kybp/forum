# Forum

This project implements a discussion platform where users can create
accounts and post threads with replies. It also supports a default
author whose posts are the only ones that will show on the index for
unauthenticated users, allowing it to double as a blog. It primarily
consists of a Django API and a Nuxt 3 SPA with server-side rendering.

There is Terraform code for provisioning resources and a GitHub
Actions pipeline for deploying whenever things are merged to main. The
deploy requires AWS, Cloudflare, and Grafana accounts.

## Setup

To run the app, all you need is a recent version of
[Docker](https://docs.docker.com/get-docker/).

For development, you will also need:
- [Terraform](https://www.terraform.io/)
- [mkcert](https://github.com/FiloSottile/mkcert)

To set up, first copy `.env.example` into a file named `.env`. The
default settings should work, but take a peek in the file and see if
you want to change anything.

Next, do `./run migrate`. This will set up the DB and build necessary
Docker images.

## Running

To start the app in dev mode, just do `./run`. This will enable
debugging features and will automatically reload code on save. By
default, the site will be available at
[http://localhost:3000](http://localhost:3000).

You can also test out a production build by setting the environment
variable `PREVIEW` to a non-empty string. Then you will need to
restart the app, and a production build preview will be available at
[https://localhost](https://localhost).

If you get an error like `/docker-entrypoint.sh: exec: line 47: npm:
not found`, you're probably trying to run a command like `./run lint`
which requires development dependencies against production preview
images. Do `./run restart` to pick up your current `$PREVIEW` setting.

The `run` script packages the most common project operations; see the
bottom of the script for the full list of commands.

### e2e Specs

You have two choices for running the e2e specs:

- `./run e2e`: This runs the tests entirely inside of Docker in
  headless mode.
- `./run debug-e2e`: This runs the test locally with a graphical
  debugger and a browser window you can interact with. It will install
  dependencies in a virtual environment automatically. **Note**: You
  need Python installed locally to use this.

Both commands forward any arguments to `pytest` with the Playwright
plugin installed, which supports many options. Most importantly, you
can pass a filename to run that file, or `-k foo` to run tests whose
names contain `foo`. Run with `--help` to see a full list.

If you want to bail on a test run, close the browser before the
inspector, or Playwright might not exit properly. Or just control-C it
from the terminal.

## Directory Structure

The project is split up into the following directories:
- `frontend/`: This directory contains a Nuxt app that serves the web
  UI with server-side rendering.
- `backend/`: This directory contains a Django app that implements the
  REST API that the frontend relies on.
- `e2e/`: This directory contains the end-to-end tests that use
  Playwright to use the site as a user would and ensure everything
  works.
- `infra/`: This directory contains the Terraform code for
  provisioning servers, databases, etc to host the app in production.
- `nginx/`: This directory contains the configuration for Nginx, which
  is used in production to proxy requests to the frontend and backend
  servers.
- `certbot/`: This directory contains the SSL certificates for the
  site. You probably won't need to go in here, but it needs to exist.

## GitHub Configuration

If you put this project on GitHub, you will need to add the following
repository secrets in order for the GitHub Actions workflows to work:
- `DOMAIN`: The domain the site will be hosted at (this is compiled
  into the production images)
- `DOCKERHUB_USERNAME`: The username for the DockerHub account where
  these images will be hosted
- `DOCKERHUB_TOKEN`: An API token for the DockerHub account where
  these images will be hosted

You will need the following for prod deployments (see below for more
details on provisioning):
- `PRIMARY_EMAIL`: The email to use for the primary author. This
  author's threads are the only ones logged-out users will see.
- `SQL_DATABASE`: The name of the database to connect to. This is a
  Terraform variable you can configure; it defaults to forum_prod.
- `SQL_USER`: The database user. This is a Terraform variable you can
  configure; it defaults to postgres.
- `SQL_PASSWORD`: The database password for `SQL_USER`. You need to
  come up with this and will be asked to input it when you work with
  provisioning.
- `SQL_HOST`: The host the database can be reached at. This is
  generated during `terraform apply`; you will see it in the output at
  the end.
- `SQL_PORT`: The port the database can be reached on. This is a
  variable you can configure in Terraform, but it will also be output
  to the console after running `terraform apply`.
- `PROD_IP`: A host that we can use to SSH into the production server.
- `PROD_USERNAME`: The username of our account on the production
  server. Defaults to `ubuntu`.
- `PROD_SSH_KEY`: An SSH key we can use to authenticate with the
  production server. This is generated by Terraform, and will be
  available in `infra/ec2-ssh-key` after provisioning.
- `OTLP_HOST`: The host of a site we can send OpenTelemetry data
  to. You can get this from the `terraform apply` output.
- `OTLP_TOKEN`: The token we can use to authenticate when sending
  OpenTelemetry data. This is generated after `terraform apply`, but
  as it's sensitive, you will need to do `terraform output
  grafana_otlp_token` to get a value.
- `AWS_S3_REGION_NAME`: The AWS region to use. This is configurable in
  Terraform and is available as an output.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Credentials for
  accessing your AWS account.
- `AWS_S3_BUCKET_NAME`: The name of the S3 bucket where image uploads
  are stored. This is generated by Terraform and available as an
  output.
- `AWS_CLOUDFRONT_DOMAIN`: The domain name of the CloudFront
  distribution where the S3 bucket that our image uploads are stored
  in can be found. This is generated by Terraform and is available as
  an output.

## Production provisioning and deployment

To provision resources for a prod deploy you will need:
- an AWS account set up and configured for CLI use on your computer
- a Cloudflare account, and an API token in an exported
  `$CLOUDFLARE_API_TOKEN` environment variable
- a Grafana Cloud account, and a token for an access policy with the
  following permissions:
  - `stacks:read`
  - `stacks:write`
  - `stacks:delete`
  - `metrics:write`
  - `logs:write`
  - `traces:write`
  - `profiles:write`

With all that, `cd` into the `infra` directory and run `terraform
init`, then `terraform plan` to preview what will be set up. If you're
okay with the changes, run `terraform apply` to apply them.

If all the resources are created successfully, some values will be
displayed that you need to store in GitHub repository secrets. See the
GitHub configuration section for details.

### Connecting to the production server

The file `infra/ec2-ssh-key` will be generated for use SSHing into the
server. You can SSH in (from the `infra/` directory) with
`ssh -i ec2-ssh-key ubuntu@example.com`.

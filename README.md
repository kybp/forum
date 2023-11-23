# Forum

## Setup

To run the app, all you need is a recent version of Docker. If you
want to use the production build preview, you'll also need
[mkcert](https://github.com/FiloSottile/mkcert).

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

You have two choices for running the e2e specs.

If you want to run them inside Docker (note that the graphical
debugger will not work), change `VITE_API_HOST` in your `.env` file
according to the comments, restart the app to pick up the changes if
you had it running, and then do `./run e2e`.

If you want to use the graphical debugger, you will need to install
Python v3.8+ locally. Then you can `./run install-local-e2e` to
install the e2e project in a virtual environment, and from there
`./run debug-e2e` will run the tests. You do not need to change your
`.env` file from normal development settings to run the specs this
way.

Both `./run e2e` and `./run debug-e2e` forward arguments to `pytest`
with the Playwright plugin installed, which supports many options. Run
with `--help` to see a full list.

If you want to bail on a test run, close the browser before the
inspector, or Playwright might not exit properly.

## GitHub Configuration

If you put this project on GitHub, you will need to set
`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` as repository secrets for
the GitHub Actions pipeline to work.

## Production provisioning and deployment

To provision resources for a prod deploy you will need:
- an AWS account set up and configured for CLI use on your computer
- a Cloudflare account, and an API token in an exported
  `$CLOUDFLARE_API_TOKEN` environment variable
- Terraform installed

With all that, `cd` into the `infra` directory and run `terraform
init`, then `terraform plan` to preview what will be set up. If you're
okay with the changes, run `terraform apply` to apply them.

If all the resources are created successfully, some values will be
displayed that you need to store in GitHub repository secrets. See the
GitHub configuration section for details.

The file `infra/ec2-ssh-key` will also be generated for use SSHing
into the server. You can SSH in (from the `infra/` directory) with
`ssh -i ec2-ssh-key ubuntu@example.com`.

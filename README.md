# Forum

## Setup

To run the app, all you need is a recent version of Docker.

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

You can also test out a production build with `./run preview`. The
production preview will be available at
[http://localhost:8000](http://localhost:8000). Dev and prod builds
will step on each other's toes, so you'll need to do `./run stop`
first if you have a dev build running.

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

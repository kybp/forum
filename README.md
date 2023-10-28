# Forum

## Running

To run the app, all you need is a recent version of Docker.

To set up, first copy `.env.example` into a file named `.env`. The
default settings should work, but take a peek in the file and see if
you want to change anything.

The included `run` script wraps docker commands for common tasks. To
spin up the app in dev mode, just do `./run`. See the bottom of the
`run` script for other commands.

The first time you run the app, you will also need to `./run migrate`
in order to set up the database.

### e2e Specs

If you only want to run the e2e specs, `./run e2e` will work. This
calls out to `pytest` and supports many options; `./run e2e --help` to
see them.

You can also run the tests with a graphical inspector, but this
doesn't work when running inside Docker Desktop, so you will need to
install Python v3.8+ locally. Then you can `./run install-local-e2e`
to install the e2e project in a virtual environment.

After this, change `VITE_API_HOST` in your `.env` according to the
instructions. Remember to change it back and restart the app if you
want to run the tests inside Docker.

Finally, you should be able to `./run debug-e2e`.

If you want to bail on a run, close the browser before the inspector,
or Playwright might not exit properly.

## GitHub Configuration

If you put this project on GitHub, you will need to set
`DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` as repository secrets.

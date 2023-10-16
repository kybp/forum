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

If you only want to run the e2e specs, `./run e2e` will work. Running
them with a headed browser and graphical inspector doesn't work with
Docker Desktop, so for development, you should install it
locally. This requires Python v3.8+. Then, to install locally:

```sh
python -m venv env
. env/bin/activate
python -m pip install -r e2e/requirements.txt
playwright install
```

After this, you can run the tests with the inspector by `cd`ing into
the `e2e` directory and running `PWDEBUG=1 python -m pytest` (omit the
environment variable to run them headless).

If you want to bail on a run, close the browser before the inspector,
or Playwright might not exit properly.

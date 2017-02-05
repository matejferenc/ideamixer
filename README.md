# ideamixer

1. Prerequisities:
 a. Node.js installed
 b. npm installed
 c. MongoDB installed and RUNNING!

2. Preparation
 a. database setup: go to /scripts and run `node txt2db.js`. This script does not end gracefully, so you need to kill it by Ctrl+C
 b. compilation of dependencies in backend: go to / and run `npm install`
 c. compilation of dependencies in frontend: go to /xsicht and run `npm install`

3. Running backend
 a. execute the file `start.bat` or `debug.bat` (if you are using linux, you are smart enough to manage)
 b. verify that server is running by going to `localhost:8880` or `localhost:8880/idea/generate`
 c. frontend was not built yet, so no UI will be visible

4. Running frontend
 a. go to /xsicht and run `npm run build` and wait for completion
 b. go to `localhost:8880`. You should see frontend working properly
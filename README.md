### Gulp ###

This project uses Gulp. The following commands are available:

| Task        | What it does
| ------------- |-------------|
| `watch` | watches for file changes in KIT, SASS and JavaScript files and compiles them to _config.mode_ destination |
| `build:frontend` | runs all the required tasks to get a proper frontend build |
| `build:backend` | the same task as the frontend, but doesn't compile KIT files and uses _config.mode = backend_ |

### Contribution guidelines ###

* All code comments in English (US)
* For every new feature/change, create a new branch (Git Flow!)
* Never develop in the master-branch!
* Use 4 spaces instead of tabs
* End each file with a newline

### Further reading ###

* http://nvie.com/posts/a-successful-git-branching-model/
* http://stackoverflow.com/questions/729692/why-should-files-end-with-a-newline
# Git Branches - Semantic Release

[![Latest Release](https://img.shields.io/github/release/byCedric/semantic-release-git-branches/all.svg?style=flat-square)](https://github.com/byCedric/semantic-release-git-branches/releases)
[![Build Status](https://img.shields.io/travis/com/byCedric/semantic-release-git-branches/master.svg?style=flat-square)](https://travis-ci.com/byCedric/semantic-release-git-branches)
[![Codecov coverage](https://img.shields.io/codecov/c/github/byCedric/semantic-release-git-branches.svg?style=flat-square)](https://codecov.io/gh/byCedric/semantic-release-git-branches)
[![Code Climate grade](https://img.shields.io/codeclimate/maintainability/byCedric/semantic-release-git-branches.svg?style=flat-square)](https://codeclimate.com/github/byCedric/semantic-release-git-branches)

A fork of [`@semantic-release/git`](https://github.com/semantic-release/git) which uses the [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) approach for releases.

## verifyConditions

Verify the access to the remote Git repository, the commit `message` format and the `assets` option configuration.

## prepare

Create a release commit, including configurable files.

## Configuration

## Environment variables

| Variable              | Description                                                                                                                                                              | Default                              |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `GIT_AUTHOR_NAME`     | The author name associated with the release commit. See [Git environment variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables#_committing).     | @semantic-release-bot.               |
| `GIT_AUTHOR_EMAIL`    | The author email associated with the release commit. See [Git environment variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables#_committing).    | @semantic-release-bot email address. |
| `GIT_COMMITTER_NAME`  | The committer name associated with the release commit. See [Git environment variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables#_committing).  | @semantic-release-bot.               |
| `GIT_COMMITTER_EMAIL` | The committer email associated with the release commit. See [Git environment variables](https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables#_committing). | @semantic-release-bot email address. |

### Options

| Options        | Description                                                    | Default                                                                        |
| -------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------|
| `message`      | The message for the release commit. See [message](#message).   | `chore: create new release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}`     |
| `assets`       | Files to include in the release commit. See [assets](#assets). | `['CHANGELOG.md', 'package.json', 'package-lock.json', 'npm-shrinkwrap.json']` |
| `branchName`   | The name of the release branch.                                | `release/${nextRelease.version}`                                               |
| `branchPush`   | If the release branch should be pushed to remote.              | `false`                                                                        |
| `branchMerges` | All branches that will receive a release branch merge.         | `[branch]`                                                                     |

#### `message`

The message for the release commit is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter     | Description                                                                         |
|---------------|-------------------------------------------------------------------------------------|
| `branch`      | The branch from which the release is done.                                          |
| `lastRelease` | `Object` with `version`, `gitTag` and `gitHead` of the last release.                |
| `nextRelease` | `Object` with `version`, `gitTag`, `gitHead` and `notes` of the release being done. |

It is recommended to include `[skip ci]` in the commit message to not trigger a new build.
**Note**: Some CI service support the `[skip ci]` keyword only in the subject of the message.

##### `message` examples

The `message` `Release ${nextRelease.version} - ${new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })} [skip ci]\n\n${nextRelease.notes}` will generate the commit message:

> Release v1.0.0 - Oct. 21, 2015 1:24 AM \[skip ci\]<br><br>## 1.0.0<br><br>### Features<br>* Generate 1.21 gigawatts of electricity<br>...

#### `assets`

Can be an `Array` or a single entry. Each entry can be either:
- a [glob](https://github.com/micromatch/micromatch#matching-features)
- or an `Object` with a `path` property containing a [glob](https://github.com/micromatch/micromatch#matching-features).

Each entry in the `assets` `Array` is globbed individually. A [glob](https://github.com/micromatch/micromatch#matching-features) can be a `String` (`"dist/**/*.js"` or `"dist/mylib.js"`) or an `Array` of `String`s that will be globbed together (`["dist/**", "!**/*.css"]`).

If a directory is configured, all the files under this directory and its children will be included.

If a file has a match in `.gitignore` it will always be excluded.

##### `assets` examples

`'dist/*.js'`: include all `js` files in the `dist` directory, but not in its sub-directories.

`'dist/**/*.js'`: include all `js` files in the `dist` directory and its sub-directories.

`[['dist', '!**/*.css']]`: include all files in the `dist` directory and its sub-directories excluding the `css` files.

`[['dist', '!**/*.css'], 'package.json']`: include `package.json` and all files in the `dist` directory and its sub-directories excluding the `css` files.

`[['dist/**/*.{js,css}', '!**/*.min.*']]`: include all `js` and `css` files in the `dist` directory and its sub-directories excluding the minified version.

### Usage

Options can be set within the plugin definition in the Semantic-release configuration file:

```json
{
  "release": {
    "prepare": [
      "@semantic-release/npm",
      {
        "path": "semantic-release-git-branches",
        "assets": ["package.json", "dist/**/*.{js|css}", "docs"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "publish": ["@semantic-release/github"]
  }
}
```

When using with the [changelog](https://github.com/semantic-release/changelog) or [npm](https://github.com/semantic-release/npm) plugins:
- The [changelog](https://github.com/semantic-release/changelog) plugin must be called first in order to update the changelog file so the [gitflow](https://github.com/bycedric/semantic-release-git-branches) and [npm](https://github.com/semantic-release/npm) plugin can include it in the release.
- The [npm](https://github.com/semantic-release/npm) plugin must be called second in order to update the `package.json` file so the [gitflow](https://github.com/bycedric/semantic-release-git-branches) plugin can include it in the release commit.

To use with the [changelog](https://github.com/semantic-release/changelog) and [npm](https://github.com/semantic-release/npm) plugins:

```json
{
  "release": {
    "verifyConditions": ["@semantic-release/changelog", "@semantic-release/npm", "semantic-release-git-branches"],
    "prepare": ["@semantic-release/changelog", "@semantic-release/npm", "semantic-release-git-branches"]
  }
}
```

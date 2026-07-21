# Release Process

- Close all issues for planned release
- Checkout and pull `main` branch in git from origin
- Run `npm version <semver-pre-release, e.g., 1.6.0-alpha>` (Update in package.json to be a semver pre-release, then commit, tag with semver pre-release and auto run `git push && git push --tags`)
  - Triggers CI build from tag to call `npm run buildAll && npm publish --access public` (Publish npm package to npmjs.com)
- Verify pre-released package
- Run `npm version <semver-release, e.g., 1.6.0>` (Update in package.json to be a semver release, then commit, tag with semver release and auto run `git push && git push --tags`)
  - Triggers CI build from tag to call `npm run buildAll && npm publish --access public` (Publish npm package to npmjs.com)
- Create new release (on GitHub)
  - select (final release) tag
  - auto-generate release notes
  - publish final release

# Versioning

## Goals

- Enable Mach 30 to be able to produce incremental releases of yaml-datastore

## Schema

- semantic version
- dash (except for final release)
- release keyword (except for final release)
  - alpha.n (initial pre-releases numbered n)
  - beta.n (optional intermediary pre-release numbered n)
  - rc.n (release candidate, final pre-release numbered n)

### Examples

- v1.6.0-alpha.0
- v1.6.0-beta.2
- v1.6.0-rc.1
- v1.6.0

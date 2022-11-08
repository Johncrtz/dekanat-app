# Intutable

## Description

No-code tool for building CRUD apps.

Built on [Intutable Core](https://gitlab.com/intutable/core/) and Next JS.

## What Does This App Do?

dekanat-app is a highly configurable tool for keeping track of employees,
committees, and institutions of the Faculty for Mathematics and Computer
Science. More than a typical database app, it allows users to
configure the tables and relationships between them.
Key features in development include (similarly configurable) workflows
for modeling processes like hiring and admission of doctoral students,
import and export with the LSF and various file formats, and a fine-grained
system of permissions in accordance with tight data protection regulations.

## Getting Started
### Installation

1. Clone the repo
2. `cd dekanat-app`
3. `npm install`
4.  - Dev mode: `npm run dev`
    - Production mode:  
      `npm run build`  
      `npm run start`
    - `npm run reset -w database` resets the database

### Usage
After starting the app, navigate to its location at
`http://localhost:3000` in the browser. In dev mode, a default user with
the e-mail admin@dekanat.de and the password "password" is created. Log in
and you will see the projects page with one project named "Fakultät MathInf".
Click on it, then click on the "Personen" table. This table page is the 
center of the application. Try to create, edit, and delete some rows and
columns. If you want to create or delete tables, you must go back to the
project's page. The button on the very left of the toolbar allows you to
create views, in which you can add filters to limit the data displayed.

## Documentation

There is a high-level overview of the application's structure in /docs/dev.

## [Semver](https://semver.org) for Non-API Designs

Given **x**.**y**.**z** (MAJOR.MINOR.PATCH):

-   **x** -> resdesigns of UI/X; backwards incompatible changes of e.g. export/import algorithms, routines, features related to user data and stuff like that
-   **y** -> new but backwards compatible features (starting at e.g. changing a button or adding one); code changes without visual effect to the user (e.g. performance improvments, cleaning code or rewriting code etc.)
-   **z** -> backwards comptabile bug fixes

**Note**: Prereleases like Alphas and Betas must conform to [semver specifications](https://semver.org/#spec-item-11).

Since those tags like `-alpha.1` are only syntactically specified by semver, the semantics are up to the user. Our »TypeScript Template Literal Type« `VersionTag` defines three tags:

-   **-alpha** or **-alpha.n** (where `n` is a number) ->
-   **-beta** or **-beta.n** (where `n` is a number) ->
-   **-rc** or **-rc.n** (where `n` is a number) ->

Remember to bump versions in multiple package.json files: './package.json' and './gui/package.json'.

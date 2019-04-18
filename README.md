# Artemis

Artemis client-side data store and state management library.

## Development setup

Clone this repository and install its dependencies:

```bash
git clone git@github.com:agrilyst/data.git
cd data
yarn install
```

### Testing

`yarn test` builds the library, then tests it.

### Distribution
`yarn build` builds the library to `dist`, generating three files:

* `dist/artemis-data.cjs.js`
    A CommonJS bundle, suitable for use in Node.js, that `require`s the external dependency. This corresponds to the `"main"` field in package.json
* `dist/artemis-data.esm.js`
    an ES module bundle, suitable for use in other people's libraries and applications, that `import`s the external dependency. This corresponds to the `"module"` field in package.json
* `dist/artemis-data.umd.js`
    a UMD build, suitable for use in any environment (including the browser, as a `<script>` tag), that includes the external dependency. This corresponds to the `"browser"` field in package.json

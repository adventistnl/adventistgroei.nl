module.exports = {
  client: {
    includes: [ './app/**/*.ts', './app/**/*.tsx', './components/**/*.ts', './components/**/*.tsx', './hooks/**/*.ts', './hooks/**/*.tsx', './lib/**/*.ts', './lib/**/*.tsx',   './graphql/**/*.ts',
  './graphql/**/*.tsx', ],
    excludes: [ '**/*.test.ts', '**/__tests__/*' ],
  },
}

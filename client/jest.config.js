module.exports = {
  // base for Jest's configuration
  preset: '@vue/cli-plugin-unit-jest',
  // // tell Jest to handle `*.(js|jsx|json|vue)` files
  // moduleFileExtensions: ['js', 'json', 'vue', 'css'],
  transform: {
    // process js with `babel-jest`
    '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest',
    // process `*.vue` files with `vue-jest`
    '^.+\\.vue$': '<rootDir>/node_modules/vue-jest',
    // process `*.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)` files with `jest-transform-stub`
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': '<rootDir>/node_modules/jest-transform-stub'
  },
  transformIgnorePatterns: [

    '<rootDir>/node_modules/(?!vue|axios)'
  ],
  // glob patterns Jest uses to detect test files
  testMatch: [`<rootDir>/**/*.spec.js`],
  setupFiles: ['<rootDir>/unitTestUtils/test.config.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/**/*.vue',
    '<rootDir>/src/**/**/*.js'
  ],
  coverageReporters: ['lcov', 'html', 'text-summary'],
}

// jest.config.js
module.exports = {
    // Test environment
    testEnvironment: "jsdom", // Use jsdom for browser-like environment
  
    // Module file extensions
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  
    // Module name mapper (for aliases and module resolution)
    moduleNameMapper: {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom", // Resolve react-router-dom
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS modules
    },
  
    // Transform settings (for handling JavaScript/TypeScript files)
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Use Babel for transpilation
    },
  
    // Setup files (for global test setup)
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Optional: for global test setup
  
    // Collect coverage (optional)
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage", // Output directory for coverage reports
    coverageReporters: ["text", "lcov"], // Report formats
  };
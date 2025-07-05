export default {
    preset: 'ts-jest/presets/default-esm',   // transpile TS in ESM mode
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      // allow importing .js in TS files without extension mismatch
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    globals: {
      'ts-jest': {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    },
  };
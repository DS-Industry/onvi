module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-.*|@rnmapbox/maps|swr|zustand)/)',
  ],
  moduleNameMapper: {
    '^@gorhom/bottom-sheet$': '<rootDir>/__mocks__/@gorhom/bottom-sheet.js',
  },
};

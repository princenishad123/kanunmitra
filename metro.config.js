const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// TanStack Query exposes a source entry specifically for React Native/Metro.
config.resolver.unstable_conditionNames = [
  ...(config.resolver.unstable_conditionNames ?? []),
  '@tanstack/custom-condition',
];

module.exports = withNativeWind(config, { input: './src/global.css' });

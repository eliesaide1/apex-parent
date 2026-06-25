const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '..', 'apex-shared');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Metro must watch the shared source package (it lives outside parent-app).
  watchFolders: [sharedRoot],
  resolver: {
    // Resolve all node_modules from parent-app (single install root).
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    // Map the @apex/shared package entry to its TypeScript source.
    extraNodeModules: {
      '@apex/shared': path.resolve(sharedRoot, 'src', 'index.ts'),
    },
    // Do NOT watch native build output. Gradle creates/deletes CMake temp dirs
    // under node_modules/*/android/.cxx and android/build during a build; the
    // Node fs.watch fallback crashes (ENOENT) when those dirs vanish mid-watch.
    // metro accepts a RegExp (or array) directly for blockList.
    blockList: [
      /.*[\\/]android[\\/]\.cxx[\\/].*/,
      /.*[\\/]android[\\/]build[\\/].*/,
      /.*[\\/]android[\\/]app[\\/]build[\\/].*/,
      /.*[\\/]\.cxx[\\/].*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);

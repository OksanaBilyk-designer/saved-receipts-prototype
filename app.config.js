// Dynamic Expo config: extends app.json and lets the web base path be chosen at
// build time so the same source deploys to multiple static hosts.
//
//   EXPO_BASE_PATH unset  -> /saved-receipts-prototype              (GitHub Pages, default)
//   EXPO_BASE_PATH set    -> e.g. /public/admin/prototypes/saved-receipts (Elevate design bucket)
//
// This value must stay in sync with BASE_PATH in src/app/+html.tsx (both read
// the same env var), so the PWA manifest, icons, and service worker resolve.

/** @param {{ config: import('@expo/config-types').ExpoConfig }} ctx */
module.exports = ({ config }) => {
  const rawBase = process.env.EXPO_BASE_PATH || '/saved-receipts-prototype';
  // Expo's baseUrl expects a leading slash and NO trailing slash.
  const baseUrl = '/' + rawBase.replace(/^\/+/, '').replace(/\/+$/, '');

  return {
    ...config,
    experiments: {
      ...config.experiments,
      baseUrl,
    },
  };
};

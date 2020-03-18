const withDefault = require('./utils/default-options');
module.exports = options => {
  const { contentPath, useExternalMDX } = withDefault(options);

  return {
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `gatsby-theme-syl`,
          path: contentPath
        }
      },
      !useExternalMDX && {
        resolve: `gatsby-plugin-mdx`,
        options: {
          defaultLayouts: {
            default: require.resolve('./src/components/layout.js')
          }
        }
      },
      `gatsby-plugin-theme-ui`
    ].filter(Boolean)
  };
};

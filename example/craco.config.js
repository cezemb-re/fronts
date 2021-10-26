module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: (cssLoaderOptions, { env, paths }) => {
        // We want to select the CSS loader config for all plain `.scss` files. In the current CRA Webpack configuration,
        // this SCSS rules are defined by using `importLoaders: 3`. To make a distinction between the rules for SCSS modules
        // and plain SCSS files, we need to look for the loaderOptions where no modules are set. The if-statement below
        // filters this and keeps existing CRA configuration for all other rules intact.
        //
        // See https://github.com/facebook/create-react-app/blob/b9963abde5870d46cd906160f98f81dbc0a5ecf2/packages/react-scripts/config/webpack.config.js#L563
        if (cssLoaderOptions.importLoaders !== 3 || cssLoaderOptions.modules) return cssLoaderOptions

        return {
          ...cssLoaderOptions,
          modules: {
            compileType: 'icss',
          },
        }
      },
    },
  },
}

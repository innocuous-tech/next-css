import webpack from 'webpack';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import findUp from 'find-up';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import { nextConfig, nextCSSConfig } from '@types';

const fileExtensions = new Set();
let extractCssInitialized = false;

export const defineCSSLoaderConfig = (
  config: webpack.Configuration,
  {
    extensions = [],
    cssModules = false,
    cssLoaderOptions = {},
    dev,
    isServer,
    postcssLoaderOptions = {},
    loaders = [],
  }: nextConfig & nextCSSConfig
) => {
  // We have to keep a list of extensions for the splitchunk config
  extensions.forEach(extension => fileExtensions.add(extension));

  if (!isServer) {
    // @ts-ignore
    config.optimization.splitChunks.cacheGroups.styles = {
      name: 'styles',
      test: new RegExp(`\\.+(${[...Array.from(fileExtensions)].join('|')})$`),
      chunks: 'all',
      enforce: true,
    };
  }

  if (!isServer && !extractCssInitialized) {
    config.plugins!.push(
      new ExtractCssChunks({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: dev
          ? 'static/chunks/[name].css'
          : 'static/chunks/[name].[contenthash:8].css',
        chunkFilename: dev
          ? 'static/chunks/[name].chunk.css'
          : 'static/chunks/[name].[contenthash:8].chunk.css',
        hot: dev,
      })
    );
    extractCssInitialized = true;
  }

  if (!dev) {
    if (!Array.isArray(config.optimization!.minimizer)) {
      config.optimization!.minimizer = [];
    }

    config.optimization!.minimizer.push(
      new OptimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
        },
      })
    );
  }

  const postcssConfigPath = findUp.sync('postcss.config.js', {
    cwd: config.context,
  });

  const getPostCSSConfigFromFile = (path: string) =>
    Object.assign({}, postcssLoaderOptions.config, { path });

  // Get config from postcss config file if defined
  const postcssLoader = postcssConfigPath
    ? getPostCSSConfigFromFile(postcssConfigPath)
    : {
        loader: 'postcss-loader',
        options: Object.assign({}, postcssLoaderOptions, {
          config: {
            ...postcssLoaderOptions.config,
          },
        }),
      };

  const cssLoader = {
    loader: 'css-loader',
    options: Object.assign(
      {},
      {
        modules: cssModules,
        sourceMap: dev,
        importLoaders: loaders.length + (postcssLoader ? 1 : 0),
        exportOnlyLocals: isServer,
      },
      cssLoaderOptions
    ),
  };

  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ['ignore-loader'];
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules) {
    return [cssLoader, postcssLoader, ...loaders].filter(Boolean);
  }

  return [
    !isServer && ExtractCssChunks.loader,
    cssLoader,
    postcssLoader,
    ...loaders,
  ].filter(Boolean);
};

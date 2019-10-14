import webpack from 'webpack';
import { defineCSSLoaderConfig } from './defineCSSLoaderConfig';
import { nextConfig, nextCSSConfig } from '@types';

module.exports = (nextConfig: nextConfig & nextCSSConfig) => {
  return Object.assign({}, nextConfig || {}, {
    webpack(
      config: webpack.Configuration,
      options: Partial<nextConfig> & {
        defaultLoaders?: {
          [x: string]: any;
          css: object;
        };
      }
    ) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions } = nextConfig;

      options.defaultLoaders.css = defineCSSLoaderConfig(config, {
        extensions: ['css'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      });

      config.module!.rules.push({
        test: /\.css$/,
        issuer(issuer) {
          if (issuer.match(/pages[\\/]_document\.js$/)) {
            throw new Error(
              'You can not import CSS files in pages/_document.js, use pages/_app.js instead.'
            );
          }
          return true;
        },
        use: options.defaultLoaders.css,
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

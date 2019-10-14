import { CSSLoaderOptions, PostCSSLoaderOptions } from './';

export type nextCSSConfig = {
  cssModules?: boolean;
  cssLoaderOptions?: CSSLoaderOptions;
  extensions?: string[];
  postcssLoaderOptions?: PostCSSLoaderOptions;
  loaders?: string[] | object[] | string[] & object[];
};

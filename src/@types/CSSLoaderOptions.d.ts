// @see https://webpack.js.org/loaders/css-loader/#options
export type CSSLoaderOptions = {
  import?: () => boolean | boolean;
  importLoaders?: number;
  localsConvention?: string;
  modules?: boolean | string | object;
  onlyLocals?: boolean;
  sourceMap?: boolean;
  url?: () => boolean | boolean;
};

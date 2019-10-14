// @see https://github.com/postcss/postcss-loader#options
export type PostCSSLoaderOptions = {
  config?: {
    path: string;
    context: {
      env: 'development' | 'test' | 'production';
      file: object;
      options: object;
    };
  };
  exec?: boolean;
  parser?: string | object;
  plugins?: () => string[] | string[];
  sourceMap?: 'inline' | boolean;
  stringifier?:
    | string
    | {
        parser?: () => string | string;
        syntax?: () => string | string;
        stringifier?: () => string | string;
      };
  syntax?: string | object;
};

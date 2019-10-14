import webpack from 'webpack';
import { WebpackEntryPoints } from './';

export type nextConfig = {
  buildId?: string;
  config?: any;
  dev?: boolean;
  isServer?: boolean;
  pagesDir?: string;
  target?: string;
  tracer?: any;
  entrypoints?: WebpackEntryPoints;
  webpack?: (
    config: webpack.Configuration,
    options: Partial<nextConfig> & {
      defaultLoaders?: {
        [x: string]: any;
        css: object;
      };
    }
  ) => object;
};

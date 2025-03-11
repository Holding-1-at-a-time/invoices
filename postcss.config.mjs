/**
 * The PostCSS configuration.
 *
 * @param { import('postcss-load-config').Options } options - The options for the PostCSS configuration.
 * @returns { import('postcss').Config } The PostCSS configuration.
 */
export default function postcssConfig(options: import('postcss-load-config').Options): import('postcss').Config {
  return {
    plugins: [
      tailwindcss,
      autoprefixer,
      tailwindcssAnimate,
      postcssImport,
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
  };
}


const path = require('path');

module.exports = {
  entry: './src/app.ts', // Change this to your main TypeScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { 
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'], // add '.js' if you have any JS files
  },
  mode: 'development', // Use 'production' for minified output
};
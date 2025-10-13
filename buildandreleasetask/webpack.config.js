const path = require('path');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    // Don't bundle these, they should be available in the Azure Pipelines agent
  },
  optimization: {
    minimize: false // Keep readable for debugging
  }
};

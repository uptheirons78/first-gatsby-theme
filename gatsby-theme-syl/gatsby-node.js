const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const withDefault = require('./utils/default-options');

exports.onPreBootstrap = ({ store }, options) => {
  const { program } = store.getState();
  const { contentPath } = withDefault(options);
  const dir = path.join(program.directory, contentPath);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
};

module.exports = env =>
  env === 'development'
    ? {
        DIR_PATH: `${__dirname}/../data/.dept`,
        TEMPLATE_FILE_PATH: `${__dirname}/../data/.dept/data.json`,
        INSTALL_DIR_PATH: `${__dirname}/../data`,
        DEFAULT_OUT_DIR_PATH: `${__dirname}/../data`,
      }
    : {
        // production
        DIR_PATH: `${process.env.HOME}/.dept`,
        TEMPLATE_FILE_PATH: `${process.env.HOME}/.dept/data.json`,
        INSTALL_DIR_PATH: `${process.env.PWD}`,
        DEFAULT_OUT_DIR_PATH: `${process.env.PWD}`,
      };

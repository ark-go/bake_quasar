module.exports = {
  apps: [
    {
      name: "bake-vite",
      // interpreter_args: '--inspect-brk=127.0.0.1:9229',
      // node_args: '--inspect',
      cwd: "/home/nodeuser/node/bake/server",
      script: "index.js",
      ignore_watch: ["node_modules"],
      //watch: ['../modules'],
      //watch_options: {
      // https://github.com/paulmillr/chokidar#api
      //  followSymlinks: true,
      //},

      // usePolling: true,  // для Windows

      // out_file: "/home/nodeuser/nodewww/test/out.log",
      // error_file: "/home/nodeuser/nodewww/test/error.log",
      // это не работаект log_level: 3, // 0 выключить, 1 - только ошибким , 2 - ошибки и предупреждения, 3 - все.
      env: {
        NODE_ENV: "development",
        NODE_LOG_LEVEL: 3,
      },
      env_production: {
        NODE_ENV: "production",
        NODE_LOG_LEVEL: 3,
      },
    },
  ],
};

// $NODE_PATH

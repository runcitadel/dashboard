module.exports = {
  devServer: {
    allowedHosts: ["citadel-dev.local"],
    watchOptions: {
      poll: true,
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].template = "./public/index.html";
      return args;
    });
  },
};

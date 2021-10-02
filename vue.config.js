module.exports = {
  // css: {
  //     loaderOptions: {
  //         sass: {
  //             prependData: `
  //                 @import "@/global-styles/designs-ystem.scss";
  //             `
  //         }
  //     }
  // }
  devServer: {
    allowedHosts: ["umbrel-dev.local"],
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

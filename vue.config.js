export default {
  devServer: {
    allowedHosts: ["citadel-dev.local"],
    watchOptions: {
      poll: true,
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("vue", "@vue/compat");
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3,
            },
          },
        };
      });
    config.plugin("html").tap((args) => {
      args[0].template = "./public/index.html";
      return args;
    });
  },
};

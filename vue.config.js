module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/todo-vue-app/" : "/",
  transpileDependencies: ["vuetify"]
};

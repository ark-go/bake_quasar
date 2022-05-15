npm install

npm i @quasar/babel-preset-app

@babel/eslint-parser eslint.rc
parserOptions: {
parser: '@babel/eslint-parser',
ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
sourceType: 'module' // Allows for the use of imports
},

quasar.config.js исправит ошибку @Charset должно быть впереди

build: {
extendViteConf(viteConf) {
if (viteConf.css !== Object(viteConf.css)) {
viteConf.css = {};
}
if (viteConf.css.postcss !== Object(viteConf.css.postcss)) {
viteConf.css.postcss = {};
}
if (Array.isArray(viteConf.css.postcss.plugins) === false) {
viteConf.css.postcss.plugins = [];
}
viteConf.css.postcss.plugins.unshift({
postcssPlugin: 'internal:charset-removal',
AtRule: {
charset: (atRule) => {
if (atRule.name === 'charset') {
atRule.remove();
}
},
},
});
},
},

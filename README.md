<!--
 * @Author: ADI
 * @Date: 2020-07-28 14:29:52
 * @LastEditors: ADI
 * @LastEditTime: 2020-07-28 16:00:53
-->

# 升级 babelv7.4 的变化

> babel 从 v6 升级到 v7 的大更新还记忆犹新,近日有幸参与到 electron 桌面端项目组中,在升级 babel 的过程中发现 babelv7.4 升级后在引用垫片的方式有变,特此学习记录一下。

# 先看看最后的成果

大体参考 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/babel-preset-app/index.js) 进行升级。可以跟着下面的步骤试试效果。

```
// 安装升级 babel 依赖
npx babel-upgrade
yarn add core-js @babel/preset-env @babel/runtime
yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-syntax-dynamic-import @babel/plugin-transform-runtime --dev

// at main.ts
import "core-js/stable";
import "regenerator-runtime/runtime";

// at babel-config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // debug: true,
        // useBuiltIns: "usage", // @vue/babel-preset-app默认值, 对于检测不到的项，需要到入口手动引入
        useBuiltIns: "entry", // vuex、axios等node_modules依赖"usage"检测不到
        corejs: {
          version: 3,
          proposals: true,
        },
        targets: {
          ie: 9,
        },
        include: [
          "es.array.iterator",
          "es.promise",
          "es.object.assign",
          "es.promise.finally",
          "es.symbol",
        ],
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-transform-runtime",
      {
        // polyfills are injected by preset-env & polyfillsPlugin, so no need to add them again
        corejs: false,
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};

```

# plugin 的启用顺序

> 在 babel.config.js 中，plugins 中的插件按照数组索引从左往右顺序执行，之后按照数组顺序逆序执行 presets 数组的的配置(preset 可以看做是 plugins 集合)

# 关于配置项的 options 说明

> babel 生态迭代很快，为避免时效性的问题给读者带来困惑，推荐搜索对应插件文档详查。

## 常用的插件(建议查阅):

1. [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
2. [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)
3. [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)
4. [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)

# 用 rollup.js 调试 babel

1. clone 本仓库
2. yarn install
3. 修改.babelrc 中的选项查看效果 (rollup-plugin-babel 依赖的是 babelv7.0, 不过不影响调试)

# 关于 @babel/preset-env 与 @babel/plugin-transform-runtime 的选择

- 在自己的应用里，推荐使用 @babel/preset-env， 它会根据配置的 browerlist 与 target 来进行编译, 编译体积会小一些。
- 如果是公用的 npm 之类的，推荐使用 @babel/plugin-transform-runtime， 防止免全局污染，以避免外部代码影响。

@babel/preset-env

```
yarn add core-js @babel/preset-env @babel/runtime
yarn add @babel/plugin-transform-runtime --dev
// .babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "useBuiltIns": "usage",
                "corejs": {
                    "version": 3,
                    "proposals": true
                }
            }
        ]
    ]
}
```

@babel/plugin-transform-runtime

```
// .babelrc
yarn add @babel/runtime @babel/runtime-corejs3
yarn add @babel/plugin-transform-runtime -D
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": {
                    "version": 3,
                    "proposals": true
                },
                "useESModules": true
            }
        ]
    ]
}
```

> 开发者在代码中如果使用了新的 ES 特性，比如 Promise、generator 函数等，往往需要通过 core-js 和 regenerator-runtime 给全局环境注入 polyfill。 这种做法，在应用型的开发中，是非常标准的做法。 但是如果在开发一个独立的工具库项目，不确定它将会被其它人用到什么运行环境里面，那么前面那种扩展全局环境的 polyfill 就不是一个很好的方式。 transform-runtime 可以帮助这种项目创建一个沙盒环境，即使在代码里用到了新的 ES 特性，它能将这些特性对应的全局变量，转换为对 core-js 和 regenerator-runtime 非全局变量版本的引用。这其实也应该看作是一种给代码提供 polyfill 的方式。

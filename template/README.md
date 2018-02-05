# {{ name }}

> {{ description }}

## Build Setup

``` bash
# 安装依赖
npm install

# 本地运行
npm run dev

# 编译
npm run build

# 可视化分析构建结果
npm run report
{{#unit}}
# 运行单元测试
npm run unit
{{/unit}}
{{#e2e}}

# 运行端对端测试
npm run e2e
{{/e2e}}
{{#if_or unit e2e}}

# 运行所有测试
npm test
{{/if_or}}
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# vite-plugin-arbalest

于script setup中定义vue组件的name，适用于强迫症人群。

## 安装 (yarn or npm)

**vue version:** >=3.2.0

```
yarn add vite-plugin-arbalest-D
```

or

```
npm i vite-plugin-svg-arbalest -D

```

## 使用

- vite.config.ts 中的配置插件

```ts
import viteArbalest from 'vite-plugin-arbalest';

export default () => {
  return {
    plugins: [
      viteArbalest()
    ],
  };
};
```
## 如何在组件使用

**Vue**

使用前

```vue
<template>
    <div class="home">Home</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'Home'
})
</script>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
</style>
```

使用后

```vue
<template>
    <div class="home">Home</div>
</template>

<script lang="ts" setup name="Home">
</script>

<style lang="scss" scoped>
</style>
```

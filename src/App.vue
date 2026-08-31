<!--
  SPDX-License-Identifier: GPL-3.0-or-later
  作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
-->
<template>
  <main class="map-page">
    <ZhejiangThreeMap />
  </main>
</template>

<script setup lang="ts">
import ZhejiangThreeMap from './components/map/ZhejiangThreeMap.vue';
</script>

<style scoped>
.map-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000201;
}
</style>

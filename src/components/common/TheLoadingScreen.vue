<template>
  <div id="loading">
    <div class="lds-dual-ring"></div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TheLoadingScreen',
}
</script>

<style>
#loading {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: transparent;
}

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}

.lds-dual-ring::after {
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 6px solid #cef;
  border-color: var(--loading-icon-color) transparent;
  border-radius: 50%;
  animation: lds-dual-ring 1.2s linear infinite;
  content: ' ';
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

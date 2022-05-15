<template>
  <transition name="fade" :mode="mode" appear>
    <slot></slot>
  </transition>
</template>
<script>
export default {
  props: {
    mode: {
      type: String,
      default: "out-in",
    },
  },
};
</script>
<style lang="scss" scoped>
.comp-fade-enter-active,
.comp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.comp-fade-enter-from,
.comp-fade-leave-to {
  opacity: 0;
}
</style>

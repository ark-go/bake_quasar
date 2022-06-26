<template>
  <div
    class="full-width row flex-center text-primary q-gutter-sm text-weight-bold"
  >
    <span> {{ dataslot.message }} </span>
  </div>
</template>

<script>
// в dataslot   icon, message, filter
export default {
  props: ["dataslot"],
  setup() {},
};
</script>

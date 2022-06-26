<template>
  <div class="column full-width">
    <div><slot name="title"></slot></div>
    <div><slot></slot></div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "TableTop",
  components: {},
  props: [],
  emits: [],
  setup(props) {
    return {  };
  },
});
</script>

<template>
  <div class="row">
    <q-btn flat dense round color="green" icon="add" @click="$emit('onAdd')" />
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "TableTopBtn",
  components: {},
  props: [],
  emits: ["onAdd"],
  setup(props) {
    return {};
  },
});
</script>

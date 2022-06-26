<template>
  <q-select
    :model-value="visibleColumns"
    @update:model-value="$emit('update:visibleColumns', $event)"
    multiple
    dense
    options-dense
    display-value="Вид"
    emit-value
    map-options
    :options="columns"
    option-value="name"
    options-cover
    style="min-width: 30px"
    borderless
  />
</template>
<script>
import { defineComponent, ref } from "vue";
import { useSpravStore } from "stores/spravStore";
export default defineComponent({
  name: "TableTopVisible",
  components: {},
  props: ["visibleColumns", "columns"],
  emits: ["update:visibleColumns"],
  setup(props) {
    const spravStore = useSpravStore();
    return { spravStore };
  },
});
</script>

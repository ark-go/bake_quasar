<template>
  <q-tabs
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="left"
    narrow-indicator
    mobile-arrows
    inline-label
  >
    <q-tab name="main" label="Выбор" />
    <q-tab
      v-for="tab in selectedNode.buttonPanel"
      :key="tab.name"
      v-bind="tab"
    />
  </q-tabs>
  <q-separator />
</template>

<script>
import { defineComponent, ref } from "vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabButton",
  components: {},
  props: {
    selectedNode: Object,
    tabModel: String,
  },
  emits: ["update:tabModel"],
  setup(props) {
    return {};
  },
});
</script>

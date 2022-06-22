<template>
  <q-tabs
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    mobile-arrows
    inline-label
  >
    <q-tab name="main" label="Дом" />
    <q-tab
      v-for="tab in selectedNode.buttonPanel"
      :key="tab.name"
      v-bind="tab"
    />
    <!-- <q-tab name="raz1" label="чтото" />
    <q-tab name="dva2" label="гдето" />
    <q-tab name="tru3" label="тамто" />
    <q-tab name="chet4" label="здеся" />
    <q-tab name="pat5" label="тута" />
    <q-tab name="shest6" label="вот оно" />
    <q-tab name="sem7" label="нашли" />
    <q-tab name="vosem8" label="бери" />
    <q-tab name="main" label="Дом" /> -->
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

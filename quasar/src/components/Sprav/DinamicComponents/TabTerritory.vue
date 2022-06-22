<template>
  <q-tab-panels
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    animated
  >
    <q-tab-panel
      name="manager"
      :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }"
    >
      воть туть Манагер
    </q-tab-panel>
    <q-tab-panel name="bakeryTerritory" style="padding: 0">
      <Bakery-Table-Territory
        :maxBodyHeight="maxBodyHeight"
      ></Bakery-Table-Territory>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent, ref } from "vue";
import BakeryTableTerritory from "./TabTerritory/BakeryTableTerritory.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabTerritory",
  components: { BakeryTableTerritory },
  props: { maxBodyHeight: String, tabModel: String },
  //emits: ["update:filter"],
  setup(props) {
    return {};
  },
});
</script>

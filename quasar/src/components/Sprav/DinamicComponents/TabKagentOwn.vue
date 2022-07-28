<template>
  <q-tab-panels
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    animated
  >
    <q-tab-panel name="kagentBakery" style="padding: 0">
      <Kagent-Bakery-Panels></Kagent-Bakery-Panels>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
// При выборе дерева SpravTree срабатывает и хранится в Storage  spravStore
// Penia - spravStore.s electedNode
// в файле Sprav.vue на ArkCard подменяется компнент правого поля
// selectComponent.js  закачивает нужный компонент
import { defineComponent, ref } from "vue";
import KagentBakeryPanels from "./TabKagentBakeryOwn/KagentBakeryPanels.vue";
//import BakeryTableRegionManager from "./TabRegionManager/BakeryTableRegionManager.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabKagentOwn",
  components: { KagentBakeryPanels },
  props: {
    maxBodyHeight: String,
    tabModel: String,
  },
  //emits: ["update:filter"],
  setup(props) {
    return {};
  },
});
</script>

<template>
  <q-tab-panels
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    animated
  >
    <q-tab-panel
      name="baker"
      :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }"
    >
      <!-- <Bakery-Table-Region-Manager></Bakery-Table-Region-Manager> -->
    </q-tab-panel>
    <q-tab-panel name="managerTerritory" style="padding: 0">
      <Tab-Panel-Terr></Tab-Panel-Terr>
    </q-tab-panel>
    <q-tab-panel name="managerRegion" style="padding: 0">
      <Tab-Panel-Reg></Tab-Panel-Reg>
    </q-tab-panel>
    <q-tab-panel name="managerBakery" style="padding: 0">
      <Tab-Panel-Bakery></Tab-Panel-Bakery>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
// bakeryBaker имя панели которое есть в SpravTRee
// При выборе дерева SpravTree срабатывает и хранится в Storage  spravStore
// Penia - spravStore.s electedNode
// в файле Sprav.vue на ArkCard подменяется компнент правого поля
// selectComponent.js  закачивает нужный компонент
import { defineComponent, ref } from "vue";
import TabPanelTerr from "./TabManagerTerritory/TabPanel.vue";
import TabPanelReg from "./TabManagerRegion/TabPanel.vue";
import TabPanelBakery from "./TabManagerBakery/TabPanel.vue";
//import BakeryTableRegionManager from "./TabRegionManager/BakeryTableRegionManager.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabBakeryBaker",
  components: { TabPanelTerr, TabPanelReg, TabPanelBakery },
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

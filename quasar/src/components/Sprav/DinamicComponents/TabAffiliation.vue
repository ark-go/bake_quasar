<template>
  <q-tab-panels
    :model-value="tabModel"
    @update:model-value="$emit('update:tabModel', $event)"
    animated
  >
    <q-tab-panel name="affiliationBakery" style="padding: 0">
      <Affiliation-Bakery-Panels></Affiliation-Bakery-Panels>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
// При выборе дерева SpravTree срабатывает и хранится в Storage  spravStore
// Penia - spravStore.s electedNode
// в файле Sprav.vue на ArkCard подменяется компнент правого поля
// selectComponent.js  закачивает нужный компонент
import { defineComponent, ref } from "vue";
import AffiliationBakeryPanels from "./TabAffiliationBakery/AffiliationBakeryPanels.vue";
//import BakeryTableRegionManager from "./TabRegionManager/BakeryTableRegionManager.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabAffiliation",
  components: { AffiliationBakeryPanels },
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

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
      <Bakery-Table-Territory-Manager></Bakery-Table-Territory-Manager>
    </q-tab-panel>
    <q-tab-panel name="bakeryTerritory" style="padding: 0">
      <Territory-Bakery-Panels></Territory-Bakery-Panels>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
// При выборе дерева SpravTree срабатывает и хранится в Storage  spravStore
// Penia - spravStore.selectedNode
// в файле Sprav.vue на ArkCard подменяется компнент правого поля
// selectComponent.js  закачивает нужный компонент

import { defineComponent, ref } from "vue";
import TerritoryBakeryPanels from "./TabTerritoryBakery/TerritoryBakeryPanels.vue";
import BakeryTableTerritoryManager from "./TabTerritoryManager/BakeryTableTerritoryManager.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabTerritory",
  components: {
    TerritoryBakeryPanels,
    BakeryTableTerritoryManager,
  },
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

<template>
  <q-tab-panels
    v-model="tabModel"
    animated
    :keep-alive="keepAlive"
    class="ark-tab-panel"
  >
    <q-tab-panel name="main" class="ark-tab-panel">
      <Tab-Sale-Bakery></Tab-Sale-Bakery>
    </q-tab-panel>
    <q-tab-panel name="bakeryItem" class="ark-tab-panel">
      <Tab-Sale-Items></Tab-Sale-Items>
    </q-tab-panel>
    <q-tab-panel name="bufferItem" class="ark-tab-panel">
      <Tab-Sale-Buffer></Tab-Sale-Buffer>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
/**
 * используем для размещения tabPanel панелей
 */
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";

import TabSaleBakery from "./saleBakery/TabSaleBakery.vue";
import TabSaleItems from "./saleItems/TabSaleItems.vue";
import TabSaleBuffer from "./saleBuffer/TabSaleBuffer.vue";

import { useSaleStore, storeToRefs } from "src/stores/saleStore";
export default defineComponent({
  name: "TabDocuments",
  components: {
    TabSaleBakery,
    TabSaleItems,
    TabSaleBuffer,
  },
  setup() {
    const { tabModel } = storeToRefs(useSaleStore());
    const keepAlive = ref(false);
    onMounted(() => {
      tabModel.value = "main";
    });
    onBeforeUnmount(() => {
      console.log("keep off Sale");
      keepAlive.value = false;
    });
    return { tabModel, keepAlive };
  },
});
</script>
<style lang="scss" scoped>
.ark-tab-panel {
  padding: 0;
}
</style>

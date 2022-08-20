<template>
  <q-tab-panels v-model="tabModel" animated keep-alive class="ark-tab-panel">
    <q-tab-panel name="main" class="ark-tab-panel">
      <Tab-Sale-Bakery></Tab-Sale-Bakery>
    </q-tab-panel>
    <q-tab-panel name="bakeryItems" class="ark-tab-panel">
      <Tab-Sale-Items></Tab-Sale-Items>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
/**
 * используем для размещения tabPanel панелей
 */
import { defineComponent, onMounted } from "vue";

import TabSaleBakery from "./saleBakery/TabSaleBakery.vue";
import TabSaleItems from "./saleItems/TabSaleItems.vue";

import { useSaleStore, storeToRefs } from "src/stores/saleStore";
export default defineComponent({
  name: "TabDocuments",
  components: {
    TabSaleBakery,
    TabSaleItems,
  },
  setup() {
    const { tabModel } = storeToRefs(useSaleStore());
    onMounted(() => {
      tabModel.value = "main";
    });
    return { tabModel };
  },
});
</script>
<style lang="scss" scoped>
.ark-tab-panel {
  padding: 0;
}
</style>

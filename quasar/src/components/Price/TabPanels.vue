<template>
  <q-tab-panels v-model="tabModel" animated keep-alive class="ark-tab-panel">
    <q-tab-panel name="main" class="ark-tab-panel">
      <Tab-Price-Doc></Tab-Price-Doc>
    </q-tab-panel>
    <q-tab-panel name="bakery" class="ark-tab-panel">
      <Tab-Price-Bakery></Tab-Price-Bakery>
    </q-tab-panel>
    <q-tab-panel name="priceValue" class="ark-tab-panel">
      <Tab-Price-Value></Tab-Price-Value>
    </q-tab-panel>
    <q-tab-panel name="priceValueFranch" class="ark-tab-panel">
      <Tab-Price-Value-Franch></Tab-Price-Value-Franch>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
/**
 * используем для размещения tabPanel панелей
 */
import { defineComponent, onMounted } from "vue";

import TabPriceDoc from "./priceDoc/TabPriceDoc.vue";
import TabPriceBakery from "./priceBakery/TabPriceBakery.vue";
import TabPriceValue from "./priceValue/TabPriceValue.vue";
import TabPriceValueFranch from "./priceValueFranch/TabPriceValueFranch.vue";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";
export default defineComponent({
  name: "TabDocuments",
  components: {
    TabPriceDoc,
    TabPriceBakery,
    TabPriceValue,
    TabPriceValueFranch,
  },
  setup() {
    const { tabModel } = storeToRefs(usePriceStore());
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

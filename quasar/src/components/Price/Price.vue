<template>
  <ark-card
    title="Прайс"
    :subTitle="subTitle"
    :pageMaxHeight="pageMaxHeight"
    :style="{ width: cardMain.width.curr + 'px', maxWidth: '98vw' }"
    :selectedRow="priceStore.selectedRowDoc"
    :menuObj="menuObj"
    @menuClick="menuClick"
  >
    <template v-slot:tabPanels>
      <Tab-Panels></Tab-Panels>
    </template>
  </ark-card>
  <Help-Panel v-model:helpShow="helpShow" :helpCode="helpCode"></Help-Panel>
</template>
<script>
import ArkCard from "./ArkCard.vue";
import { defineComponent, ref, watchEffect } from "vue";
import { usePriceStore } from "stores/priceStore";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
// все назначается в tabPanels в подкаталогах
import TabPanels from "./TabPanels.vue";
import HelpPanel from "components/HelpPanel/HelpPanel.vue";
export default defineComponent({
  name: "PagePrice",
  props: {
    pageMaxHeight: Object,
  },
  components: {
    ArkCard,
    HelpPanel,
    TabPanels,
    // PriceDocTable
  },
  setup() {
    const priceStore = usePriceStore();
    const { cardMain } = storeToRefs(usePagesSetupStore());
    const subTitle = ref("");
    const helpCode = ref("");
    const helpShow = ref(false);
    watchEffect(() => {
      subTitle.value = priceStore.priceTitle; // .selectedRowDoc.datestart;
      console.log("смена строкив документах", priceStore.priceTitle);
    });
    //-------------------------------------------
    const menuObj = ref({ sizeForm: "Размер", helpPanel: "Справка" });
    function menuClick(val) {
      switch (val) {
        case "sizeForm":
          break;
        case "helpPanel":
          helpCode.value = "price-main";
          helpShow.value = true;
          break;

        default:
          break;
      }
    }
    //--------------------------------------------
    return {
      cardMain,
      priceStore,
      subTitle,
      menuObj,
      menuClick,
      helpCode,
      helpShow,
    };
  },
});
</script>

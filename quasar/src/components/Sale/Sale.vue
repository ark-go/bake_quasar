<template>
  <ark-card
    title="Прайс"
    :subTitle="subTitle"
    :pageMaxHeight="pageMaxHeight"
    :style="{
      width: cardMain.width.curr + 'px',
      maxWidth: '98vw',
    }"
    :selectedRow="saleStore.selectedSaleRowDoc"
    :menuObj="menuObj"
    @menuClick="menuClick"
    :fullScreenTr="fullScreen"
  >
    <template v-slot:tabPanels>
      <Tab-Panels></Tab-Panels>
    </template>
    <template v-slot:bottomSlot>
      <Corner-Size v-model:sizeX="cardMain.width.curr"></Corner-Size>
    </template>
  </ark-card>

  <Help-Panel v-model:helpShow="helpShow" :helpCode="helpCode"></Help-Panel>
</template>
<script>
import ArkCard from "./ArkCard.vue";
import { defineComponent, ref, watchEffect, onUnmounted } from "vue";
import { useSaleStore } from "stores/saleStore";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
// все назначается в tabPanels в подкаталогах
import TabPanels from "./TabPanels.vue";
import HelpPanel from "components/HelpPanel/HelpPanel.vue";
import CornerSize from "./CornerSize.vue";
export default defineComponent({
  name: "PageSale",
  props: {
    pageMaxHeight: Object,
  },
  components: {
    ArkCard,
    HelpPanel,
    TabPanels,
    CornerSize,
  },
  setup() {
    const saleStore = useSaleStore();
    onUnmounted(() => {
      saleStore.watchStop();
      saleStore.$reset();
    });
    const { cardMain } = storeToRefs(usePagesSetupStore());
    const subTitle = ref("");
    const helpCode = ref("");
    const helpShow = ref(false);
    const fullScreen = ref(false);
    // watchEffect(() => {
    //   subTitle.value = saleStore.priceTitle; // .selectedRowDoc.datestart;
    //   console.log("смена строкив документах", saleStore.priceTitle);
    // });
    //-------------------------------------------
    const menuObj = ref({
      sizeForm: "Размер",
      helpPanel: "Справка",
      fullScreen: "Ф",
    });
    function menuClick(val) {
      switch (val) {
        case "sizeForm":
          break;
        case "helpPanel":
          helpCode.value = "sale-main";
          helpShow.value = true;
          break;
        case "fullScreen":
          fullScreen.value = !fullScreen.value;
          break;
        default:
          break;
      }
    }
    //--------------------------------------------
    return {
      fullScreen,
      cardMain,
      saleStore,
      subTitle,
      menuObj,
      menuClick,
      helpCode,
      helpShow,
    };
  },
});
</script>

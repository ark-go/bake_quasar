<template>
  <ark-card
    title="Прайс"
    :subTitle="subTitle"
    :pageMaxHeight="pageMaxHeight"
    :style="{
      width: cardMain.width.curr + 'px',
      maxWidth: '98vw',
    }"
    :selectedRow="priceStore.selectedRowDoc"
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
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  onUnmounted,
  nextTick,
  onMounted,
} from "vue";
import { usePriceStore } from "stores/priceStore";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import { useLoadBakeryDocument } from "./loadBakeryDocument";
import { useLoadPriceValue } from "./loadPriceValue";
import { useLoadPriceValueFranch } from "./loadPriceValueFranch";
// все назначается в tabPanels в подкаталогах
import TabPanels from "./TabPanels.vue";
import HelpPanel from "components/HelpPanel/HelpPanel.vue";
import CornerSize from "./CornerSize.vue";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "PagePrice",
  props: {
    pageMaxHeight: Object,
  },
  components: {
    ArkCard,
    HelpPanel,
    TabPanels,
    CornerSize,
    // PriceDocTable
  },
  setup() {
    const $q = useQuasar();
    const priceStore = usePriceStore();
    const loadBakeryDocument = useLoadBakeryDocument();
    const loadPriceValue = useLoadPriceValue();
    const loadPriceValueFranch = useLoadPriceValueFranch();
    const { selectedRowDoc, selectedBakeryPrice } = storeToRefs(
      usePriceStore()
    );

    onUnmounted(() => {
      //  nextTick(() => {
      console.log("unmounted Price");
      priceStore.watchStop();
      priceStore.$reset();
      //   });
    });
    //  priceStore.watchStore(() => {
    // return
    watch(
      () => selectedRowDoc.value,
      async () => {
        await loadBakeryDocument.loadTable();
        await loadPriceValue.loadTable();
        await loadPriceValueFranch.loadTable();
      }
    );
    // watch(
    //   () => selectedBakeryPrice.value,
    //   async () => {
    //     //  await loadPriceValueFranch.loadTable();
    //   }
    // );
    //});
    const { cardMain } = storeToRefs(usePagesSetupStore());
    const subTitle = ref("");
    const helpCode = ref("");
    const helpShow = ref(false);
    const fullScreen = ref(false);
    onMounted(() => {
      if ($q.platform.is.mobile) {
        nextTick(() => {
          fullScreen.value = true;
        });
      }
    });
    priceStore.watchStore(() => {
      return watchEffect(() => {
        subTitle.value = priceStore.priceTitle; // .selectedRowDoc.datestart;
        console.log("смена строкив документах", priceStore.priceTitle);
      });
    });
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
          helpCode.value = "price-main";
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

<template>
  <ark-card
    :title="spravStore.selectedNode.pathStr ? 'Cправочник' : 'Cправочники'"
    :pageMaxHeight="pageMaxHeight"
    :subTitle="subTitle"
    :style="{ width: cardMain.width.curr + 'px', maxWidth: '98vw' }"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :selectedNode="spravStore.selectedNode"
    :menuObj="menuObj"
    @menuClick="menuClick"
  >
    <template v-slot:before>
      <sprav-tree
        style="min-width: 100px"
        v-model:selectedNode="spravStore.selectedNode"
      ></sprav-tree>
    </template>
    <template v-slot:after>
      <component
        v-if="spravStore.selectedNode.tableName"
        :is="currentTable"
        v-bind="{
          tableInfo: spravStore.selectedNode,
          class: 'maxBodyHeight',
          commandLoad: { cmd: 'load' },
          spravRow: spravStore.selectedRow,
        }"
        @selectedRow="(val) => (spravStore.selectedRow = val)"
      ></component>
      <div v-else class="text-none-table">Выберите что-нибудь.</div>
    </template>
  </ark-card>
  <Help-Panel v-model:helpShow="helpShow" :helpCode="helpCode"></Help-Panel>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  onBeforeUnmount,
  defineAsyncComponent,
} from "vue";
import SpravTree from "components/Sprav/SpravTree.vue";
import SpravTable from "components/Sprav/SpravTable.vue";
import TradeMarkTable from "components/Trademark/TrademarkTable.vue";
//import BakeryTable from "components/Bakery/BakeryTable.vue";
import CityTable from "components/City/Table.vue";
import ArkCard from "./ArkCard.vue";
import HelpPanel from "components/HelpPanel/HelpPanel.vue";
//import NoTable from "components/Sprav/NoTable.vue";

import { useSpravStore } from "stores/spravStore";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageSprav",
  props: {
    pageMaxHeight: Object,
  },
  components: {
    ArkCard,
    SpravTree,
    HelpPanel,
  },
  setup() {
    //  const $q = useQuasar();
    const helpShow = ref(false);
    const helpCode = ref(null);
    const spravStore = useSpravStore();
    const { cardMain } = storeToRefs(usePagesSetupStore());
    const $router = useRouter();
    const subTitle = ref("");
    const currentTableName = ref(null);
    const currentTable = ref(SpravTable);
    const $q = useQuasar();
    const splitHorizont = ref(false);
    onBeforeUnmount(() => {
      // при входе могло остаться чтото, желательно удалять при выходе
      spravStore.selectedNode = {};
      spravStore.selectedRow = {};
    });
    watchEffect(() => {
      subTitle.value = "";
      if (!spravStore.selectedNode.tableName) {
        //
      }
      if (spravStore.selectedNode.pathStr)
        subTitle.value = spravStore.selectedNode.pathStr;
      if (spravStore.selectedRow.name)
        subTitle.value += " | " + spravStore.selectedRow.name;
    });
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
    const splitStyleW = {
      background: "rgb(214 214 214)",
      minWidth: "50px",
      minHeight: "6px",
      borderRadius: "3px",
    };
    watchEffect(() => {
      splitHorizont.value = $q.screen.width < $q.screen.height;
    });
    watch(
      () => spravStore.selectedNode.tableName,
      () => {
        spravStore.selectedRow = {};
        console.log("Выбрал дерево >", spravStore.selectedNode);
        switch (spravStore.selectedNode.tableType) {
          case undefined:
            currentTable.value = SpravTable;
            break;
          case "trademark":
            currentTable.value = TradeMarkTable;
            break;
          case "city":
            currentTable.value = CityTable;
            break;
          // case "bakery":
          //   currentTable.value = BakeryTable;
          //   break;
          case "tabUsers":
            currentTable.value = defineAsyncComponent(() =>
              import("./tabUsers/TablePanel.vue")
            );
            break;
          case "tabBakery":
            console.log("case tree tabBakery");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabBakery/TablePanel.vue")
            );
            break;
          case "tabTerritory":
            console.log("case tree tabTerritory");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabTerritory/TablePanel.vue")
            );
            break;
          case "tabRegion":
            console.log("case tree tabRegion");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabRegion/TablePanel.vue")
            );
            break;
          case "tabKagent":
            console.log("case tree tabKagent");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabKagent/TablePanel.vue")
            );
            break;
          case "tabKagentOwn":
            console.log("case tree tabKagentOwn");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabKagentOwn/TablePanel.vue")
            );
            break;
          case "tabKagentFranch":
            console.log("case tree tabKagentFranch");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabKagentFranch/TablePanel.vue")
            );
            break;
          case "tabTrademark":
            console.log("case tree tabKagent");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabTrademark/TablePanel.vue")
            );
            break;
          case "tabPacktype":
            console.log("case tree tabPacktype");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabPacktype/TablePanel.vue")
            );
            break;
          case "tabAffiliation":
            console.log("case tree tabAffiliation");
            currentTable.value = defineAsyncComponent(() =>
              import("./tabAffiliation/TablePanel.vue")
            );
            break;
          // case "help":
          //   currentTable.value = HelpPanel;
          //   break;
          default:
            currentTable.value = undefined;

            break;
        }
        console.log(
          "Произошел выбор справочника таблиц:",
          currentTable.value?.name,
          spravStore.selectedNode?.tableType
        );
      }
    );
    const buttonArr = ref([]);
    // const buttonArr = ref([
    //   { key: "backRoute", name: "Назад" },
    //   //  { key: "Добавить", name: "Второй" },
    // ]);
    function buttonClick(val) {
      if (val == "backRoute") {
        console.log(val);
        $router.go(-1);
      }
    }
    //-------------------------------------------
    const menuObj = ref({ sizeForm: "Размер", helpPanel: "Справка" });
    function menuClick(val) {
      switch (val) {
        case "sizeForm":
          break;
        case "helpPanel":
          console.log("Справка о", spravStore.selectedNode);
          if (spravStore.selectedNode.helpCode)
            helpCode.value = spravStore.selectedNode.helpCode;
          else if (spravStore.selectedNode.key)
            helpCode.value = "treeSprav-" + spravStore.selectedNode.key;
          else {
            helpCode.value = "";
          }
          helpShow.value = true;
          break;

        default:
          break;
      }
    }
    //--------------------------------------------
    return {
      helpShow,
      helpCode,
      cardMain,
      menuObj,
      spravStore,
      currentTable,
      currentTableName,
      splitterModel: ref(30),
      splitHorizont,
      splitStyleH,
      splitStyleW,
      buttonArr,
      subTitle,
      buttonClick,
      menuClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  padding: 6px;
  gap: 10px;
  grid-template-columns: 40% 1fr;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
  }
}
.text-none-table {
  text-align: center;
  font-weight: bold;
  color: #8b8787;
  font-size: 20px;
}
</style>

<template>
  <ark-card
    title="Продукция"
    :subTitle="currentLabel"
    :style="{ width: cardMain.width.curr + 'px' }"
    :pageMaxHeight="pageMaxHeight"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Получить PDF' }"
    @menuClick="menuClick"
  >
    <div class="ark-grid">
      <div class="ark-grid-left">
        <transition appear name="comp-fade" mode="out-in">
          <keep-alive include="ProductsTree">
            <products-tree
              v-if="!currentRowText"
              style="min-width: 100px"
              @on-selected-node="onSelectedNode"
            ></products-tree>
            <products-action
              v-else
              @on-click-recept="$emit('onToRecept')"
              @on-click-pdf="menuClick('pdf')"
            >
            </products-action>
          </keep-alive>
        </transition>
      </div>
      <div class="ark-grid-right">
        <!-- <transition appear name="comp-fade" mode="out-in"> -->
        <component
          v-if="!!currentTable"
          :is="currentTable"
          v-bind="{
            tableInfo: selectedNode2,
            tabname: currentTabname,
            tablabel: currentLabel,
          }"
        ></component>
        <!-- </transition> -->
      </div>
    </div>
    <Pdf-Dialog
      v-model:showDialog="showPdfDialog"
      :param="pdfDialogParam"
    ></Pdf-Dialog>
  </ark-card>
</template>

<script>
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  computed,
  onActivated,
  nextTick,
  onMounted,
} from "vue";
import { dataLoad } from "src/utils/ark.js";
import NoTable from "components/Products/NoTable.vue";
//import ArkCard from "components/Card/ArkCard.vue";
import ArkCard from "components/Products/ArkCard.vue";
import ProductsTree from "components/Products/ProductsTree.vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { arkVuex } from "src/utils/arkVuex.js";
import ProductsAction from "./ProductsAction.vue";
import { emitter } from "../../boot/axios";
import { getPDF } from "src/utils/getPDF.js";
import PdfDialog from "../PDF/PdfDialog.vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
//import { arkVuex } from "src/utils/arkVuex"; // const { pdfWindow } = createArkVuex();
export default defineComponent({
  name: "f-products",
  components: {
    ArkCard,
    ProductsTree,
    ProductsAction,
    PdfDialog,
  },
  props: ["pageMaxHeight"],
  emits: ["onToRecept"],
  setup(props, { emit }) {
    const { pdfWindow } = arkVuex();
    const $q = useQuasar();
    const { cardMain, currentPage } = storeToRefs(usePagesSetupStore());
    const { selectedRowsVuex } = arkVuex();
    const selectedNode = ref({});
    const selectedNode2 = ref({});
    const currentTabname = ref("");
    const router = useRouter();
    const currentTable = ref(null); // подключаемые таблицу
    const currentLabel = ref(null);
    const showPdfDialog = ref(false);
    const pdfDialogParam = ref({});
    onMounted(() => {
      currentPage.value = "products";
    });
    const currentRowText = computed(() => {
      let row = selectedRowsVuex?.products[0];
      if (row) {
        let str =
          row.productvid_name + "<br> " + row.name + " " + row.description;
        return str;
      }
      return "";
    });
    onActivated(() => {
      // Возникает при выходе из keep-alive
      // если был сброшен выбор дерева то очищаем выбор продукта
      // выбор сбросится при переходе с другой страницы
      if (!currentLabel.value) selectedRowsVuex.products.length = 0;
    });
    function onSelectedNode(node) {
      selectedRowsVuex.products.length = 0;
      currentLabel.value = node.label;
      switch (node.table) {
        case "producttype":
          currentTabname.value = "producttype";
          currentTable.value = defineAsyncComponent(() =>
            import("./producttype/Table.vue")
          );

          break;
        case "productrawvid":
          currentTabname.value = "productrawvid";
          currentTable.value = defineAsyncComponent(() =>
            import("./productrawvid/Table.vue")
          );

          break;
        case "productassortment":
          currentTabname.value = "productassortment";
          currentTable.value = defineAsyncComponent(() =>
            import("./productassortment/Table.vue")
          );

          break;
        case "productvid":
          currentTabname.value = "productvid";
          currentTable.value = defineAsyncComponent(() =>
            import("./productvid/Table.vue")
          );
          break;
        case "productraw":
          currentTabname.value = "productraw";
          currentTable.value = defineAsyncComponent(() =>
            import("./productraw/Table.vue")
          );
          break;
        case "products":
          currentTabname.value = "products";
          currentTable.value = defineAsyncComponent(() =>
            import("./products/Table.vue")
          );
          break;
        default:
          currentTable.value = null;
          currentLabel.value = null;
          break;
      }
    }

    const buttonArr = ref([
      { key: "backRoute", name: "Назад" },
      //  { key: "Добавить", name: "Второй" },
    ]);
    function buttonClick(val) {
      if (val == "backRoute") {
        console.log(val);
        router.go(-1);
      }
      if (val == "onToRecept") {
        emit("onToRecept");
      }
    }
    async function menuClick(val, val2) {
      if (val == "pdf") {
        // getPDF("ingredientSostav", { title: "Все продукты" }); // id: "" опущен параметр.
        // router.push({
        //   name: "products",
        //   params: { cmd: "ww" },
        //   //target: "_blank",
        // });
        pdfDialogParam.value = {
          typePdf: "base64", // file/base64
          tgFormat: "pdf", // pdf/jpg
          command: "products",
          fileName: "Продукты",
          id: selectedRowsVuex?.products[0]?.id,
        };
        nextTick(() => {
          showPdfDialog.value = true;
        });
      }
    }
    return {
      cardMain,
      pdfDialogParam,
      menuClick,
      showPdfDialog,
      currentTable,
      currentLabel,
      selectedNode,
      selectedNode2,
      onSelectedNode,
      currentTabname,
      buttonArr,
      buttonClick,
      selectedRowsVuex,
      currentRowText,
      // onClickPdf(row) {
      //   // console.log("в PDF состав продукта id", row);
      //   getPDF("ingredientSostav", {
      //     id: row ? row.id : "",
      //     title: row?.id
      //       ? "Состав продукта\n" +
      //         row.productvid_name +
      //         " " +
      //         row.name +
      //         (row.massa ? " (" + row.massa + ")" : "")
      //       : "Все продукты",
      //   });
      // },
    };
  },
});
</script>

<style lang="scss" scoped></style>

<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 30% 1fr;
  overflow: auto; // для центра
  max-height: inherit; // размер центра
  .ark-grid-left {
    overflow: auto;
    max-height: inherit;
  }
  .ark-grid-right {
    overflow: auto;
    max-height: inherit;
  }
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
    .ark-grid-left {
      overflow: unset;
    }
    .ark-grid-right {
      overflow: unset;
    }
  }
}
//
.comp-fade-enter-active,
.comp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.comp-fade-enter-from,
.comp-fade-leave-to {
  opacity: 0;
}
</style>

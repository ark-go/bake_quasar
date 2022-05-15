<template>
  <ark-card
    title="Продукция"
    :subTitle="currentLabel"
    style="width: 700px"
    :pageMaxHeight="pageMaxHeight"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Получить PDF' }"
    @menuClick="menuClick"
  >
    <div class="ark-grid">
      <div class="ark-grid-left">
        <transition appear name="comp-fade" mode="out-in">
          <keep-alive include="products-tree">
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
import PdfDialog from "./PdfDialog.vue";
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
    const { selectedRowsVuex } = arkVuex();
    const selectedNode = ref({});
    const selectedNode2 = ref({});
    const currentTabname = ref("");
    const router = useRouter();
    const currentTable = ref(null); // подключаемые таблицу
    const currentLabel = ref(null);
    const showPdfDialog = ref(false);
    const pdfDialogParam = ref({});
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
      { key: "onToRecept", name: "Туда" },
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
          fileName: "Смотреть меня",
          id: selectedRowsVuex?.products[0]?.id,
        };
        nextTick(() => {
          showPdfDialog.value = true;
        });
        // let routeData = router.resolve({
        //   name: "products",
        //   params: { cmd: "ww" },
        // });
        // window.open(routeData.href, "_blank");

        //console.log("нажал", currentTabname.value);
        // router.push({
        //   name: "pdf",
        //   query: {
        //     pdfOpts: { tabname: currentTabname.value },
        //   },
        // });
        //! let urlq = await getPDF(currentTabname.value);
        //! console.log("нажал pdff", urlq);
        // $router.push({
        //   name: "pdf",
        //   params: urlq,
        // });
        //!  pdfWindow.command = { ...urlq };
        //!  pdfWindow.show = true;
        // if (currentTabname.value) {
        //   let res = await dataLoad(
        //     "/api/pdfmain",
        //     { pdfOpts: { tabname: currentTabname.value } },
        //     "Запрос разрешения PDF"
        //   );
        //   if (!res.result) {
        //     return;
        //   }
        //   console.log("PDF=" + res.result);
        //   let url =
        //     "/api/pdfget?key=" +
        //     res.result +
        //     "&tabname=" +
        //     currentTabname.value;
        //   $q.notify({
        //     color: "silver",
        //     textColor: "white",
        //     icon: "thumb_up",
        //     message: "Открыть PDF ?",
        //     caption: "откроется в новом окне",
        //     position: "center",
        //     // avatar,
        //     multiLine: true,
        //     timeout: 0,
        //     actions: [
        //       {
        //         label: "Открыть",
        //         color: "green",
        //         handler: () => {
        //           console.log("Запрос" + url);
        //           window.open(url, "_blank");
        //         },
        //       },
        //       {
        //         label: "Не хочу",
        //         color: "yellow",
        //         handler: () => {
        //           /* console.log('wooow') */
        //         },
        //       },
        //     ],
        //   });
        // }
      }
    }
    return {
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
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 40% 1fr;
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

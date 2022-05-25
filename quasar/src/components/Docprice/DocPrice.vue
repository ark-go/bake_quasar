<template>
  <ark-card
    :title="title + ': ' + docPrice.currPanelName"
    :subTitle="subtitleDoc"
    :style="{ width: cardMain.width.curr + 'px' }"
    :buttonArr="buttonArr"
    :pageMaxHeight="pageMaxHeight"
    :heightRabZone="heightRabZone"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'PDF отчет' }"
    @menuClick="menuClick"
  >
    <transition appear name="comp-fade" mode="out-in">
      <keep-alive include="DocDocument">
        <doc-document
          ref="refDocDocument"
          v-if="docPrice.currPanelName == 'Документы'"
          @on-Close-Dialog="onCloseDialog"
          @on-Show-Dialog="onShowDialog"
        ></doc-document>
        <doc-bake v-else-if="docPrice.currPanelName == 'Пекарни'"></doc-bake>
        <doc-price-list
          v-else-if="docPrice.currPanelName == 'Прайс-лист'"
        ></doc-price-list>
      </keep-alive>
    </transition>
    <form-dialog-doc
      :rowData="docPrice.currRowDoc"
      v-model:showDialog="showDialogDoc"
      @onSave="onSave"
    >
    </form-dialog-doc>
    <Pdf-Dialog
      v-model:showDialog="showPdfDialog"
      :param="pdfDialogParam"
    ></Pdf-Dialog>
  </ark-card>
</template>
<script>
import { useDocPrice } from "stores/storeDocPrice.js";
import { useQuasar } from "quasar";
import ArkCard from "components/Docprice/ArkCard.vue";
import {
  defineComponent,
  ref,
  nextTick,
  onUnmounted,
  onMounted,
  computed,
} from "vue";
import FormDialogDoc from "./FormDialogDoc.vue";
import DocDocument from "./DocDocument.vue";
import DocBake from "./Bake/DocBake.vue";
import DocPriceList from "./Price/DocPriceList.vue";
import PdfDialog from "./PdfDialog.vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
export default defineComponent({
  name: "DocPrice",
  components: {
    ArkCard,
    FormDialogDoc,
    DocBake,
    DocDocument,
    DocPriceList,
    PdfDialog,
  },
  props: {
    title: String,
    subTitle: String,
    buttonArr: Object,
    menuObj: Object,
    maxWidth: String,
    pageMaxHeight: Object,
    heightRabZone: [String, Number],
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const { cardMain, currentPage } = storeToRefs(usePagesSetupStore());
    currentPage.value = "docPrice";
    const docPrice = useDocPrice();
    const refTableDoc = ref(null);
    const refDocDocument = ref(null);
    const dateRange = ref({});
    const showDialogDoc = ref(false);
    const showPdfDialog = ref(false);
    const pdfDialogParam = ref({});
    docPrice.currPanelName = "Документы";
    //const activePanel = ref("DocDocument");
    const subtitleDoc = computed(() => {
      return docPrice.currRowDoc?.docnum
        ? "Документ " +
            docPrice.currRowDoc.datestart +
            " №" +
            docPrice.currRowDoc.docnum +
            " " +
            docPrice.currRowDoc.kagent_name
        : props.subTitle;
    });
    onMounted(() => {
      currentPage.value = "docPrice";
    });
    onUnmounted(() => {
      docPrice.currRowDoc = {};
    });
    function onShowDialog() {
      showDialogDoc.value = true;
    }
    function onCloseDialog() {
      showDialogDoc.value = false;
    }
    async function onSave(row) {
      await refDocDocument.value.saveDocument(row);
    }
    async function menuClick(val, val2) {
      if (val == "pdf") {
        $q.dialog({
          title: "Отчет PDF (Прейскурант)",
          message: "Выберите тип отчета:",
          cancel: "Отмена",

          // rounded: true,
          options: {
            type: "radio",
            model: "fullHistory",
            focus: "ok",
            // inline: true
            items: [
              {
                label: "История цен",
                value: "fullHistory",
                color: "secondary",
              },
              { label: "Только последние цены", value: "lastCena" },
              // { label: "Option 3", value: "opt3" },
            ],
          },
          cancel: true,
          persistent: true,
        }).onOk((data) => {
          console.log(">>>> OK, received", data);
          pdfDialogParam.value = {
            typePdf: "base64", // file/base64
            tgFormat: "pdf", // pdf/jpg
            command: "priceAll",
            commandExt: { actionType: data, fileName: "Прайс " + data },
            fileName: "Смотреть меня",
            //  id: selectedRowsVuex?.products[0]?.id,
          };
          nextTick(() => {
            showPdfDialog.value = true;
          });
        });
      }
    }
    return {
      cardMain,
      showPdfDialog,
      pdfDialogParam,
      menuClick,
      onShowDialog,
      onCloseDialog,
      onSave,
      refDocDocument,
      refTableDoc,
      dateRange,
      showDialogDoc,
      docPrice,
      subtitleDoc,
      // activePanel,
    };
  },
});
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 200px 1fr;
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

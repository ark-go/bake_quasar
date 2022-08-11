<template>
  <Tab-Panel-Split>
    <Side-Doc
      @onClickEdit="onClickEdit"
      @onClickNew="onClickNew"
      @onClickDelete="onClickDelete"
      @onClickExcel="onClickExcel"
    ></Side-Doc>
    <template v-slot:after>
      <Table-Panel :checkSave="checkSave"></Table-Panel>
    </template>
  </Tab-Panel-Split>
  <form-doc v-model:showDialog="showDialog" @onSave="onSave"></form-doc>
</template>
<script>
import { ref, defineComponent } from "vue";
import TabPanelSplit from "../TabPanelSplit.vue";
import TablePanel from "./priceDoc/TablePanel.vue";
import FormDoc from "./FormDoc.vue";
import SideDoc from "./side/SideDoc.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc } from "./tableFunc";
export default defineComponent({
  name: "priceDoc",
  components: { TabPanelSplit, TablePanel, SideDoc, FormDoc },
  setup() {
    const { selectedRowDoc } = storeToRefs(usePriceStore());
    const showDialog = ref(false);
    const checkSave = ref(false);
    const tableFunc = useTableFunc("tabPrice");
    function onClickEdit() {
      showDialog.value = true;
    }
    function onClickNew() {
      selectedRowDoc.value = {};
      showDialog.value = true;
    }
    function onSave() {
      // Save уже произошло, а тут команда на обновление
      checkSave.value = !checkSave.value;
    }
    async function onClickDelete() {
      await tableFunc.deleteDocument(selectedRowDoc.value.id);
      checkSave.value = !checkSave.value;
    }
    async function onClickExcel() {
      let res = await tableFunc.exportPriceExcel(selectedRowDoc.value);
      //      console.log("Пришло вот:", res);
      if (res) {
        const blob = b64toBlob(
          res.bufferExcel,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const blobUrl = URL.createObjectURL(blob);
        const anchorTag = document.createElement("a");
        anchorTag.href = blobUrl;

        anchorTag.download = res.fileName; //"My PDF File.xlsx"
        anchorTag.click();
        URL.revokeObjectURL(blobUrl);
      }
    }
    const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };
    return {
      showDialog,
      onClickEdit,
      onClickNew,
      onSave,
      onClickDelete,
      onClickExcel,
      checkSave,
    };
  },
});
</script>

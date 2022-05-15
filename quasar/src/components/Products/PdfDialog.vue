<template>
  <q-dialog
    :model-value="showDialog"
    :maximized="$q.screen.lt.md"
    @update:model-value="(val) => $emit('update:showDialog', val)"
    @before-show="onBeforeShowDialog"
  >
    <q-card
      class="no-scroll"
      style="
        background: rgb(243, 243, 239);
        min-width: 80vw;
        min-height: 80vh;
        width: 100%;
        height: 100%;
      "
    >
      <q-bar class="bg-brand-light">
        <h5 class="text-brand-text">{{ title }}</h5>
        <q-space></q-space>
        <q-btn
          @click="$emit('update:showDialog', false)"
          color="black"
          flat
          icon="close"
        ></q-btn>
      </q-bar>

      <div class="fit">
        <q-pdfviewer type="html5" :src="pdfData" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { dataLoad } from "src/utils/ark.js";
import { ref, defineComponent, onMounted, onUnmounted } from "vue";
export default defineComponent({
  name: "PdfDialog",
  components: {},
  props: {
    showDialog: Boolean,
    param: {
      type: Object,
      default: () => {
        return {
          typePdf: "base64", // file/base64
          tgFormat: "pdf", // pdf/jpg
          command: "",
          fileName: "Смотреть меня",
        };
      },
    },
    // id: [String, Number], //
    // typePdf: {
    //   type: String,
    //   default: "base64", // file/base64
    // },
    // tgFormat: String, // pdf/jpg
    // command: String,
  },
  setup(props) {
    const title = ref("");
    const pdfData = ref("");
    async function onBeforeShowDialog() {
      console.log("старт диалогг");
      await loadTable();
    }
    // onMounted(async () => {
    //   console.log("старт mounted диалогг");
    //   await loadTable();
    // });
    async function loadTable() {
      let mess = "Загрузка PDF";
      let res = await dataLoad("/api/pdfMainLoad", props.param, mess);
      if (res.result) {
        pdfData.value = res.result;
      } else {
        pdfData.value = null;
      }
    }
    return { onBeforeShowDialog, title, pdfData };
  },
});
</script>

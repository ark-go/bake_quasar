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
        {{ platform }}
        <q-btn
          @click="$emit('update:showDialog', false)"
          color="black"
          flat
          icon="close"
        ></q-btn>
      </q-bar>

      <div class="fit">
        <object
          v-if="q.platform.is.android"
          width="100%"
          height="600px"
          :data="pdfData"
          type="application/pdf"
        ></object>
        <q-pdfviewer v-else type="html5" :src="pdfData" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { dataLoad } from "src/utils/ark.js";
import { useQuasar } from "quasar";
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
    const q = useQuasar();
    const title = ref("");
    const pdfData = ref("");
    const platform = ref("");
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
        //   if (q.platform.is.android) {
        //     platform.value = "Андроид" + res.result;
        //     //pdfData.value = res.result;
        //  //   reDataUrl(res.result);
        //   } else {
        //  platform.value = "Не андроид";
        pdfData.value = res.result;
        //}
        //pdfData.value = res.result;
      } else {
        pdfData.value = null;
      }
    }
    function reDataUrl(dataUrl) {
      // let url = (
      //   window.URL ||
      //   window.webkitURL ||
      //   window ||
      //   {}
      // ).createObjectURL(blob);
      // workaround for mobile playback, where it didn't work on chrome/android.
      // fetch blob at url using xhr, and use url generated from that blob.
      // see issue: https://code.google.com/p/chromium/issues/detail?id=227476
      // thanks, gbrlg
      var xhr = new XMLHttpRequest();
      xhr.open("GET", dataUrl, true);
      xhr.responseType = "blob";
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
          var url = (
            window.URL ||
            window.webkitURL ||
            window ||
            {}
          ).createObjectURL(xhr.response);

          pdfSrc.value = url;
          // now url is ready
        }
      };
      xhr.send();
    }
    return { q, onBeforeShowDialog, title, pdfData, platform };
  },
});
</script>

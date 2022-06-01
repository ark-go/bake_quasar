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
        <q-pdfviewer v-model="showPdf" type="html5" :src="pdfData" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
//import { dataLoad } from "src/utils/ark.js";
import { ref, defineComponent, onMounted, onUnmounted } from "vue";
import { axios } from "boot/axios.js";
import { useQuasar } from "quasar";
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
    const showPdf = ref(false);
    async function onBeforeShowDialog() {
      console.log("старт диалогг");
      await loadPDF();
    }
    // onMounted(async () => {
    //   console.log("старт mounted диалогг");
    //   await loadTable();
    // });
    function blobToDataURI(blob) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob); //blob
        reader.onload = function (e) {
          resolve(e.target.result); //base64
        };
      });
    }
    async function loadPDF() {
      //let mess = "Загрузка PDF";
      // let res = await dataLoad("/api/pdfMainLoad", props.param, mess);
      let res = await axios.post("/api/pdf", props.param, {
        responseType: "text",
        // headers: {
        //   Accept: "application/pdf",
        // },
      });
      console.log(
        " тип вернулся",
        typeof res.data,
        "тип данных",
        typeof res.data,
        "----"
        //   res.data
      );
      if (typeof res.data == "string") {
        //const blob = new Blob([res.data], { type: "application/pdf" });
        //pdfData.value = window.URL.createObjectURL(res.data);
        // pdfData.value = "data:application/pdf;base64," + res.data;

        const blob = b64toBlob(res.data, "application/pdf");
        //if (q.platform.is.android)
        androidDataUrl(blob);
        //const blobUrl = URL.createObjectURL(blob);
        //pdfData.value = blobUrl;

        // const parsed = JSON.parse(res.data);

        // retrieve the original buffer of data
        // const buff = Buffer.from(res.data.blob, "base64");
        // console.log("buffer", res.data.blob);
        // // const blob = new Blob([buff]); // JavaScript Blob
        // const blob = new Blob([res.data.blob], { type: res.data.type });
        // const url = window.URL.createObjectURL(blob);
        // console.log("url", url);
        // pdfData.value = url;
        //console.log("что суем в пдф", pdfData.value);
        //data:image/png;base64,
        // await blobToDataURI(res.data).then((reu) => {
        //   pdfData.value = reu; // base64 display picture
        // });
        showPdf.value = true;
      } else {
        showPdf.value = false;
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
    function androidDataUrl(blob) {
      let url = (
        window.URL ||
        window.webkitURL ||
        window ||
        {}
      ).createObjectURL(blob);
      // workaround for mobile playback, where it didn't work on chrome/android.
      // fetch blob at url using xhr, and use url generated from that blob.
      // see issue: https://code.google.com/p/chromium/issues/detail?id=227476
      // thanks, gbrlg
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      //xhr.setRequestHeader("Origin-Agent-Cluster", "?1");
      xhr.responseType = "blob";
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
          var url = (
            window.URL ||
            window.webkitURL ||
            window ||
            {}
          ).createObjectURL(xhr.response);

          pdfData.value = url;
        }
      };
      xhr.send();
    }
    return { onBeforeShowDialog, title, pdfData, showPdf };
  },
});
</script>

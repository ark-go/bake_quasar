<template>
  <div :ref="(val) => (refFull = val)">
    <q-dialog
      style="z-index: 99999999"
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      full-height
      transition-show="slide-up"
      transition-hide="slide-down"
      @show="dialogShow"
    >
      <q-card
        class="bg-primary text-white"
        style="width: 1000px; max-width: 95vw"
      >
        <div :ref="(val) => (refHeader = val)">
          <q-bar>
            <q-space />
            <q-btn
              dense
              flat
              icon="minimize"
              @click="maximizedToggle = false"
              :disable="!maximizedToggle"
            >
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
                >Minimize</q-tooltip
              >
            </q-btn>
            <q-btn
              dense
              flat
              icon="crop_square"
              @click="maximizedToggle = true"
              :disable="maximizedToggle"
            >
              <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
                >Maximize</q-tooltip
              >
            </q-btn>
            {{ platform }}
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
        <!-- <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section> -->

        <!-- <q-card-section class="q-pt-none"> -->
        <div :style="{ maxHeight: body }">
          <q-pdfviewer
            v-model="show"
            type="html5"
            :src="pdfSrc"
            content-class="absolute"
          />
        </div>
        <!-- </q-card-section> -->
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref, watchEffect } from "vue";
import { arkVuex } from "src/utils/arkVuex"; // const { pdfWindow } = createArkVuex();
import { dataLoad } from "src/utils/ark.js";
import { useQuasar } from "quasar";
import { dom } from "quasar";
export default {
  setup() {
    const q = useQuasar();
    const { pdfWindow } = arkVuex();
    const command = ref(pdfWindow.command);
    const pdfSrc = ref("");
    const dialog = ref(pdfWindow.show);
    const refFull = ref(0);
    const refHeader = ref(0);
    const platform = ref("");
    const body = ref(0);
    const { style, height } = dom; //import { dom } from "quasar";
    console.log("SHOW SHOW SHOW", pdfWindow.show);
    watchEffect(() => {
      loadData(command.value).then();
    });

    watchEffect(() => {
      try {
        body.value = height(refFull.value) - height(refHeader.value) + "px";
        console.log(
          "body body body",
          body.value,
          height(refFull.value),
          height(refHeader.value)
        );
      } catch (e) {}
    });
    // const maximizedToggle = ref(true);
    async function loadData(dat) {
      console.log("pdfDialog", dat);
      //  let res = await dataLoad("/api/pdfget", command, "Запрос PDF");
      let res = await dataLoad(
        "/api/pdfmodal",
        { action: "products" },
        "Запрос PDF"
      );
      if (res.error) {
        return console.log("Ошибка запроса PDF:", res.error);
      } else {
        if (q.platform.is.android) {
          platform.value = "Андроид";
          reDataUrl(res.result);
        } else {
          platform.value = "Не андроид";
          pdfSrc.value = res.result;
        }
        console.log("pdfSrc", pdfSrc.value);
        dialog.value = true;
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
    return {
      platform,
      pdfSrc,
      command,
      dialog,
      show: ref(true),
      maximizedToggle: ref(true),
      refFull,
      refHeader,
      dialogShow() {
        try {
          body.value = height(refFull.value) - height(refHeader.value) + "px";
          console.log(
            "body body body",
            body.value,
            height(refFull.value),
            height(refHeader.value)
          );
        } catch (e) {}
      },
    };
  },
};
</script>

<template>
  <q-page class="flex flex-center column" style="min-width: 160px">
    <q-card style="min-height: 420px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="cam" label="Фото" />
        <q-tab name="imgRes" label="Картинка" />
        <q-tab name="camId" label="Выбор" />
      </q-tabs>

      <q-separator />
      <!-- :resolution="{ width: 375, height: 412 }" -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="cam">
          <div style="max-width: 375px; max-height: 412px">
            <camera
              :ref="(el) => (refCamera = el)"
              @loading="loading"
              @started="started"
              :resolution="{ width: 375, height: 412 }"
              autoplay
            >
              <div
                class="column flex"
                style="
                  height: 100%;
                  justify-content: flex-end;
                  padding-bottom: 10px;
                "
              >
                <div class="flex flex-center">
                  <q-btn
                    v-if="loadingText == ''"
                    size="22px"
                    round
                    color="white"
                    text-color="blue"
                    icon="camera"
                    @click="clickPhoto"
                  ></q-btn>
                </div>
              </div>
            </camera>
            <div
              v-if="loadingText != ''"
              style="text-align: center; font-weight: bold; color: blue"
            >
              {{ loadingText }}
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="imgRes">
          <q-img
            :src="urlimg"
            spinner-color="white"
            width="375px"
            style="background-color: silver"
          />
        </q-tab-panel>
        <q-tab-panel name="camId">
          <q-select
            :options="cameras"
            v-model="optmodel"
            option-value="deviceId"
            option-label="label"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
// https://github.com/BastiaanJansen/simple-vue-camera
import { ref, onMounted, watch } from "vue";
import Camera from "simple-vue-camera";
export default {
  components: {
    Camera,
  },
  setup() {
    // Get a reference of the component
    //const camera = ref<InstanceType<typeof Camera>>();
    const refCamera = ref();
    const urlimg = ref();
    const tab = ref("cam");
    const loadingText = ref("");
    const cameras = ref([]);
    const optmodel = ref(null);
    watch(optmodel, (val) => {
      console.log(">>", val.deviceId);
      refCamera.value?.changeCamera(val.deviceId);
      //refCamera.value?.start()
    });
    async function mount() {
      // const devices = await refCamera.value?.devices(["videoinput"]);
      // console.log(devices);
      if (!refCamera.value) return;
      try {
        const devices = await refCamera.value.devices(["videoinput"]);
        cameras.value = devices;
        optmodel.value = cameras.value[0];
        // cameras.value = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];
        console.log(devices);
      } catch (e) {
        console.log(e);
      }
    }

    onMounted(() => {
      mount();
    });
    return {
      tab,
      urlimg,
      refCamera,
      loadingText,
      cameras,
      optmodel,
      loading() {
        loadingText.value = "Загружаем камеру";
      },
      started() {
        loadingText.value = "";
      },
      async clickPhoto() {
        const blob = await refCamera.value?.snapshot({
          width: 600,
          height: 660,
        });
        // To show the screenshot with an image tag, create a url
        blobToDataURL(blob, (urlD) => {
          //  urlimg.value = URL.createObjectURL(blob);
          urlimg.value = urlD;
          tab.value = "imgRes";
          //  console.log(urlimg.value);
          //  console.log(blob);
        });
      },
    };
  },
};
function blobToDataURL(blob, callback) {
  // https://stackoverflow.com/questions/23150333/html5-javascript-dataurl-to-blob-blob-to-dataurl
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
}
</script>

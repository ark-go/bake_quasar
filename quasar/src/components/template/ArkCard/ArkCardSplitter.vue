<template>
  <q-splitter
    v-model="splitterModel"
    :limits="[20, 80]"
    class="maxBodyHeight"
    :horizontal="splitIsHorizont"
    emit-immediately
    @update:model-value="splitUpdate"
    :separator-class="splitIsHorizont ? 'separatorHor' : 'separatorVert'"
  >
    <template v-slot:separator>
      <div :style="splitIsHorizont ? splitStyleH : splitStyleW"></div>
    </template>
    <template v-slot:before>
      <div
        :ref="(val) => (refSplitBefore = val)"
        :class="splitIsHorizont ? 'splitBefore' : 'maxBodyHeight'"
      >
        <slot name="before">
          <div class="maxBodyHeight" style="background-color: green"></div>
        </slot>
      </div>
    </template>
    <template v-slot:after>
      <div
        :ref="(val) => (refSplitAfter = val)"
        :class="splitIsHorizont ? 'splitAfter' : 'maxBodyHeight'"
      >
        <slot name="after">
          <div class="maxBodyHeight" style="background-color: blue"></div>
        </slot>
      </div>
    </template>
  </q-splitter>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  nextTick,
  onMounted,
  onBeforeMount,
} from "vue";
import { useQuasar, dom } from "quasar";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "SplitterSprav",
  components: {},
  props: {
    splitHorizont: {
      type: Boolean,
      default: undefined,
    },
    splitName: {
      type: String,
      default: "def",
    },
  },
  // emits: ["update:filter"],
  setup(props) {
    const $q = useQuasar();
    const pageSetup = usePagesSetupStore();
    const { style, height } = dom;
    const splitterModel = ref(30);
    const splitIsHorizont = ref(false);
    const maxBodyHeightSplitA = ref("");
    const maxBodyHeightSplitB = ref("");
    const refSplitAfter = ref(null);
    const refSplitBefore = ref(null);
    const separatorWidth = ref(3);
    const { cardMain } = storeToRefs(usePagesSetupStore());
    let splitname = "spliter_" + props.splitName;
    onMounted(() => {
      // у нас динамический splitname? если нет то создадим
      if (!cardMain.value[splitname]) cardMain.value[splitname] = {};
      watchEffect(() => {
        if (splitIsHorizont.value)
          splitterModel.value = cardMain.value[splitname]?.horizontal || 50;
        else splitterModel.value = cardMain.value[splitname]?.vertical || 30;
      });
      watch(
        () => splitterModel.value,
        () => {
          // создаем splitname, если нет, повторяем, потому что после сброса настроек его тут уже нет
          if (!cardMain.value[splitname]) cardMain.value[splitname] = {};
          if (splitIsHorizont.value)
            cardMain.value[splitname].horizontal = splitterModel.value;
          else cardMain.value[splitname].vertical = splitterModel.value;
        }
      );
      nextTick(() => {
        resizeCard();
      });
    });
    watchEffect(() => {
      // если задан параметр то по параметру
      if (typeof props.splitHorizont != "undefined") {
        splitIsHorizont.value = props.splitHorizont;
      } else {
        splitIsHorizont.value = $q.screen.width < $q.screen.height;
      }
    });
    async function resizeCard() {
      if (splitIsHorizont.value) {
        await nextTick();
        console.log("resize horizont");
        try {
          //
          maxBodyHeightSplitA.value =
            Math.floor(height(refSplitAfter.value) - separatorWidth.value) +
            "px";
          maxBodyHeightSplitB.value =
            Math.floor(height(refSplitBefore.value) - separatorWidth.value) +
            "px";
          console.log(
            "resize horizont",
            maxBodyHeightSplitA.value,
            "refSplitAfter.value",
            height(refSplitAfter.value)
          );
        } catch (e) {
          console.log("нет элемента верт. пропуск");
        }
        console.log(
          "resize horizont",
          maxBodyHeightSplitA.value,
          maxBodyHeightSplitB.value
        );
      }
    }
    watch(
      () => splitIsHorizont.value,
      () => {
        resizeCard();
      }
    );
    watchEffect(() => {
      let a = pageSetup.arkCardHeight;
      resizeCard();
    });

    function splitUpdate(val) {
      resizeCard();
    }

    const splitStyleW = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "50px",
      minHeight: "6px",
      borderRadius: "3px",
    };
    return {
      splitStyleH,
      splitStyleW,
      splitterModel,
      splitIsHorizont,
      maxBodyHeightSplitA,
      maxBodyHeightSplitB,
      separatorWidth,
      refSplitAfter,
      refSplitBefore,
      splitUpdate,
    };
  },
});
</script>
<!-- <style lang="scss" module>
.splitAfter {
  height: 100%;
  max-height: 100%;
  color: red;
  // overflow: hidden;
  .maxBodyHeight {
    height: v-bind(maxBodyHeightSplitA) !important;
    max-height: v-bind(maxBodyHeightSplitA) !important;
    padding-top: 0; // мешает , и не расчитываем
    padding-bottom: 0;
    overflow: auto;
    color: blueviolet;
  }
}
.splitAfter :slotted(.maxBodyHeight2) {
  height: v-bind(maxBodyHeightSplitA) !important;
  max-height: v-bind(maxBodyHeightSplitA) !important;
  padding-top: 0; // мешает , и не расчитываем
  padding-bottom: 0;
  overflow: auto;
  color: blueviolet;
}
</style> -->
<style lang="scss" scoped>
// .splitBefore {
//   height: 100%;
//   max-height: 100%;
// }
// .splitAfter {
//   height: 100%;
//   max-height: 100%;
// }
.splitBefore {
  height: 100%;
  max-height: 100%;
  //  overflow: hidden;
  :deep(.maxBodyHeight) {
    height: v-bind(maxBodyHeightSplitB);
    max-height: v-bind(maxBodyHeightSplitB);
    padding-top: 0; // мешает , и не расчитываем
    padding-bottom: 0;
    overflow: auto;
  }
}
// :local(.splitAfter) {
//   height: 100%;
//   max-height: 100%;
//   :local(.maxBodyHeight) {
//     height: v-bind(maxBodyHeightSplitA);
//     max-height: v-bind(maxBodyHeightSplitA);
//     padding-top: 0; // мешает , и не расчитываем
//     padding-bottom: 0;
//     overflow: auto;
//   }
// }
:slotted(:deep(.splitAfter)) {
  height: 100%;
  max-height: 100%;
  // overflow: hidden;
  .maxBodyHeight {
    height: v-bind(maxBodyHeightSplitA);
    max-height: v-bind(maxBodyHeightSplitA);
    padding-top: 0; // мешает , и не расчитываем
    padding-bottom: 0;
    overflow: auto;
  }
}
// :slotted(:deep(.maxBodyHeight)) {
//   height: v-bind(maxBodyHeightSplitA) !important;
//   max-height: v-bind(maxBodyHeightSplitA) !important;
//   padding-top: 0; // мешает , и не расчитываем
//   padding-bottom: 0;
//   overflow: auto;
//   color: silver;
// }
:deep(.separatorVert) {
  width: v-bind("separatorWidth + 'px'");
}
:deep(.separatorHor) {
  height: v-bind("separatorWidth + 'px'");
}
</style>

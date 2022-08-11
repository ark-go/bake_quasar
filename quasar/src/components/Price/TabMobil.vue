<template>
  <q-tab-panels v-model="tabModelBottom" animated keep-alive>
    <q-tab-panel
      name="sideTab"
      style="padding: 0"
      :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }"
    >
      <slot name="before"></slot>
    </q-tab-panel>

    <q-tab-panel
      name="dataTab"
      style="padding: 0"
      :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }"
    >
      <slot name="after"></slot>
    </q-tab-panel>
  </q-tab-panels>
  <div :ref="(el) => (refTabsButton = el)">
    <!-- <q-separator /> -->
    <teleport
      to="#tabTeleport"
      :disabled="disableTeleport"
      v-if="!disableTeleport"
    >
      <q-tabs
        v-model="tabModelBottom"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        switch-indicator
      >
        <q-tab name="sideTab" label="Выбор" />
        <q-tab name="dataTab" label="Список" />
      </q-tabs>
    </teleport>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watchEffect,
  watch,
  nextTick,
} from "vue";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "TabMobil",
  props: {},
  components: {},
  setup(props) {
    const refTabsButton = ref();
    //const teleTarget =
    const { maxBodyHeight, maxBodyHeightResize, tabModel } = storeToRefs(
      usePriceStore()
    );
    const tabTarget = ref("#tabTeleport");
    const disableTeleport = ref(true);
    const tabModelBottom = ref("sideTab");
    watch(
      () => tabModel.value,
      () => {
        console.log("окно:", tabModel.value);
      }
    );
    onMounted(() => {
      // ошибки ктораньше появляется, телепорт хочет иметь таргет до появления
      // для этого же я использую v-if в телепорте, не знаю как заставить включаться после таргета
      disableTeleport.value = false;
      nextTick(() => {
        maxBodyHeightResize.value = !maxBodyHeightResize.value;
      });
    });
    return {
      tabModelBottom,
      refTabsButton,
      maxBodyHeight,
      disableTeleport,
      tabTarget,
      tabModel,
    };
  },
});
</script>

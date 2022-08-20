<template>
  <q-tab-panels
    v-model="tabModelBottom"
    animated
    keep-alive
    :swipeable="isMobile"
  >
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
    <!-- <teleport
      to="#tabTeleport"
      :disabled="disableTeleport"
      v-if="!disableTeleport"
    > -->
    <!-- <q-tabs
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
    </q-tabs> -->
    <!-- </teleport> -->
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
import { useSaleStore, storeToRefs } from "src/stores/saleStore";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "TabMobil",
  props: {},
  components: {},
  setup(props) {
    const refTabsButton = ref();
    const $q = useQuasar();
    //const teleTarget =
    const { maxBodyHeight, maxBodyHeightResize, tabModel } = storeToRefs(
      useSaleStore()
    );

    const tabTarget = ref("#tabTeleport");
    const disableTeleport = ref(true);
    const tabModelBottom = ref("sideTab");
    const isMobile = ref($q.platform.is.mobile);
    watch([() => maxBodyHeightResize.value, $q.platform.is.mobile], () => {
      isMobile.value = $q.platform.is.mobile;
      console.log("Переключаем мобилу:", isMobile.value);
    });
    onMounted(() => {
      isMobile.value = $q.platform.is.mobile;
      // ошибки ктораньше появляется, телепорт хочет иметь таргет до появления
      // для этого же я использую v-if в телепорте, не знаю как заставить включаться после таргета
      disableTeleport.value = false;

      // watch(() => {
      // maxBodyHeight.value = `calc(${maxBodyHeight.value} - ${refTabsButton.value.offsetHeight}px)`;

      // });
      nextTick(() => {
        maxBodyHeightResize.value = !maxBodyHeightResize.value;
      });
    });
    return {
      isMobile,
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

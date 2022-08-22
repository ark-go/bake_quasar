<template>
  <q-tab-panel name="main" style="padding: 0">
    <tab-mobil v-if="splitHorizont">
      <template v-slot:before>
        <slot name="default"></slot>
      </template>
      <template v-slot:after>
        <slot name="after"></slot>
      </template>
    </tab-mobil>
    <Splitter-Sprav v-else>
      <template v-slot:before>
        <slot name="default"></slot>
      </template>
      <template v-slot:after>
        <slot name="after"></slot>
      </template>
    </Splitter-Sprav>
  </q-tab-panel>
</template>
<script>
import { defineComponent, ref, watchEffect } from "vue";
import TabMobil from "./TabMobil.vue";
import SplitterSprav from "./SplitterSprav.vue";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "TabPanelSplit",
  components: { TabMobil, SplitterSprav },
  props: {
    tabName: {
      type: String,
    },
  },
  setup() {
    const $q = useQuasar();
    const priceStore = usePriceStore();
    const { maxBodyHeight, tabModel } = storeToRefs(usePriceStore());
    const splitHorizont = ref(null);
    priceStore.watchStore(() => {
      return watchEffect(() => {
        splitHorizont.value = $q.screen.width < $q.screen.height;
      });
    });
    return { maxBodyHeight, splitHorizont, tabModel };
  },
});
</script>

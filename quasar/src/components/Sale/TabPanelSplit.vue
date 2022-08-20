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
import { useSaleStore, storeToRefs } from "src/stores/saleStore";
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
    const { maxBodyHeight, tabModel } = storeToRefs(useSaleStore());
    const splitHorizont = ref(null);
    watchEffect(() => {
      splitHorizont.value = $q.screen.width < $q.screen.height;
    });
    return { maxBodyHeight, splitHorizont, tabModel };
  },
});
</script>

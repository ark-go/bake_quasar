<template>
  <q-tab-panels v-model="tabModel" animated keep-alive>
    <q-tab-panel name="main" style="padding: 0">
      <tab-sprav v-if="splitIsHorizont" :class="maxBodyHeight">
        <template v-slot:before>
          <slot name="before"></slot>
        </template>
        <template v-slot:after>
          <slot name="after"></slot>
        </template>
      </tab-sprav>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
export default defineComponent({
  name: "ArkCardBodySplit",
  components: {},
  props: {
    menuDialogShow: Boolean,
  },
  emits: ["update:menuDialogShow"],
  setup(props) {
    const { cardMain } = storeToRefs(usePagesSetupStore());
    console.log("cardMin", cardMain.value);
    const splitIsHorizont = ref(false);
    watchEffect(() => {
      splitIsHorizont.value = $q.screen.width < $q.screen.height;
    });
    return { cardMain };
  },
});
</script>

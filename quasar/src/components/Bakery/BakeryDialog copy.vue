<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
    @before-show="onShowDialog"
    persistent
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Контрагент</div>
        <div class="text-h9">sub</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
import { useQuasar } from "quasar";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "$1",
  components: {},
  props: {
    showDialog: Boolean,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const showDialog = ref(false);
    $0;
    return {};
  },
});
</script>

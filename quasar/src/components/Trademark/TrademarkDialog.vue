<style lang="scss" scoped>
.ark-card {
  max-width: 250px;
  width: 100%;
}
</style>
<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
  >
    <q-card class="ark-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          {{ inputForSave.id ? "Редактирование:" : "Новый элемент" }}
        </div>
        <div class="text-subtitle2">{{ inputForSave.name }}</div>
      </q-card-section>
      <div style="padding: 6px">
        <q-input
          v-model="inputForSave.name"
          label="Наименование:"
          color="indigo"
          autocomplete="off"
          autofocus
          clearable
          dense
        />
        <TrademarkSelect :sprav="sprav.brand" v-model:select-id="computedSprav">
        </TrademarkSelect>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn dense flat color="primary" v-close-popup @click="onSave"
          >Сохранить</q-btn
        >
        <q-btn
          dense
          flat
          color="primary"
          v-close-popup="cancelEnabled"
          :disable="!cancelEnabled"
          >Отмена</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";
import TrademarkSelect from "./TrademarkSelect.vue";
export default {
  props: {
    showDialog: Boolean,
    // inputArr: Object,
    sprav: Object, // списки таблиц тут на надо brand_name
    rowData: Object, // строка из базы или пустой объект {}
  },
  emits: ["update:showDialog", "onSave"],
  components: {
    TrademarkSelect,
  },
  setup(props, { emit }) {
    const cancelEnabled = ref(true);
    const inputForSave = ref({});
    const selectId = ref("");
    function preDialog() {
      console.log("XXXXXXXXXXXXXXXXXXXXX", props.rowData);
      inputForSave.value = props.rowData;
    }
    const computedSprav = computed({
      get: () => {
        //return props.sprav.brand.find((x) => x.id == inputForSave.value?.id);
        return inputForSave.value.brand_id;
      },
      set: (val) => {
        inputForSave.value.brand_id = val;
      },
    });
    onMounted(() => {
      preDialog();
    });
    // prettier-ignore
    watch(() => props.showDialog, () => { preDialog(); });

    return {
      selectId,
      cancelEnabled,
      emit,
      onSave() {
        console.log(">>>>>>>>>>>>>>", inputForSave.value);
        emit("onSave", inputForSave.value);
      },
      inputForSave,
      computedSprav,
    };
  },
};
</script>

<template>
  <q-dialog
    :model-value="showDialogLoc"
    @update:model-value="(val) => emit('update:showDialog', val)"
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          {{ oldValue ? "Редактирование:" : "Новый элемент" }}
        </div>
        <div class="text-subtitle2">{{ oldValue }}</div>
      </q-card-section>

      <q-input
        style="padding: 0 7px"
        v-model="inputForSave.colValue"
        label="Наименование:"
        color="indigo"
        autocomplete="off"
        autofocus
        clearable
        dense
      />
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
import { ref, watch, onMounted, unref } from "vue";
export default {
  props: {
    showDialog: Boolean,
    inputArr: Object,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const cancelEnabled = ref(true);
    const showDialogLoc = ref(false);
    const inputForSave = ref({});
    const oldValue = ref("");
    function preDialog() {
      inputForSave.value = {};
      inputForSave.value = props.inputArr; //[0];
      oldValue.value = inputForSave.value?.colValue;
      showDialogLoc.value = props.showDialog;
    }
    onMounted(() => {
      preDialog();
    });
    // prettier-ignore
    watch(() => props.showDialog, () => { preDialog(); });

    return {
      unref,
      oldValue,
      cancelEnabled,
      showDialogLoc,
      emit,
      onSave() {
        emit("inputForSave", inputForSave);
      },
      inputForSave,
    };
  },
};
</script>

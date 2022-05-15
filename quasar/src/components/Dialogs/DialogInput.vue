<template>
  <q-dialog
    :model-value="showDialogLoc"
    @update:model-value="(val) => emit('update:showDialog', val)"
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Our Changing Planet</div>
        <div class="text-subtitle2"></div>
      </q-card-section>

      <q-input
        v-for="item in inputForSave"
        style="padding: 0 7px"
        :key="item.id"
        v-model="item.colValue"
        :label="item.colTitle"
        color="indigo"
        autocomplete="off"
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
import { ref, watch, onMounted } from "vue";
export default {
  props: {
    showDialog: Boolean,
    inputArr: Object,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const cancelEnabled = ref(true);
    const showDialogLoc = ref(false);
    const inputForSave = ref([]);
    function preDialog() {
      inputForSave.value = [];
      props.inputArr.forEach((element) => {
        inputForSave.value.push(element);
      });
      showDialogLoc.value = props.showDialog;
    }
    onMounted(() => {
      preDialog();
    });
    // prettier-ignore
    watch(() => props.showDialog, () => { preDialog(); });

    return {
      //show,
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

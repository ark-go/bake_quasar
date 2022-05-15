<style lang="scss" scoped>
.card {
  //width: 100%;
  // max-width: 250px;
}
.card-body {
  padding: 6px;
  width: 250px;
}
</style>
<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
    @before-show="onBeforeShowDialog"
    :persistent="true"
  >
    <q-card class="card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">{{title}}</div>
        <div class="text-h9">{{ rowData?.name || "Новая" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <form-input
            dense
            v-model="currentRow.name"
            hide-hint
            hide-bottom-space
            label="Наименование"
            :lazy-rules="false"
            :rules="[
              (val) => (!!val && val.length >= 2) || 'Ну хотябы два символа',
            ]"
          />
          <form-input
            dense
            v-model="currentRow.prefix"
            hide-hint
            hide-bottom-space
            label="Префикс"
            :lazy-rules="false"
            :rules="[(val) => (!!val && val.length >= 2) || 'от двух символов']"
          />
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          dense
          flat
          color="primary"
          @click="onSave"
          label="Сохранить"
        ></q-btn>
        <q-btn dense flat color="primary" v-close-popup label="Отмена"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
export default defineComponent({
  name: "FormDialog",
  components: { FormInput },
  props: {
    showDialog: Boolean,
    rowData: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const currentRow = ref(null);
    async function onBeforeShowDialog() {
      // перед открытием, скопируем текущую строку таблицы если она есть
      currentRow.value = { ...props.rowData };
    }
    return {
      emit,
      onBeforeShowDialog,
      currentRow,
      onSave() {
        emit("onSave", currentRow.value);
      },
    };
  },
});
</script>

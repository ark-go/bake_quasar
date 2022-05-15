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
        <div class="text-h5">{{ title }}</div>
        <div class="text-h9">{{ rowData?.name || "Новая" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <form-input
            dense
            v-model="currentRow.massbrutto"
            hide-hint
            hide-bottom-space
            label="Брутто"
            suffix="гр."
            :readonly="!currentRow.is_raw"
            :outlined="!currentRow.is_raw"
            :color="!currentRow.is_raw ? 'red-2' : ''"
            :autofocus="currentRow.is_raw"
          />
          <form-input
            dense
            v-model="currentRow.massnetto"
            hide-hint
            hide-bottom-space
            label="Нетто"
            suffix="гр."
            :readonly="!currentRow.is_raw"
            :outlined="!currentRow.is_raw"
            :color="!currentRow.is_raw ? 'red-2' : ''"
          />
          <form-input
            dense
            v-model="currentRow.massfinish"
            hide-hint
            hide-bottom-space
            label="Итог"
            suffix="гр."
            :autofocus="!currentRow.is_raw"
          />
          <q-input
            dense
            label="Примечание"
            :shadow-text="
              currentRow.description
                ? ''
                : 'Введите дополнительные данные об этом виде продукта'
            "
            :model-value="currentRow.description"
            @update:model-value="(val) => (currentRow.description = val)"
            type="textarea"
            autogrow
            clearable
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
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
import { arkVuex } from "src/utils/arkVuex.js";
export default defineComponent({
  name: "BakeryDialog",
  components: { FormInput },
  props: {
    currentTab: String,
    showDialog: Boolean,
    rowData: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const { selectedRowsVuex } = arkVuex();
    const $q = useQuasar();
    const currentRow = ref(null);
    async function onBeforeShowDialog() {
      // перед открытием, скопируем текущую строку таблицы если она есть
      currentRow.value = { ...props.rowData };
      console.log("Показываем у нас есть : ", selectedRowsVuex.products);
      console.log("Показываем окно из ингредиент: ", currentRow.value);
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

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
          <field-select
            label="Тип продукции"
            :sprav="allSprav.producttype"
            v-model:selectId="currentRow.producttype_id"
          />
          <form-input
            dense
            v-model="currentRow.name"
            hide-hint
            hide-bottom-space
            label="Наименование"
            :lazy-rules="true"
            :rules="[
              (val) => (!!val && val.length >= 2) || 'Ну хотябы два символа',
            ]"
          />
          <form-input
            dense
            v-model="currentRow.nameext"
            hide-hint
            hide-bottom-space
            label="Дополнительно"
            clearable
          />
          <field-select
            label="Единица измерения"
            :sprav="allSprav.unit"
            v-model:selectId="currentRow.unit_id"
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
import FieldSelect from "./FieldSelect.vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
export default defineComponent({
  name: "BakeryDialog",
  components: { FormInput, FieldSelect },
  props: {
    showDialog: Boolean,
    rowData: Object,
    allSprav: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const currentRow = ref(null);
    async function onBeforeShowDialog() {
      // перед открытием, скопируем текущую строку таблицы если она есть
      currentRow.value = { ...props.rowData };
      console.log("Показываем окно: ", currentRow.value);
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

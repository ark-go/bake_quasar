<style lang="scss" scoped>
// .card {
//   //width: 100%;
//   // max-width: 250px;
// }
.card-body {
  padding: 6px;
  width: 550px;
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
        <div class="text-h5">{{ rowData?.article }}</div>
        <div class="text-h9">{{ rowData?.price_name || "Новый товар" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <form-input
            dense
            v-model="currentRow.article"
            hide-hint
            hide-bottom-space
            label="Артикул"
            clearable
            clear-icon="close"
          />
          <form-input
            dense
            v-model="currentRow.price_name"
            hide-hint
            hide-bottom-space
            label="Название товара"
            clearable
            clear-icon="close"
          />
          <field-select
            label="Название продукта"
            :sprav="products"
            v-model:selectId="currentRow.products_id"
          />
          <form-input
            dense
            v-model="currentRow.cena"
            hide-hint
            hide-bottom-space
            label="Цена"
            clearable
            clear-icon="close"
          />

          <q-input
            dense
            label="Примечание"
            :shadow-text="currentRow.description ? '' : 'Примечание'"
            :model-value="currentRow.description"
            @update:model-value="(val) => (currentRow.description = val)"
            type="textarea"
            autogrow
            clearable
            clear-icon="close"
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
        <q-btn dense flat color="primary" v-close-popup label="Закрыть"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
//import SelectDateExt from "./SelectDateExt.vue";
import { dataLoad } from "src/utils/ark.js";
import FieldSelect from "./FieldSelect.vue";
export default defineComponent({
  name: "FormDialogProduct",
  components: { FormInput, FieldSelect },
  props: {
    showDialog: Boolean,
    rowData: Object,
    products: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const currentRow = ref(null);
    // const allSprav = ref({});

    onMounted(async () => {
      currentRow.value = { ...props.rowData };
      //   await loadTable();
    });
    async function onBeforeShowDialog() {
      currentRow.value = { ...props.rowData };
      // перед открытием, надо скачать справочники
      console.log("Показываем окно: ", currentRow.value);
    }
    // async function loadTable() {
    //   let mess = "Загрузка справочников";
    //   let res = await dataLoad(
    //     "/api/docprice",
    //     { cmd: "allSprav", tabname: "docprice" },
    //     mess
    //   );
    //   allSprav.value = res?.result || [];
    //   console.log("справ", allSprav.value);
    // }
    return {
      //    allSprav,
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

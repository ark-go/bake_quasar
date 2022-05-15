<style lang="scss" scoped>
// .card {
//   //width: 100%;
//   // max-width: 250px;
// }
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
        <div class="text-h9">{{ rowData?.docnum || "Новая" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <!-- <field-select
            label="Торговая сеть"
            :sprav="allSprav.productvid"
            v-model:selectId=""
          /> -->
          <field-select
            label="Контр.агент"
            :sprav="allSprav.kagent_tm"
            v-model:selectId="currentRow.kagent_tm_id"
          />
          <field-select
            label="Вид документа"
            :sprav="allSprav.docpricevid"
            v-model:selectId="currentRow.docpricevid_id"
          />
          <form-input
            dense
            v-model="currentRow.docnum"
            hide-hint
            hide-bottom-space
            label="Номер документа"
          />
          <form-input
            dense
            v-model="currentRow.name"
            hide-hint
            hide-bottom-space
            label="Наименование документа"
          />
          <select-date-ext
            label="Дата действия цен"
            v-model:value-date="currentRow.datestart"
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
import SelectDateExt from "./SelectDateExt.vue";
import { dataLoad } from "src/utils/ark.js";
import FieldSelect from "./FieldSelect.vue";
export default defineComponent({
  name: "FormDialogDoc",
  components: { FormInput, SelectDateExt, FieldSelect },
  props: {
    showDialog: Boolean,
    rowData: Object,
    //allSprav: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const currentRow = ref(null);
    const allSprav = ref({});
    onMounted(async () => {
      currentRow.value = { ...props.rowData };
      await loadTable();
    });
    async function onBeforeShowDialog() {
      currentRow.value = { ...props.rowData };
      // перед открытием, надо скачать справочники
      console.log("Показываем окно: ", currentRow.value);
    }
    async function loadTable() {
      let mess = "Загрузка справочников";
      let res = await dataLoad(
        "/api/docprice",
        { cmd: "allSprav", tabname: "docprice" },
        mess
      );
      allSprav.value = res?.result || [];
      console.log("справ", allSprav.value);
    }
    return {
      allSprav,
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

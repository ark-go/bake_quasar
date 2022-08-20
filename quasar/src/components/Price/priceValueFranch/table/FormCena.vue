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
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="text-h9">Артикул: {{ selectedRowPrice.article }}</div>
      </q-card-section>
      <q-card-section
        class="bg-primary text-white scroll-y q-px-sm"
        style="max-height: 200px"
      >
        <div class="text-h7">
          <div v-if="selectedFranchPrice.length > 0">
            <div v-for="v of selectedFranchPrice" :key="v.id" class="row">
              <div class="row col-6 items-center text-right q-pr-sm">
                {{ v.bakery_name }}
              </div>
              <div class="row col-6 items-center">
                {{ v.kagent_franch_name }}
              </div>
              <!-- <div class="grid-item">{{ v.bakery_name }}</div>
              <div class="grid-item">{{ v.kagent_franch_name }}</div> -->
            </div>
          </div>
          <div v-else>Выберите пекарни !</div>
        </div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <form-input
            dense
            v-model="currentRow.cena"
            hide-hint
            hide-bottom-space
            label="Цена прайса"
            readonly
          />
          <form-input
            dense
            v-model="currentRow.franch_cena"
            hide-hint
            hide-bottom-space
            label="Цена франчайзи"
            autofocus
          />

          <q-input
            dense
            label="Примечание"
            :shadow-text="
              currentRow.franch_description
                ? ''
                : 'Введите дополнительные данные'
            "
            v-model="currentRow.franch_description"
            type="textarea"
            autogrow
          />
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right" class="row items-center">
        <q-btn
          v-if="selectedFranchPrice.length > 0"
          dense
          flat
          color="primary"
          @click="onReset"
          label="Сброс"
        ></q-btn>
        <q-btn
          v-if="selectedFranchPrice.length > 0"
          dense
          flat
          color="primary"
          @click="onSave(false)"
          label="Сохранить"
        ></q-btn>
        <div v-else>Выберите пекарни!</div>
        <q-btn
          dense
          flat
          color="primary"
          @click="$emit('update:showDialog', false)"
          label="Отмена"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  defineComponent,
  ref,
} from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc } from "./tableFunc";

export default defineComponent({
  name: "FormDoc",
  components: { FormInput },
  props: {
    showDialog: Boolean,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const { selectedRowPrice, selectedFranchPrice } = storeToRefs(
      usePriceStore()
    );
    const tableFunc = useTableFunc("tabPrice");
    const loadingProductVid = ref(false);
    const watchStop = ref(false);
    const currentRow = ref({});
    async function onBeforeShowDialog() {
      console.log("Показываем окно raz: ", selectedRowPrice.value);

      //блокируем перехватчики
      watchStop.value = true;
      // сбрасывем форму
      currentRow.value = {};
      // если данные есть о строке, запускаем считывание данных
      if (selectedRowPrice.value.id) {
        currentRow.value = { ...selectedRowPrice.value };
      }
      // включаем отслеживание
      watchStop.value = false;
    }
    async function onSave(CenaR) {
      console.log(
        "До записи",
        selectedFranchPrice.value,
        currentRow.value,
        CenaR
      );
      let dat = await tableFunc.insertFranchCena(
        currentRow.value,
        selectedFranchPrice.value,
        CenaR
      );
      //selectedFranchPrice[]  price_bakery_id  -- есть
      console.log("После записи", dat, selectedFranchPrice.value);

      if (dat) {
        emit("update:showDialog", false);
        emit("onSave");
      }
    }
    async function onReset() {
      await onSave(true); // CenaR
    }
    return {
      emit,
      onBeforeShowDialog,
      currentRow,
      onSave,
      onReset,
      loadingProductVid,
      selectedFranchPrice,
      selectedRowPrice,
    };
  },
});
</script>
<style lang="scss" scoped>
.grid-form-input {
  padding: 1px;
  display: grid;
  grid-column-gap: 3px;
  grid-template-columns: 1fr 1fr;
  .grid-item {
    font-size: 15px;
    // нечетные
    &:nth-child(odd) {
      text-align: right;
      font-weight: bold;
    }
  }
}
</style>

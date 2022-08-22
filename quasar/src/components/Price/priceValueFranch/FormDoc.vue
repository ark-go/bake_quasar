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
        <div class="text-h9">{{ selectedRowPrice?.article || "Новый" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <form-input
            dense
            v-model="currentRow.article"
            hide-hint
            hide-bottom-space
            label="Артикул"
          />
          <form-input
            dense
            v-model="currentRow.price_name"
            hide-hint
            hide-bottom-space
            label="Название товара"
          />

          <FieldSelect-Product-Vid
            label="Продукт"
            :sprav="allSprav.productvid"
            v-model:selectId="currentRow.productvid_id"
            :loading="loadingProductVid"
          />
          <form-input
            dense
            v-model="currentRow.cena"
            hide-hint
            hide-bottom-space
            label="Цена"
          />

          <q-input
            dense
            label="Примечание"
            :shadow-text="
              currentRow.description ? '' : 'Введите дополнительные данные'
            "
            :model-value="currentRow.description"
            @update:model-value="(val) => (currentRow.description = val)"
            type="textarea"
            autogrow
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
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import FieldSelectProductVid from "./FieldSelectProductVid.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc } from "./tableFunc";

export default defineComponent({
  name: "FormDoc",
  components: { FormInput, FieldSelectProductVid },
  props: {
    showDialog: Boolean,
    //allSprav: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const priceStore = usePriceStore();
    const { selectedRowPrice, selectedRowDoc } = storeToRefs(usePriceStore());
    const tableFunc = useTableFunc("tabPrice");
    const loadingProductVid = ref(false);
    const loadingKagent = ref(false);
    const loadingKagentOwn = ref(false);
    const watchStop = ref(false);
    const allSprav = reactive({});
    const currentRow = ref({
      datestart: null,
      trademark_id: null,
    });
    onMounted(async () => {
      console.log("МОУНТЕД price form");
      await loadProductVid();
    });
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
    priceStore.watchStore(() => {
      return watch(
        () => currentRow.value.datestart,
        async () => {
          if (watchStop.value) return;
          // поменяли дату, перечитаем торговые сети
        }
      );
    });

    async function loadProductVid() {
      loadingProductVid.value = true;
      allSprav.productvid = await tableFunc.loadProductVid();
      loadingProductVid.value = false;
    }
    async function onSave() {
      let isId = allSprav.productvid.findIndex(
        (v) => v.id == currentRow.value.productvid_id
      );
      console.log("На запись", isId, currentRow.value, allSprav.productvid);
      if (isId >= 0) {
        let dat = await tableFunc.addPriceValue(
          currentRow.value,
          selectedRowDoc.value.id
        );
        console.log("После записи", dat);

        if (dat) {
          emit("update:showDialog", false);
          emit("onSave");
        }
      } else {
        throw new Error("Укажите продукт из списка");
      }
    }
    return {
      allSprav,
      emit,
      onBeforeShowDialog,
      currentRow,
      onSave,
      loadingProductVid,
    };
  },
});
</script>

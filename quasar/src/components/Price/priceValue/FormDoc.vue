<style lang="scss" scoped>
// .card {
//   //width: 100%;
//   // max-width: 250px;
// }
.card-body {
  padding: 2px;
  width: 300px;
  max-width: 400px;
  min-width: 300px;
  @media (max-width: 600px) {
    max-width: 95vw;
    min-width: 94vw;
  }
}
</style>
<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
    @before-show="onBeforeShowDialog"
    :persistent="true"
  >
    <q-card class="card card-body">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          {{ selectedRowPrice?.article ? "Изменить позицию" : "Новый товар" }}
        </div>
        <div class="text-h9">
          {{
            selectedRowPrice?.article
              ? "Артикул: " + selectedRowPrice?.article
              : ""
          }}
        </div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column" style="padding: 4px; width: 100%">
          <form-input
            @blur="onBlur"
            dense
            v-model="currentRow.article"
            hide-hint
            hide-bottom-space
            label="Артикул"
          />
          <form-input
            v-if="false"
            dense
            v-model="currentRow.price_name"
            hide-hint
            hide-bottom-space
            label="Название товара"
          />
          <select-tovar
            :tovar_name="currentRow.price_name"
            @update:tovar_name="(val) => (currentRow.price_name = val)"
            v-model:sprav="rowsTovarSelect"
            @productvid_id="(val) => (currentRow.productvid_id = val)"
            label="Название товара!"
            use-input
            @onMounted="onBlur"
            loading="loadingToavar"
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
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import { useQuasar } from "quasar";
import FormInput from "./FormInput.vue";
import SelectTovar from "./SelectTovar.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import FieldSelectProductVid from "./FieldSelectProductVid.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc } from "./tableFunc";
import { useUserStore } from "stores/userStore.js";

export default defineComponent({
  name: "FormDoc",
  components: { FormInput, FieldSelectProductVid, SelectTovar },
  props: {
    showDialog: Boolean,
    //allSprav: Object,
    title: {
      type: String,
      default: "хз",
    },
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const userStore = useUserStore();
    const arkUtils = useArkUtils();
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
    const loadingToavar = ref(false);
    const tovarSelect = ref();
    const rowsTovarSelect = ref([]);
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
    watch(
      () => currentRow.value.datestart,
      async () => {
        if (watchStop.value) return;
        // поменяли дату, перечитаем торговые сети
      }
    );

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
    watch(
      () => tovarSelect.value,
      () => {
        console.log("Выбор селект ", tovarSelect.value);
      }
    );
    async function onBlur(evt) {
      loadingToavar.value = true;
      let dat = await tableFunc.loadPriceValueSelectArticle(
        currentRow.value.article,
        selectedRowDoc.value.kagent_id
      );
      rowsTovarSelect.value = dat;
      loadingToavar.value = false;
      console.log("История артикулов", currentRow.value.article, dat);
    }
    return {
      onBlur,
      allSprav,
      emit,
      onBeforeShowDialog,
      currentRow,
      onSave,
      loadingProductVid,
      selectedRowPrice,
      rowsTovarSelect,
      tovarSelect,
      userStore,
      loadingToavar,
    };
  },
});
</script>

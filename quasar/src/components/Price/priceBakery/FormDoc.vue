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
        <div class="text-h9">{{ selectedRowDoc?.docnum || "Новая" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <select-date-ext
            label="Дата действия цен"
            v-model:value-date="currentRow.datestart"
          />
          <field-select
            label="Торговая сеть"
            :sprav="allSprav.trademark"
            v-model:selectId="currentRow.trademark_id"
            :loading="loadingTrademark"
          />
          <field-select
            label="Контр.агент"
            :sprav="allSprav.kagent"
            v-model:selectId="currentRow.kagent_id"
            :loading="loadingKagent"
          />
          <field-select
            label="Контр.агент собственный"
            :sprav="allSprav.kagentOwn"
            v-model:selectId="currentRow.kagent_own_id"
            :loading="loadingOwn"
          />
          <field-select
            label="Вид документа"
            :sprav="allSprav.pricevid"
            v-model:selectId="currentRow.pricevid_id"
          />
          <form-input
            dense
            v-model="currentRow.docnum"
            hide-hint
            hide-bottom-space
            label="Номер документа"
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
import SelectDateExt from "./SelectDateExt.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import FieldSelect from "./FieldSelect.vue";
import { usePriceStore, storeToRefs } from "stores/priceStore";
import { useTableFunc } from "./tableFunc";

export default defineComponent({
  name: "FormDoc",
  components: { FormInput, SelectDateExt, FieldSelect },
  props: {
    showDialog: Boolean,
    //allSprav: Object,
    title: String,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const { selectedRowDoc } = storeToRefs(usePriceStore());
    const tableFunc = useTableFunc("tabPrice");
    const loadingTrademark = ref(false);
    const loadingKagent = ref(false);
    const loadingKagentOwn = ref(false);
    const watchStop = ref(false);
    const currentRow = ref({
      datestart: null,
      trademark_id: null,
    });
    onMounted(async () => {
      // currentRow.value = { ...selectedRowDoc.value };
      console.log("МОУНТЕД");
    });
    async function onBeforeShowDialog() {
      console.log("Показываем окно raz: ", selectedRowDoc.value);
      await loadPricevid();
      //блокируем перехватчики
      watchStop.value = true;
      // сбрасывем форму
      currentRow.value = {};
      // если данные есть о строке, запускаем считывание данных
      if (selectedRowDoc.value.datestart) {
        currentRow.value = { ...selectedRowDoc.value };
        allSprav.trademark = await tableFunc.loadTrademark(
          selectedRowDoc.value.datestart
        );
        currentRow.value.trademark_id = selectedRowDoc.value.trademark_id;
        await loadKontragents();
        currentRow.value.kagent_id = selectedRowDoc.value.kagent_id;
        currentRow.value.kagent_own_id = selectedRowDoc.value.kagent_own_id;
      }
      // включаем отслеживание
      watchStop.value = false;
    }
    watch(
      () => currentRow.value.datestart,
      async () => {
        if (watchStop.value) return;
        // поменяли дату, перечитаем торговые сети
        await loadTrademarkWatch();
      }
    );
    async function loadTrademarkWatch() {
      loadingTrademark.value = true;
      allSprav.trademark = await tableFunc.loadTrademark(
        currentRow.value.datestart
      );
      loadingTrademark.value = false;
      if (allSprav.trademark.length == 0) {
        // после чтения торговых сетей, получили пусто
        // сбрасываем контрагентов, и ждем выбора сети
        console.log("Сброс ЧЧЧЧЧЧЧЧЧЧЧЧЧЧ данных");
        currentRow.value.trademark_id = null;
        currentRow.value.kagent_id = null;
        currentRow.value.kagentOwn_id = null;

        allSprav.kagent = [];
        allSprav.kagentOwn = [];
      } else {
        // если после чтения сетей чтото прочитали
        // перечитываем контрагентов
        await loadKontragents();
      }
      console.log(
        "Читаем сети на число",
        currentRow.value.datestart,
        allSprav.trademark
      );
    }
    watch(
      () => currentRow.value.trademark_id,
      async () => {
        if (watchStop.value) return;
        // если поменяли торговую сеть, перечитаем контрагентов
        await loadKontragents();
      }
    );
    async function loadKontragents() {
      loadingKagent.value = true;
      allSprav.kagent = await tableFunc.loadKagent(
        currentRow.value.datestart,
        currentRow.value.trademark_id
      );
      loadingKagent.value = false;
      loadingKagentOwn.value = true;
      console.log("Читаем контрагентов на число", allSprav.kagent);
      allSprav.kagentOwn = await tableFunc.loadKagentOwn(
        currentRow.value.datestart,
        currentRow.value.trademark_id
      );
      loadingKagentOwn.value = false;
      console.log("ЧТЕНИЕ КОНТРАГЕНТА", currentRow.value.trademark_id);
      // if (oneStartEdit.value) {
      //   console.log("до", currentRow.value);
      //   currentRow.value.kagent_id = selectedRowDoc.value.kagent_id;
      //   currentRow.value.kagent_own_id = selectedRowDoc.value.kagent_own_id;
      //   console.log("после", currentRow.value);
      //   oneStartEdit.value = false;
      // }
    }
    async function loadPricevid() {
      allSprav.pricevid = await tableFunc.loadPricevid();
    }
    async function onSave() {
      console.log("На запись", currentRow.value);
      let dat = await tableFunc.addDocument(currentRow.value);
      console.log("После записи", dat);
      if (dat) {
        emit("update:showDialog", false);
        emit("onSave");
      }
    }
    const allSprav = reactive({});

    // async function loadTable() {
    //   let mess = "Загрузка справочников";
    //   let res = await arkUtils.dataLoad(
    //     "/api/docprice",
    //     { cmd: "allSprav", tabname: "docprice" },
    //     mess
    //   );
    //   allSprav.value = res?.result || [];
    //   console.log("справ", allSprav.value);
    // }
    return {
      allSprav,
      emit,
      onBeforeShowDialog,
      currentRow,
      onSave,
      loadingTrademark,
      loadingKagent,
      loadingKagentOwn,
    };
  },
});
</script>

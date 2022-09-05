<style lang="scss" scoped>
// .card {
//   //width: 100%;
//   // max-width: 250px;
// }
.card-body {
  padding: 6px;
  width: 600px;
  max-height: 90vh;
  min-width: 500px;
  max-width: 75vw;
  @media (max-width: 600px) {
    max-width: 95vw;
    min-width: 94vw;
  }
}
</style>
<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="$emit('update:showDialog', $event)"
    @before-show="onBeforeShowDialog"
    :persistent="true"
  >
    <q-card class="card-body">
      <!-- <q-card-section class="bg-primary text-white">
        <div class="text-h9">ну..</div>
      </q-card-section> -->
      <q-card-section class="bg-blue-1 text-primary">
        <div class="text-primary text-weight-bold text-blue-14">
          {{ bakerySelectedRow.name }}
        </div>
        <div class="">Сопоставьте столбцы.</div>
      </q-card-section>
      <q-card-section horizontal v-if="!visibleSendSave">
        <q-card-section class="col-6 q-pr-xs">
          <q-item class="q-pb-none">
            <q-item-section side class="col-6 q-py-none text-right"
              >Дата</q-item-section
            >
            <q-item-section
              class="col-6 q-py-none"
              style="justify-content: center"
            >
              <q-select
                dense
                v-model="resultItemsName.datesale"
                class=""
                :options="selectOptions"
                clearable
                clear-icon="close"
                hide-dropdown-icon
              ></q-select>
            </q-item-section>
          </q-item>
          <q-item class="q-pb-none">
            <q-item-section side class="col-6 q-py-none text-right"
              >Артикул</q-item-section
            >
            <q-item-section
              class="col-6 q-py-none"
              style="justify-content: center"
            >
              <q-select
                dense
                v-model="resultItemsName.article"
                :options="selectOptions"
                clearable
                clear-icon="close"
                hide-dropdown-icon
              ></q-select>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-6 q-pl-xs">
          <q-item class="q-pb-none">
            <q-item-section side class="col-6 q-py-none text-right"
              >Количество</q-item-section
            >
            <q-item-section
              class="col-6 q-py-none"
              style="justify-content: center"
            >
              <q-select
                dense
                v-model="resultItemsName.count"
                :options="selectOptions"
                clearable
                clear-icon="close"
                hide-dropdown-icon
              ></q-select>
            </q-item-section>
          </q-item>
          <q-item class="q-pb-none">
            <q-item-section side class="col-6 q-py-none text-right"
              >Любой</q-item-section
            >
            <q-item-section
              class="col-6 q-py-none"
              style="justify-content: center"
            >
              <q-select
                dense
                v-model="resultItemsName.any"
                :options="selectOptions"
                clearable
                clear-icon="close"
                hide-dropdown-icon
              ></q-select>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card-section>
      <!-- <q-card-section class="p-px-none" style="justify-content: center">
        <q-input
          dense
          v-model="currentRow.text"
          hide-hint
          hide-bottom-space
          label="фигня"
          type="textarea"
          rows="3"
          wrap="off"
          @update:model-value="onInputText"
          readonly
        />
      </q-card-section> -->
      <q-separator />
      <q-card-section>
        <Table-Panel
          :rows="rows"
          style="max-height: 40vh"
          :columns="visibleSendSave ? columns : undefined"
        ></Table-Panel>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          dense
          flat
          color="primary"
          @click="onBeforeShowDialog"
          label="Получить буфер"
        ></q-btn>
        <q-space />
        <q-btn
          dense
          flat
          color="orange-5"
          @click="onSendSave"
          label="Готово"
          v-if="visibleSendSave"
        ></q-btn>
        <q-btn
          dense
          flat
          color="primary"
          @click="onTest"
          label="Тест"
          v-if="visibleBtnTest && !visibleSendSave"
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
import { defineComponent, ref, reactive, onMounted, watch, withCtx } from "vue";
import { useQuasar } from "quasar";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import { useSaleStore, storeToRefs } from "stores/saleStore";
import TablePanel from "./TablePanel.vue";
//import { useTableFunc } from "./tableFunc";

export default defineComponent({
  name: "FormManualData",
  components: { TablePanel },
  props: {
    showDialog: Boolean,
    visibleSendSave: Boolean,
    //allSprav: Object,
    title: {
      type: String,
      default: "Документ",
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const { bakerySelectedRow } = storeToRefs(useSaleStore());
    const visibleBtnTest = ref(false);

    const resultItemsName = ref({
      datesale: "",
      article: "",
      count: "",
      any: "",
    });
    const {} = storeToRefs(useSaleStore());
    const selectOptions = ref([]);
    const clipboard = ref("");
    //   const tableFunc = useTableFunc("tabPrice");
    const currentRow = ref({
      text: "",
      datestart: null,
      trademark_id: null,
    });
    onMounted(async () => {
      console.log("МОУНТЕД ShowDialog");
    });
    watch(
      () => props.rows,
      () => {
        if (props.rows.length > 0) {
          selectOptions.value = Object.keys(props.rows[0]);
        }
      }
    );
    watch(
      () => resultItemsName.value,
      () => {
        selectOptions.value = Object.keys(props.rows[0]);

        for (var key in resultItemsName.value) {
          let i = selectOptions.value.indexOf(resultItemsName.value[key]);
          if (i >= 0) {
            selectOptions.value.splice(i, 1);
          }
        }
        if (
          resultItemsName.value.datesale &&
          resultItemsName.value.article &&
          resultItemsName.value.count
        )
          visibleBtnTest.value = true;
        else visibleBtnTest.value = false;
      },
      { deep: true }
    );
    async function onBeforeShowDialog() {
      console.log("Показываем окно вмф: ");
      clipboard.value = "Чего то забыли";
      clipboard.value = await navigator.clipboard.readText(); // получае буфер
      clipboard.value = clipboard.value.trim();
      let test = clipboard.value.substring(0, 300); // отрежем разумную длинну
      let countT = test.match(/(\t)/gm); // посмотрим сколько табов
      // if (countT) console.log("сколько: ", countT.length); // сколько ?
      if (countT && countT.length >= 3) {
        // 3 должно быть минимум
        currentRow.value.text = clipboard.value; // переносим в редактор
        emit("onSaveManualData", { text: clipboard.value }); // отправляем н разбор
      } else {
        emit("onClipboardError"); // стираем старую таблицу если была
        currentRow.value.text =
          "Не правильно :) как ты думаешь что тут. а подсказку тебе дал браузер";
      }
    }
    function onInputText(val) {
      // emit("onSaveManualData", val); // на обработку отключаем...
    }
    function onTest() {
      emit("onSaveManualData", {
        text: clipboard.value,
        column: resultItemsName.value,
      });
    }
    function onSendSave() {
      emit("onSaveData", {
        rows: props.rows,
        //  column: resultItemsName.value,
      });
    }
    const columns = ref([
      {
        name: "datesale",
        label: "Дата",
        align: "right",
        field: "datesale",
        required: true, // нельзя выключить
        sortable: false,
      },
      {
        name: "article",
        label: "Артикул",
        align: "left",
        field: "article",
        required: true, // нельзя выключить
        sortable: false,
      },
      {
        name: "count",
        label: "Кол-во",
        align: "right",
        field: "count",
        required: true, // нельзя выключить
        sortable: false,
      },
      {
        name: "any",
        label: "тест",
        align: "left",
        field: "any",
        required: true, // нельзя выключить
        sortable: false,
      },
    ]);
    return {
      emit,
      onBeforeShowDialog,
      currentRow,
      onTest,
      onInputText,
      selectOptions,
      resultItemsName,
      visibleBtnTest,
      onSendSave,
      columns,
      bakerySelectedRow,
    };
  },
});
</script>

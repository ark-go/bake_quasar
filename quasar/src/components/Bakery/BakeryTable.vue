<template>
  <div class="column no-wrap">
    <q-table
      style="min-width: 100px"
      dense
      :filter="filter"
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table table-kagent-column-table maxBodyHeight"
      virtual-scroll
      v-model:pagination="paginationСatalog"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      title="Пекарни"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="dblClickRow"
    >
      <template v-slot:body="props">
        <table-body
          :propsV="props"
          @on-btn-edit="onEdit"
          @on-btn-delete="onDelete"
          :noEditTable="noEditTable"
          @on-Info-Row="$emit('onInfoRow', $event)"
          :funcTable="loadTable"
          :componentBodyMenu="componentBodyMenu"
        ></table-body>
      </template>
      <template v-slot:top-left>
        <div class="row">
          <q-btn
            v-if="!noEditTable"
            flat
            dense
            round
            color="green"
            icon="add"
            @click="onAdd()"
          />
          <div v-if="!noEditTable" style="min-width: 25px"></div>
          <find-table v-model:filter="filter"></find-table>
        </div>
      </template>
      <template v-slot:top-right v-if="!noEditTable">
        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          display-value="Вид"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 30px"
          borderless
        />
      </template>
      <template v-slot:no-data="dataslot">
        <no-data-footer :dataslot="dataslot"></no-data-footer>
      </template>
      <template v-slot:bottom v-if="noEditTable">
        <q-select
          v-model="visibleColumns"
          multiple
          dense
          options-dense
          display-value="Вид"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 30px"
          borderless
        />
        <q-space />
        <q-pagination
          dense
          v-model="paginationСatalog.page"
          :max="Math.ceil(rows.length / paginationСatalog.rowsPerPage)"
          input
          input-class="text-orange-10"
        />
      </template>
    </q-table>
  </div>
  <bakery-dialog
    :rowData="rowCurrent"
    v-model:showDialog="showDialog"
    @onSave="onSave"
    v-model:edit-mode="editMode"
    :kagentDel="kagentDel"
  ></bakery-dialog>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
import NoDataFooter from "components/NoDataFooter.vue";
import BakeryDialog from "./BakeryDialog.vue";
import TableBody from "./TableBody.vue";
import FindTable from "./FindTable.vue";
import { useQuasar } from "quasar";
//import { Meta } from "quasar";
export default defineComponent({
  name: "SpravTable",
  props: {
    componentBodyMenu: Object,
    noEditTable: {
      type: Boolean,
      default: false,
    },
    // команда для чтения  таблицы, задается при вставке в слот из других компонент
    commandLoad: Object,
  },
  emits: [],
  components: {
    NoDataFooter,
    TableBody,
    BakeryDialog,
    FindTable,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const rows = ref([]);
    const visibleColumns = ref([]);
    const showDialog = ref(false);
    const rowCurrent = ref({});
    //const visibleOffDefault = ref([]);
    //const columns = ref([]);
    onMounted(async () => {
      await loadTable();
      columnFilter();
    });
    async function onSave(row) {
      if (row?.id) console.log("Готов записывать Обновления", row);
      else console.log("Готов записывать Новый объект", row);
      await addTable(row);
    }
    function columnFilter() {
      visibleColumns.value = [];
      columns.forEach((item, index, array) => {
        if (visibleOffDefault.includes(item.name)) return;
        visibleColumns.value.push(item.name);
      });
    }
    // Вставить проверку отрытого окна
    async function loadTable() {
      let mess = "Загрузка пекарен";
      // команда cmd может задаваться из родительских компонентов
      let res = await arkUtils.dataLoad("/api/bakery", props.commandLoad, mess);
      if (res.result) {
        rows.value = res.result;
      } else {
        rows.value = [];
      }
    }
    async function deleteTable(row) {
      let mess = "Удаление";
      let res = await arkUtils.dataLoad(
        "/api/bakery",
        { id: row.id, cmd: "delete" },
        mess
      );
      if (res.result) {
        rows.value = res.result;
        try {
          let idx = rows.value.findIndex((val) => {
            return val.id == row.id;
          });
          if (idx != -1) {
            // если нашли то что удаляли, то удалим из нашего Array таблицы
            //  rows.value.splice(idx, 1);
            await loadTable();
            //console.log("посде удал", rows.value);
          }
        } catch {
          console.log("тут ошибка № 2410");
        }
      } else {
        // Мы не удалили ничего
        //await loadTable();
      }
    }
    async function addTable(row) {
      let mess = "Запись новой пекарни";
      let res = await arkUtils.dataLoad(
        "/api/bakery",
        { ...row, ...{ cmd: "add" } },
        mess
      );
      if (res.result) {
        // получим строку в []
        console.log("Записали", res.result);
        //  console.log("return one row", res.result[0]);
        if (row.id) {
          // если передавали id значит был Update
          // найдем в нашем Array таблице id обновляемой строки
          let idx = rows.value.findIndex((val) => {
            return val.id == row.id;
          });
          if (idx != -1) {
            // если нашли то что обновляли, то заменим новой строкой
            rows.value[idx] = res.result[0];
          } else {
            //! Запустить полное перечитывание
            // не может произойти
            console.log("Аварийное перечитывание");
            await loadTable();
          }
        } else {
          // передавали без Id значит была новая строка
          // вставим полученную новую строку в наш Array таблицы, вперед
          rows.value.unshift(res.result[0]);
        }
        showDialog.value = false;
      } else {
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    async function onDelete(val) {
      //------------- Dialog
      $q.dialog({
        title: "Удалить запись?",
        message: val.name,
        cancel: true,
        persistent: true,
        ok: { label: "Удалить", color: "red-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      })
        .onOk(async () => {
          // console.log('>>>> OK')
          await deleteTable(val);
        })
        .onOk(() => {
          console.log(">>>> second OK catcher");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });

      //--------------------
    }

    // ----------
    return {
      loadTable,
      showDialog,
      onDelete,
      onSave,
      rowCurrent,
      rows,
      filter: ref(""),
      paginationСatalog: ref({
        rowsPerPage: 10,
      }),
      columns,
      visibleColumns,
      visibleOffDefault,
      onAdd(row) {
        rowCurrent.value = row;
        showDialog.value = true;
      },
      onEdit(row) {
        rowCurrent.value = row;
        showDialog.value = true;
      },
    };
  },
});
let visibleOffDefault = [
  "user_email",
  "user_date",
  "territory_name",
  "region_name",
  "address",
  "dateopen",
  "dateclose",
  "area",
  "kolbakers",
  "description",
];
let columns = [
  {
    name: "name",
    label: "Наименование",
    align: "left",
    field: "name",
    required: true,
  },
  {
    name: "franch",
    label: "Фрч",
    align: "left",
    field: "franch",
    required: true,
  },
  {
    name: "trdemark_name",
    label: "Торг.сеть",
    align: "left",
    field: "trdemark_name",
  },
  {
    name: "territory_name",
    label: "Территория",
    align: "left",
    field: "territory_name",
  },
  {
    name: "region_name",
    label: "Регион",
    align: "left",
    field: "region_name",
  },
  {
    name: "city_name",
    label: "Город",
    align: "left",
    field: "city_name",
  },
  {
    name: "address",
    label: "Адрес",
    align: "left",
    field: "address",
  },
  {
    name: "dateopen",
    label: "Открыто",
    align: "left",
    field: "dateopen",
  },
  {
    name: "dateclose",
    label: "Закрыто",
    align: "left",
    field: "dateclose",
  },
  {
    name: "area",
    label: "Площадь",
    align: "left",
    field: "area",
  },
  {
    name: "kolbakers",
    label: "Кол.пекарей",
    align: "left",
    field: "kolbakers",
  },
  {
    name: "ispack",
    label: "Упаковка",
    align: "left",
    field: "ispack",
  },
  {
    name: "own_kagent_name",
    label: "Собственный",
    align: "left",
    field: "own_kagent_name",
  },
  {
    name: "tm_kagent_name",
    label: "Торг.сеть",
    align: "left",
    field: "tm_kagent_name",
  },
  {
    name: "fr_kagent_name",
    label: "Франчайзи",
    align: "left",
    field: "fr_kagent_name",
  },
  {
    name: "description",
    label: "Описание",
    align: "left",
    field: "description",
  },
  {
    name: "user_email",
    label: "EMail",
    align: "left",
    field: "user_email",
  },
  {
    name: "user_date",
    label: "Дата ред.",
    align: "left",
    field: "user_date",
  },
];
</script>

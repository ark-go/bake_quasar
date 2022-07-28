<template>
  <ark-card
    title="Спецификации магазинов"
    :subTitle="subTitle"
    :menuObj="{ help: 'Справка', vtor: 'Второй' }"
    :buttonArr="buttonArr"
    @buttonClick="buttonClick"
    @menuClick="menuClick"
  >
    <div :style="{ maxWidth: Screen.width + 'px', minWidth: '125px' }">
      <q-table
        style="min-width: 100px"
        dense
        no-data-label="Нет данных."
        class="my-sticky-virtscroll-table non-selectable"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="rowid"
        title=""
        :rows="rows"
        :columns="columns"
        :[isVisibleColumns]="visibleColumns"
        @row-dblclick="dblClickRow"
        v-model:expanded="rowExpanded"
      >
        <template v-slot:top-right>
          <q-space />
          <q-select
            v-model="groupSelect"
            multiple
            dense
            options-dense
            display-value="Группа"
            emit-value
            map-options
            :options="groupAll"
            option-value="value"
            options-cover
            style="min-width: 30px"
          />
          <q-select
            v-if="!groupSelect.length"
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
          />
        </template>
        <template v-slot:header="props" v-if="groupSelect.length > 0">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props" v-if="groupSelect.length > 0">
          <q-tr :props="props" @dblclick="dblClickGroupRow(props.row)">
            <q-td auto-width>
              <q-btn
                size="sm"
                flat
                round
                dense
                @click="props.expand = propsExpand(props)"
                :icon="props.expand ? 'expand_more' : 'chevron_right'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <store-built-in></store-built-in>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </ark-card>
  <dialog-alert v-model:message="messageAlert"></dialog-alert>
  <teleport to="body">
    <spec-doc-form
      v-show="specDocFormPopup"
      class="modal"
      @click.self="specDocFormPopup = false"
    ></spec-doc-form>
  </teleport>
</template>

<script>
import {
  ref,
  onMounted,
  reactive,
  toRefs,
  watch,
  computed,
  nextTick,
} from "vue";
import { axios } from "boot/axios";
import ArkCard from "components/Card/ArkCard.vue";
import DialogAlert from "components/Dialogs/DialogAlert.vue";
import SpecDocForm from "components/Spec/SpecDocForm.vue";
import { visibleCol } from "src/utils/visibleCol.js";
import StoreBuiltIn from "components/StoreBuiltIn.vue";
import { Screen } from "quasar";
//import { useState, Task } from "src/utils/useState.js";
import { useState } from "src/utils/ark.js";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();
//import PartnersForm from "components/PartnersForm.vue";
import { useQuasar } from "quasar";

export default {
  name: "SpecDocStore",
  props: ["requiredColumn", "vidColumns"],
  components: {
    ArkCard,
    DialogAlert,
    SpecDocForm,
    StoreBuiltIn,
  },
  setup(props, { emit }) {
    const arkUtils = useArkUtils();
    const { vidTable } = useState(); // import { useState, Task } from "src/utils/useState.js";
    // console.log("::::::::::", vidTable.specDocStore);
    let rows = ref([]);
    const editData = reactive({ email: "fff" });
    const visibleColumnsBuff = ref([]);
    //  const visibleColumns = ref(["store_name", "doc_number", "date_start"]);
    const isDocument = ref(true);
    const subTitle = ref("");
    const groupSelect = ref([]);
    const messageAlert = ref("");
    const columns = ref([]);
    const groupbyBuff = ref([]);
    const specDocFormPopup = ref(false);
    const rowExpanded = ref([]);
    const groupby = ref([]);
    const isVisibleColumns = computed(() =>
      !!groupSelect.value.length ? null : "visible-columns"
    );
    // реализация v-model  читаем из props, отправляем update
    const visibleColumns = visibleCol(
      "specDocStore",
      props?.vidColumns,
      props?.requiredColumn
    );

    const buttonArr = ref([
      { key: "Pervii", name: "Первый" },
      { key: "vtoroi", name: "Второй" },
    ]);
    const groupAll = ref([
      { value: { sortId: 10, field: "date_start" }, label: "Дата" },
      { value: { sortId: 15, field: "doc_number" }, label: "Док. номер" },
      // { value: { sortId: 20, field: "store_name" }, label: "Магазин" },
      { value: { sortId: 40, field: "region" }, label: "Регион" },
      {
        value: { sortId: 50, field: "territory" },
        label: "Территория",
      },
      { value: { sortId: 60, field: "brandname" }, label: "Бренд" },
      {
        value: { sortId: 70, field: "distributing" },
        label: "Сеть",
      },
      { value: { sortId: 80, field: "city" }, label: "Город" },
      { value: { sortId: 90, field: "street" }, label: "Улица" },
    ]);
    function createButtonGroup() {
      buttonArr.value = [
        { key: "addSpecGroup", name: "Добавить на группу" },
        { key: "vtoroi", name: "Второй" },
      ];
    }
    function createButtonNoGroup() {
      buttonArr.value = [
        { key: "addSpec", name: "Добавить" },
        { key: "vtoroi", name: "Второй" },
      ];
    }
    // загрука основной таблицы по группам
    async function dataAllLoad() {
      rowExpanded.value = []; // закрываем развернутые строки
      groupby.value = [];
      groupSelect.value.sort(sortColumn);
      console.log("groupSelect1", groupSelect.value);
      //console.log("groupSelect2", groupSelect.value[0]);
      groupSelect.value.forEach((item) => {
        groupby.value.push(item.field);
      });

      const m = await dataLoadM(groupby.value);
      if (!!groupby.value.length) {
        if (
          groupby.value.includes("date_start") &&
          !groupbyBuff.value.includes("date_start") // была ли раньше выбрана дата
        ) {
          messageAlert.value = " Ах. ";
        }
        columns.value = getColumnsGroup(groupby.value, groupAll.value);
        subTitle.value = ""; // очищаем заголовок
        let nameArr = [];
        columns.value.forEach((item) => {
          nameArr.push(item.label);
          // массив в строку
          if (nameArr) subTitle.value = "Группировка:\n" + nameArr.join(", "); // выдаем список в заголовок
          createButtonGroup();
        });
        groupbyBuff.value = groupby.value.slice(); // сохраним выбор, чтоб сравнивать потом
      } else {
        groupbyBuff.value = [];
        columns.value = columnsAll;
        subTitle.value = "";
        createButtonNoGroup();
      }
      rows.value = m.result;

      // if (rowExpanded.value.length == 1)
      //   await propsExpand(rowExpanded.value[0]);
      // else rowExpanded.value = [];
    }

    const mount = async () => {
      await dataAllLoad();
    };
    onMounted(mount);
    function dblClickGroupRow(row) {
      console.log("dblClickGroupRow::", row);
    }
    function dblClickRow(evt, row, idx) {
      console.log("dblCLick::", row, evt);
      if (groupSelect.value.length > 0) {
        messageAlert.value =
          " \
          При группировке значений выбрать спецификации нельзя! <br> \
          Группировка используется для группового добавления \
          ";
      } else {
        emit("dblClick", row);
      }
    }
    watch(groupSelect, async () => {
      await dataAllLoad();
    });
    async function dataLoadM(groupData, rowData, isChilds = false) {
      return await arkUtils.dataLoad("/api/specdocLoad", {
        groupby: groupData, //["store_name", "region", "city", "street"],
        rowData: rowData, // выбранные данные
        isChilds: isChilds, // если true - выдавать детей по группе
      });
      return;
      try {
        let resp = await axios.post("/api/specdocLoad", {
          groupby: groupData, //["store_name", "region", "city", "street"],
          rowData: rowData, // выбранные данные
          isChilds: isChilds, // если true - выдавать детей по группе
        });
        let data = resp.data;
        // console.log("specdocLoad", data.result);
        return data;
      } catch (err) {
        console.log(err);
        return {
          error: "specdocLoad: Ошибка чтения данных",
        };
      }
    }
    // ждем массив группировки
    // отправляем запрос магазинов по выбранной группировке и дате
    async function dataExpandTableLoad(groupData, rowData) {
      console.log("отправляем", rowData);
      return await dataLoadM(groupData, rowData, true);
    }
    function getColumnsGroup(groupSelect, groupAll) {
      let result = [];
      groupSelect.forEach((item) => {
        let res = {};
        // поиск объекта в массиве объектов
        res.name = item;
        res.label = groupAll.find((x) => x.value.field === item).label; // русское
        res.sortId = groupAll.find((x) => x.value.field === item).value.sortId; // Сортировка
        res.align = "left";
        res.field = item;
        result.push(res);
      });
      //result.sort(sortColumn);
      result.push({
        name: "count",
        label: "Позиций",
        align: "center",
        field: "count",
      });
      // console.log("Колонки", result);
      return result;
    }
    // для сортировки столбцов
    function sortColumn(a, b) {
      if (a.sortId < b.sortId) {
        return -1;
      }
      if (a.sortId > b.sortId) {
        return 1;
      }
      return 0;
    }

    return {
      Screen,
      editData,
      columns,
      rows,
      isDocument,
      pagination: ref({
        rowsPerPage: 10,
      }),
      isVisibleColumns,
      visibleColumns,
      dblClickRow,
      dblClickGroupRow,
      menuClick(val) {
        if (val == "help") {
          messageAlert.value =
            "<b>Группа:</b> магазины группируются по выбранным параметрам,<br>" +
            "<b>Вид:</b> позволяет выбрать видимые столбцы," +
            "моут существовать обязательные столбцы, которые нельзя убрать из выбора," +
            "в режиме выбора Групп, видимые столбцы нельзя выбрать";
        }
        console.log("h-----", val);
      },
      buttonClick(val) {
        console.log("Button Card", val);
        if (val == "addSpec") {
          specDocFormPopup.value = true;
        }
      },
      groupSelect,
      groupAll,
      subTitle,
      buttonArr,
      messageAlert,
      specDocFormPopup,
      rowExpanded,
      async propsExpand(val) {
        // обработка разворачивания строки
        // val.key - ключ строки которую открывают/закрывают
        let currentExpand = rowExpanded.value; // все открытые строки
        if (currentExpand.includes(val.key)) {
          // если строка которую нажали уже есть в списке, удаляем из видимых
          nextTick(() => {
            // необходимо так, мы должны сделать это когда вернем эту функцию
            rowExpanded.value = []; // закрываем все expand
          });
        } else {
          // если нажатой нет в списке, то ставим ее единственной в список
          console.log("Открываем эту строку", val); // val.row - вся строка из бызы ? а нужна ли

          console.log("а группировка у нас такая", groupSelect.value); // тест
          //await dataExpandTableLoad(groupSelect.value);
          let res = await dataExpandTableLoad(groupby.value, val.row);
          if (res.error) {
            console.error(
              "dataExpandTableLoad Ошибка чтения вложенных групп",
              res.error.toString()
            );
            return;
          }

          console.log("dataExpandTableLoad:", res.result);
          vidTable.dataStoreBuiltIn = {
            group: groupby.value,
            result: res.result,
          };
          nextTick(() => {
            rowExpanded.value = [val.key];
          });
        }
        return false; //  не важно нам тут !val.expand; // это произойдет до nextTick ! а nexTick переключит как надо
      },
    };
  },
};

const columnsAll = [
  {
    name: "store_city",
    label: "Город",
    align: "left",
    field: "store_city",
  },
  {
    name: "store_street",
    label: "Улица",
    align: "left",
    field: "store_street",
  },
  {
    name: "date_start",
    label: "Дата",
    align: "right",
    field: "date_start",
  },
  {
    name: "doc_number",
    label: "№ Документа",
    align: "left",
    field: "doc_number",
  },
  {
    name: "countvalue",
    label: "Позиций",
    align: "center",
    field: "countvalue",
  },
  {
    name: "prim",
    label: "Примечание",
    align: "left",
    field: "prim",
  },
];
</script>

<style></style>

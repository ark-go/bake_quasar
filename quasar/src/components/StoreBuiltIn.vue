<template>
  <!-- <partners-form :data="editData" @update-table="updateTable"></!-->
  <div :style="{ maxWidth: Screen.width + 'px', minWidth: '125px' }">
    <q-table
      style="min-width: 100px"
      dense
      no-data-label="Нет данных."
      no-results-label="Ничего не найдено."
      class="my-sticky-virtscroll-table"
      virtual-scroll
      :filter="filter"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="id"
      title="Магазины"
      :rows="rows"
      :columns="columns"
      :visible-columns="visibleColumns"
      @row-dblclick="(event, val) => emit('dblClick', val)"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:top-left>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Поиск"
          autocomplete="off"
          name="tabNomencl"
        >
          <template v-slot:append>
            <q-icon
              v-if="filter !== ''"
              name="close"
              class="cursor-pointer"
              @click.stop="filter = ''"
            />
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-right>
        <!-- <img
          style="height: 50px; width: 50px"
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
        /> -->

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
        />
      </template>
      <template v-slot:no-data="dataslot">
        <no-data-footer :dataslot="dataslot"></no-data-footer>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted, reactive, toRefs, watch, computed } from "vue";
import { axios } from "boot/axios";
import NoDataFooter from "components/NoDataFooter.vue";
import { Screen } from "quasar";
import { visibleCol } from "src/utils/visibleCol.js";
import { useState } from "src/utils/useState.js";
export default {
  name: "StoreBuiltIn",
  props: ["vidColumns", "requiredColumn"], // виндны колоники, и обязательные к показу
  events: ["update:vidColumns"],
  components: {
    NoDataFooter,
  },
  setup(props, { emit }) {
    const { vidTable } = useState(); // import { useState, Task } from "src/utils/useState.js";
    // const { state, vidTable } = useState();
    // console.log("Statate-222", state);
    const test = ref("");
    // реализация v-model  читаем из props, отправляем update
    const visibleColumns = visibleCol(
      "storeBuiltIn",
      props?.vidColumns,
      props?.requiredColumn
    );
    const selected = ref([]);
    const rows = ref([]);
    const rowsG = computed(() => vidTable.dataStoreBuiltIn);
    watch(rowsG, () => {
      selected.value = []; // сбрасываем выделение после загрузки
      rows.value = rowsG.value.result;
      console.log("group:", rowsG.value.group, rowsG.value.result);
      let visible = [];
      if (!!rowsG.value.result.length) {
        for (let key in rowsG.value.result[0]) {
          if (["ourlegal", "legal"].includes(key)) continue;
          if (!rowsG.value.group.includes(key)) visible.push(key);
        }
        // visibleColumns.value = rowsG.value.group;
      }
      visibleColumns.value = visible;
    });

    const editData = reactive({ email: "fff" });
    console.log("Вид колонок пришло проп", props?.vidColumns);

    const filter = ref();
    const mount = async () => {
      filter.value = "";
      test.value = "Mounted";
      // const m = await dataLoad();
      // rows.value = m.result;
    };
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      //editData.value = { email: "98888777" };
      //    editData.value = { ...row }; //  = reactive(row); //toRefs(row);
    }
    // async function updateTable() {
    //   const m = await dataLoad();
    //   rows.value = m.result;
    // }
    return {
      editData,
      test,
      columns,
      rows,
      selected,
      pagination: ref({
        rowsPerPage: 10,
      }),
      visibleColumns,
      filter,
      dblClickRow,
      Screen,
      emit,
      getSelectedString() {
        console.log(
          "Выбрали:",
          selected.value.length === 0
            ? ""
            : `${selected.value.length} record${
                selected.value.length > 1 ? "s" : ""
              } selected of ${rows.value.length}`
        );
      },
      //     updateTable,
    };
  },
};
async function dataLoad() {
  try {
    let resp = await axios.post("/api/storeLoad", {});
    let data = resp.data;
    console.log("storeLoad", data.result);
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "storeLoad: Ошибка чтения данных (storeLoad)",
    };
  }
}
const columns = [
  //   {
  //     name: "index",
  //     label: "#",
  //     field: "index",
  //   },
  {
    name: "region",
    label: "Регион",
    field: "region",
    sortable: true,
  },
  {
    name: "territory",
    label: "Территория",
    field: "territory",
    sortable: true,
  },
  {
    name: "city",
    // required: true, // не даст убрать выбор со столбца "вид"
    label: "Город",
    align: "left",
    field: "city",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "street",
    label: "Улица, дом",
    align: "left",
    field: "street",
    // field: (row) => row.name,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "brandname",
    align: "center",
    label: "Бренд",
    field: "brandname",
    sortable: true,
  },
  {
    name: "distributing",
    align: "center",
    label: "Торговая сеть",
    field: "distributing",
    sortable: true,
  },
  {
    name: "legal",
    align: "center",
    label: "Юр лицо магазина",
    field: "legal",
    sortable: true,
  },
  {
    name: "ourlegal",
    align: "left",
    label: "Наше юр лицо",
    field: "ourlegal",
    sortable: true,
  },
  {
    name: "count",
    align: "left",
    label: "Позиций",
    field: "count",
    sortable: true,
  },
];
</script>

<style></style>

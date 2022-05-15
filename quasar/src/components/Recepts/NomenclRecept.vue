<template>
  <div class="column flex flex-center">
    <div class="">
      <div class="row">
        <q-table
          style="min-width: 100px"
          dense
          no-data-label="Нет данных."
          no-results-label="Ничего не найдено."
          :filter="filter"
          class="my-sticky-virtscroll-table non-selectable"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :virtual-scroll-sticky-size-start="48"
          row-key="email"
          title=""
          :rows="rows"
          :columns="columns"
          @row-dblclick="dblClickRow"
          @row-contextmenu.prevent="contextTable"
          :loading="loading"
        >
          <template v-slot:top-right>
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
            <q-checkbox
              v-model="extendedTable"
              checked-icon="star"
              unchecked-icon="star_border"
              indeterminate-icon="help"
            />
          </template>
          <template v-slot:no-data="dataslot">
            <no-data-footer :dataslot="dataslot"></no-data-footer>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, watch, computed, toRefs } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
import NoDataFooter from "components/NoDataFooter.vue";
export default {
  name: "NomenclRecept",
  props: ["dataRec"],
  components: { NoDataFooter },
  setup(props, { emit }) {
    const visibleColumns = ref([]);
    const filter = ref("");
    const rows = ref([]);
    //  const columns = ref([]);
    function contextTable() {}
    const loading = ref(false);
    const extendedTable = ref(false);

    async function loadRecepts(nomencl_id) {
      let res = await receptsNomenclLoad(nomencl_id);
      if (res.error) {
        console.log("Error receptsNomenclLoad:", res.error);
      } else {
        rows.value = res.message;
        console.log("load recepts3,", res.message);
      }
    }
    watch(props, async () => {
      let dataRow = props.dataRec;
      await loadRecepts(dataRow.nomencl_id);
    });
    onMounted(async () => {
      let dataRow = props.dataRec;
      console.log("Пришло nomenclRecepts", dataRow);
      await loadRecepts(dataRow.nomencl_id);
    });
    function dblClickRow(evt, row, idx) {
      console.log("dblClickRecept", row);
      emit("goRecept", row);
    }
    return {
      emit,
      visibleColumns,
      filter,
      pagination: ref({
        rowsPerPage: 10,
      }),
      rows,
      columns,
      dblClickRow,
      contextTable,
      loading,
      extendedTable,
    };
  },
};
// читаем ингредиенты по заданному "номеру" рецкпта
async function receptsNomenclLoad(nomencl_id) {
  try {
    let resp = await axios.post("/api/receptsNomenclLoad", {
      nomenclId: nomencl_id,
    });
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "receptsNomenclLoad: Ошибка чтения данных",
    };
  }
}
//visibleColumns
const columns = [
  {
    name: "nomencl_name",
    label: "Вид временно",
    field: "nomencl_name",
    align: "left",
    sortable: true,
  },
  {
    name: "recept_name",
    label: "Номенклатура",
    field: "recept_name",
    align: "left",
    sortable: true,
  },
];
</script>

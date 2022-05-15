<template>
  <div class="column flex flex-center">
    <div class="">
      <div class="row">
        <q-table
          style="min-width: 100px"
          dense
          no-data-label="Нет данных."
          no-results-label="Ничего не найдено."
          :visible-columns="visibleColumns"
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
          <template v-slot:body-cell="props">
            <add-recept-context-menu
              :dataslot="props"
              @add-to-recept="addToRecept"
            ></add-recept-context-menu>
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
import AddReceptContextMenu from "components/Recepts/AddReceptContextMenu.vue";
export default {
  name: "AllIngredients",
  props: ["dataRec", "infoRecept"],
  components: { NoDataFooter, AddReceptContextMenu },
  setup(props, { emit }) {
    const visibleColumns = ref([]);
    const filter = ref("");
    const rows = ref([]);
    //  const columns = ref([]);
    function dblClickRow() {}
    function contextTable() {}
    const loading = ref(false);
    const extendedTable = ref(false);
    const mainReceptId = ref(null);
    //--
    watch(extendedTable, () => {
      changeVidNomencl();
    });
    const changeVidNomencl = async () => {
      visibleColumns.value = [];
      columns.forEach((item, index, array) => {
        if (!extendedTable.value) {
          if (["vidnomencl_name", "article"].includes(item.name)) return;
          // if (item.name == "vidnomencl_name") return;
          // if (item.name == "article") return;
        }
        visibleColumns.value.push(item.name);
      });
    };
    //--
    async function mount() {
      console.log("Текущий Рецепт ИД:", props.infoRecept.recept_id);
      mainReceptId.value = props.infoRecept.recept_id;
      let res = await loadIngredient();
      changeVidNomencl();
      if (res.error) {
        console.log("Error loadIngredient:", res.error);
      } else {
        rows.value = res.result;
        console.log("load recepts,", res.result);
      }
    }
    watch(props, async () => {
      await mount();
    });
    onMounted(async () => {
      await mount();
    });
    return {
      emit,
      visibleColumns,
      filter,
      mainReceptId,
      pagination: ref({
        rowsPerPage: 10,
      }),
      rows,
      columns,
      dblClickRow,
      contextTable,
      loading,
      extendedTable,
      addToRecept(val) {
        console.log("Добавить в рецепт1:", val);
        let dataToRecord = {
          recept_id: mainReceptId.value,
          nomencl_id: val.row.nomencl_id,
          recept_idx: val.row.recept_id,
          recept_name: val.row.recept_name,
        };
        console.log("Добавить в рецепт2:", dataToRecord);
        emit("addToRecept", dataToRecord);
      },
    };
  },
};
// читаем ингредиенты по заданному "номеру" рецкпта
async function loadIngredient() {
  try {
    let resp = await axios.post("/api/nomenclReceptsLoad", {});
    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "nomenclReceptsLoad: Ошибка чтения данных (nomenclReceptsLoad)",
    };
  }
}
//visibleColumns
const columns = [
  {
    name: "article",
    label: "Артикул",
    field: "article",
    align: "left",
    //  sortable: true,
  },
  {
    name: "recept_name",
    label: "Выбор ингредиента",
    field: "recept_name",
    align: "left",
    //  sortable: true,
  },
  {
    name: "vidnomencl_name",
    label: "Вид номнклатуры",
    field: "vidnomencl_name",
    align: "left",
    //  sortable: true,
  },
];
</script>

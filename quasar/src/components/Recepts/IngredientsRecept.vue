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
            <del-recept-context-menu
              :dataslot="props"
              @del-from-recept="delFromRecept"
            ></del-recept-context-menu>
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
import DelReceptContextMenu from "components/Recepts/DelReceptContextMenu.vue";

export default {
  name: "IngredientsRecept",
  props: ["dataRec", "infoRecept"],
  components: { NoDataFooter, DelReceptContextMenu },
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
    watch(extendedTable, () => {
      changeVidNomencl();
    });
    const changeVidNomencl = async () => {
      visibleColumns.value = [];
      console.log("Колонки", columns);
      columns.forEach((item, index, array) => {
        if (!extendedTable.value) {
          if (
            item.name == "article" ||
            item.name == "brutto" ||
            item.name == "netto" ||
            item.name == "itogo" ||
            item.name == "comment"
          )
            return;
        }
        visibleColumns.value.push(item.name);
      });
      console.log("Колонки показать", visibleColumns.value);
    };
    function reLoadIngredients() {
      loadIngred(mainReceptId.value);
    }
    async function loadIngred(mainId) {
      console.log("Будем читать состав рецепта:", mainId);
      let res = await loadIngredients(mainId);
      if (res.error) {
        console.log("Error loadIngredient:", res.error);
      } else {
        rows.value = res.message;
        console.log("Загрузили состав рецепта:", rows.value);
      }
    }
    async function mount() {
      console.log("2>Текущий Рецепт ИД:", props.infoRecept.recept_id);
      mainReceptId.value = props.infoRecept.recept_id;
      loadIngred(mainReceptId.value);
      changeVidNomencl();
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
      pagination: ref({
        rowsPerPage: 10,
      }),
      rows,
      columns,
      dblClickRow,
      contextTable,
      loading,
      extendedTable,
      mainReceptId,
      reLoadIngredients,
      delFromRecept(val) {
        console.log("Хотим удалить:", val);
        emit("delFromRecept", val);
      },
    };
  },
};
// читаем ингредиенты по заданному "номеру" рецкпта
async function loadIngredients(receptId) {
  try {
    let resp = await axios.post("/api/ingredientsLoad", {
      receptId: receptId,
    });

    let data = resp.data;
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "loadIngredients: Ошибка чтения данных (loadIngredients)",
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
    sortable: true,
  },
  {
    name: "nameingredient",
    label: "Ингредиент",
    field: "nameingredient",
    align: "left",
    sortable: true,
  },
  {
    name: "brutto",
    label: "Бруто",
    field: "brutto",
    align: "left",
    sortable: true,
  },
  {
    name: "netto",
    label: "Нетто",
    field: "netto",
    align: "left",
    sortable: true,
  },
  {
    name: "itogo",
    label: "Выход",
    field: "itogo",
    align: "left",
    sortable: true,
  },
  {
    name: "comment",
    label: "Коммент",
    field: "comment",
    align: "left",
    sortable: true,
  },
];
</script>

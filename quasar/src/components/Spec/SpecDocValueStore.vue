<template>
  <ark-card
    title="Спецификация"
    :subTitle="dateMagazin"
    :menuObj="{ perv: 'Первый', vtor: 'Второй' }"
    :buttonArr="[
      { key: 'back', name: 'Назад' },
      { key: 'addSpec', name: 'Добавить' },
    ]"
    @buttonClick="buttonClick"
    @menuClick="menuClick"
  >
    <div class="flex column">
      <q-table
        style="min-width: 100px"
        dense
        no-data-label="Нет данных."
        class="my-sticky-virtscroll-table non-selectable"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="email"
        title=""
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        @row-dblclick="dblClickRow"
      >
        <template v-slot:top-right>
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
      </q-table>
    </div>
  </ark-card>
</template>

<script>
import { ref, onMounted, reactive, toRefs, watch } from "vue";
import { axios } from "boot/axios";
import ArkCard from "components/Card/ArkCard.vue";
//import PartnersForm from "components/PartnersForm.vue";
import { useQuasar } from "quasar";

export default {
  name: "SpecDocValueStore",
  components: {
    ArkCard,
  },
  props: ["idDocument", "dateMagazin"],
  setup(props, { emit }) {
    const subTitle = ref("");
    let rows = ref([]);
    const editData = reactive({ email: "fff" });
    const visibleColumns = ref(["article_store", "product", "cena"]);
    async function startDataLoad() {
      if (props.idDocument && props.idDocument > 0) {
        const m = await dataLoad(props.idDocument);
        rows.value = m.result || [];
      }
    }
    const mount = async () => {
      startDataLoad();
    };
    watch(props, async () => {
      console.log("Получили запрос данных на документ", props.idDocument);
      startDataLoad();
    });
    onMounted(mount);
    function dblClickRow(evt, row, idx) {
      //editData.value = { email: "98888777" };
      //    editData.value = { ...row }; //  = reactive(row); //toRefs(row);
    }
    function buttonClick(val) {
      if (val == "back") {
        emit("onExit");
      }
    }
    function menuClick(val) {
      console.log("меню прилетело", val);
    }
    // async function updateTable() {
    //   const m = await dataLoad();
    //   rows.value = m.result;
    // }
    return {
      buttonClick,
      menuClick,
      subTitle,
      editData,
      columns,
      rows,
      emit,
      pagination: ref({
        rowsPerPage: 10,
      }),
      visibleColumns,
      dblClickRow,
      //     updateTable,
    };
  },
};
async function dataLoad(val) {
  try {
    let resp = await axios.post("/api/specdocvalueLoad", {
      specdoc_id: val,
    });
    let data = resp.data;
    console.log("specdocvalueLoad", data.result);
    return data;
  } catch (err) {
    console.log(err);
    return {
      error: "specdocvalueLoad: Ошибка чтения данных",
    };
  }
}
const columns = [
  {
    name: "article_store",
    label: "Артикул",
    align: "left",
    field: "article_store",
  },
  {
    name: "product",
    label: "Наименование",
    align: "left",
    field: "product",
  },
  {
    name: "cena",
    label: "Цена",
    align: "right",
    field: "cena",
  },
  {
    name: "user",
    label: "Сотрудник",
    align: "left",
    field: "user",
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

<template>
  <div class="ark-grid">
    <div class="column ark-grid-left">
      <!-- <Date-Select-Range @on-Set-Date="onSetDate"></Date-Select-Range> -->
      <q-list separator>
        <Button-Item
          title="Документы"
          subtitle="В список документов"
          @onClick="docPrice.currPanelName = 'Документы'"
        ></Button-Item>
        <!-- <Doc-Bake-Select
          :subtitle="subtitle"
          title="ВЫБОР ПЕКАРНИ:"
          :sprav="rowsSprav"
          v-model:selectId="selectId"
          @add-Bake="addBake"
          @delete-Bake="deleteBake"
          :readonly="!!docPrice.currRowBakery?.bakery_id"
        ></Doc-Bake-Select> -->
        <Button-Item-Menu
          title="Выбор пекарен"
          :subtitle="
            'Выберите пекарни контрагента: ' + docPrice.currRowDoc.kagent_name
          "
        >
          <Button-Menu-Table
            :rows="rowsSprav"
            @on-Add-Bake="onAddBake"
          ></Button-Menu-Table>
        </Button-Item-Menu>
        <Button-Item
          title="Прайс-лист"
          :subtitle="
            'установка цен для пекарен c ' + docPrice.currRowDoc.datestart
          "
          @onClick="docPrice.currPanelName = 'Прайс-лист'"
        ></Button-Item>
      </q-list>
    </div>
    <div class="ark-grid-right">
      <doc-bake-table
        :rows="rows"
        @on-Delete-Bake="onDeleteBake"
      ></doc-bake-table>
      <!-- <table-doc
          ref="refTableDoc"
          :dateRange="dateRange"
          @on-show-dialog="onShowDialog"
          @on-close-dialog="onCloseDialog"
        ></table-doc> -->
    </div>
  </div>
</template>
<script>
import ButtonItem from "../ButtonItem.vue";
import DocBakeTable from "./DocBakeTable.vue";
//import DocBakeSelect from "./DocBakeSelect.vue";
import ButtonItemMenu from "./ButtonItemMenu.vue";
import ButtonMenuTable from "./ButtonMenuTable.vue";
import { dataLoad } from "src/utils/ark.js";
import { useDocPrice } from "stores/storeDocPrice.js";
import { ref, onMounted, watch } from "vue";
export default {
  name: "DocBake",
  components: {
    ButtonItem,
    DocBakeTable,
    //  DocBakeSelect,
    ButtonItemMenu,
    ButtonMenuTable,
  },
  setup(props, { emit }) {
    const docPrice = useDocPrice();
    const rowsSprav = ref([]);
    const rows = ref([]);
    const subtitle = ref(["Нет данных"]);
    const selectId = ref(0);
    watch(selectId, () => {
      subtitle.value = [];
      let row = getInfoBake(selectId.value);
      //console.log("Выбор печки ", selectId.value, row);
      // subtitle.value.push(row.city_name);
      // subtitle.value.push(row.trademark_name);
      // subtitle.value.push(row.kagent_tm_name);
    });
    function getInfoBake(id) {
      return rowsSprav.value.find((x) => x.id == id);
    }
    watch(docPrice, () => {
      console.log("watch", docPrice.currRowBakery);
      if (docPrice.currRowBakery?.bakery_id) {
        selectId.value = docPrice.currRowBakery?.bakery_id;
      }
    });
    onMounted(async () => {
      await loadTable();
      await loadTableSprav();
    });
    async function addBake() {
      await addTable();
    }
    async function loadTable() {
      console.log("Загрузка документов:", docPrice.currRowDoc);
      let mess = "Загрузка документов";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "load",
          tabname: "bakery",
          docprice: docPrice.currRowDoc.id,
        },
        mess
      );
      if (res.result) {
        rows.value = res.result;
      } else {
        rows.value = [];
      }
    }
    async function loadTableSprav() {
      let mess = "Загрузка документов";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "loadSprav",
          tabname: "bakery",
          kagent: docPrice.currRowDoc.kagent_tm_id,
          docpriceid: docPrice.currRowDoc.id,
        },
        mess
      );
      if (res.result) {
        rowsSprav.value = res.result;
      } else {
        rowsSprav.value = [];
      }
    }
    async function addTable(rowBakery) {
      //if (selectId.value < 1) return;
      let mess = "Добавить документ";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "add",
          tabname: "bakery",
          docprice_id: docPrice.currRowDoc.id,
          bakery_id: rowBakery.id, //selectId.value,
        }, // там другая таблица
        mess
      );
      console.log("Это записали", res);
      if (res.result) {
        loadTableSprav();
        // получим строку в []
        console.log("Записали", res.result, rowBakery);
        //  console.log("return one row", res.result[0]);
        // if (row?.id) {
        //   // если передавали id значит был Update
        //   // найдем в нашем Array таблице id обновляемой строки
        //   let idx = rows.value.findIndex((val) => {
        //     return val.id == row.id;
        //   });
        //   if (idx != -1) {
        //     // если нашли то что обновляли, то заменим новой строкой
        //     rows.value[idx] = res.result[0];
        //   } else {
        //     //! Запустить полное перечитывание
        //     // не может произойти
        //     console.log("Аварийное перечитывание");
        //     await loadTable();
        //   }
        // } else {
        //   // передавали без Id значит была новая строка
        //   // вставим полученную новую строку в наш Array таблицы, вперед
        //   rows.value.unshift(res.result[0]);
        // }
        rows.value.unshift(res.result[0]);
        // showDialog.value = false;
      } else {
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    // async function deleteBake() {
    //   await deleteTable();
    // }
    async function deleteTable(rowBakery) {
      console.log(">>>>> del ", rowBakery);
      let mess = "Удаление";
      let res = await dataLoad(
        "/api/docprice",
        { id: rowBakery.id, cmd: "delete", tabname: "bakery" },
        mess
      );
      if (res.result) {
        loadTableSprav();
        // rows.value = res.result;
        try {
          let idx = rows.value.findIndex((val) => {
            return val.id == rowBakery?.id;
          });
          if (idx != -1) {
            // если нашли то что удаляли, то удалим из нашего Array таблицы
            rows.value.splice(idx, 1);
            docPrice.currRowBakery = null;
            //await loadTable();
            //console.log("посде удал", rows.value);
          }
        } catch {
          await loadTable();
          console.log("тут ошибка № 2410");
        }
      } else {
        // Мы не удалили ничего
        //await loadTable();
      }
    }
    return {
      rows,
      docPrice,
      rowsSprav,
      subtitle,
      addBake,
      selectId,
      // deleteBake,
      async onAddBake(rowBakery) {
        await addTable(rowBakery);
      },
      async onDeleteBake(rowBakery) {
        await deleteTable(rowBakery);
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 200px 1fr;
  overflow: auto; // для центра
  max-height: inherit; // размер центра
  .ark-grid-left {
    overflow: auto;
    max-height: inherit;
  }
  .ark-grid-right {
    overflow: auto;
    max-height: inherit;
  }
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
    .ark-grid-left {
      overflow: unset;
    }
    .ark-grid-right {
      overflow: unset;
    }
  }
}
</style>

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
        <!-- <Button-Item-Menu
          title="Выбор пекарен"
          :subtitle="
            'Выберите пекарни данного контрагента: ' +
            docPrice.currRowDoc.kagent_name
          "
        >
          <Button-Menu-Table
            :rows="rowsSprav"
            @on-Add-Bake="onAddBake"
          ></Button-Menu-Table>
        </Button-Item-Menu> -->
        <Button-Item
          title="Добавить товар"
          subtitle="Выбор продукта"
          @onClick="addForm"
        ></Button-Item>
      </q-list>
    </div>
    <div class="ark-grid-right">
      <Doc-Price-List-Table
        :rows="rows"
        @on-Delete="onDelete"
        @on-Edit="onEdit"
      ></Doc-Price-List-Table>
      <!-- <table-doc
          ref="refTableDoc"
          :dateRange="dateRange"
          @on-show-dialog="onShowDialog"
          @on-close-dialog="onCloseDialog"
        ></table-doc> -->
    </div>
    <Form-Dialog-Product
      v-model:showDialog="showDialog"
      :products="rowsSprav"
      :row-Data="docPrice.currRowPrice"
      @on-Save="onSave"
    >
    </Form-Dialog-Product>
  </div>
</template>

<script>
import { useDocPrice } from "stores/storeDocPrice.js";
import { useQuasar } from "quasar";
import { dataLoad } from "src/utils/ark.js";
import { defineComponent, ref, nextTick, onMounted, computed } from "vue";
import ButtonItem from "../ButtonItem.vue";
import DocPriceListTable from "./DocPriceListTable.vue";
import FormDialogProduct from "./FormDialogProduct.vue";
export default defineComponent({
  name: "DocPriceList",
  components: { ButtonItem, DocPriceListTable, FormDialogProduct },
  setup(props, { emit }) {
    const { notify, dialog } = useQuasar();
    const docPrice = useDocPrice(); // currRowPrice - выбор
    const showDialog = ref(false);
    const rowsSprav = ref([]);
    const rows = ref([]);
    onMounted(async () => {
      await loadTableSprav();
      await loadTable();
    });
    async function loadTable() {
      let mess = "Загрузка прайса";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "load",
          tabname: "docpricelist",
          docprice_id: docPrice.currRowDoc.id,
        },
        mess
      );
      if (res.result) {
        console.log("ЗАгрузка продуктов", res.result);
        rows.value = res.result;
      } else {
        rows.value = [];
      }
    }
    async function loadTableSprav() {
      let mess = "Загрузка продуктов";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "loadProducts",
          tabname: "docpricelist",
        },
        mess
      );
      if (res.result) {
        console.log("ЗАгрузка продуктов", res.result);
        rowsSprav.value = res.result;
      } else {
        rowsSprav.value = [];
      }
    }

    async function addTable(rowProducts) {
      //if (selectId.value < 1) return;
      let mess = "Добавить документ";
      let res = await dataLoad(
        "/api/docprice",
        {
          cmd: "add",
          tabname: "docpricelist",
          docprice_id: docPrice.currRowDoc.id,
          ...rowProducts,
        },
        mess
      );
      console.log("Это записали", res);
      if (res.result) {
        docPrice.currRowPrice.article = "";
        docPrice.currRowPrice.cena = "";
        docPrice.currRowPrice.description = "";
        docPrice.currRowPrice.products_id = rowProducts.products_id;
        docPrice.currRowPrice.price_name = rowProducts.price_name;
        showDialog.value = false;
        nextTick(() => {
          if (!rowProducts?.id) {
            showDialog.value = true;
          }
        });
        notify({
          color: "green",
          position: "top",
          message: "Сохранено: " + rowProducts.price_name,
          icon: "gpp_good",
        });

        // await loadTable();
        // получим строку в []
        console.log("Записали", res.result, rowProducts);
        console.log("return one row", res.result[0]);
        if (rowProducts?.id) {
          // если передавали id значит был Update
          // найдем в нашем Array таблице id обновляемой строки
          let idx = rows.value.findIndex((val) => {
            return val.id == rowProducts.id;
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
        // rows.value.unshift(res.result[0]);
        // showDialog.value = false;
      } else {
        //! не обнуляем таблицу, у нас открыто окно ввода данных
        // rows.value = [];
      }
    }
    async function deleteTable(rowPriceList) {
      let mess = "Удаление";
      let res = await dataLoad(
        "/api/docprice",
        {
          id: rowPriceList.id,
          // docprice_id: docPrice.currRowDoc.id,
          cmd: "delete",
          tabname: "docpricelist",
        },
        mess
      );
      if (res.result) {
        // loadTable();
        // rows.value = res.result;
        try {
          let idx = rows.value.findIndex((val) => {
            return val.id == rowPriceList?.id;
          });
          if (idx != -1) {
            // если нашли то что удаляли, то удалим из нашего Array таблицы
            rows.value.splice(idx, 1);
            docPrice.currRowPrice = {};
            //await loadTable();
            //console.log("посде удал", rows.value);
          }
        } catch {
          await loadTable();
          console.log("тут ошибка № 2413");
        }
      } else {
        // Мы не удалили ничего
        //await loadTable();
      }
    }
    function addForm() {
      docPrice.currRowPrice = {};
      nextTick(() => {
        showDialog.value = true;
      });
    }
    return {
      docPrice,
      showDialog,
      rowsSprav,
      rows,
      addForm,
      async onSave(row) {
        console.log("save", row);
        await addTable(row);
      },
      async onDelete(row) {
        dialog({
          title: "Удалить запись?",
          message: row.price_name,
          cancel: true,
          persistent: true,
          ok: { label: "Удалить", color: "red-3" }, // q-btn
          cancel: { label: "Отменить", color: "blue-5" },
          focus: "cancel",
        }).onOk(async () => {
          await deleteTable(row);
        });
        //  await deleteTable(row);
      },
      async onEdit(row) {
        docPrice.currRowPrice = row;
        nextTick(() => {
          showDialog.value = true;
        });
        //await addTable(row);
      },
    };
  },
});
</script>

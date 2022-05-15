<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => $emit('update:showDialog', val)"
  >
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ subTitle }}</div>
        <div class="text-h9">{{ agentName }}</div>
      </q-card-section>
      <div class="ark-grid" style="padding: 6px">
        <div class="ark-grid-left">
          <kagent-list-table
            :list-name="listName"
            :kagent-id="kagentId"
            :rowsList="rowsList"
            :rowsListLoad="rowsListLoad"
            :rowsListClick="rowsListClick"
          ></kagent-list-table>
        </div>
        <div class="ark-grid-right">
          <kagent-sprav-table
            :table-name="spravName"
            :rows-sprav="rowsSprav"
            :rowsSpravClick="rowsSpravClick"
          ></kagent-sprav-table>
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn dense flat color="primary" v-close-popup>Закрыть</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted } from "vue";
import KagentListTable from "components/Kagent/KagentListTable.vue";
import KagentSpravTable from "components/Kagent/KagentSpravTable.vue";
import { dataLoad } from "src/utils/ark.js";
export default {
  components: {
    KagentListTable,
    KagentSpravTable,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    userName: String, // просто фамилия
    kagentId: [String, Number], // id kontragent
    subTitle: String,
    spravName: String, // название справочника таблицы
    listName: String, //   название таблицы list для выбора
    agentName: String,
  },
  setup(props) {
    const rowsList = ref([]);
    const rowsSprav = ref([]);
    // перечитываем список контрагента
    async function listLoad(kagentId, listName) {
      console.log("Загрузка List", kagentId, listName);
      let dat = { tableName: listName, id: kagentId };
      let res = await dataLoad(
        "/api/kagentListLoad",
        dat,
        `список ${listName} контрагента`
      );
      if (res.result) {
        rowsList.value = res.result;
      } else {
        rowsList.value = [];
      }
      //---------------------- Загружаем справочник
      let dat2 = {
        tableNameLoad: props.spravName,
      };
      let resS = await dataLoad(
        "/api/spravLoad",
        dat2,
        `Справочник ${props.spravName}`
      );
      console.log(resS);
      if (resS.result) {
        console.log("+++++++++++++++", dat.tableName, rowsList.value);
        rowsSprav.value = resS.result.filter((item) => {
          return !rowsList.value.find((element) => element.name == item.name); // find !arr2.includes(rowsList.value));
        });
        //rowsSprav.value = resS.result;
      } else {
        rowsSprav.value = [];
      }
    }
    onMounted(async () => {
      // console.log("list dialog load", props.kagentId, props.listName);
      // await listLoad(props.kagentId, props.listName);
    });
    return {
      listLoad,
      rowsList,
      rowsSprav,
      // загружаем и справочник и список агента
      async rowsListLoad() {
        await listLoad(props.kagentId, props.listName);
      },
      //! синяя кнопка на справочнике - добавить
      async rowsSpravClick(id, listName) {
        let dat = {
          tableName: props.listName, //!
          kagentId: props.kagentId,
          kagentSpravId: id,
        };
        let res = await dataLoad(
          "/api/kagentListAdd",
          dat,
          `Добавляем в список ${listName} контрагента`
        );
        await listLoad(props.kagentId, props.listName);
      },
      async rowsListClick(id) {
        let dat = {
          tableName: props.listName,
          idList: id,
        };
        console.log("удаляем из списка", dat);
        let res = await dataLoad(
          "/api/kagentListDelete",
          dat,
          `Удаляем из списка ${props.listName} контрагента`
        );
        await listLoad(props.kagentId, props.listName);
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  padding: 6px;
  gap: 15px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
  }
}
// @media (min-width: 600px) {
//   .q-dialog__inner--minimized {
//     > div {
//       max-width: 561px;
//     }
//   }
// }
</style>

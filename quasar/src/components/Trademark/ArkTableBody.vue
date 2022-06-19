<template>
  <q-tr :props="propsV">
    <q-td v-for="col in propsV.cols" :key="col.id" :props="propsA">
      {{ col.value }}
      <!-- <q-popup-edit v-model="col.row" v-slot="scope">
        <q-input v-model="scope.value" dense autofocus counter />
        <q-btn label="Записать"></q-btn>
      </q-popup-edit> -->
    </q-td>
    <q-td>
      <div class="row no-wrap vertical-middle" style="justify-content: right">
        <q-btn
          round
          color="blue-3"
          size="1ex"
          icon="mode_edit"
          @click="rowEdit(propsV.row)"
        />
        <q-btn
          round
          color="red-3"
          size="1ex"
          icon="delete_forever"
          @click="rowDelete(propsV.row)"
        />
      </div>
    </q-td>
    <!-- <trademark-dialog
      v-model:showDialog="showDialog"
      :sprav="sprav"
      :row-data="rowData"
      @onSave="onSaveData"
    ></trademark-dialog> -->
  </q-tr>
</template>

<script>
import { ref, watch } from "vue";
//import TrademarkDialog from "components/Trademark/TrademarkDialog.vue";
export default {
  name: "TableCell",
  props: {
    propsV: Object,
    rowEdit: Function,
    rowDelete: Function,
  },
  components: {
    // TrademarkDialog,
  },
  setup(props, { emit }) {
    // const showDialog = ref(false);
    // const rowData = ref({});
    // function rowEdit(val) {
    //   rowData.value = val.row;
    //   showDialog.value = true;
    // }
    // function rowDelete(val) {
    //   console.log("Кнопка", val);
    //   emit("onDeleteData", val);
    // }
    return {
      // rowDelete,
      // rowEdit,
      // showDialog,
      // onSaveData(val) {
      //   emit("onSaveData", val);
      // },
    };
  },
};
</script>

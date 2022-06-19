<template>
  <q-tr
    :props="propsV"
    class="color-table cursor-pointer"
    :class="selectedRow?.id == propsV.row?.id ? 'select-row' : ''"
    @click.exact="$emit('onRowClick', propsV.row)"
  >
    <q-td
      v-for="col in propsV.cols"
      :key="col.id"
      :props="propsA"
      colspan="100%"
      ><div
        style="
          max-width: 200px;
          white-space: break-spaces;
          overflow-wrap: break-word;
        "
      >
        {{ col.value }}
      </div>
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
          @click="rowEdit(propsV)"
        />
        <q-btn
          round
          color="red-3"
          size="1ex"
          icon="delete_forever"
          @click="rowDelete(propsV)"
        />
      </div>
    </q-td>
    <sprav-dialog
      :inputArr="inputArr"
      v-model:showDialog="showDialog"
      @inputForSave="inputForSave"
    ></sprav-dialog>
  </q-tr>
</template>

<script>
import { ref, watch } from "vue";
import SpravDialog from "components/Sprav/SpravDialog.vue";
export default {
  name: "TableCell",
  props: {
    propsV: Object,
    selectedRow: Object,
  },
  components: {
    SpravDialog,
  },
  setup(props, { emit }) {
    const showDialog = ref(false);
    const inputArr = ref([]);
    function rowEdit(val) {
      console.log("rowEdit", val.row.name, val);
      inputArr.value = {
        id: val.row.id,
        colTitle: "Наименование", // значение колонки
        colBase: "name", // название поля в базе
        colValue: val.row.name,
      };
      //  emit("onEdit", [inputArr]);
      showDialog.value = true;
    }
    function rowDelete(val) {
      console.log("Кнопка", val);
      emit("onDeleteData", val);
    }
    function inputForSave(val) {
      emit("onSaveData", val);
    }
    return {
      rowDelete,
      rowEdit,
      showDialog,
      inputArr,
      inputForSave,
    };
  },
};
</script>
<style lang="scss" scoped>
.color-table {
  // tr:nth-child(1) {
  //   background: #666; /* Цвет фона */
  //   color: #fff; /* Цвет текста */
  // }
  &:nth-child(2n) {
    // background: #f0f0f0; /* Цвет фона */
    background: #fffdfd;
  }
}
.select-row {
  color: red;
}
</style>

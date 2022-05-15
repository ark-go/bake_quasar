<template>
  <q-tr
    :props="propsV"
    class="color-table cursor-pointer"
    :class="docPrice.currRowPrice?.id == propsV.row.id ? 'select-row' : ''"
    @click.exact="onRowClick(propsV.row)"
    @click.ctrl.exact="onRowClick(propsV.row, true)"
  >
    <q-td
      :style="{
        textAlign: 'left',
        justifyContent: 'flex-start',
      }"
      style="align-items: center"
    >
      <!-- <div class="row no-wrap vertical-middle" style="justify-content: right"> -->
      <q-btn
        v-show="docPrice.currRowPrice?.id"
        round
        color="blue-3"
        size="1ex"
        icon="edit"
        @click.stop="$emit('onRowButtonEdit', propsV?.row)"
      >
      </q-btn>
      <q-btn
        v-show="docPrice.currRowPrice?.id"
        round
        color="red-3"
        size="1ex"
        icon="delete_forever"
        @click.stop="$emit('onRowButton', propsV?.row)"
      >
      </q-btn>
    </q-td>

    <q-td
      v-for="col in propsV.cols"
      :key="col.id"
      :props="propsA"
      :style="{
        textAlign: typeof col.value == 'boolean' ? 'center' : col.align,
      }"
      style="max-width: 250px"
    >
      <template v-if="typeof col.value == 'boolean'">
        <q-icon
          v-if="col.value"
          name="star"
          color="red-3"
          style="text-align: center"
        />
      </template>
      <template v-else>
        {{ col.value }}
      </template>
    </q-td>
  </q-tr>
</template>

<script>
import { ref, watch } from "vue";
import { useDocPrice } from "stores/storeDocPrice.js";
export default {
  name: "DocPriceTableBody",
  props: {
    propsV: Object,
    btnType: String,
    buttons: {
      type: Array,
      default: () => {
        return ["blue", "red"];
      },
    },
    blueIcon: {
      type: String,
      default: "mode_edit",
    },
    redIcon: {
      type: String,
      default: "delete_forever",
    },
    blueTooltipMess: {
      type: String,
      default: "",
    },
    redTooltipMess: {
      type: String,
      default: "",
    },
    selectedRowId: {
      type: Boolean,
      default: false,
    },
  },
  //emit: ["onBtnEdit", "onBtnDelete"],
  setup(props, { emit }) {
    const docPrice = useDocPrice();
    function onRowClick(row, isCtrl) {
      if (docPrice.currRowPrice?.id == row.id) docPrice.currRowPrice = null;
      else docPrice.currRowPrice = row;

      emit("onRowClick", row, isCtrl);
    }
    return { docPrice, onRowClick };
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
</style>
<style lang="scss" scoped>
.select-row {
  color: red;
}
</style>

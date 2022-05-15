<template>
  <q-tr
    :props="propsV"
    class="color-table cursor-pointer"
    :class="docPrice.currRowBakery?.id == propsV.row.id ? 'select-row' : ''"
    @click.exact="onRowClick(propsV.row)"
    @click.ctrl.exact="onRowClick(propsV.row, true)"
  >
    <q-td
      v-for="col in propsV.cols"
      :key="col.id"
      :props="propsA"
      :style="{
        textAlign: typeof col.value == 'boolean' ? 'center' : 'left',
      }"
      style="
        max-width: 200px;
        /* white-space: break-spaces;
          overflow-wrap: break-word;
          */
      "
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
  name: "DocBakeTableBody",
  props: {
    propsV: Object,
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
  emit: ["onBtnEdit", "onBtnDelete"],
  setup(props, { emit }) {
    const docPrice = useDocPrice();
    function onRowClick(row, isCtrl) {
      if (docPrice.currRowBakery?.id == row.id) docPrice.currRowBakery = null;
      else docPrice.currRowBakery = row;

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

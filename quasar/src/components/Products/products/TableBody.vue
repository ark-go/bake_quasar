<template>
  <q-tr
    :props="propsV"
    class="color-table cursor-pointer"
    :class="selectedRows.indexOf(propsV.row) != -1 ? 'select-row' : ''"
    @click.exact="$emit('onRowClick', propsV.row)"
    @click.ctrl.exact="$emit('onRowClick', propsV.row, true)"
  >
    <template v-if="!isLeft">
      <q-td
        v-for="col in propsV.cols"
        :key="col.id"
        :props="propsA"
        :style="{
          textAlign: typeof col.value == 'boolean' ? 'center' : col.align,
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
    </template>
    <q-td
      :style="{
        textAlign: isLeft ? 'left' : 'right',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }"
      style="align-items: center"
    >
      <!-- <div class="row no-wrap vertical-middle" style="justify-content: right"> -->
      <q-btn
        v-if="buttons.includes('blue')"
        round
        color="blue-3"
        size="1ex"
        :icon="blueIcon"
        @click.stop="$emit('onBtnEdit', propsV?.row)"
      >
        <q-tooltip
          v-if="blueTooltipMess"
          class="bg-blue"
          :offset="[10, 10]"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <span style="font-size: 10px">{{ blueTooltipMess }}</span>
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="buttons.includes('red')"
        round
        color="red-3"
        size="1ex"
        :icon="redIcon"
        @click.stop="$emit('onBtnDelete', propsV?.row)"
      >
        <q-tooltip
          v-if="redTooltipMess"
          class="bg-red"
          :offset="[10, 10]"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <span style="font-size: 10px">{{ redTooltipMess }}</span>
        </q-tooltip>
      </q-btn>
      <!-- </div> -->
    </q-td>
    <template v-if="isLeft">
      <q-td v-for="col in propsV.cols" :key="col.id" :props="propsA">
        {{ col.value }}
      </q-td>
    </template>
  </q-tr>
</template>

<script>
import { ref, watch } from "vue";
export default {
  name: "TableCell",
  props: {
    propsV: Object,
    isLeft: Boolean, // кнопки слева ?
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
    selectedRows: {
      type: Array,
      default: () => [],
    },
  },
  emit: ["onBtnEdit", "onBtnDelete"],
  setup(props, { emit }) {},
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

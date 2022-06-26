<template>
  <q-tr
    :props="propsV"
    class="color-table cursor-pointer non-selectable"
    :class="{ 'text-red': currentRow?.id == propsV.row?.id }"
    @click.exact="$emit('onRowClick', propsV.row)"
    @click.right.exact="$emit('onRowClick', propsV.row)"
  >
    <component
      :is="tableBodyMenu"
      :row="propsV.row"
      :funcTable="funcTable"
      :tableName="tableName"
    ></component>
    <template v-if="!isLeft">
      <q-td
        v-for="(col, index) in propsV.cols"
        :key="col.id"
        :props="propsA"
        :style="{
          textAlign: typeof col.value == 'boolean' ? 'center' : 'left',
        }"
        style="max-width: 200px; overflow-x: hidden"
      >
        <q-icon
          v-if="index == 0 && infoBtn && currentRow?.id == propsV.row?.id"
          size="3ex"
          name="help"
          color="teal"
          class="cursor-pointer"
          style="margin-right: 3px"
          @click="$emit('onInfoRow', propsV?.row)"
        />
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
      v-if="!noEditTable && (yesBtnDelete || yesBtnEdit)"
      :style="{
        textAlign: isLeft ? 'left' : 'right',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }"
      style="align-items: center"
    >
      <q-btn
        v-if="yesBtnEdit"
        round
        color="blue-3"
        size="1ex"
        :icon="iconBtnEdit"
        @click="$emit('onBtnEdit', propsV?.row)"
      >
      </q-btn>
      <q-btn
        v-if="yesBtnDelete"
        round
        color="red-3"
        size="1ex"
        :icon="iconBtnDelete"
        @click="$emit('onBtnDelete', propsV?.row)"
      >
      </q-btn>
    </q-td>
    <template v-if="isLeft">
      <q-td v-for="col in propsV.cols" :key="col.id" :props="propsA">
        {{ col.value }}
      </q-td>
    </template>
    <!-- <q-td v-for="col in propsV.cols" :key="col.id" :props="propsA">
      {{ col.value }}
    </q-td> -->
  </q-tr>
</template>

<script>
import { ref } from "vue";
export default {
  name: "TableCell",
  props: {
    currentRow: Object,
    tableName: String,
    funcTable: Function,
    tableBodyMenu: Object,
    propsV: Object,
    isLeft: {
      type: Boolean, // кнопки слева ?
      default: false,
    },
    yesBtnEdit: Boolean,
    yesBtnDelete: Boolean,
    iconBtnEdit: {
      type: String,
      default: "mode_edit",
    },
    iconBtnDelete: {
      type: String,
      default: "delete_forever",
    },
    noEditTable: {
      type: Boolean,
      default: false,
    },
    noInfoBtn: {
      type: Boolean,
      default: false,
    },
  },

  emit: ["onBtnEdit", "onBtnDelete"],
  setup(props, { emit }) {
    const infoBtn = ref(!props.noInfoBtn);

    return {
      infoBtn,
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
// ========  не использую нигде
$icon-size: 3ex;
$border-radius: 0.5; //15% = 0.15, 50% = 0.50 etc.

$background: #2d2c3e;
$background-b: #2d2c3e;

// Icon Colors
$green: #16a085;
$red: #c82647;
$green-l: #8cc63f;
$orange: #eb9532;
$purple: #7e3661;

// Text
$white: #ffffff;
.icon-fill {
  &::before {
    transition-duration: 0.5s;
    box-shadow: inset 0 0 0 1px $green;
  }
  &:hover::before {
    box-shadow: inset 0 0 0 2ex $green;
  }
}
.icon7 {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: $icon-size;
  height: $icon-size;
  margin-left: $icon-size/5;
  margin-right: $icon-size/5;
  border-radius: $icon-size * $border-radius;
  overflow: hidden;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition: all 0.25s ease;
    border-radius: $icon-size * $border-radius;
  }
  i {
    position: relative;
    color: $white;
    font-size: $icon-size/2;
    margin-top: $icon-size/4;
    transition: all 0.25s ease;
  }
}
</style>

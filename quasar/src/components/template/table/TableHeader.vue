<template>
  <q-tr :props="props">
    <q-th
      v-if="['multiple', 'single'].includes(selection)"
      style="text-align: left"
    >
      <!-- eslint-disable-next-line vue/no-mutating-props  -->
      <!-- eslint-disable vue/no-mutating-props  -->
      <q-checkbox
        v-if="selection == 'multiple'"
        dense
        v-model="props.selected"
        checked-icon="star"
        unchecked-icon="star_border"
        indeterminate-icon="star_half"
      />
      <!-- <q-checkbox dense v-model="props.selected" /> -->
    </q-th>
    <q-th
      v-for="col in props.cols"
      :key="col.name"
      :props="props"
      class="arkadii-table-header"
    >
      {{ col.label }}
    </q-th>
    <q-th
      v-if="(yesBtnEdit || yesBtnDelete) && !noEditTable"
      style="text-align: center"
    >
    </q-th>
  </q-tr>
</template>

<script>
import { ref } from "vue";
export default {
  name: "TableHeader",
  props: {
    currentRow: Object,
    props: Object,
    isLeft: {
      type: Boolean, // кнопки слева ?
      default: false,
    },
    yesBtnEdit: Boolean,
    yesBtnDelete: Boolean,
    noEditTable: Boolean,
    selection: String,
  },

  emit: ["onBtnEdit", "onBtnDelete"],
  setup(props, { emit }) {
    const infoBtn = ref(!props.noInfoBtn);

    return {
      emit,
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

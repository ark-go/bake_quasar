<template>
  <q-btn-toggle
    v-model="btnToogle"
    @update:model-value="$emit('onBtnToogle', btnToogle)"
    class="my-custom-toggle"
    no-caps
    spread
    rounded
    unelevated
    toggle-color="primary"
    color="white"
    text-color="primary"
    :options="[
      { label: 'Сырье', value: 'row' },
      { label: 'Продукт', value: 'product' },
    ]"
  />
</template>
<script>
import { defineComponent, ref, onMounted, computed, watchEffect } from "vue";
export default defineComponent({
  name: "FormSelectIngr",
  components: {},
  props: {},
  emits: ["onBtnToogle"],
  setup(props) {
    const btnToogle = ref("row");

    return {
      btnToogle,
    };
  },
});
</script>

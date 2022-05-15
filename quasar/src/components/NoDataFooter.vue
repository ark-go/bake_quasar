<template>
  <!-- <template v-slot:no-data="{ icon, message, filter }"> -->
  <div
    class="full-width row flex-center text-blue q-gutter-sm text-weight-bold"
  >
    <!-- <q-icon size="2em" name="sentiment_dissatisfied" /> -->
    <span> {{ dataslot.message }} </span>
    <!-- <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" /> -->
  </div>
</template>

<script>
//import { ref, onMounted, reactive, watch, computed, toRefs } from "vue";
//import { axios } from "boot/axios";
//import { useQuasar } from "quasar";

// в dataslot   icon, message, filter
export default {
  props: ["dataslot"],
  setup() {},
};
</script>

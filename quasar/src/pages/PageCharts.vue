<template>
  <q-page class="flex flex-center column" style="min-width: 360px">
    <div class="row">
      <charts-demo></charts-demo>
      <charts-demo2></charts-demo2>
    </div>
    <div class="row">
      <charts-demo3></charts-demo3>
      <charts-demo4></charts-demo4>
    </div>
    <div class="row">
      <charts-demo5></charts-demo5>
      <charts-demo6></charts-demo6>
    </div>
  </q-page>
</template>

<script>
//https://apexcharts.com/docs/vue-charts/
import { defineComponent, ref } from "vue";
import ChartsDemo2 from "components/ChartsDemo2.vue";
import ChartsDemo3 from "components/ChartsDemo3.vue";
import ChartsDemo4 from "components/ChartsDemo4.vue";
import ChartsDemo5 from "components/ChartsDemo5.vue";
import ChartsDemo6 from "components/ChartsDemo6.vue";
import ChartsDemo from "components/ChartsDemo.vue";
export default defineComponent({
  name: "vue3Charts",
  components: {
    ChartsDemo2,
    ChartsDemo,
    ChartsDemo3,
    ChartsDemo4,
    ChartsDemo5,
    ChartsDemo6,
  },

  setup() {
    return {};
  },
});
</script>
<style>
#app {
  color: #2ecc71;
}
</style>

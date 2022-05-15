<template>
  <div class="column">
    <apexchart
      height="200"
      type="donut"
      style="str"
      :options="options"
      :series="series"
    ></apexchart>
    <q-toggle
      v-model="toogle"
      @update:model-value="clickExample"
      label="ЖМИ! (странно до 7 цветов, непонятки, сейчас как видишь врет)"
    />
  </div>
</template>
<script>
import VueApexCharts from "vue3-apexcharts";

import { ref, reactive, createApp } from "vue";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const toogle = ref(false);
    const options = reactive({
      // chart: {
      //   id: "vuechart-example",
      // },
      // xaxis: {
      //   categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      // },
    });
    const series = ref([30, 40, 45, 50, 49, 60, 70, 91]);
    // const series = ref([
    //   {
    //     name: "series-1",
    //     data: [30, 40, 45, 50, 49, 60, 70, 91],
    //   },
    // ]);
    function getData() {
      let a = [];
      for (let i = 0; i < 8; i++) {
        a.push(getRandomIntInclusive(0, 200));
      }
      console.log("rand", a);
      return a;
    }
    function clickExample() {
      // series.value.data[3] = 40;
      console.log("clik");
      // series.value.data = reactive([30, 20, 10, 99, 49, 30, 70, 91]); //ref(getData());
      // series.value = [
      //   {
      //     data: getData(),
      //   },
      // ];
      series.value = getData();
      console.log("Загружено туда", series.value.data);
    }
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }
    return { options, series, toogle, clickExample };
  },
};
</script>
<style lang="scss" scoped></style>
>

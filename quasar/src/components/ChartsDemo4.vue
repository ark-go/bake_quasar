<template>
  <div class="column">
    <apexchart
      height="200"
      type="radar"
      :options="options"
      :series="series"
    ></apexchart>
    <q-toggle
      v-model="toogle"
      @update:model-value="clickExample"
      label="ЖМИ! "
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
    const series = ref([
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 100, 20],
      },
      {
        name: "Series 2",
        data: [20, 30, 40, 80, 20, 80],
      },
      {
        name: "Series 3",
        data: [44, 76, 78, 13, 43, 10],
      },
    ]);
    const options = ref({
      chart: {
        height: 350,
        type: "radar",
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
        },
      },
      title: {
        text: "Radar Chart - Multi Series",
      },
      stroke: {
        width: 2,
      },
      fill: {
        opacity: 0.1,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        categories: ["2011", "2012", "2013", "2014", "2015", "2016"],
      },
    });
    function getData() {
      let a = [];
      for (let i = 0; i < 6; i++) {
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
      series.value[0].data = getData();
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

<template>
  <div class="column">
    <apexchart
      width="400"
      type="polarArea"
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
    const series = ref([14, 23, 21, 17, 15, 10, 12, 17, 21]);
    const options = ref({
      chart: {
        type: "polarArea",
      },
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    });
    function getData() {
      let a = [];
      for (let i = 0; i < 9; i++) {
        a.push(getRandomIntInclusive(0, 36));
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

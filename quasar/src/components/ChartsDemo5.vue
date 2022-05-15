<template>
  <div class="column">
    
    <apexchart
      height="300"
      type="line"
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
        name: "High - 2013",
        data: [28, 29, 33, 36, 32, 32, 33],
      },
      {
        name: "Low - 2013",
        data: [12, 11, 14, 18, 17, 13, 13],
      },
    ]);
    const options = ref({
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Вот еще фигулина",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Temperature",
        },
        min: 5,
        max: 40,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    });
    function getData() {
      let a = [];
      for (let i = 0; i < 7; i++) {
        a.push(getRandomIntInclusive(6, 36));
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

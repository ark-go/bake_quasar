<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <q-card class="chart-full">
      <!-- <q-card-section class="q-py-xs"
        ><q-btn
          class="fixed-top-left q-pl-10 q-pt-10"
          flat
          label="Еще"
          @click="$emit('onClickNext')"
        ></q-btn>
      </q-card-section> -->
      <q-card-section style="font-size: 16px">
        <q-btn
          class="absolute q-pl-10 q-pt-10"
          style="z-index: 2"
          flat
          label="Еще"
          @click="$emit('onClickNext')"
        ></q-btn>
        <Vue-Apex-Charts
          :width="screenWidthChart"
          :height="screenHeightChart"
          type="line"
          :options="options"
          :series="series"
          @click="click"
        ></Vue-Apex-Charts>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
} from "vue";
import ru from "./rus.json";
import { useTableFunc } from "./tableFunc";
import VueApexCharts from "vue3-apexcharts";
export default defineComponent({
  name: "ChartTwo",
  components: { VueApexCharts },
  props: [
    "paddingX",
    "screenWidth",
    "screenWidthChart",
    "reStartChart",
    "screenHeightChart",
  ],
  setup(props) {
    const tableFunc = useTableFunc();
    const arrCategory = ref([]);
    const arrSeries = ref([]);
    const arrSeries2 = ref([]);
    const arrSeries3 = ref([]);
    watch(
      () => props.reStartChart,
      () => {
        console.log("restart chart");
        setTimeout(() => {
          if (series.value) series.value = [...series.value, ...[]]; // обновление
        }, 1000);
      }
    );
    const options = ref({
      title: {
        text: "Продажа",
        align: "center",
      },
      animations: {
        enabled: true,
      },
      chart: {
        id: "chart3",
        type: "bar",
        stacked: false,
        locales: [ru],
        defaultLocale: "ru",
        //  type: "line",

        toolbar: {
          autoSelected: "pan",
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            customIcons: [],
          },
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: [2],
      },
      stroke: {
        width: [1, 1, 4],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },
          title: {
            text: "Деньга",
            style: {
              fontSize: "14px",
              color: "#008FFB",
            },
          },
        },
        // это рисует верикальную линейку для seriesName
        {
          seriesName: "Сумма фанч.",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#00E396",
          },
          labels: {
            style: {
              fontSize: "14px",
              colors: "#00E396",
            },
          },
          title: {
            text: "Сумма франшизы",
            style: {
              fontSize: "14px",
              color: "#00E396",
            },
          },
        },
        {
          seriesName: "Кол-во",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#FEB019",
          },
          labels: {
            style: {
              fontSize: "14px",
              colors: "#FEB019",
            },
          },
          title: {
            text: "Кол-во проданных пунктов",
            style: {
              fontSize: "14px",
              color: "#FEB019",
            },
          },
        },
      ],
      // labels: arrCategory.value,
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            fontSize: "14px",
          },
        },
        categories: arrCategory.value,
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40,
      },
    });
    const series = ref([
      {
        type: "column",
        name: "Сумма",
        data: arrSeries2.value,
      },
      {
        type: "column",
        name: "Сумма фанч.",
        data: arrSeries3.value,
      },
      {
        type: "line",
        name: "Кол-во",
        data: arrSeries.value,
      },
    ]);
    onMounted(async () => {
      console.log("Mount load");
      await load();
    });
    async function load() {
      const resOtch = await tableFunc.loadSaleOtchetDay();
      if (!resOtch) {
        return;
      }
      console.log("получ..", resOtch);
      let cat = {
        xaxis: {
          categories: [],
        },
      };
      // let ser = [];
      resOtch.forEach((el) => {
        arrCategory.value.push(el.datesale);
        arrSeries.value.push(el.sum_countsale);
        arrSeries2.value.push(el.sum_itogocena);
        arrSeries3.value.push(el.sum_itogocena_franch);
        //   console.log(series.value[0].data);
      });
      series.value = [...series.value, ...[]]; // обновление

      // ------------
    }
    // var chart = new ApexCharts(document.querySelector("#chart"), options);
    // chart.render();
    return {
      options,
      series,
      click: (chartContext, xaxis, yaxis) => {
        console.log(
          "chartContext",
          chartContext,
          "xaxis",
          xaxis,
          "yaxis",
          yaxis
        );
      },
    };
  },
});
</script>

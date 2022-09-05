<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <q-card class="chart-full">
      <q-card-section class="q-py-xs"
        ><q-btn flat label="Еще" @click="$emit('onClickNext')"></q-btn> Товары
      </q-card-section>
      <q-card-section style="font-size: 16px">
        <Vue-Apex-Charts
          :width="screenWidthChart"
          height="auto"
          type="bar"
          :options="options"
          :series="series"
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
import { useTableFunc } from "./tableFunc";
import VueApexCharts from "vue3-apexcharts";
export default defineComponent({
  name: "ChartTwo",
  components: { VueApexCharts },
  props: ["paddingX", "screenWidth", "screenWidthChart", "reStartChart"],
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
      chart: {
        id: "chart2",
        toolbar: {
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
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          maxWidth: 250,
          style: {
            fontSize: "14px",
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
          },
        },
        categories: arrCategory.value,
      },
    });
    const series = ref([
      {
        name: "Продано",
        data: arrSeries.value,
      },
      {
        name: "Сумма",
        data: arrSeries2.value,
      },
      {
        name: "Сумма франч",
        data: arrSeries3.value,
      },
    ]);
    onMounted(async () => {
      console.log("Mount load");
      await load();
    });
    async function load() {
      const resOtch = await tableFunc.loadSaleOtchetTovar();
      if (!resOtch) {
        return;
      }
      // console.log("получ..", resOtch);
      let cat = {
        xaxis: {
          categories: [],
        },
      };
      // let ser = [];
      resOtch.forEach((el) => {
        arrCategory.value.push(el.tovar_name);
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
    return { options, series };
  },
});
</script>

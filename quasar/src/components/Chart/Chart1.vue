<template>
  <q-page class="flex flex-center" style="min-width: 360px">
    <q-card class="chart-full">
      <q-card-section class="q-py-xs">
        <q-btn flat label="Еще" @click="$emit('onClickNext')"></q-btn>
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
  name: "ChartOne",
  components: { VueApexCharts },
  props: ["screenWidth", "screenWidthChart", "reStartChart"],
  setup(props) {
    const tableFunc = useTableFunc();
    const arrCategory = ref([]);
    const arrSeries = ref([]);
    const arrSeries2 = ref([]);
    const arrSeries3 = ref([]);
    watch(
      () => props.reStartChart,
      () => {
        setTimeout(() => {
          series.value = [...series.value, ...[]]; // обновление
        }, 1000);
      }
    );
    const options = ref({
      chart: {
        id: "chart1",
      },
      animations: {
        enabled: true,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: [1],
      },
      title: {
        text: "Пекарни",
        align: "left",
      },
      yaxis: {
        labels: {
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
        name: "Итого",
        data: arrSeries.value,
      },
      {
        name: "Итого франч",
        data: arrSeries2.value,
      },
      {
        name: "Продажи",
        data: arrSeries3.value,
      },
    ]);
    onMounted(async () => {
      await load();
    });
    async function load() {
      const resOtch = await tableFunc.loadSaleOtchet();
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
        arrCategory.value.push(el.bakery_name);
        arrSeries.value.push(+el.sum_itogocena);
        arrSeries2.value.push(+el.sum_itogocena_franch);
        arrSeries3.value.push(+el.sum_countsale);
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

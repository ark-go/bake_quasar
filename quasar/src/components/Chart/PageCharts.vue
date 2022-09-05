<style lang="scss" scoped>
:deep(.chart-full) {
  max-width: v-bind(screenWidth);
  width: 100%;
  & > .q-card__section {
    padding-left: v-bind(paddingX);
    padding-right: v-bind(paddingX);
    padding-top: v-bind(paddingY);
    padding-bottom: v-bind(paddingY);
  }
}
</style>
<template>
  <q-page
    class="flex flex-center column"
    style="min-width: 360px"
    :style-fn="styleFn"
  >
    <component
      :is="chartArr[currentChart]"
      :data-body="{ row: '' }"
      :paddingX="paddingX"
      :screenWidth="screenWidth"
      :screenWidthChart="screenWidthChart"
      :screenHeightChart="screenHeightChart"
      :reStartChart="reStartChart"
      @onClickNext="onClickNext"
    ></component>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import Chart1 from "./Chart1.vue";
import Chart2 from "./Chart2.vue";
import Chart3 from "./Chart3.vue";
export default defineComponent({
  name: "PageCharts",
  components: {},
  setup() {
    const chartArr = ref([Chart1, Chart2, Chart3]);
    const route = useRoute();
    const $q = useQuasar();
    const reStartChart = ref(false);
    const paddingXz = ref(20);
    const paddingX = computed(() => {
      return paddingXz.value + "px";
    });
    const paddingYz = ref(20);
    const paddingY = computed(() => {
      return paddingYz.value + "px";
    });
    const currentChart = ref(0);
    const screenWidth = ref("250px");
    const screenWidthChart = ref("300px");
    const screenHeightChart = ref("300px");
    function styleFn(offset, height) {
      //  () => $q.screen.width,
      screenWidthChart.value = $q.screen.width - 8 - paddingXz.value * 2 + "px";
      screenHeightChart.value =
        height - offset - 8 - paddingYz.value * 2 + "px";
      screenWidth.value = $q.screen.width - paddingXz.value + "px";
      console.log("Высота высчитали:", screenHeightChart.value, height, offset);
      nextTick(() => {
        reStartChart.value = !reStartChart.value;
        console.log("поворот..", reStartChart.value);
      });

      return {};
    }
    // chart.value = Chart1;
    onMounted(() => {
      console.log("start", route.params.id);
      if (
        route.params.id &&
        Number(route.params.id) &&
        route.params.id <= chartArr.value.length
      ) {
        currentChart.value = route.params.id - 1;
      }
    });
    function onClickNext() {
      if (
        route.params.id &&
        Number(route.params.id) &&
        route.params.id <= chartArr.value.length
      ) {
        if (currentChart.value + 1 < chartArr.value.length) {
          currentChart.value += 1;
        } else if (currentChart.value + 1 == chartArr.value.length) {
          currentChart.value = 0;
        }
        console.log(":::", currentChart.value);
      }
    }
    return {
      $q,
      chartArr,
      currentChart,
      paddingX,
      paddingY,
      screenWidth,
      onClickNext,
      screenWidthChart,
      screenHeightChart,
      reStartChart,
      styleFn,
    };
  },
});
</script>

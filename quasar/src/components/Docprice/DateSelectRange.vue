<template>
  <q-input dense :model-value="dateRangeInput" readonly>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          v-model="isProxyShow"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="dateRange" mask="DD.MM.YYYY" no-unset range>
            <div class="row items-center justify-end">
              <q-btn @onClick="onLimit" label="По лимиту" color="primary" flat />
              <q-btn v-close-popup label="Закрыть" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { date } from "quasar";
export default {
  emits: ["onSetDate"],
  setup(props, { emit }) {
    // const qDateProxy = ref(null);
    const isProxyShow = ref(false);
    const timeStamp = new Date();
    const maskDate = "DD.MM.YYYY";
    const startDate = date.formatDate(timeStamp, maskDate);
    //const startRange = addToDate(timeStamp, { days: 7, months: 1 });
    const timeStampEnd = date.addToDate(timeStamp, { days: 15 });
    const endDate = date.formatDate(timeStampEnd, maskDate);
    // const dateRange = ref({ from: startDate, to: endDate });
    const dateRange = ref({});
    onMounted(() => {
      dateRange.value = { from: startDate, to: endDate };
    });
    function sendDate(from = "", to = "") {
      let dateFrom = date.extractDate(from, maskDate);
      let dateTo = date.extractDate(to, maskDate);
      // проверим что там дата
      if (
        date.inferDateFormat(dateFrom) == "date" &&
        date.inferDateFormat(dateTo) == "date"
      ) {
        isProxyShow.value = false; // закроем окно
        emit("onSetDate", {
          // docPrice.vue
          from: date.startOfDate(dateFrom, "hours"),
          to: date.endOfDate(dateTo, "hours"),
        });
      }
    }
    function onLimit(){
      isProxyShow.value = false; // закроем окно
      emit("onSetDate",null);
    }
    const dateRangeInput = ref("");
    watch(dateRange, () => {
      if (typeof dateRange.value == "string") {
        dateRangeInput.value = dateRange.value;
        sendDate(dateRange.value, dateRange.value);
        return;
      } else if (
        typeof dateRange.value == "object" &&
        dateRange.value !== null
      ) {
        dateRangeInput.value =
          dateRange.value?.from + " - " + dateRange.value?.to;
        sendDate(dateRange.value?.from, dateRange.value?.to);
        return;
      } else {
        dateRangeInput.value = "Не выбрано";
        return;
      }
    });
    // const dateRangeInput = computed(() => {
    //   console.log("computed>>", dateRange.value);
    //   if (typeof dateRange.value == "string") {
    //     // sendDate(dateRange.value, dateRange.value);
    //     return dateRange.value;
    //   } else if (
    //     typeof dateRange.value == "object" &&
    //     dateRange.value !== null
    //   ) {
    //     // sendDate(dateRange.value?.from, dateRange.value?.to);
    //     return dateRange.value?.from + " - " + dateRange.value?.to;
    //   } else {
    //     return "Не выбрано";
    //   }
    // });
    return {
      isProxyShow,
      dateRange,
      dateRangeInput,
      onLimit
    };
  },
};
</script>

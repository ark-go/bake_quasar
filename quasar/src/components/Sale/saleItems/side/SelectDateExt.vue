<template>
  <q-input
    :model-value="currentDateSale"
    dense
    :readonly="true"
    label="Дата"
    :disable="!checkDateSale"
    @click="isProxyShow = true"
  >
    <template v-slot:append>
      <q-btn
        round
        dense
        flat
        icon="keyboard_arrow_left"
        class="text-weight-bold"
        @click="onAddDay(-1)"
        :disable="currentDateSale == selectedDateBetweenBakery?.from"
      />
      <q-btn
        round
        dense
        flat
        icon="keyboard_arrow_right"
        class="text-weight-bold"
        @click="onAddDay(1)"
        :disable="currentDateSale == selectedDateBetweenBakery?.to"
      />
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          cover
          v-model="isProxyShow"
          transition-show="scale"
          transition-hide="scale"
          @before-show="beforeShow"
        >
          <q-date
            v-model="currentDateSale"
            mask="DD.MM.YYYY"
            navigation-min-year-month="2010/01"
            :locale="locale"
            first-day-of-week="1"
            no-unset
            :options="options"
            :today-btn="false"
            :minimal="true"
            dense
          >
            <q-btn
              round
              dense
              flat
              icon="close"
              class="text-weight-bold"
              @click="isProxyShow = false"
            />
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { ref, onMounted, watchEffect, watch, computed } from "vue";
import { date } from "quasar";
import { useSaleStore, storeToRefs } from "src/stores/saleStore";
export default {
  name: "SelectDateExt",
  props: {
    nodense: Boolean,
  },
  emits: ["update:value-date"],
  setup(props, { emit }) {
    const saleStore = useSaleStore();
    const { currentDateSale, selectedDateBetweenBakery, checkDateSale } =
      storeToRefs(useSaleStore());
    const { addToDate } = date;
    const dateFormat = ref("DD.MM.YYYY");
    const isProxyShow = ref(false);
    function options(checkdate) {
      if (selectedDateBetweenBakery.value?.from) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let minimumDate = date.extractDate(
          selectedDateBetweenBakery.value.from,
          dateFormat.value
        );
        if (calDate < minimumDate) return false;
      }
      if (selectedDateBetweenBakery.value?.to) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let maximumDate = date.extractDate(
          selectedDateBetweenBakery.value.to,
          dateFormat.value
        );
        console.log("Оптионс2: ", calDate, maximumDate);

        if (calDate > maximumDate) return false;
      }
      return true;
    }

    const dateValue = ref("");
    const qdateValue = ref("");
    function beforeShow() {}
    watch(
      () => selectedDateBetweenBakery.value,
      () => {
        checkedDateBetween();
      }
    );
    function checkedDateBetween() {
      let minimumDate = date.extractDate(
        selectedDateBetweenBakery.value.from,
        dateFormat.value
      );
      let maximumDate = date.extractDate(
        selectedDateBetweenBakery.value.to,
        dateFormat.value
      );
      let currentDate = date.extractDate(
        currentDateSale.value,
        dateFormat.value
      );
      if (currentDate < minimumDate || currentDate > maximumDate) {
        currentDateSale.value = selectedDateBetweenBakery.value.from;
      }
    }

    // при открытии календаря

    onMounted(() => {
      checkedDateBetween();
    });

    watch(
      () => currentDateSale.value,
      () => {
        isProxyShow.value = false;
        console.log("date sale", currentDateSale.value);
      }
    );
    function onAddDay(countDays) {
      console.log("onAddDay-1",countDays)
      emit("onAddDay", countDays);
      // saleStore.debonceArticle(() => {
      //   let minimumDate = date.extractDate(
      //     selectedDateBetweenBakery.value.from,
      //     dateFormat.value
      //   );
      //   let maximumDate = date.extractDate(
      //     selectedDateBetweenBakery.value.to,
      //     dateFormat.value
      //   );
      //   let currentDate = date.extractDate(
      //     currentDateSale.value,
      //     dateFormat.value
      //   );
      //   currentDate = addToDate(currentDate, { days: countDays });
      //   if (currentDate <= maximumDate && currentDate >= minimumDate) {
      //     currentDateSale.value = date.formatDate(
      //       currentDate,
      //       dateFormat.value
      //     );
      //   }
      // });
    }

    const localeExt = ref(locale);
    localeExt.value.months = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];
    return {
      isProxyShow,
      options,
      dateValue,
      locale,
      beforeShow,
      qdateValue,
      dateFormat,
      onOk() {
        console.log("Mounted calendar 22", qdateValue.value);
        emit("update:valueDate", qdateValue.value);
      },
      currentDateSale,
      selectedDateBetweenBakery,
      checkDateSale,
      onAddDay,
    };
  },
};
const locale = {
  days: [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ],
  daysShort: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  months: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ],
  monthsShort: [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
  ],
};
</script>

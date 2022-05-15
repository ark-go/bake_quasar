<template>
  <div class="row">
    <q-input v-model="dateValue" :dense="dense" readonly :label="label">
      <template v-slot:append>
        <q-icon name="chevron_left" class="cursor-pointer" @click="dayminus" />
        <q-icon name="chevron_right" class="cursor-pointer" @click="dayplus" />
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="dateValue"
              :mask="dateFormatExt"
              :locale="locale"
              first-day-of-week="1"
              no-unset
              today-btn
              :subtitle="subtitle"
              :title="title"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Закрыть" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
        <!-- <q-btn label="<"></q-btn>
        <q-btn label=">"></q-btn> -->
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { date } from "quasar";
export default {
  name: "DateSelectExt",
  props: ["label", "dense"],
  setup() {
    const dateValue = ref("2019/02/01"); // чтобы тут написать?
    const dateFormat = ref("DD.MM.YYYY");
    const dateFormatExt = ref("DD.MM.YYYY (dddd)");
    const subtitle = ref();
    const title = ref();
    const locale = ref({
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
    });
    const localeExt = ref(locale.value);
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
    watch(dateValue, (value) => {
      // console.log(value);
      let ndate = date.extractDate(value, dateFormat.value);
      subtitle.value = date.formatDate(ndate, "DD.MM.YYYY");

      title.value = date.formatDate(ndate, "D MMMM, dddd", localeExt.value);
      // ndate = date.addToDate(ndate, { days: -1 });
      // let res = date.formatDate(ndate, dateFormatExt.value, locale.value);
      console.log(ndate);
    });
    onMounted(() => {
      const timeStamp = Date.now();
      dateValue.value = date.formatDate(
        timeStamp,
        dateFormatExt.value,
        locale.value
      );
    });
    function dayplus() {
      let ndate = date.extractDate(dateValue.value, dateFormat.value);
      ndate = date.addToDate(ndate, { days: 1 });
      dateValue.value = date.formatDate(
        ndate,
        dateFormatExt.value,
        locale.value
      );
    }
    function dayminus() {
      let ndate = date.extractDate(dateValue.value, dateFormat.value);
      ndate = date.addToDate(ndate, { days: -1 });
      dateValue.value = date.formatDate(
        ndate,
        dateFormatExt.value,
        locale.value
      );
    }
    return {
      dateValue,
      locale,
      dayplus,
      dayminus,
      dateFormatExt,
      subtitle,
      title,
    };
  },
};
</script>
<style lang="scss">
.q-date__header-title-label {
  font-size: 16px;
}
</style>

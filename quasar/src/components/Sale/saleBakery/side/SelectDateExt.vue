<template>
  <q-input
    :model-value="inputDate"
    @update:model-value="$emit('update:value-dateOFF', $event)"
    :dense="!nodense"
    :readonly="true"
    :label="label"
    @click="isProxyShow = true"
  >
    <template v-slot:append>
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
            v-model="qdateValue"
            mask="DD.MM.YYYY"
            navigation-min-year-month="2010/01"
            :locale="locale"
            first-day-of-week="1"
            no-unset
            :options="options"
            today-btn
            :minimal="false"
            :title="title"
            range
            dense
            @range-start="rangeStart"
          >
            <!-- <div class="row items-center justify-end">
              <q-btn
                v-show="!!valueDate"
                v-close-popup
                dense
                label="Очистить"
                color="danger"
                flat
                @click="$emit('update:valueDate', null)"
              />
              <q-space></q-space>
              <q-btn v-close-popup dense label="Отмена" color="primary" flat />
              <q-btn
                v-close-popup
                dense
                label="Выбрать"
                color="primary"
                flat
                @click="onOk"
              >
                <q-tooltip
                  anchor="bottom middle"
                  self="center middle"
                  style="font-size: 16px"
                >
                  Выбрать
                </q-tooltip>
              </q-btn>
            </div> -->
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { ref, onMounted, watchEffect, watch, computed } from "vue";
import { date } from "quasar";
export default {
  name: "SelectDateExt",
  props: {
    valueDate: Object,
    label: String,
    nodense: Boolean,
    minDate: String,
    maxDate: String,
  },
  emits: ["update:value-date"],
  setup(props, { emit }) {
    //  const dateValue = ref("2019/02/01"); // чтобы тут написать?
    const dateFormat = ref("DD.MM.YYYY");
    const isProxyShow = ref(false);
    const title = ref("");
    const inputDate = computed(() => {
      if (typeof qdateValue.value == "string") {
        return qdateValue.value;
      }
      if (qdateValue.value.from == qdateValue.value.to)
        return qdateValue.value.from;
      else return qdateValue.value.from + " - " + qdateValue.value.to;
    });
    function options(checkdate) {
      if (props.minDate) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let minimumDate = date.extractDate(props.minDate, dateFormat.value);
        if (calDate < minimumDate) return false;
      }
      if (props.maxDate) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let maximumDate = date.extractDate(props.maxDate, dateFormat.value);
        console.log("Оптионс: ", checkdate, props.maxDate);
        console.log("Оптионс2: ", calDate, maximumDate);

        if (calDate > maximumDate) return false;
      }
      return true;
    }
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
    const dateValue = ref({});
    const qdateValue = ref({});
    function beforeShow() {
      if (props.valueDate.from) {
        title.value = props.valueDate.from;
      }
      //else {
      //   const timeStamp = Date.now();
      //   qdateValue.value.from = date.formatDate(timeStamp, dateFormat.value);
      //   qdateValue.value.to = date.formatDate(timeStamp, dateFormat.value);
      //   //  console.log("111", qdateValue.value);
      // }
    }

    onMounted(() => {
      console.log("Mounted calendar-0", props.valueDate);
      if (props.valueDate.from) {
        qdateValue.value = props.valueDate;
      } else {
        const timeStamp = Date.now();
        qdateValue.value.from = date.formatDate(timeStamp, dateFormat.value);
        qdateValue.value.to = date.formatDate(timeStamp, dateFormat.value);
        emit("update:valueDate", qdateValue.value);
      }
      console.log("Mounted calendar", props.valueDate, qdateValue.value);
    });
    watch(
      () => qdateValue.value,
      () => {
        isProxyShow.value = false;
        if (typeof qdateValue.value == "string") {
          emit("update:valueDate", {
            from: qdateValue.value,
            to: qdateValue.value,
          });
        } else emit("update:valueDate", qdateValue.value);
      }
    );
    return {
      isProxyShow,
      options,
      dateValue,
      locale,
      beforeShow,
      qdateValue,
      dateFormat,
      title,
      rangeStart(val) {
        let day = val.day;
        if (day < 10) day = "0" + day;
        let month = val.month;
        if (month < 10) month = "0" + month;
        let year = val.year;
        if (year < 10) year = "0" + year;
        title.value = `${day}.${month}.${year} - ...`;
      },
      onOk() {
        console.log("Mounted calendar 22", qdateValue.value);
        emit("update:valueDate", qdateValue.value);
      },
      inputDate,
    };
  },
};
</script>

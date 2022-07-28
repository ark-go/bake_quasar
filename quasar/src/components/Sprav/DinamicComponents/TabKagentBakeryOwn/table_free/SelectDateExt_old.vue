<template>
  <q-input
    :model-value="valueDate"
    @update:model-value="$emit('update:valueDate', $event)"
    :dense="!nodense"
    :readonly="true"
    :label="label"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="qDateProxy"
          cover
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
            :subtitle="label"
            :title="subtitle"
            :minimal="false"
            dense
          >
            <div class="row items-center justify-end">
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
            </div>
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
  name: "DateSelectExt",
  props: {
    valueDate: String,
    label: String,
    nodense: Boolean,
    minDate: String,
    maxDate: String,
  },
  emits: ["update:value-date"],
  setup(props, { emit }) {
    //  const dateValue = ref("2019/02/01"); // чтобы тут написать?
    const dateFormat = ref("DD.MM.YYYY");
    function options(checkdate) {
      if (props.minDate) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let minimumDate = date.extractDate(props.minDate, dateFormat.value);
        console.log("calend", calDate, minimumDate);
        if (calDate < minimumDate) return false;
      }
      if (props.maxDate) {
        let calDate = date.extractDate(checkdate, "YYYY/MM/DD");
        let maximumDate = date.extractDate(props.maxDate, dateFormat.value);

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
    const dateValue = ref("");
    const qdateValue = ref("");
    function beforeShow() {
      if (props.valueDate) {
        // пришло НЕ пусто
        qdateValue.value = props.valueDate;
        console.log("000-2", qdateValue.value);
      } else {
        const timeStamp = Date.now();
        qdateValue.value = date.formatDate(timeStamp, dateFormat.value);
        console.log("111", qdateValue.value);
      }
    }

    onMounted(() => {
      console.log("Mounted calendar", props.valueDate);
    });
    return {
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
    };
  },
};
</script>

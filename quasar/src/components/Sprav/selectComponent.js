import { ref, computed, defineAsyncComponent } from "vue";
import { useSpravStore } from "stores/spravStore";
import ErrorLoad from "./DinamicComponents/ErrorLoad.vue";
/**
 * Возвращаем компонент, который задан в дереве выбора справочника
 * @returns component vue
 */
export function getComponent() {
  const spravStore = useSpravStore();

  switch (spravStore.selectedNode.component) {
    case undefined: // если нет отдельного компонента
      return null;
      break;
    default: // если ничего не обработали, возьмем из дерева
      return importComp(spravStore.selectedNode.component);
      break;
  }
}
function importComp(path) {
  // для переменных в запросе долже быть обязательно каталог, и расширение указано в статическом виде, т.е. за переменной
  try {
    // https://vueframework.com/docs/v3/ru/ru/api/global-api.html#defineasynccomponent
    return defineAsyncComponent({
      // Функция-фабрика
      loader: () => import(`./DinamicComponents/${path}.vue`),
      errorComponent: ErrorLoad, // компонен подставится, если была ошибка
      onError(error, retry, fail, attempts) {
        if (error.message.match(/fetch/) && attempts <= 3) {
          // повтор при ошибках загрузки, максимум 3 попытки
          retry();
        } else {
          // обратите внимание, retry/fail аналогичны resolve/reject для promise:
          // один из них должен быть вызван для продолжения обработки ошибок.
          fail();
        }
      },
    }); // требует расширение делать статическим
  } catch (e) {
    console.log("Ошибка динамической загрузки");
  }
}

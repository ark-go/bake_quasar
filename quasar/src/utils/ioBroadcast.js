import { ref, onMounted, onBeforeUnmount } from "vue";
import { Notify } from "quasar";
import { useIoSocket } from "src/stores/ioSocket";
/**
 *
 * @param {*} func callback - функция должна примимать объект, один из параметров command
 * @returns
 */
export function useIoBroadcast(func, message) {
  //
  const ioSocket = useIoSocket();
  //----------------------------
  async function getBroadcast(val) {
    console.log("BroadCast io", val);
    if (val.command == "update") {
      showAlert(message, val.userFio);
      await func(val);
    }
  }
  onMounted(() => {
    ioSocket.socket.on("sysroom", getBroadcast);
  });
  onBeforeUnmount(() => {
    ioSocket.socket.off("sysroom", getBroadcast);
  });
  /**
   * Отправка broadcast сообщения указывать имя таблицы
   * @param {*} tableName  - собственно команда
   */
  function sendBroadcast(tableName) {
    // в параметре  command ( update ) и tableName
    let param = {
      command: "update",
      tableName: tableName,
    };
    ioSocket.socket.emit("sysroom", param);
  }
  function showAlert(mess, userFam) {
    userFam = userFam || "";
    Notify.create({
      group: false, // required to be updatable
      // timeout: 0, // we want to be in control when it gets dismissed
      message: mess,
      caption: userFam + " обновил данные.",
      position: "bottom-left",
      color: "blue-grey-3",
      textColor: "white",
    });
  }
  return { sendBroadcast };
}

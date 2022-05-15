<template>
  <q-page class="flex flex-center" style="min-width: 160px">
    <div class="column">
      <video class="camera_stream"></video>
      <img class="photo" />
      <canvas></canvas>
      <q-btn @click="onClick" label="Жми"></q-btn><br />
      Привет!
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  setup() {
    function mount() {
      let video = document.querySelector("video.camera_stream");
      getPhoto(video);
    }
    onMounted(() => {
      mount();
    });
    return {
      onClick() {
        takeSnapshot();
      },
    };
  },
};
function getPhoto(video) {
  navigator.getUserMedia(
    // Настройки
    {
      video: true,
    },
    // Колбэк для успешной операции
    function (stream) {
      // Создаём объект для видео потока и
      // запускаем его в HTLM элементе video.
      // video.src = window.URL.createObjectURL(stream);

      const mediaStream = new MediaStream(stream);
      //const video = document.getElementById('video-player');
      video.srcObject = mediaStream;

      // Воспроизводим видео.
      video.play();
    },
    // Колбэк для не успешной операции
    function (err) {
      // Наиболее частые ошибки — PermissionDenied и DevicesNotFound.
      console.error(err);
    }
  );
}
function takeSnapshot() {
  var hidden_canvas = document.querySelector("canvas"),
    video = document.querySelector("video.camera_stream"),
    image = document.querySelector("img.photo"),
    // Получаем размер видео элемента.
    width = video.videoWidth,
    height = video.videoHeight,
    // Объект для работы с canvas.
    context = hidden_canvas.getContext("2d");

  // Установка размеров canvas идентичных с video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;

  // Отрисовка текущего кадра с video в canvas.
  context.drawImage(video, 0, 0, width, height);

  // Преобразование кадра в изображение dataURL.
  var imageDataURL = hidden_canvas.toDataURL("image/png");

  // Помещение изображения в элемент img.
  image.setAttribute("src", imageDataURL);
}
</script>

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dateTimeInput: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedTimestamp = null; // вибрана користувачем дата
let countdownInterval = null; // значення інтервалу для його зупинки

disableStartBtn(); // відключаю кнопку старт - поки не виберем дату

flatpickr(refs.dateTimeInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    const now = Date.now();

    if (pickedDate.getTime() <= now) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topCenter',
      });
      disableStartBtn();
    } else {
      userSelectedTimestamp = pickedDate.getTime(); // зберігаю вибраний час
      enableStartBtn();
    }
  },
}); // бібліотека календар, вибір часу, 24 формат, поточна дата, логіка після закр календаря

refs.startBtn.addEventListener('click', () => {
  if (!userSelectedTimestamp) return; // слухач на кнопку,не вибрана дата - не активуємо

  disableStartBtn();
  refs.dateTimeInput.disabled = true;

  startCountdown(userSelectedTimestamp); // передаю вибр дату в функцію запуска таймера
});

function startCountdown(targetTimestamp) {
  clearInterval(countdownInterval); // очищаю попередній інтервал

  countdownInterval = setInterval(() => {
    const now = Date.now();
    const diff = targetTimestamp - now; // кожну сек рахуємо різницю

    if (diff <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(0);
      refs.dateTimeInput.disabled = false;
      disableStartBtn();
      iziToast.success({
        message: 'Time is up!',
        position: 'topCenter',
      });
      return;
    }

    updateTimerDisplay(diff); // якщо час іще іде оновлюємо кожну секунду
  }, 1000);
}

function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  refs.days.textContent = String(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds); // конвертація в мс
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0'); // двохзн формат
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60; // переводим мс в одиниці часу
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function disableStartBtn() {
  refs.startBtn.disabled = true; // функціїї вкл.викл кнопки старт
}

function enableStartBtn() {
  refs.startBtn.disabled = false;
}

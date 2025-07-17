import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form'); // шукаю форму

// додаю слухача подій на сабміт:
form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(form.elements.delay.value); // значення в число (текст--число)

  const state = form.elements.state.value; // зчитую обрану опцію з кнопки

  form.elements.delay.value = ''; // очищаю поле після введення

  createPromise(delay, state) // створюю проміс передаю затримку та стан
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});

function createPromise(delay, state) {
  //оголошую функцію
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

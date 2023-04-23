let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.menu-button');
// js работает - закрываем меню (открытое по умолчанию)
navMain.classList.remove('main-nav--nojs');
navMain.classList.remove('main-nav--opened');
navMain.classList.add('main-nav--closed');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    navToggle.classList.remove('menu-button--open');
    navToggle.classList.add('menu-button--close');
  } else {
    navMain.classList.remove('main-nav--opened');
    navMain.classList.add('main-nav--closed');
    navToggle.classList.remove('menu-button--close');
    navToggle.classList.add('menu-button--open');
  }
});

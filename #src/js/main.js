let top_header_menu = document.querySelector('.top-header__menu');
let menu_body = document.querySelector('.menu__body');
let icon_menu = document.querySelector('.icon-menu');

top_header_menu.onclick = function() {
  menu_body.classList.toggle('_active');
  icon_menu.classList.toggle('_active');
}


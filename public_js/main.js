document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});

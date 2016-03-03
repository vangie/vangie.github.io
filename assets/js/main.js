/*! Plugin options and other jQuery stuff */

// dl-menu options
$(function() {
  $('#dl-menu').dlmenu({
    animationClasses: {
      classin: 'dl-animate-in',
      classout: 'dl-animate-out'
    }
  });
});

// FitVids options
$(function() {
  $("article").fitVids();
});

$(".close-menu").click(function() {
  $(".menu").toggleClass("disabled");
  $(".links").toggleClass("enabled");
});

$(".about").click(function() {
  $("#about").css('display', 'block');
});

$(".close-about").click(function() {
  $("#about").css('display', '');
});

// header
$(document).ready(function(e) {
  $(window).scroll(function() {
    var header = $('.header-menu');
    var scroll = $(window).scrollTop();
    if (scroll > 300) {
      header.attr('class', 'header-menu header-menu-overflow');
    } else {
      header.attr('class', 'header-menu header-menu-top');
    }
  });
});

//mobile menu
$(document).ready(function() {
  $("#menu").attr('style', '');
  $("#menu").mmenu({
    "extensions": [
      "border-full",
      "effect-zoom-menu",
      "effect-zoom-panels",
      "pageshadow",
      "theme-dark"
    ],
    "counters": true,
    "navbars": [{
      "position": "bottom",
      "content": [
        "<a class='fa fa-search' href='/search'></a>",
        "<a class='fa fa-envelope' href='#/'></a>",
        "<a class='fa fa-twitter' href='#/'></a>",
        "<a class='fa fa-facebook' href='#/'></a>"
      ]
    }]
  });
});

$(document).ready(function() {
    $('.intro').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 2,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                autoWidth: true,
                loop: true
            },
            600: {
                items: 1,
                nav: false,
                autoWidth: true
            },
            1000: {
                nav: true,
                items: 2,
                loop: false
            }
        }
    })

    $('.courses').owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        active: "transparent",
        items: 3,
        responsiveClass: true,
        dots: false,
        responsive: {
            0: {
                items: 2,
                nav: false,
                autoWidth: true,
                loop: true,
                dots: false,
            },
            600: {
                items: 2,
                nav: false,
                autoWidth: true,
                dots: false,
            },
            1000: {
                nav: false,
                items: 3,
                dots: false,

                loop: false
            }
        }
    })
    $('.read-list').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        items: 3,
        responsiveClass: true,
        // autoWidth:true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                // autoWidth:true,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
                // autoWidth:true
            },
            1000: {
                nav: false,
                items: 4,
                loop: true
            }
        }
    })
    $(".pop-car").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                // autoWidth:true,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
                // autoWidth:true
            },
            1000: {
                nav: true,
                items: 3,
                loop: false
            }
        }
    })
    $('.without-nav').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                // autoWidth:true,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
                // autoWidth:true
            },
            1000: {
                nav: false,
                items: 3,
                loop: false
            }
        }
    })
    $(".carousel-two").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 2,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2,
                nav: false,
                autoWidth: true,
                loop: true
            },
            600: {
                items: 1,
                nav: false,
                autoWidth: true
            },
            1000: {
                nav: true,
                items: 2,
                loop: false
            }
        }
    })
    $(".nav-top").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
            },
            1000: {
                nav: true,
                items: 3,
                loop: true
            }
        }
    })
    $('.middle-car').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 3,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                autoWidth: true,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
                autoWidth: true
            },
            1000: {
                nav: true,
                items: 3,
                loop: false
            }
        }
    })
    $("#chooseCourse").niceSelect();
    $("#chooseCourse2").niceSelect();
    $("#chooseCourse3").niceSelect();
    $("#chooseCourse4").niceSelect();
    $("#chooseCourse5").niceSelect();
    $("#chooseCourse6").niceSelect();

    // ScrollReveal({
    //     reset:true,
    //     distance:'60px',
    //     duration:2500,
    //     delay:400
    // });
    // ScrollReveal().reveal('.fade-up',{delay:150});
    // ScrollReveal().reveal('.fade-left',{delay:180, origin:'left'});
    // ScrollReveal().reveal('.fade-right',{delay:180, origin:'right'});
    // ScrollReveal().reveal('.fade-down',{delay:200});

    $('.course-review').addClass('hide')
    $('.resp').click(function() {
        $('.course-review').toggleClass('hide')
        console.log('ok')
    })

    // $('.infor div').hide();
    $("#cont1").hide();
    $("#cont2").hide();
    $("#cont3").hide();
    $("#cont4").hide();
    $("#cont1").show();
    $("#btn1").click(function() {
        $("#cont1").hide();
        $("#cont2").hide();
        $("#cont3").hide();
        $("#cont4").hide();
        $("#cont1").show();
    })
    $("#btn2").click(function() {
        $("#cont1").hide();
        $("#cont3").hide();
        $("#cont4").hide();
        $("#cont2").show();
    })
    $("#btn3").click(function() {
        $("#cont1").hide();
        $("#cont2").hide();
        $("#cont4").hide();
        $("#cont3").show();
    })
    $("#btn4").click(function() {
        $("#cont1").hide();
        $("#cont2").hide();
        $("#cont3").hide();
        $("#cont4").show();
    })
})
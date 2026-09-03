/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Show menu */
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/* Hide menu */
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    })
}

/*==================== REMOVE MOBILE MENU ====================*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu')

    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}

navLink.forEach(n => n.addEventListener('click', linkAction))


/*==================== CHANGE HEADER STYLES ====================*/
const scrollHeader = () => {
    const header = document.getElementById('header')

    // Add the scroll-header class when the viewport is greater than 50
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header')
    } else {
        header.classList.remove('scroll-header')
    }
}

window.addEventListener('scroll', scrollHeader)

/*=============== SWIPER WORKS ===============*/
const swiperWork = new Swiper('.work__swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 24,
  grabCursor: true,

  pagination: {
    el: '.work__data .swiper-pagination',
    type: 'fraction',
  },

  navigation: {
    nextEl: '.work__data .swiper-button-next',
    prevEl: '.work__data .swiper-button-prev',
  },
});

/*=============== SWIPER TESTIMONIAL ===============*/
const swiperTestimonial = new Swiper('.service__swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 56,
  grabCursor: true,

  pagination: {
    el: '.service__swiper .swiper-pagination',
  },

  navigation: {
    nextEl: '.service__swiper .swiper-button-next',
    prevEl: '.service__swiper .swiper-button-prev',
  },
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () => {
  const scrollUp = document.getElementById('scroll-up')
  // Add the .scroll-header class if the scroll of the viewport is greater than 350
  this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                      : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id')

// Link the ID of each section (section id="home") to each link (a href="#home")
// and activate the link with the class .active-link

const scrollActive = () => {
  // We get the position by scrolling down
  const scrollY = window.scrollY

  sections.forEach(section => {
    const id = section.id, // id of each section
          top = section.offsetTop - 50, // Distance from the top edge
          height = section.offsetHeight, // Element height
          link = document.querySelector('.nav__menu a[href*=' + id + ']') // id nav link

    if(!link) return

    link.classList.toggle('active-link', scrollY > top && scrollY <= top + height)
  })
}
window.addEventListener('scroll', scrollActive)

/*=============== BOOKING FORM ===============*/

const bookingForm = document.getElementById("booking-form");

const dateInput = document.getElementById("date");

const barberInput = document.getElementById("barber");

const timeInput = document.getElementById("time");

const today = new Date().toISOString().split("T")[0];

dateInput.min = today;


// Generate time slots
function generateTimeSlots() {
    timeInput.innerHTML = `
        <option value="">Select a time</option>
    `;

    for (let hour = 9; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {

            const hourText = String(hour).padStart(2, "0");
            const minuteText = String(minute).padStart(2, "0");

            const time = `${hourText}:${minuteText}`;

            const option = document.createElement("option");

            option.value = time;

            option.textContent = formatTime(time);

            timeInput.appendChild(option);
        }
    }
}


// Convert 24-hour time to 12-hour format
function formatTime(time) {
    const [hour, minute] = time.split(":");

    const date = new Date();

    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}


// Load available times
async function loadAvailableTimes() {

    const barber = barberInput.value;
    const date = dateInput.value;

    if (!barber || !date) {
        timeInput.innerHTML = `
            <option value="">Select barber and date first</option>
        `;
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/bookings?barber=${encodeURIComponent(barber)}&date=${encodeURIComponent(date)}`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        const bookedTimes = data.bookedTimes;

        generateTimeSlots();

        // Disable already booked times
        Array.from(timeInput.options).forEach(option => {

            if (bookedTimes.includes(option.value)) {

                option.disabled = true;

                option.textContent += " - Booked";
            }
        });

    } catch (error) {

        console.error("Availability error:", error);

        timeInput.innerHTML = `
            <option value="">Unable to load times</option>
        `;
    }
}


// Generate slots when page loads
generateTimeSlots();


// Reload available times when barber changes
barberInput.addEventListener("change", loadAvailableTimes);


// Reload available times when date changes
dateInput.addEventListener("change", loadAvailableTimes);


// Submit booking
bookingForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const service = document.getElementById("service").value;
    const barber = barberInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    const customerName = document.getElementById("customerName").value;
    const phone = document.getElementById("phone").value;


    try {

        const response = await fetch("http://localhost:5000/api/bookings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                service,
                barber,
                date,
                time,
                customerName,
                phone
            })
        });


        const data = await response.json();


        // Duplicate booking
        if (response.status === 409) {

            alert(`❌ ${data.message}`);

            // Reload available times
            loadAvailableTimes();

            return;
        }


        // Other error
        if (!response.ok) {

            alert("❌ Something went wrong. Please try again.");

            return;
        }


        // Successful booking
        if (data.success) {

        // Fill confirmation modal
        document.getElementById("confirm-name").textContent =
        customerName;

        document.getElementById("confirm-service").textContent =
        service;

        document.getElementById("confirm-barber").textContent =
        barber;

        document.getElementById("confirm-date").textContent =
        date;

        document.getElementById("confirm-time").textContent =
        formatTime(time);


        // Show modal
        document.getElementById("booking-modal").style.display =
        "flex";


        // Reset booking form
        bookingForm.reset();

        dateInput.min = today;

        generateTimeSlots();
    }

    } catch (error) {

        console.error("Booking error:", error);

        alert(
            "❌ Unable to connect to the server.\n" +
            "Please make sure the backend server is running."
        );
    }
});


// Close booking modal
document
    .getElementById("close-booking-modal")
    .addEventListener("click", () => {

        document.getElementById("booking-modal").style.display =
            "none";

    });


// Done button
document
    .getElementById("done-booking")
    .addEventListener("click", () => {

        document.getElementById("booking-modal").style.display =
            "none";

    });


/*=============== GSAP ANIMATION ===============*/ 
const reveal = (selector, options = {}) => {
  gsap.from(selector, {
    scrollTrigger: selector,
    opacity: 0,
    duration: 1,
    y: 100,
    delay: .3,
    ease: 'power2.out',
    ...options
  })
} 

/* Home animation */
const tl = gsap.timeline({})
tl.fromTo(
  '.home__bg, .home__shadow',
  {
    y: -800,
    scale: .3,
    opacity: 0
  },
  {
    y: 0,
    scale: .3,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }
)
tl.to(
  '.home__bg, .home__shadow',
  {
    scale: 1,
    duration: 1,
    ease: 'back.out(0.5)'
  }
)

/* Home background animation */
tl.to(
  '.home__bg',
  {
    scale: 1.08,
    duration: 8,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
    transformOrigin: 'center center'
  }
)

reveal('.home__logo', {y: 0, scale: .3, delay: 1.9, ease: 'elastic.out(0.8,0.5'})
reveal('.home__title', {delay: 2.2})
reveal('.home__description', {delay: 2.5})
reveal('.home__data .button', {delay: 2.8})

/* The nav animation only works in the home section */
if(window.scrollY < 100) {
   reveal('.nav > *', {delay: 1.6, y: -30})
} else {
   gsap.set('.nav > *', {opacity: 1, y: 0})
}

/* About animation */
reveal('.about__data > *', {stagger: .2})
reveal('.about__img', {delay: .9})

const aboutCounter = document.querySelectorAll('.about__counter')
aboutCounter.forEach(el => {
  gsap.from(el, {
    textContent: 0,
    duration: 3,
    ease: 'power1.out',
    snap: { textContent: 1},
    scrollTrigger: {trigger: el, once: true}
  })
})

/* Work animation */
reveal('.work__data .section__title', {})
reveal('.work__description', {delay: .6})
reveal('.work__data .swiper-pagination', {delay: .9})
reveal('.work__data :is(.swiper-button-prev, .swiper-button-next)', {delay: 1.2})
reveal('.work__swiper', {delay: .9})

/* Service animation */
reveal('.service__data .section__title', {})
reveal('.service__plan', {delay: .6, stagger: .2})
reveal('.service__swiper', {delay: .9, stagger: .2})

/* Expert animation */
reveal('.expert .section__title', {})
reveal('.expert__description', {delay: .6})
reveal('.expert__card', {delay: .9, stagger: .2})

/* Contact animation */
reveal('.contact__data .section__title', {})
reveal('.contact__description', {delay: .6})
reveal('.contact__data .button', {delay: .9, y: 0, scale: 0})
reveal('.contact__map', {delay: .9})
reveal('.contact__card', {delay: 1.2, stagger: .2})

/* Footer animation */
reveal('.footer__container', {})
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
const sections = document.querySelectorAll('section[id]')

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

const API_BASE_URL = "https://yewl.onrender.com";

const serviceInput = document.getElementById("service");

const providerId = new URLSearchParams(window.location.search).get("providerId");

const selectedServiceFromUrl = new URLSearchParams(window.location.search).get("service");

// ============================
// LOAD SELECTED PROVIDERS
// ============================

async function loadSelectedProvider() {

    if (!providerId) {
        barberInput.innerHTML =
            `<option value="">Select a barber</option>`;
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/public/providers`
        );

        const data = await response.json();

        if (!data.success) {
            barberInput.innerHTML =
                `<option value="">Provider not found</option>`;
            return;
        }

        const provider =
            data.providers.find(
                p => String(p._id) === String(providerId)
            );

        if (!provider) {
            barberInput.innerHTML =
                `<option value="">Provider not found</option>`;
            return;
        }

        barberInput.innerHTML = "";

        const option =
            document.createElement("option");

        option.value = provider.name;

        option.textContent =
            `${provider.name} - ${provider.area}`;

        option.selected = true;

        barberInput.appendChild(option);

    } catch (error) {

        console.error(
            "Failed to load provider:",
            error
        );

        barberInput.innerHTML =
            `<option value="">Failed to load provider</option>`;
    }
}

let currentBooking = null;

const today = new Date().toISOString().split("T")[0];

dateInput.min = today;

// ===============================
// LOAD PROVIDER SERVICES
// ===============================

async function loadProviderServices() {

    if (!providerId) {
        console.error("Provider ID missing");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/public/providers/${providerId}/services`
        );

        const data = await response.json();

        console.log("Provider services:", data);

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to load services."
            );
        }

        serviceInput.innerHTML =
            `<option value="">Select a service</option>`;

        data.services.forEach(function(service) {

            const option =
                document.createElement("option");

            option.value = service._id;

            option.dataset.serviceName = service.name;

            option.textContent =
                `${service.name} - ₹${service.price}`;

            serviceInput.appendChild(option);
        });

        console.log(
            "OPTIONS AFTER LOAD:",
            [...serviceInput.options].map(
                option => option.value
            )
        );

        console.log(
            "URL SERVICE:",
            selectedServiceFromUrl
        );

        if (selectedServiceFromUrl) {

            const matchingOption =
                [...serviceInput.options].find(
                    option =>
                        option.dataset.serviceName &&
                        option.dataset.serviceName.trim().toLowerCase() ===
                        selectedServiceFromUrl.trim().toLowerCase()
                );

            if (matchingOption) {

                serviceInput.value =
                    matchingOption.value;

                console.log(
                    "AUTO SELECTED:",
                    serviceInput.value
                );

            } else {

                console.log(
                    "No matching service found."
                );
            }
        }

    } catch (error) {

        console.error(
            "Failed to load provider services:",
            error
        );
    }
}

// =============================
// HELPER FUNCTIONS 
// =============================
function timeToMinutes(time) {

    const [hours, minutes] =
        time.split(":").map(Number);

    return hours * 60 + minutes;
}


function minutesToTime(minutes) {

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    return String(hours).padStart(2, "0") +
           ":" +
           String(mins).padStart(2, "0");
}


function formatTime(time) {

    const [hours, minutes] =
        time.split(":").map(Number);

    const period =
        hours >= 12 ? "PM" : "AM";

    const displayHour =
        hours % 12 || 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}


// ===============================
// LOAD AVAILABLE TIMES
// ===============================

async function loadAvailableTimes() {

    const date = dateInput.value;

    if (!providerId || !date) {
        timeInput.innerHTML = `
            <option value="">Select date first</option>
        `;
        return;
    }

    try {

        timeInput.innerHTML =
            `<option value="">Loading...</option>`;

        const response = await fetch(
            `${API_BASE_URL}/api/public/providers/${providerId}/availability?date=${date}`
        );

        const data = await response.json();

        console.log("Availability:", data);

        if (!data.success) {

            timeInput.innerHTML =
                `<option value="">Unable to load times</option>`;

            return;
        }

        if (!data.isOpen) {

            timeInput.innerHTML =
                `<option value="">Provider is closed</option>`;

            return;
        }

        const start = data.workingHours.start;
        const end = data.workingHours.end;

        const bookedTimes = data.bookedTimes || [];

        timeInput.innerHTML =
            `<option value="">Select a time</option>`;

        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);

        for (
            let minutes = startMinutes;
            minutes < endMinutes;
            minutes += 30
        ) {

            const time = minutesToTime(minutes);

            if (!bookedTimes.includes(time)) {

                const option =
                    document.createElement("option");

                option.value = time;
                option.textContent = formatTime(time);

                timeInput.appendChild(option);
            }
        }

    } catch (error) {

        console.error(
            "Availability error:",
            error
        );

        timeInput.innerHTML =
            `<option value="">Failed to load times</option>`;
    }
}


// ===============================
// CALL FUNCTION
// ===============================

loadProviderServices();
loadSelectedProvider();

dateInput.addEventListener("change", loadAvailableTimes);

// Load providers from backend
async function loadProviders() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/public/providers`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        // Clear existing options
        barberInput.innerHTML = `
            <option value="">Select a barber</option>
        `;

        // Add providers from database
        data.providers.forEach(provider => {

            const option = document.createElement("option");

            option.value = provider._id;
            option.textContent =
                `${provider.name} (${provider.accountType}) - ${provider.area}`;

            barberInput.appendChild(option);
        });

    } catch (error) {

        console.error("Provider loading error:", error);

        barberInput.innerHTML = `
            <option value="">Unable to load barbers</option>
        `;
    }
}

// Load providers when page loads
loadProviders();


// Generate time slots
function generateTimeSlots(startTime, endTime) {

    if (!startTime || !endTime) {
        timeInput.innerHTML = `
            <option value="">Select date first</option>
        `;
        return;
    }

    timeInput.innerHTML = `
        <option value="">Select a time</option>
    `;

    const [startHour, startMinute] =
        startTime.split(":").map(Number);

    const [endHour, endMinute] =
        endTime.split(":").map(Number);

    let currentMinutes =
        startHour * 60 + startMinute;

    const closingMinutes =
        endHour * 60 + endMinute;

    while (currentMinutes < closingMinutes) {

        const hour =
            Math.floor(currentMinutes / 60);

        const minute =
            currentMinutes % 60;

        const time =
            `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        const option =
            document.createElement("option");

        option.value = time;
        option.textContent = formatTime(time);

        timeInput.appendChild(option);

        currentMinutes += 30;
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


// Reload available times when barber changes
barberInput.addEventListener("change", loadAvailableTimes);

// Reload available times when date changes
dateInput.addEventListener("change", loadAvailableTimes);


// Submit booking
bookingForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const serviceId = document.getElementById("service").value;
    const providerId = barberInput.value;

    const date = dateInput.value;
    const time = timeInput.value;

    const serviceOption =
        document.getElementById("service").selectedOptions[0];

    const barberOption =
        barberInput.selectedOptions[0];

    const serviceName = serviceOption
        ? serviceOption.textContent
        : "";

    const providerName = barberOption
        ? barberOption.textContent
        : "";

    const customerName =
        document.getElementById("customerName").value;

    const phone =
        document.getElementById("phone").value;


    try {

        const response = await fetch(`${API_BASE_URL}/api/bookings`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                providerId,
                serviceId,
                service: serviceName,
                barber: providerName,
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

        document.getElementById("confirm-code").textContent =
            data.receivingCode;

        // Fill confirmation modal
        document.getElementById("confirm-name").textContent =
        customerName;

        document.getElementById("confirm-service").textContent =
            document.getElementById("service").selectedOptions[0].textContent;

        document.getElementById("confirm-barber").textContent =
            barberInput.selectedOptions[0].textContent;

        document.getElementById("confirm-date").textContent =
        date;

        document.getElementById("confirm-time").textContent =
        formatTime(time);

        currentBooking = {
            id: data.bookingId,
            manageToken: data.manageToken,
            customerName,
            phone,
            service: serviceName,
            barber: providerName,
            providerId,
            serviceId,
            date,
            time
        };
        document.getElementById("reschedule-panel").hidden = true;


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

function populateRescheduleTimes() {
    const select = document.getElementById("reschedule-time");
    select.innerHTML = '<option value="">Select a time</option>';
    for (let hour = 9; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            select.insertAdjacentHTML("beforeend", `<option value="${value}">${formatTime(value)}</option>`);
        }
    }
}

document.getElementById("whatsapp-confirmation")?.addEventListener("click", () => {
    if (!currentBooking) return;
    const message = `Hi ${currentBooking.customerName}, your appointment is booked!%0A%0AService: ${currentBooking.service}%0ABarber: ${currentBooking.barber}%0ADate: ${currentBooking.date}%0ATime: ${formatTime(currentBooking.time)}`;
    window.open(`https://wa.me/${currentBooking.phone}?text=${message}`, "_blank", "noopener");
});

document.getElementById("show-reschedule")?.addEventListener("click", () => {
    if (!currentBooking) return;
    const panel = document.getElementById("reschedule-panel");
    panel.hidden = !panel.hidden;
    document.getElementById("reschedule-date").min = today;
    document.getElementById("reschedule-date").value = currentBooking.date;
    populateRescheduleTimes();
    document.getElementById("reschedule-time").value = currentBooking.time;
});

async function updateCustomerBooking(payload) {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${currentBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manageToken: currentBooking.manageToken, ...payload })
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Unable to update booking");
    return data;
}

document.getElementById("cancel-booking")?.addEventListener("click", async () => {
    if (!currentBooking || !confirm("Cancel this appointment?")) return;
    try {
        const data = await updateCustomerBooking({ action: "cancel" });
        alert(`✓ ${data.message}`);
        document.getElementById("booking-modal").style.display = "none";
    } catch (error) {
        alert(`❌ ${error.message}`);
    }
});

document.getElementById("save-reschedule")?.addEventListener("click", async () => {
    if (!currentBooking) return;
    const date = document.getElementById("reschedule-date").value;
    const time = document.getElementById("reschedule-time").value;
    if (!date || !time) return alert("Please select a new date and time.");
    try {
        const data = await updateCustomerBooking({ action: "reschedule", date, time });
        currentBooking.date = date;
        currentBooking.time = time;
        document.getElementById("confirm-date").textContent = date;
        document.getElementById("confirm-time").textContent = formatTime(time);
        document.getElementById("reschedule-panel").hidden = true;
        alert(`✓ ${data.message}`);
    } catch (error) {
        alert(`❌ ${error.message}`);
    }
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


// ===============================
// YEWL PROVIDER LIST
// ===============================

const YEWL_API_URL = "https://yewl.onrender.com";

const barberCategoryBtn =
    document.getElementById("barberCategoryBtn");

const beautyCategoryBtn =
    document.getElementById("beautyCategoryBtn");

const providerList =
    document.getElementById("providerList");

const useMyLocation =
    document.getElementById("useMyLocation");


// ===============================
// CUSTOMER GPS LOCATION
// ===============================

if (useMyLocation) {

    useMyLocation.addEventListener("click", function () {

        if (!navigator.geolocation) {

            alert("GPS is not supported by your browser.");
            return;

        }

        useMyLocation.innerHTML =
            '<i class="ri-loader-4-line"></i> Getting Location...';

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                console.log("Customer Latitude:", latitude);
                console.log("Customer Longitude:", longitude);

                // Save customer location
                localStorage.setItem(
                    "customerLatitude",
                    latitude
                );

                localStorage.setItem(
                    "customerLongitude",
                    longitude
                );

                useMyLocation.innerHTML =
                    '<i class="ri-map-pin-fill"></i> Location Found';

                // Remove manually selected area
                if (userArea) {
                    userArea.value = "";
                }

            },

            function (error) {

                console.error(
                    "Customer GPS Error:",
                    error
                );

                useMyLocation.innerHTML =
                    '<i class="ri-map-pin-line"></i> Use My Location';

                alert(
                    "Location permission denied or unavailable."
                );

            }

        );

    });

}

const userArea =
    document.getElementById("userArea");

// ===============================
// DISTANCE CALCULATION
// ===============================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// ===============================
// PROVIDER OPEN / CLOSED STATUS
// ===============================

function getProviderOpenStatus(workingHours) {

    if (!workingHours) {
        return {
            isOpen: false,
            label: "Hours unavailable"
        };
    }

    const now =
        new Date();

    const currentDay =
        [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ][now.getDay()];


    let todayHours = null;


    // ===============================
    // DAY-WISE FORMAT
    // ===============================

    if (
        workingHours[currentDay] &&
        typeof workingHours[currentDay] === "object"
    ) {

        todayHours =
            workingHours[currentDay];

    }


    // ===============================
    // SIMPLE FORMAT
    // ===============================

    else if (
        workingHours.start &&
        workingHours.end
    ) {

        todayHours =
            workingHours;

    }
    
    // ==================================
    // NO HOURS
    // ==================================

    if (!todayHours) {

        return {
            isOpen: false,
            label: "Closed"
        };

    }

    // ===================================
    // PROVIDER CLOSED TODAY
    // ===================================


    if (
        todayHours.isOpen === false
    ) {

        return {
            isOpen: false,
            label: "Closed"
        };

    }
    
    // =================================
    // TIME NOT AVAILABLE
    // =================================

    if (
        !todayHours.start ||
        !todayHours.end
    ) {

        return {
            isOpen: false,
            label: "Hours unavailable"
        };

    }


    // ===============================
    // CHECK CURRENT TIME
    // ===============================

    const currentTime =
        now.getHours() * 60 +
        now.getMinutes();


    const [startHour, startMinute] =
        todayHours.start
            .split(":")
            .map(Number);


    const [endHour, endMinute] =
        todayHours.end
            .split(":")
            .map(Number);


    const startTime =
        startHour * 60 +
        startMinute;


    const endTime =
        endHour * 60 +
        endMinute;


    const isOpen =
        currentTime >= startTime &&
        currentTime < endTime;


    return {
        isOpen: isOpen,
        label: isOpen
            ? "Open"
            : "Closed"
    };

}


// ===============================
// LOAD PROVIDERS
// ===============================

async function loadYEWLProviders(category) {

    if (!providerList) {
        return;
    }

    providerList.innerHTML =
        "<p>Loading providers...</p>";

    try {

        const response = await fetch(
            `${YEWL_API_URL}/api/public/providers`
        );

        const data = await response.json();

        console.log(
            "YEWL Providers:",
            data
        );

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load providers."
            );
        }

        const customerLatitude =
            Number(
                localStorage.getItem("customerLatitude")
            );

        const customerLongitude =
            Number(
                localStorage.getItem("customerLongitude")
            );

        const selectedArea =
            userArea
                ? userArea.value.trim().toLowerCase()
                : "";

        let providers =
            data.providers.filter(function(provider) {

                const categoryMatch =
                    provider.category === category;

                if (
                    selectedArea &&
                    selectedArea !== "other"
                ) {

                    const providerArea =
                        (provider.area || "")
                            .trim()
                            .toLowerCase();

                    return (
                        categoryMatch &&
                        providerArea === selectedArea
                    );
                }

                return categoryMatch;

            });


        // ===============================
        // SORT BY NEAREST LOCATION
        // ===============================

        if (
            Number.isFinite(customerLatitude) &&
            Number.isFinite(customerLongitude)
        ) {

            providers = providers
                .map(function(provider) {

                    if (
                provider.latitude === undefined ||
                provider.longitude === undefined
                    ) {
                        return {
                            ...provider,
                            distance: null
                        };
                    }

                    const distance =
                        calculateDistance(
                            customerLatitude,
                            customerLongitude,
                            Number(provider.latitude),
                            Number(provider.longitude)
                        );

                    return {
                        ...provider,
                        distance
                    };

                })
                .sort(function(a, b) {

                    if (a.distance === null) return 1;

                    if (b.distance === null) return -1;

                    return a.distance - b.distance;

                });

        }

        // ===============================
        // NO PROVIDERS
        // ===============================

        if (providers.length === 0) {

            providerList.innerHTML = `
                <p>
                    No ${category === "barber"
                        ? "barbers"
                        : "beauty professionals"
                    } found.
                </p>
            `;

            return;
        }


        // ===============================
        // DISPLAY PROVIDERS
        // ===============================

        providerList.innerHTML = "";

        providers.forEach(function(provider) {

            const card =
                document.createElement("div");

            card.className =
                "provider-card";


            const image =
                provider.profileImage ||
                "assets/img/home-logo-noorslot.png";

            const providerStatus =
               getProviderOpenStatus(
                   provider.workingHours
               );


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${provider.name}"
                    class="provider-card__image"
                >

                <div class="provider-card__content">

                    <h3 class="provider-card__name">
                        ${provider.name}
                    </h3>

                    <p>
                        ${
                            provider.category === "barber"
                                ? "Barber"
                                : "Beauty / Makeup"
                        }
                    </p>

                    <p>
                        <i class="ri-map-pin-line"></i>
                        ${provider.area || "Location not available"}
                    </p>

                    ${
                        provider.rating > 0
                            ? `
                                <p class="provider-card__rating">
                                    <i class="ri-star-fill"></i>
                                    ${provider.rating}
                                    <span>
                                        (${provider.totalReviews || 0} reviews)
                                    </span>
                                </p>
                              `
                            : `
                                <p class="provider-card__rating">
                                    <i class="ri-star-line"></i>
                                    New provider
                                </p>
                              `
                    }

                    ${
                        provider.startingPrice !== null &&
                        provider.startingPrice !== undefined
                            ? `
                                <p class="provider-card__price">
                                    <i class="ri-price-tag-3-line"></i>
                                    Starting from ₹${provider.startingPrice}
                                </p>
                              `
                            : ""
                    }

                    <p class="${
                        providerStatus.isOpen
                            ? "provider-card__open"
                            : "provider-card__closed"
                    }">
                        <i class="${
                            providerStatus.isOpen
                                ? "ri-checkbox-circle-fill"
                                : "ri-close-circle-fill"
                        }"></i>

                        ${providerStatus.label}
                    </p>

                    ${
                        provider.distance !== null &&
                        provider.distance !== undefined
                            ? `
                                <p>
                                    <i class="ri-navigation-line"></i>
                                    ${
                                        provider.distance < 1
                                            ? `${Math.round(provider.distance * 1000)} m away`
                                            : `${provider.distance.toFixed(1)} km away`
                                    }
                                </p>
                              `
                            : ""
                    }

                    <div class="provider-card__actions">

                        <button
                            type="button"
                            class="button provider-card__button"
                            data-provider-id="${provider._id}"
                        >
                            View Profile
                        </button>

                        ${
                            provider.latitude !== undefined &&
                            provider.longitude !== undefined
                                ? `
                                    <button
                                        type="button"
                                        class="button provider-card__direction-button"
                                        data-latitude="${provider.latitude}"
                                        data-longitude="${provider.longitude}"
                                    >
                                        <i class="ri-navigation-line"></i>
                                        Get Directions
                                    </button>
                                  `
                                : ""
                        }

                    </div>

                </div>

            `;

            const viewProfileButton =
                card.querySelector(".provider-card__button");

            viewProfileButton.addEventListener(
                "click",
                function() {

                    const providerId =
                        this.dataset.providerId;

                    window.location.href =
                        `provider-profile.html?id=${providerId}`;

                }
            );


            const directionButton =
                card.querySelector(
                    ".provider-card__direction-button"
                );

            if (directionButton) {

                directionButton.addEventListener(
                    "click",
                    function() {

                        const latitude =
                            this.dataset.latitude;

                        const longitude =
                            this.dataset.longitude;

                        const googleMapsUrl =
                            `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

                        window.open(
                            googleMapsUrl,
                            "_blank"
                        );

                    }
                );

            }


            providerList.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Provider loading error:",
            error
        );

        providerList.innerHTML = `
            <p>
                Unable to load providers.
            </p>
        `;
    }
}


// ===============================
// BARBER BUTTON
// ===============================

if (barberCategoryBtn) {

    barberCategoryBtn.addEventListener(
        "click",
        function() {

            barberCategoryBtn.classList.add("active");
            beautyCategoryBtn?.classList.remove("active");

            loadYEWLProviders("barber");

        }
    );

}


// ===============================
// BEAUTY BUTTON
// ===============================

if (beautyCategoryBtn) {

    beautyCategoryBtn.addEventListener(
        "click",
        function() {

            beautyCategoryBtn.classList.add("active");
            barberCategoryBtn?.classList.remove("active");

            loadYEWLProviders("beauty");

        }
    );

}


// ===============================
// AREA CHANGE
// ===============================

if (userArea) {

    userArea.addEventListener("change", function () {

        const selectedArea = this.value;

        if (!selectedArea) {
            providerList.innerHTML = "";
            return;
        }

        // If a category button was previously selected,
        // reload providers using the selected area.

        if (barberCategoryBtn?.classList.contains("active")) {
            loadYEWLProviders("barber");
        }

        if (beautyCategoryBtn?.classList.contains("active")) {
            loadYEWLProviders("beauty");
        }

    });

}

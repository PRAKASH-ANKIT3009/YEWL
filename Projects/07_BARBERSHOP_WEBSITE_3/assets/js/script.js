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

document.querySelectorAll('.nav__link[href="#support"]').forEach(link => {
    link.addEventListener('click', () => {
        const supportDetails = document.querySelector('.support__details');
        if (supportDetails) {
            supportDetails.open = true;
            loadSupportHighlights();
        }
    });
});


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

/*=============== PROVIDER BEFORE / AFTER WORK ===============*/
async function loadPublicWorkPortfolio() {
  const slidesContainer = document.getElementById("providerWorkSlides");
  const carousel = document.querySelector(".work-portfolio__swiper");
  if (!slidesContainer || !carousel) return;

  const showPortfolioMessage = message => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    const paragraph = document.createElement("p");
    paragraph.className = "work-portfolio__empty";
    paragraph.textContent = message;
    slide.appendChild(paragraph);
    slidesContainer.replaceChildren(slide);
    const controls = carousel.querySelector(".work-portfolio__controls");
    if (controls) controls.hidden = true;
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/public/work-portfolio`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load provider work.");

    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) {
      showPortfolioMessage("NOORSLOT professionals have not added before-and-after work yet. Check back soon.");
      return;
    }

    const slides = items.map(item => {
      const slide = document.createElement("article");
      slide.className = "swiper-slide";
      const card = document.createElement("div");
      card.className = "work-portfolio__card";

      const heading = document.createElement("div");
      heading.className = "work-portfolio__card-heading";
      const service = document.createElement("h3");
      service.textContent = item.serviceName || "Service";
      const professional = document.createElement("p");
      professional.textContent = item.providerName || "NOORSLOT Professional";
      heading.append(service, professional);
      card.appendChild(heading);

      const pair = document.createElement("div");
      pair.className = "work-portfolio__pair";
      [[item.beforeImage, "Before"], [item.afterImage, "After"]].forEach(([url, label]) => {
        const figure = document.createElement("figure");
        figure.className = "work-portfolio__figure";
        const badge = document.createElement("figcaption");
        badge.textContent = label;
        const image = document.createElement("img");
        image.src = url;
        image.alt = `${item.serviceName || "Service"} — ${label}, by ${item.providerName || "NOORSLOT professional"}`;
        image.loading = "lazy";
        image.decoding = "async";
        figure.append(image, badge);
        pair.appendChild(figure);
      });
      card.appendChild(pair);

      if (item.providerId) {
        const link = document.createElement("a");
        link.className = "work-portfolio__book-link";
        link.href = `index.html?providerId=${encodeURIComponent(String(item.providerId))}#booking`;
        link.textContent = "Book this professional";
        card.appendChild(link);
      }

      slide.appendChild(card);
      return slide;
    });
    slidesContainer.replaceChildren(...slides);

    new Swiper(carousel, {
      loop: items.length > 1,
      slidesPerView: 1,
      spaceBetween: 18,
      autoHeight: true,
      grabCursor: true,
      navigation: {
        nextEl: carousel.querySelector(".work-portfolio__next"),
        prevEl: carousel.querySelector(".work-portfolio__prev")
      },
      pagination: {
        el: carousel.querySelector(".work-portfolio__pagination"),
        type: "fraction"
      }
    });
  } catch (error) {
    console.error("Load public work portfolio error:", error);
    showPortfolioMessage("Professional work gallery is temporarily unavailable. Please try again later.");
  }
}

window.addEventListener("DOMContentLoaded", loadPublicWorkPortfolio, { once: true });

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
const serviceInput = document.getElementById("service");
const serviceLocationInput = document.getElementById("serviceLocation");
const servicePriceHint = document.getElementById("servicePriceHint");
const customerEmailInput = document.getElementById("customerEmail");
if (customerEmailInput) {
    try {
        const signedInCustomer = JSON.parse(localStorage.getItem("customerData") || "null");
        if (signedInCustomer?.email) customerEmailInput.value = signedInCustomer.email;
    } catch (error) {
        console.warn("Could not load saved customer email.");
    }
}

const API_BASE_URL = "https://yewl.onrender.com";
let publicProvidersPromise = null;

const bookingParams = new URLSearchParams(window.location.search);
const initialProviderId = bookingParams.get("providerId");
const selectedServiceFromUrl = bookingParams.get("service");

let currentBooking = null;
let availabilityRequestId = 0;
let servicesRequestId = 0;
let isBookingSubmitting = false;

// Use the browser's local date, not UTC.
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const today = getLocalDateString();

if (dateInput) {
    dateInput.min = today;
}

// Convert 24-hour time to 12-hour display.
function formatTime(time) {
    if (!time || typeof time !== "string") return "";

    const [hours, minutes] = time.split(":").map(Number);

    if (
        !Number.isFinite(hours) ||
        !Number.isFinite(minutes)
    ) {
        return time;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function setTimePlaceholder(message) {
    if (!timeInput) return;

    timeInput.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = message;

    timeInput.appendChild(option);
}

function setServicePlaceholder(message) {
    if (!serviceInput) return;

    serviceInput.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.textContent = message;

    serviceInput.appendChild(option);
}

// ============================
// LOAD PROVIDERS
// ============================

async function loadProviders() {
    if (!barberInput) return;

    barberInput.innerHTML =
        '<option value="">Loading professionals...</option>';

    try {
        const providers = await getPublicProviders();

        barberInput.innerHTML =
            '<option value="">Select a professional</option>';

        if (providers.length === 0) {
            barberInput.replaceChildren(new Option("No professionals available yet", ""));

            setServicePlaceholder("Register a professional first");
            setTimePlaceholder("No time slots available yet");

            console.log("No providers registered on NOORSLOT yet.");
            return [];
        }

        providers.forEach(provider => {
            const option = document.createElement("option");

            option.value = provider._id;
            option.dataset.phone = provider.phone || "";
            option.textContent =
                `${provider.name} (${provider.accountType || provider.category || "Professional"}) - ${provider.area || ""}`;

            barberInput.appendChild(option);
        });

        // If the page was opened from a provider profile,
        // select that provider automatically.
        if (initialProviderId) {
            const matchingProvider = providers.find(
                provider =>
                    String(provider._id) === String(initialProviderId)
            );

            if (matchingProvider) {
                barberInput.value = matchingProvider._id;
            }
        }

        return providers;

    } catch (error) {
        console.error("Provider loading error:", error);

        barberInput.innerHTML =
            '<option value="">Unable to load professionals</option>';

        setServicePlaceholder("Select a professional first");
        setTimePlaceholder("Select provider, service and date");

        return [];
    }
}

function updateSelectedServicePrice() {
    const option = serviceInput?.selectedOptions?.[0];
    const mode = option?.dataset.serviceMode || "shop";
    if (!option?.value || !serviceLocationInput) {
        if (serviceLocationInput) {
            serviceLocationInput.replaceChildren(new Option("Choose a service first", ""));
            serviceLocationInput.disabled = true;
        }
        if (servicePriceHint) servicePriceHint.textContent = "";
        return;
    }
    const modes = mode === "both" ? ["shop", "home"] : [mode];
    serviceLocationInput.replaceChildren(...modes.map(value => new Option(value === "home" ? "Home service" : "At the shop", value)));
    serviceLocationInput.disabled = modes.length === 1;
    if (!modes.includes(serviceLocationInput.value)) serviceLocationInput.value = modes[0];
    const value = serviceLocationInput.value;
    const price = value === "home" ? option.dataset.homePrice : option.dataset.shopPrice;
    if (servicePriceHint) servicePriceHint.textContent = price !== "" && price !== undefined ? `Selected price: ₹${price}` : "Price not configured";
}

// ============================
// LOAD SERVICES FOR SELECTED PROVIDER
// ============================

async function loadProviderServices() {
    if (!barberInput || !serviceInput) return;

    const selectedProviderId = barberInput.value;
    const requestId = ++servicesRequestId;

    setServicePlaceholder("Select a service");
    updateSelectedServicePrice();
    setTimePlaceholder("Select provider, service and date");

    if (!selectedProviderId) {
        setServicePlaceholder("Select a professional first");
        return;
    }

    setServicePlaceholder("Loading services...");

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/public/providers/${encodeURIComponent(selectedProviderId)}/services`
        );

        const data = await response.json();

        // Ignore an older response if the provider changed.
        if (
            requestId !== servicesRequestId ||
            selectedProviderId !== barberInput.value
        ) {
            return;
        }

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to load services."
            );
        }

        serviceInput.innerHTML =
            '<option value="">Select a service</option>';

        const services = Array.isArray(data.services)
            ? data.services
            : [];

        services.forEach(service => {
            const option = document.createElement("option");

            option.value = service._id;
            option.dataset.serviceName = service.name || "";
            option.dataset.serviceMode = service.serviceMode || "shop";
            option.dataset.shopPrice = service.price == null ? "" : String(service.price);
            option.dataset.homePrice = service.homePrice == null ? "" : String(service.homePrice);
            const mode = service.serviceMode || "shop";
            const prices = [];
            if (mode !== "home" && service.price != null) prices.push(`Shop ₹${service.price}`);
            if (mode !== "shop" && service.homePrice != null) prices.push(`Home ₹${service.homePrice}`);
            option.textContent = `${service.name} — ${prices.join(" / ")}`;

            serviceInput.appendChild(option);
        });

        // Apply URL service only when loading the original provider.
        if (
            initialProviderId &&
            selectedProviderId === initialProviderId &&
            selectedServiceFromUrl
        ) {
            const matchingOption = [...serviceInput.options].find(
                option =>
                    option.dataset.serviceName &&
                    option.dataset.serviceName.trim().toLowerCase() ===
                    selectedServiceFromUrl.trim().toLowerCase()
            );

            if (matchingOption) {
                serviceInput.value = matchingOption.value;
            }
        }

        updateSelectedServicePrice();
        await loadAvailableTimes();

    } catch (error) {
        if (requestId !== servicesRequestId) return;

        console.error("Failed to load provider services:", error);
        setServicePlaceholder("Unable to load services");
        setTimePlaceholder("Unable to load available times");
    }
}

// ============================
// LOAD AVAILABLE TIMES
// ============================

async function loadAvailableTimes() {
    if (!dateInput || !barberInput || !serviceInput || !timeInput) {
        return;
    }

    const date = dateInput.value;
    const selectedProviderId = barberInput.value;
    const serviceId = serviceInput.value;

    // Increment even when inputs are incomplete, so old requests
    // cannot overwrite the current dropdown.
    const requestId = ++availabilityRequestId;

    if (!selectedProviderId || !serviceId || !date) {
        setTimePlaceholder("Select provider, service and date");
        return;
    }

    setTimePlaceholder("Loading available times...");

    try {
        const url = new URL(
            `${API_BASE_URL}/api/providers/${encodeURIComponent(selectedProviderId)}/available-slots`
        );

        url.searchParams.set("date", date);
        url.searchParams.set("serviceId", serviceId);

        const response = await fetch(url);
        const data = await response.json();

        // Do not show results from an older selection.
        if (
            requestId !== availabilityRequestId ||
            date !== dateInput.value ||
            selectedProviderId !== barberInput.value ||
            serviceId !== serviceInput.value
        ) {
            return;
        }

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Unable to load available slots."
            );
        }

        const availableSlots = Array.isArray(data.slots)
            ? data.slots.filter(slot => slot.available)
            : [];

        if (availableSlots.length === 0) {
            setTimePlaceholder("No slots available");
            return;
        }

        timeInput.innerHTML =
            '<option value="">Select a time</option>';

        availableSlots.forEach(slot => {
            const option = document.createElement("option");

            option.value = slot.time;
            option.textContent = formatTime(slot.time);

            timeInput.appendChild(option);
        });

    } catch (error) {
        if (requestId !== availabilityRequestId) return;

        console.error("Availability error:", error);
        setTimePlaceholder("Failed to load times");
    }
}

// ============================
// INITIAL PAGE LOAD
// ============================

async function initializeBookingForm() {
    if (!bookingForm || !barberInput || !serviceInput || !timeInput) {
        return;
    }

    setServicePlaceholder("Select a professional first");
    setTimePlaceholder("Select provider, service and date");

    await loadProviders();

    if (barberInput.value) {
        await loadProviderServices();
    }
}

initializeBookingForm();

// ============================
// INPUT CHANGE LISTENERS
// ============================

if (barberInput) {
    barberInput.addEventListener("change", () => {
        // A different provider means different services.
        loadProviderServices();
    });
}

if (serviceInput) {
    serviceInput.addEventListener("change", () => {
        updateSelectedServicePrice();
        loadAvailableTimes();
    });
}
if (serviceLocationInput) {
    serviceLocationInput.addEventListener("change", updateSelectedServicePrice);
}

if (dateInput) {
    dateInput.addEventListener("change", () => {
        loadAvailableTimes();
    });
}

// ============================
// SUBMIT BOOKING
// ============================

if (bookingForm) {
    bookingForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (isBookingSubmitting) return;

        const serviceId = serviceInput?.value;
        const selectedProviderId = barberInput?.value;
        const date = dateInput?.value;
        const time = timeInput?.value;

        const serviceOption = serviceInput?.selectedOptions[0];
        const providerOption = barberInput?.selectedOptions[0];

        const serviceName = serviceOption?.dataset.serviceName || serviceOption?.textContent || "";
        const deliveryMode = serviceLocationInput?.value || "shop";
        const selectedPrice = deliveryMode === "home" ? serviceOption?.dataset.homePrice : serviceOption?.dataset.shopPrice;
        const providerName = providerOption?.textContent || "";

        const customerName =
            document.getElementById("customerName")?.value.trim() || "";

        const phone =
            document.getElementById("phone")?.value.trim() || "";
        const email = customerEmailInput?.value.trim() || "";

        if (
            !selectedProviderId ||
            !serviceId ||
            !date ||
            !time ||
            !deliveryMode ||
            !customerName ||
            !phone ||
            !email
        ) {
            alert("Please fill in all required fields, including your email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address for your booking confirmation.");
            customerEmailInput?.focus();
            return;
        }

        if (date < getLocalDateString()) {
            alert("Please select today or a future date.");
            return;
        }

        const customerToken =
            localStorage.getItem("customerToken");

        const submitButton =
            bookingForm.querySelector('[type="submit"]');

        isBookingSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(customerToken
                            ? {
                                Authorization: `Bearer ${customerToken}`
                            }
                            : {})
                    },
                    body: JSON.stringify({
                        providerId: selectedProviderId,
                        serviceId,
                        serviceMode: deliveryMode,
                        service: serviceName,
                        barber: providerName,
                        date,
                        time,
                        customerName,
                        phone,
                        email
                    })
                }
            );

            const data = await response.json();

            if (response.status === 409) {
                alert(`❌ ${data.message || "This slot is already booked."}`);
                await loadAvailableTimes();
                return;
            }

            if (!response.ok || !data.success) {
                alert(
                    `❌ ${data.message || "Something went wrong. Please try again."}`
                );
                return;
            }

            const confirmationCode =
                document.getElementById("confirm-code");
            const confirmName =
                document.getElementById("confirm-name");
            const confirmService =
                document.getElementById("confirm-service");
            const confirmBarber =
                document.getElementById("confirm-barber");
            const confirmDate =
                document.getElementById("confirm-date");
            const confirmTime =
                document.getElementById("confirm-time");

            if (confirmationCode) {
                confirmationCode.textContent =
                    data.receivingCode || "";
            }

            if (confirmName) confirmName.textContent = customerName;
            if (confirmService) confirmService.textContent = serviceName;
            if (confirmBarber) confirmBarber.textContent = providerName;
            if (confirmDate) confirmDate.textContent = date;
            if (confirmTime) confirmTime.textContent = formatTime(time);
            const confirmLocation = document.getElementById("confirm-location");
            const confirmPrice = document.getElementById("confirm-price");
            if (confirmLocation) confirmLocation.textContent = deliveryMode === "home" ? "Home service" : "At the shop";
            if (confirmPrice) confirmPrice.textContent = selectedPrice === undefined || selectedPrice === "" ? "Contact provider" : `₹${selectedPrice}`;

            currentBooking = {
                id: data.bookingId,
                manageToken: data.manageToken,
                receivingCode: data.receivingCode || "",
                customerName,
                phone,
                service: serviceName,
                serviceMode: deliveryMode,
                servicePrice: selectedPrice,
                barber: providerName,
                providerId: selectedProviderId,
                providerPhone: barberInput.selectedOptions?.[0]?.dataset.phone || "",
                serviceId,
                date,
                time
            };

            const reschedulePanel =
                document.getElementById("reschedule-panel");

            if (reschedulePanel) {
                reschedulePanel.hidden = true;
            }

            const bookingModal =
                document.getElementById("booking-modal");

            if (bookingModal) {
                bookingModal.style.display = "flex";
            }

            // Reset the form and restore its initial provider if present.
            bookingForm.reset();
            updateSelectedServicePrice();

            if (dateInput) {
                dateInput.min = getLocalDateString();
            }

            if (initialProviderId && barberInput) {
                barberInput.value = initialProviderId;
            }

            if (barberInput?.value) {
                await loadProviderServices();
            } else {
                setServicePlaceholder("Select a professional first");
                setTimePlaceholder("Select provider, service and date");
            }

        } catch (error) {
            console.error("Booking error:", error);

            alert(
                "❌ Unable to connect to the server. Please try again."
            );

        } finally {
            isBookingSubmitting = false;

            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

// ============================
// CLOSE BOOKING MODAL
// ============================

document
    .getElementById("close-booking-modal")
    ?.addEventListener("click", () => {
        const modal = document.getElementById("booking-modal");
        if (modal) modal.style.display = "none";
    });

document
    .getElementById("done-booking")
    ?.addEventListener("click", () => {
        const modal = document.getElementById("booking-modal");
        if (modal) modal.style.display = "none";
    });

// ============================
// RESCHEDULE TIME OPTIONS
// ============================

function populateRescheduleTimes() {
    const select = document.getElementById("reschedule-time");
    if (!select) return;

    select.innerHTML =
        '<option value="">Select a time</option>';

    for (let hour = 9; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const value =
                `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

            const option = document.createElement("option");
            option.value = value;
            option.textContent = formatTime(value);

            select.appendChild(option);
        }
    }
}

// ============================
// WHATSAPP CONFIRMATION
// ============================

document
    .getElementById("whatsapp-confirmation")
    ?.addEventListener("click", () => {
        if (!currentBooking) return;

        const phone = toWhatsAppNumber(currentBooking.providerPhone);
        if (!phone) {
            alert("Professional ka WhatsApp number available nahi hai. Unki profile se contact details check karein.");
            return;
        }

        const message = [
            `Hello ${currentBooking.barber}, I just sent a booking request on NOORSLOT. Please check and confirm it from your dashboard.`,
            "",
            `Customer: ${currentBooking.customerName}`,
            `Service: ${currentBooking.service}`,
            `Service location: ${currentBooking.serviceMode === "home" ? "Home service" : "At the shop"}`,
            `Price: ${currentBooking.servicePrice ? `₹${currentBooking.servicePrice}` : "Please confirm"}`,
            `Date: ${currentBooking.date}`,
            `Time: ${formatTime(currentBooking.time)}`,
            `Customer phone: ${currentBooking.phone}`,
            `Booking code: ${currentBooking.receivingCode || "N/A"}`
        ].join("\n");
        const whatsappTab = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
        if (!whatsappTab) alert("WhatsApp nahi khula. Browser mein pop-ups allow karke dobara try karein.");
    });

function toWhatsAppNumber(value) {
    let digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
    if (digits.length === 10) digits = `91${digits}`;
    return digits;
}

// ============================
// SHOW RESCHEDULE PANEL
// ============================

document
    .getElementById("show-reschedule")
    ?.addEventListener("click", () => {
        if (!currentBooking) return;

        const panel =
            document.getElementById("reschedule-panel");
        const rescheduleDate =
            document.getElementById("reschedule-date");
        const rescheduleTime =
            document.getElementById("reschedule-time");

        if (!panel || !rescheduleDate || !rescheduleTime) return;

        panel.hidden = !panel.hidden;

        if (!panel.hidden) {
            rescheduleDate.min = getLocalDateString();
            rescheduleDate.value = currentBooking.date;

            populateRescheduleTimes();
            rescheduleTime.value = currentBooking.time;
        }
    });

// ============================
// UPDATE CUSTOMER BOOKING
// ============================

async function updateCustomerBooking(payload) {
    if (!currentBooking?.id || !currentBooking?.manageToken) {
        throw new Error("Booking information is missing.");
    }

    const response = await fetch(
        `${API_BASE_URL}/api/bookings/${encodeURIComponent(currentBooking.id)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                manageToken: currentBooking.manageToken,
                ...payload
            })
        }
    );

    const data = await response.json();

    if (!response.ok || !Array.isArray(data.providers)) {
        throw new Error(
            data.message || "Invalid providers API response."
        );
    }

    return data;
}

// ============================
// CANCEL BOOKING
// ============================

document
    .getElementById("cancel-booking")
    ?.addEventListener("click", async () => {
        if (!currentBooking) return;

        if (!confirm("Cancel this appointment?")) return;

        try {
            const data = await updateCustomerBooking({
                action: "cancel"
            });

            alert(`✓ ${data.message}`);

            const modal =
                document.getElementById("booking-modal");

            if (modal) modal.style.display = "none";

        } catch (error) {
            alert(`❌ ${error.message}`);
        }
    });

// ============================
// SAVE RESCHEDULE
// ============================

document
    .getElementById("save-reschedule")
    ?.addEventListener("click", async () => {
        if (!currentBooking) return;

        const date =
            document.getElementById("reschedule-date")?.value;

        const time =
            document.getElementById("reschedule-time")?.value;

        if (!date || !time) {
            alert("Please select a new date and time.");
            return;
        }

        if (date < getLocalDateString()) {
            alert("Please select today or a future date.");
            return;
        }

        try {
            const data = await updateCustomerBooking({
                action: "reschedule",
                date,
                time
            });

            currentBooking.date = date;
            currentBooking.time = time;

            const confirmDate =
                document.getElementById("confirm-date");
            const confirmTime =
                document.getElementById("confirm-time");
            const panel =
                document.getElementById("reschedule-panel");

            if (confirmDate) confirmDate.textContent = date;
            if (confirmTime) confirmTime.textContent = formatTime(time);
            if (panel) panel.hidden = true;

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

/* Subtle zoom animation; the image has enough inset to keep its full frame visible. */
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

async function getPublicProviders() {
    if (!publicProvidersPromise) {
        publicProvidersPromise = (async () => {
            const response = await fetch(`${API_BASE_URL}/api/public/providers`);
            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("The provider service returned an unreadable response.");
            }
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to load professionals.");
            }
            return Array.isArray(data.providers) ? data.providers : [];
        })().catch(error => {
            publicProvidersPromise = null;
            throw error;
        });
    }
    return publicProvidersPromise;
}

function renderPublicServiceCatalog(providers) {
    const catalog = document.getElementById("serviceCatalog");
    if (!catalog) return;

    const groupedServices = new Map();
    providers.forEach(provider => {
        (Array.isArray(provider.services) ? provider.services : []).forEach(service => {
            const name = String(service.name || "Service").trim();
            if (!name) return;
            const category = provider.category === "beauty" ? "Beauty & makeup" : "Barber & grooming";
            const key = `${category.toLowerCase()}::${name.toLocaleLowerCase()}`;
            if (!groupedServices.has(key)) {
                groupedServices.set(key, { name, category, providers: [] });
            }
            groupedServices.get(key).providers.push({ provider, service });
        });
    });

    const services = [...groupedServices.values()].sort((a, b) =>
        a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
    );
    catalog.replaceChildren();
    catalog.setAttribute("aria-busy", "false");

    if (!services.length) {
        const empty = document.createElement("article");
        empty.className = "service__catalog-state";
        const message = document.createElement("p");
        message.textContent = "No active services are listed yet. Please check back soon.";
        empty.append(message);
        catalog.append(empty);
        return;
    }

    const formatPrice = price => Number.isFinite(Number(price)) && price !== null
        ? `₹${Number(price).toLocaleString("en-IN")}`
        : "Price on profile";

    services.forEach(item => {
        const card = document.createElement("article");
        card.className = "service__catalog-card";

        const top = document.createElement("div");
        top.className = "service__catalog-top";
        const icon = document.createElement("span");
        icon.className = "service__catalog-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = item.category.startsWith("Beauty")
            ? '<i class="ri-sparkling-2-line"></i>'
            : '<i class="ri-scissors-cut-line"></i>';
        const category = document.createElement("span");
        category.className = "service__catalog-category";
        category.textContent = item.category;
        top.append(icon, category);

        const title = document.createElement("h4");
        title.className = "service__catalog-name";
        title.textContent = item.name;

        const providerNames = [...new Set(item.providers.map(entry => entry.provider.name).filter(Boolean))];
        const providerLabel = document.createElement("p");
        providerLabel.className = "service__catalog-providers";
        providerLabel.textContent = `${providerNames.length} ${providerNames.length === 1 ? "professional" : "professionals"} ${providerNames.length ? `• ${providerNames.slice(0, 2).join(", ")}${providerNames.length > 2 ? " and more" : ""}` : "available"}`;

        const prices = item.providers.reduce((result, entry) => {
            const mode = entry.service.serviceMode || "shop";
            if ((mode === "shop" || mode === "both") && entry.service.price !== null && Number.isFinite(Number(entry.service.price))) result.shop.push(Number(entry.service.price));
            if ((mode === "home" || mode === "both") && entry.service.homePrice !== null && Number.isFinite(Number(entry.service.homePrice))) result.home.push(Number(entry.service.homePrice));
            return result;
        }, { shop: [], home: [] });
        const priceRow = document.createElement("div");
        priceRow.className = "service__catalog-prices";
        if (prices.shop.length) {
            const shop = document.createElement("span");
            shop.textContent = `Shop from ${formatPrice(Math.min(...prices.shop))}`;
            priceRow.append(shop);
        }
        if (prices.home.length) {
            const home = document.createElement("span");
            home.textContent = `Home from ${formatPrice(Math.min(...prices.home))}`;
            priceRow.append(home);
        }
        if (!priceRow.childElementCount) {
            const unavailable = document.createElement("span");
            unavailable.textContent = "View profile for pricing";
            priceRow.append(unavailable);
        }

        const link = document.createElement("a");
        link.className = "service__catalog-link";
        link.href = "#booking";
        link.textContent = "Find a professional";
        link.setAttribute("aria-label", `Find a professional for ${item.name}`);

        card.append(top, title, providerLabel, priceRow, link);
        catalog.append(card);
    });
}

getPublicProviders()
    .then(renderPublicServiceCatalog)
    .catch(error => {
        console.warn("Could not load the public service menu:", error);
        const catalog = document.getElementById("serviceCatalog");
        if (!catalog) return;
        catalog.setAttribute("aria-busy", "false");
        const state = document.createElement("article");
        state.className = "service__catalog-state";
        const message = document.createElement("p");
        message.textContent = "Services are temporarily unavailable. Please try again shortly.";
        state.append(message);
        catalog.replaceChildren(state);
    });

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

    providerList.setAttribute("aria-busy", "true");
    providerList.innerHTML = `
        <div class="provider-loading" role="status">
            <span class="provider-loading__spinner" aria-hidden="true"></span>
            <span>Finding available professionals…</span>
        </div>
        <div class="provider-skeletons" aria-hidden="true">
            <div class="provider-skeleton"></div>
            <div class="provider-skeleton"></div>
            <div class="provider-skeleton"></div>
        </div>`;

    try {

        const allProviders = await getPublicProviders();

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
            allProviders.filter(function(provider) {

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
            providerList.setAttribute("aria-busy", "false");
            providerList.innerHTML = `
                <div class="provider-empty-state">
                    <i class="ri-user-search-line" aria-hidden="true"></i>
                    <p>No ${category === "barber" ? "barbers" : "beauty professionals"} are listed${selectedArea && userArea ? ` in ${userArea.value.trim()}` : ""} yet. Try another area or check back soon.</p>
                </div>`;

            return;
        }


        // ===============================
        // DISPLAY PROVIDERS
        // ===============================

        providerList.innerHTML = "";
        providerList.setAttribute("aria-busy", "false");

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

        providerList.setAttribute("aria-busy", "false");
        providerList.innerHTML = `
            <div class="provider-empty-state provider-empty-state--error" role="alert">
                <i class="ri-wifi-off-line" aria-hidden="true"></i>
                <p>We could not load professionals right now. Please check your connection and try again.</p>
                <button class="button provider-retry" type="button">Try again</button>
            </div>`;
        providerList.querySelector(".provider-retry")?.addEventListener("click", () => loadYEWLProviders(category));
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

// Keep every Professionals card available while making its browse action useful.
document.querySelectorAll(".expert__link").forEach(link => {
    link.setAttribute("href", "#category");
    link.addEventListener("click", () => {
        const label = link.closest(".expert__card")
            ?.querySelector(".expert__category")?.textContent?.trim().toLowerCase() || "";
        const categoryButton = /hair|men|barber|groom/.test(label)
            ? barberCategoryBtn
            : beautyCategoryBtn;
        categoryButton?.click();
    });
});


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

/*=============== NOORSLOT SUPPORT SUBMISSIONS + HIGHLIGHTS ===============*/
const supportSubmissionForm = document.getElementById("support-submission-form");
const supportMoneyFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

async function loadSupportHighlights() {
    const monthlyName = document.getElementById("support-monthly-name");
    const monthlyAmount = document.getElementById("support-monthly-amount");
    const lifetimeName = document.getElementById("support-lifetime-name");
    const lifetimeAmount = document.getElementById("support-lifetime-amount");
    if (!monthlyName || !monthlyAmount || !lifetimeName || !lifetimeAmount) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/support/leaderboard`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Could not load highlights.");
        const setHighlight = (nameElement, amountElement, record) => {
            nameElement.textContent = record?.name || "Be the first supporter";
            amountElement.textContent = record ? supportMoneyFormatter.format(Number(record.amount)) : "";
        };
        setHighlight(monthlyName, monthlyAmount, data.monthlyTop);
        setHighlight(lifetimeName, lifetimeAmount, data.lifetimeTop);
    } catch (error) {
        console.error("Load support highlights error:", error);
        monthlyName.textContent = lifetimeName.textContent = "Highlights are temporarily unavailable";
        monthlyAmount.textContent = lifetimeAmount.textContent = "";
    }
}

if (supportSubmissionForm) {
    supportSubmissionForm.addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const status = document.getElementById("support-form-status");
        const button = form.querySelector("button[type=submit]");
        const formData = new FormData(form);
        const payload = {
            name: String(formData.get("name") || "").trim(),
            amount: Number(formData.get("amount")),
            transactionRef: String(formData.get("transactionRef") || "").trim(),
            confirmedPayment: formData.get("confirmedPayment") === "on"
        };
        status.textContent = "Submitting for payment verification…";
        status.classList.remove("is-error");
        button.disabled = true;
        try {
            const response = await fetch(`${API_BASE_URL}/api/support/submissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Could not submit support details.");
            status.textContent = data.message;
            form.reset();
        } catch (error) {
            status.textContent = error.message || "Could not submit support details. Please try again.";
            status.classList.add("is-error");
        } finally {
            button.disabled = false;
        }
    });
}

const supportDetails = document.querySelector(".support__details");
if (supportDetails?.open) {
    loadSupportHighlights();
} else if (supportDetails) {
    supportDetails.addEventListener("toggle", () => {
        if (supportDetails.open) loadSupportHighlights();
    }, { once: true });
}

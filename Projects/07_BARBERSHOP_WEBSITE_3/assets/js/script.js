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
      const displayName = item.shopName || item.providerName || "NOORSLOT Professional";
      professional.textContent = item.providerAccountType === "shop" || item.shopName
        ? `${displayName} · Shop`
        : displayName;
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
        const params = new URLSearchParams({ providerId: String(item.providerId), service: item.serviceName || "", lookRef: item.afterImage || "" });
        link.href = `index.html?${params.toString()}#booking`;
        link.textContent = "Book This Look";
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
const datePickerButton = document.getElementById("datePickerButton");
const barberInput = document.getElementById("barber");
const timeInput = document.getElementById("time");
const serviceInput = document.getElementById("service");
const serviceLocationInput = document.getElementById("serviceLocation");
const servicePriceHint = document.getElementById("servicePriceHint");
const customerEmailInput = document.getElementById("customerEmail");

const API_BASE_URL = "https://yewl.onrender.com";
let publicProvidersPromise = null;

const bookingParams = new URLSearchParams(window.location.search);
const initialProviderId = bookingParams.get("providerId");
const selectedServiceFromUrl = bookingParams.get("service");
const selectedServiceIdFromUrl = bookingParams.get("serviceId");
const selectedServiceModeFromUrl = bookingParams.get("serviceMode");
const selectedLookReference = bookingParams.get("lookRef");

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
            (selectedServiceFromUrl || selectedServiceIdFromUrl)
        ) {
            const matchingOption = [...serviceInput.options].find(option =>
                (selectedServiceIdFromUrl && option.value === selectedServiceIdFromUrl) ||
                (selectedServiceFromUrl && option.dataset.serviceName &&
                    option.dataset.serviceName.trim().toLowerCase() === selectedServiceFromUrl.trim().toLowerCase())
            );

            if (matchingOption) {
                serviceInput.value = matchingOption.value;
            }
        }

        updateSelectedServicePrice();
        if (serviceLocationInput && ["shop", "home"].includes(selectedServiceModeFromUrl) &&
            [...serviceLocationInput.options].some(option => option.value === selectedServiceModeFromUrl)) {
            serviceLocationInput.value = selectedServiceModeFromUrl;
            updateSelectedServicePrice();
        }
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

if (datePickerButton && dateInput) {
    datePickerButton.addEventListener("click", () => {
        if (typeof dateInput.showPicker === "function") {
            try { dateInput.showPicker(); return; } catch (error) { /* Fall back to the native input. */ }
        }
        dateInput.focus();
        dateInput.click();
    });
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
                        email,
                        lookReference: selectedLookReference || ""
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

/* Original subtle zoom animation. */
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

const PROVIDER_CATEGORY_LABELS = Object.freeze({
    barber: "Barber & grooming",
    beauty: "Beauty, makeup & skin care",
    bridal: "Bridal & occasion styling",
    mehendi: "Mehendi & henna",
    massage: "Massage & wellness",
    nails: "Nail art & care",
    haircare: "Hair care & styling",
    wellness: "Spa & wellness",
    other: "Other personal care",
    makeup: "Beauty & makeup"
});
function formatProviderCategory(category) {
    return PROVIDER_CATEGORY_LABELS[String(category || "").toLowerCase()] || "Professional";
}
const SERVICE_SEARCH_ALIASES = Object.freeze({
    haircut: ["haircut", "hair cut", "haircutting", "hair styling", "hair style", "hair and beard"],
    beard: ["beard", "shaving", "shave", "moustache", "mustache"],
    haircare: ["hair colour", "hair color", "hair colouring", "hair coloring", "hair care", "hair treatment", "hair spa", "keratin", "smoothening", "rebonding", "highlight"],
    bridal: ["bridal", "bride", "wedding", "groom", "engagement", "occasion styling"],
    makeup: ["makeup", "make up", "beauty", "cosmetic", "party makeup", "occasion makeup"],
    meh: ["mehendi", "mehndi", "henna"],
    facial: ["facial", "skin care", "skincare", "cleanup", "clean up", "bleach", "detan", "de-tan"],
    hairremoval: ["wax", "waxing", "threading", "eyebrow", "upper lip", "hair removal"],
    massage: ["massage", "therapy", "wellness", "deep tissue", "head massage"],
    spa: ["spa", "body care", "body polish", "body scrub", "scrub", "wellness"],
    nail: ["nail", "manicure", "pedicure"]
});
const CITY_SEARCH_ALIASES = Object.freeze({
    patna: ["patna", "khagaul"]
});
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

function initializePublicServiceSearch() {
    const form = document.getElementById("serviceSearchForm");
    const serviceInput = document.getElementById("serviceSearchInput");
    const cityInput = document.getElementById("serviceCityInput");
    const catalog = document.getElementById("serviceCatalog");
    const resultCount = document.getElementById("serviceResultsCount");
    const budgetInput = document.getElementById("serviceBudgetInput");
    const modeFilter = document.getElementById("serviceModeFilter");
    const radiusInput = document.getElementById("serviceRadiusInput");
    const radiusUnit = document.getElementById("serviceRadiusUnit");
    const locationButton = document.getElementById("serviceUseLocation");
    const locationStatus = document.getElementById("serviceLocationStatus");
    const styleGoal = document.getElementById("styleGoal");
    let customerCoords = null;
    if (!form || !serviceInput || !cityInput || !catalog) return;

    let providersPromise;
    let lastQuery = "";
    let selectedLook = null;

    // The homepage service chooser feeds into this same catalog so customers
    // see real provider-submitted services, locations, and prices.
    const categoryChooser = document.querySelector(".professional-finder");
    const categoryOptions = [...(categoryChooser?.querySelectorAll("[data-service-query]") || [])];
    const categorySubmit = document.getElementById("findSelectedProfessionals");
    const categoryHint = document.getElementById("professionalFinderHint");
    let selectedCategoryQuery = "";
    const cityMatchesProvider = (providerArea, city) => {
        const terms = CITY_SEARCH_ALIASES[city] || [city];
        return terms.some(term => providerArea.includes(normalize(term)));
    };
    categoryOptions.forEach(option => option.addEventListener("click", () => {
        selectedCategoryQuery = option.dataset.serviceQuery || "";
        categoryOptions.forEach(item => {
            const selected = item === option;
            item.setAttribute("aria-pressed", String(selected));
            item.classList.toggle("is-selected", selected);
        });
        if (categorySubmit) categorySubmit.disabled = !selectedCategoryQuery;
        const label = option.querySelector("span")?.textContent?.trim() || "this service";
        if (categoryHint) categoryHint.textContent = `${label} selected. We’ll show matching services and their shop or area.`;
    }));
    categorySubmit?.addEventListener("click", () => {
        if (!selectedCategoryQuery) return;
        const area = document.getElementById("userArea")?.value || "";
        serviceInput.value = selectedCategoryQuery;
        cityInput.value = area && area !== "Other" ? area : "";
        customerCoords = null;
        document.querySelector(".service__finder")?.setAttribute("open", "");
        const areaLabel = cityInput.value.trim();
        if (locationStatus) locationStatus.textContent = areaLabel
            ? `Searching all matching providers in ${areaLabel}; GPS radius and budget filters are not applied.`
            : "Searching all matching providers; choose a city to narrow the list by location.";
        if (categoryHint) categoryHint.textContent = `Searching all providers offering this service${areaLabel ? ` in ${areaLabel}` : ""}…`;
        renderMatches({ source: "local-finder" });
        window.setTimeout(() => document.getElementById("serviceCatalog")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    });

    const normalize = value => String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLocaleLowerCase();
    const serviceMatchesQuery = (serviceName, query) => {
        if (query === "all") return true;
        const normalizedName = normalize(serviceName);
        const terms = SERVICE_SEARCH_ALIASES[query] || [query];
        return terms.some(term => normalizedName.includes(normalize(term)));
    };

    const distanceKm = (a, b) => {
        const radians = value => value * Math.PI / 180;
        const dLat = radians(b.latitude - a.latitude);
        const dLng = radians(b.longitude - a.longitude);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.latitude)) * Math.cos(radians(b.latitude)) * Math.sin(dLng / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    };

    const showMessage = (message, icon = "ri-search-line") => {
        const state = document.createElement("article");
        state.className = "service__catalog-state";
        const symbol = document.createElement("i");
        symbol.className = icon;
        symbol.setAttribute("aria-hidden", "true");
        const text = document.createElement("p");
        text.textContent = message;
        state.append(symbol, text);
        catalog.replaceChildren(state);
        catalog.setAttribute("aria-busy", "false");
    };

    const formatPrice = price => price !== null && Number.isFinite(Number(price))
        ? `₹${Number(price).toLocaleString("en-IN")}`
        : "Not listed";

    const renderMatches = async ({ source = "detailed" } = {}) => {
        const isLocalFinder = source === "local-finder";
        const query = normalize(serviceInput.value);
        const cityQuery = normalize(cityInput.value);
        const budget = isLocalFinder ? 0 : Number(budgetInput?.value || 0);
        const serviceMode = isLocalFinder ? "any" : modeFilter?.value || "any";
        const searchCoords = isLocalFinder ? null : customerCoords;
        const radiusKm = Math.min(100, Math.max(0.1, Number(radiusInput?.value || 25)));
        if (query.length < 2) {
            lastQuery = "";
            if (resultCount) resultCount.textContent = "";
            showMessage("Type at least 2 letters of a service name to see matching professionals and prices.");
            return;
        }

        const lookPreference = isLocalFinder ? null : selectedLook;
        lastQuery = JSON.stringify([source, query, cityQuery, budget, serviceMode, radiusKm, searchCoords, lookPreference]);
        const querySnapshot = lastQuery;
        if (resultCount) resultCount.textContent = "";
        catalog.setAttribute("aria-busy", "true");
        showMessage("Searching services…", "ri-loader-4-line");
        catalog.setAttribute("aria-busy", "true");

        try {
            providersPromise ||= getPublicProviders();
            const providers = await providersPromise;
            if (querySnapshot !== lastQuery) return;

            const matches = [];
            providers.forEach(provider => {
                const providerArea = normalize(provider.area);
                if (cityQuery && !cityMatchesProvider(providerArea, cityQuery)) return;
                let distance = null;
                if (searchCoords) {
                    const latitude = Number(provider.latitude), longitude = Number(provider.longitude);
                    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                        distance = distanceKm(searchCoords, { latitude, longitude });
                    }
                }
                (Array.isArray(provider.services) ? provider.services : []).forEach(service => {
                    if (!serviceMatchesQuery(service.name, query)) return;
                    const availableMode = service.serviceMode || "shop";
                    const offers = [];
                    if ((serviceMode === "any" || serviceMode === "shop") && (availableMode === "shop" || availableMode === "both") && service.price != null) offers.push(Number(service.price));
                    if ((serviceMode === "any" || serviceMode === "home") && (availableMode === "home" || availableMode === "both") && service.homePrice != null) offers.push(Number(service.homePrice));
                    const matchPrice = offers.filter(Number.isFinite).reduce((low, price) => Math.min(low, price), Number.POSITIVE_INFINITY);
                    if (budget > 0 && (!Number.isFinite(matchPrice) || matchPrice > budget)) return;
                    matches.push({ provider, service, distance, matchPrice });
                });
            });

            let sourceMatches = matches;
            if (isLocalFinder) {
                const oneMatchPerProvider = new Map();
                matches.forEach(match => {
                    const providerId = String(match.provider._id || match.provider.name || "");
                    const existing = oneMatchPerProvider.get(providerId);
                    if (!existing || match.matchPrice < existing.matchPrice) oneMatchPerProvider.set(providerId, match);
                });
                sourceMatches = [...oneMatchPerProvider.values()];
            }

            const nearbyMatches = searchCoords
                ? sourceMatches.filter(match => Number.isFinite(match.distance) && match.distance <= radiusKm)
                : sourceMatches;
            const usedLocationFallback = Boolean(searchCoords && nearbyMatches.length === 0 && sourceMatches.length > 0);
            const displayedMatches = searchCoords && nearbyMatches.length ? nearbyMatches : sourceMatches;
            displayedMatches.sort((a, b) => searchCoords
                ? (a.distance ?? Infinity) - (b.distance ?? Infinity) || a.matchPrice - b.matchPrice
                : a.matchPrice - b.matchPrice || String(a.service.name).localeCompare(String(b.service.name)));

            catalog.replaceChildren();
            catalog.setAttribute("aria-busy", "false");
            if (resultCount) {
                resultCount.textContent = displayedMatches.length
                    ? `${isLocalFinder ? `${displayedMatches.length} matching ${displayedMatches.length === 1 ? "provider" : "providers"}` : `${usedLocationFallback ? `No matches within ${radiusKmLabel()}; showing ` : ""}${displayedMatches.length} matching ${displayedMatches.length === 1 ? "service" : "services"}`}${cityQuery ? ` in ${cityInput.value.trim()}` : ""}${!isLocalFinder && lookPreference ? ` · preference: ${lookPreference.style}${lookPreference.score ? ` · rough match ${lookPreference.score}%` : ""}${lookPreference.hairShade ? ` · ${lookPreference.hairShade} hair preview` : ""}` : ""}`
                    : "No matching services found";
            }
            if (!displayedMatches.length) {
                showMessage(`No active services matched “${serviceInput.value.trim()}”${cityQuery ? ` in ${cityInput.value.trim()}` : searchCoords ? ` within ${radiusKmLabel()} of your location` : ""}. Try another service name or city.`, "ri-map-pin-line");
                if (isLocalFinder && categoryHint) categoryHint.textContent = `No providers offering this service${cityQuery ? ` were found in ${cityInput.value.trim()}` : " were found"}. Try another service or city.`;
                return;
            }

            if (isLocalFinder && categoryHint) {
                categoryHint.textContent = `${displayedMatches.length} matching ${displayedMatches.length === 1 ? "provider" : "providers"}${cityQuery ? ` found in ${cityInput.value.trim()}` : " found"}.`;
            }

            if (usedLocationFallback && locationStatus) {
                locationStatus.textContent = `No matching providers within ${radiusKmLabel()}; showing other matching areas. Check distance on each listing.`;
            }

            displayedMatches.forEach(({ provider, service, distance, matchPrice }) => {
                const card = document.createElement("article");
                card.className = "service__catalog-card";

                const top = document.createElement("div");
                top.className = "service__catalog-top";
                const icon = document.createElement("span");
                icon.className = "service__catalog-icon";
                icon.setAttribute("aria-hidden", "true");
                icon.innerHTML = provider.category === "barber"
                    ? '<i class="ri-sparkling-2-line"></i>'
                    : '<i class="ri-scissors-cut-line"></i>';
                const category = document.createElement("span");
                category.className = "service__catalog-category";
                category.textContent = formatProviderCategory(provider.category);
                top.append(icon, category);

                const title = document.createElement("h4");
                title.className = "service__catalog-name";
                title.textContent = service.name || "Service";

                const business = document.createElement("p");
                business.className = "service__catalog-business";
                business.textContent = provider.name || "Local professional";
                if (provider.isVerified === true) {
                    const verified = document.createElement("span");
                    verified.className = "provider-verified-badge";
                    verified.innerHTML = '<i class="ri-checkbox-circle-fill" aria-hidden="true"></i> Verified';
                    business.append(" ", verified);
                }

                const location = document.createElement("p");
                location.className = "service__catalog-location";
                const locationIcon = document.createElement("i");
                locationIcon.className = "ri-map-pin-line";
                locationIcon.setAttribute("aria-hidden", "true");
                const locationText = document.createElement("span");
                const distanceLabel = Number.isFinite(distance) ? " · " + (distance < 1 ? Math.round(distance * 1000) + " m" : distance.toFixed(1) + " km") + " away" : "";
                locationText.textContent = (provider.area || "City / area not listed") + distanceLabel;
                location.append(locationIcon, locationText);

                const priceRow = document.createElement("div");
                priceRow.className = "service__catalog-prices";
                const mode = service.serviceMode || "shop";
                const selectedMode = modeFilter?.value || "any";
                if ((selectedMode === "any" || selectedMode === "shop") && (mode === "shop" || mode === "both") && service.price !== null && service.price !== undefined) {
                    const shopPrice = document.createElement("span");
                    shopPrice.textContent = `Shop / parlour ${formatPrice(service.price)}`;
                    priceRow.append(shopPrice);
                }
                if ((selectedMode === "any" || selectedMode === "home") && (mode === "home" || mode === "both") && service.homePrice !== null && service.homePrice !== undefined) {
                    const homePrice = document.createElement("span");
                    homePrice.textContent = `Home visit ${formatPrice(service.homePrice)}`;
                    priceRow.append(homePrice);
                }
                if (Number.isFinite(matchPrice)) {
                    const matchBadge = document.createElement("span");
                    matchBadge.className = "service__catalog-match-price";
                    matchBadge.textContent = "Matches budget · " + formatPrice(matchPrice);
                    priceRow.prepend(matchBadge);
                }
                if (!priceRow.childElementCount) {
                    const unavailable = document.createElement("span");
                    unavailable.textContent = "Price not listed";
                    priceRow.append(unavailable);
                }
                if (service.duration) {
                    const duration = document.createElement("span");
                    duration.className = "service__catalog-duration";
                    duration.textContent = `${service.duration} min`;
                    priceRow.append(duration);
                }

                const link = document.createElement("a");
                link.className = "service__catalog-link";
                link.href = `provider-profile.html?id=${encodeURIComponent(provider._id || "")}`;
                link.textContent = "View profile";
                link.setAttribute("aria-label", `View ${provider.name || "professional"} profile for ${service.name || "this service"}`);

                card.append(top, title, business, location, priceRow, link);
                catalog.append(card);
            });
        } catch (error) {
            console.warn("Could not search public services:", error);
            if (querySnapshot !== lastQuery) return;
            providersPromise = null;
            showMessage("Services could not be loaded right now. Please try again shortly.", "ri-error-warning-line");
        }
    };

    form.addEventListener("submit", event => {
        event.preventDefault();
        renderMatches();
    });
    serviceInput.addEventListener("input", () => {
        if (normalize(serviceInput.value).length >= 2) renderMatches();
        else showMessage("Type at least 2 letters of a service name to see matching professionals and prices.");
    });
    cityInput.addEventListener("input", () => {
        if (normalize(serviceInput.value).length >= 2) renderMatches();
    });
    budgetInput?.addEventListener("input", () => { if (normalize(serviceInput.value).length >= 2) renderMatches(); });
    modeFilter?.addEventListener("change", () => { if (normalize(serviceInput.value).length >= 2) renderMatches(); });
    const formatRadiusDistance = valueKm => {
        const safeKm = Math.min(100, Math.max(0.1, Number(valueKm) || 25));
        if (safeKm < 1) return `${Math.round(safeKm * 1000)} m`;
        return `${Number.isInteger(safeKm) ? safeKm : Number(safeKm.toFixed(1))} km`;
    };
    const updateRadiusUnit = () => {
        if (radiusUnit) radiusUnit.textContent = formatRadiusDistance(radiusInput?.value);
    };
    updateRadiusUnit();
    radiusInput?.addEventListener("input", updateRadiusUnit);
    radiusInput?.addEventListener("change", () => { if (normalize(serviceInput.value).length >= 2) renderMatches(); });
    const radiusKmLabel = () => formatRadiusDistance(radiusInput?.value);
    locationButton?.addEventListener("click", () => {
        if (!navigator.geolocation) { if (locationStatus) locationStatus.textContent = "This browser does not support location."; return; }
        if (locationStatus) locationStatus.textContent = "Finding nearby providers…";
        navigator.geolocation.getCurrentPosition(position => {
            customerCoords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            if (locationStatus) locationStatus.textContent = "Nearby search is on (" + radiusKmLabel() + " radius).";
            if (normalize(serviceInput.value).length >= 2) renderMatches();
        }, error => {
            if (locationStatus) locationStatus.textContent = error.code === 1 ? "Location permission was denied. Enter a city or area instead." : "Could not get your location. Enter a city or area instead.";
        }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
    });
    window.addEventListener("noorslot-look-confirmed", event => {
        selectedLook = event.detail || null;
        if (normalize(serviceInput.value).length >= 2) renderMatches();
    });
    styleGoal?.addEventListener("change", () => {
        if (!styleGoal.value) return;
        const keywords = { haircut: "haircut", beard: "beard", bridal: "bridal", mehendi: "mehendi", massage: "massage", facial: "facial", makeup: "makeup" };
        serviceInput.value = keywords[styleGoal.value] || styleGoal.value;
        renderMatches();
    });
}



function initializeFaceStyleFinder() {
    const startButton = document.getElementById("startFaceCamera");
    const confirmButton = document.getElementById("confirmLookButton");
    const stopButton = document.getElementById("stopFaceCamera");
    const panel = document.getElementById("faceCameraPanel");
    const video = document.getElementById("faceCameraVideo");
    const canvas = document.getElementById("faceTryOnCanvas");
    const options = document.getElementById("lookStyleOptions");
    const status = document.getElementById("faceAnalysisStatus");
    const suggestions = document.getElementById("faceStyleSuggestions");
    const goal = document.getElementById("styleGoal");
    const serviceSearch = document.getElementById("serviceSearchInput");
    const colourPicker = document.getElementById("hairColourPicker");
    const colourOptions = document.getElementById("hairColourOptions");
    if (!startButton || !confirmButton || !stopButton || !panel || !video || !canvas || !options || !status || !goal) return;
    const ctx = canvas.getContext("2d");
    const stylesByGoal = {
        haircut: ["Textured crop", "Classic side part", "Soft quiff", "Forward fringe"],
        beard: ["Light stubble", "Short boxed beard", "Goatee style"],
        bridal: ["Classic red lip", "Rose lip", "Soft nude lip"],
        makeup: ["Classic red lip", "Rose lip", "Soft nude lip"]
    };
    const serviceTerms = { haircut: "haircut", beard: "beard", bridal: "bridal", makeup: "makeup", mehendi: "mehendi", massage: "massage", facial: "facial" };
    const shades = [
        { name: "Natural black", color: "#211915" }, { name: "Chestnut brown", color: "#64402d" },
        { name: "Warm brown", color: "#855238" }, { name: "Soft auburn", color: "#985541" }
    ];
    const fitScores = {
        haircut: { round: [78, 91, 90, 72], square: [92, 86, 82, 75], heart: [80, 84, 77, 91], long: [83, 76, 68, 92], oval: [88, 90, 87, 84] },
        beard: { round: [78, 91, 87], square: [93, 86, 77], heart: [78, 88, 74], long: [82, 85, 72], oval: [87, 90, 82] }
    };
    let stream = null, landmarkerPromise = null, segmenterPromise = null, selectedStyle = "", selectedScore = null;
    let selectedHairShade = shades[0], shadeMaskCanvas = document.createElement("canvas"), shadeMaskCtx = shadeMaskCanvas.getContext("2d");
    let rafId = 0, lastDetectionAt = 0, lastVideoTime = -1, faceShape = "", lastShownShape = "", landmarker = null, segmenter = null;
    const point = (points, i) => ({ x: points[i].x * canvas.width, y: points[i].y * canvas.height });
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const scoreFor = (shape, style) => {
        const list = stylesByGoal[goal.value] || [];
        const index = list.indexOf(style);
        return (fitScores[goal.value]?.[shape] || [])[index] || null;
    };
    const closeTasks = () => {
        landmarker?.close?.(); segmenter?.close?.(); landmarker = null; segmenter = null;
        landmarkerPromise = null; segmenterPromise = null;
    };
    const stopCamera = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null; video.srcObject = null; panel.hidden = true; confirmButton.disabled = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        closeTasks();
    };
    const buildStyleChoices = () => {
        selectedStyle = ""; selectedScore = null; confirmButton.disabled = true; options.replaceChildren();
        if (colourPicker) colourPicker.hidden = goal.value !== "haircut";
        (stylesByGoal[goal.value] || []).forEach(name => {
            const button = document.createElement("button");
            button.type = "button"; button.className = "look-finder__style-chip"; button.textContent = name; button.setAttribute("aria-pressed", "false");
            button.addEventListener("click", () => {
                selectedStyle = name; selectedScore = faceShape ? scoreFor(faceShape, name) : null;
                options.querySelectorAll(".look-finder__style-chip").forEach(chip => {
                    const active = chip === button; chip.classList.toggle("is-selected", active); chip.setAttribute("aria-pressed", String(active));
                });
                confirmButton.disabled = false;
                status.textContent = name + (selectedScore ? " · approximate face-shape match " + selectedScore + "%" : " selected") + ". The live preview shows your natural hair colour mask, not a generated haircut.";
            });
            options.append(button);
        });
    };
    shades.forEach(shade => {
        const button = document.createElement("button"); button.type = "button"; button.className = "look-finder__shade-chip";
        button.style.setProperty("--shade", shade.color); button.setAttribute("aria-label", shade.name); button.title = shade.name; button.setAttribute("aria-pressed", String(shade === selectedHairShade));
        button.addEventListener("click", () => {
            selectedHairShade = shade;
            colourOptions.querySelectorAll(".look-finder__shade-chip").forEach(chip => chip.setAttribute("aria-pressed", String(chip === button)));
            status.textContent = shade.name + " hair-colour preview selected. It follows the hair mask on your camera.";
        });
        colourOptions?.append(button);
    });
    const renderShapeAdvice = () => {
        if (!faceShape || !["haircut", "beard"].includes(goal.value)) return;
        const recommendations = goal.value === "beard"
            ? { round: ["Short boxed beard", 91], square: ["Light stubble", 93], heart: ["Short boxed beard", 88], long: ["Short boxed beard", 85], oval: ["Short boxed beard", 90] }
            : { round: ["Classic side part", 91], square: ["Textured crop", 92], heart: ["Forward fringe", 91], long: ["Forward fringe", 92], oval: ["Classic side part", 90] };
        const [best, score] = recommendations[faceShape];
        const label = document.createElement("strong"); label.textContent = "Approximate face shape: " + faceShape[0].toUpperCase() + faceShape.slice(1);
        const note = document.createElement("p"); note.textContent = "Style idea: " + best + " · rough match estimate " + score + "%. This is a simple face-shape heuristic, not a beauty rating; hair texture and personal preference are not measured.";
        suggestions?.replaceChildren(label, note);
    };
    const drawHairTint = mask => {
        if (!mask || goal.value !== "haircut") return;
        const width = mask.width, height = mask.height;
        if (shadeMaskCanvas.width !== width || shadeMaskCanvas.height !== height) { shadeMaskCanvas.width = width; shadeMaskCanvas.height = height; }
        const image = shadeMaskCtx.createImageData(width, height);
        const confidence = mask.getAsFloat32Array();
        const hex = selectedHairShade.color.slice(1);
        const red = parseInt(hex.slice(0, 2), 16), green = parseInt(hex.slice(2, 4), 16), blue = parseInt(hex.slice(4, 6), 16);
        for (let i = 0; i < confidence.length; i++) {
            const alpha = Math.max(0, Math.min(0.58, (confidence[i] - .12) * .72));
            const j = i * 4; image.data[j] = red; image.data[j + 1] = green; image.data[j + 2] = blue; image.data[j + 3] = Math.round(alpha * 255);
        }
        shadeMaskCtx.putImageData(image, 0, 0);
        ctx.drawImage(shadeMaskCanvas, 0, 0, canvas.width, canvas.height);
    };
    const drawLipColor = points => {
        const l = point(points, 61), r = point(points, 291), upper = point(points, 13), lower = point(points, 14);
        const color = selectedStyle === "Classic red lip" ? "rgba(177,25,54,.62)" : selectedStyle === "Soft nude lip" ? "rgba(174,105,91,.48)" : "rgba(203,61,102,.52)";
        ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.quadraticCurveTo(upper.x, upper.y - 1, r.x, r.y); ctx.quadraticCurveTo(lower.x, lower.y + 1, l.x, l.y); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    };
    const render = () => {
        if (!stream || panel.hidden) return;
        if (video.readyState >= 2) {
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const now = performance.now();
            if (video.currentTime !== lastVideoTime && now - lastDetectionAt > 120) {
                lastVideoTime = video.currentTime; lastDetectionAt = now;
                try {
                    const faceResult = landmarker?.detectForVideo(video, now);
                    const points = faceResult?.faceLandmarks?.[0];
                    if (points?.length > 454) {
                        const width = distance(point(points, 234), point(points, 454)), height = distance(point(points, 10), point(points, 152));
                        const jaw = distance(point(points, 172), point(points, 397)) / width, ratio = width / height;
                        faceShape = ratio < .68 ? "long" : jaw < .72 ? "heart" : ratio > .79 ? "round" : jaw > .88 ? "square" : "oval";
                        if (faceShape !== lastShownShape) { lastShownShape = faceShape; renderShapeAdvice(); selectedScore = selectedStyle ? scoreFor(faceShape, selectedStyle) : null; }
                        if (selectedStyle && ["bridal", "makeup"].includes(goal.value)) drawLipColor(points);
                    }
                    const segmentation = segmenter?.segmentForVideo(video, now);
                    const hairIndex = Math.max(1, segmenter?.getLabels?.().findIndex(label => label.toLowerCase().includes("hair")) ?? 1);
                    drawHairTint(segmentation?.confidenceMasks?.[hairIndex]);
                } catch (error) { console.debug("Skipped one local style frame", error); }
            }
        }
        rafId = requestAnimationFrame(render);
    };
    goal.addEventListener("change", () => {
        buildStyleChoices(); lastShownShape = ""; suggestions?.replaceChildren();
        if (!stylesByGoal[goal.value]) status.textContent = "Camera previews do not fit this service. Search it below by budget, location and provider.";
        else if (goal.value === "haircut") status.textContent = "Choose a haircut idea and hair colour. The face-shape score is approximate; the live mask previews colour on your existing hair.";
        else if (goal.value === "beard") status.textContent = "Choose a beard idea. Face shape gives a rough suggestion; the camera does not paint a fake beard over your face.";
        else status.textContent = "Choose a lipstick colour. The camera preview only changes the lip area; it does not generate a full makeup look.";
    });
    stopButton.addEventListener("click", stopCamera); buildStyleChoices();
    startButton.addEventListener("click", async () => {
        if (!stylesByGoal[goal.value]) { status.textContent = "Choose haircut, beard, bridal or makeup for face preview. Mehendi/massage and other services use the provider filters."; goal.focus(); return; }
        if (!navigator.mediaDevices?.getUserMedia) { status.textContent = "Camera needs HTTPS or localhost and browser permission."; return; }
        try {
            status.textContent = "Opening camera and loading free on-device models…";
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            video.srcObject = stream; panel.hidden = false; await video.play();
            const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs");
            const files = await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
            landmarkerPromise ||= vision.FaceLandmarker.createFromOptions(files, {
                baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task", delegate: "CPU" }, runningMode: "VIDEO", numFaces: 1
            });
            landmarker = await landmarkerPromise;
            if (goal.value === "haircut") {
                segmenterPromise ||= vision.ImageSegmenter.createFromOptions(files, {
                    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/1/hair_segmenter.tflite", delegate: "CPU" },
                    runningMode: "VIDEO", outputConfidenceMasks: true, outputCategoryMask: false
                });
                segmenter = await segmenterPromise;
            }
            render();
            status.textContent = goal.value === "haircut" ? "Hair is being detected locally; select a shade and haircut idea. Your camera feed is not sent to NOORSLOT." : "Face tracking is on-device. Choose a style idea; the camera feed is not sent to NOORSLOT.";
        } catch (error) {
            console.warn("Could not start local try-on:", error); stopCamera();
            status.textContent = error.name === "NotAllowedError" ? "Camera permission was blocked. Allow camera access in browser settings and try again." : "Camera or model could not load. Check internet and permission, then try again.";
        }
    });
    confirmButton.addEventListener("click", () => {
        if (!selectedStyle) return;
        const service = serviceTerms[goal.value] || goal.value;
        if (serviceSearch) serviceSearch.value = service;
        const chosen = { goal: goal.value, style: selectedStyle, faceShape, score: selectedScore, hairShade: goal.value === "haircut" ? selectedHairShade.name : null };
        window.dispatchEvent(new CustomEvent("noorslot-look-confirmed", { detail: chosen }));
        status.textContent = selectedStyle + (selectedScore ? " selected · approximate match " + selectedScore + "%" : " selected") + ". Searching providers for this service.";
        stopCamera(); serviceSearch?.dispatchEvent(new Event("input", { bubbles: true }));
        document.getElementById("serviceSearchForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.addEventListener("pagehide", stopCamera, { once: true });
}
window.addEventListener("DOMContentLoaded", initializeFaceStyleFinder, { once: true });

window.addEventListener("DOMContentLoaded", initializePublicServiceSearch, { once: true });

const barberCategoryBtn =
    document.getElementById("barberCategoryBtn");

const beautyCategoryBtn =
    document.getElementById("beautyCategoryBtn");

const providerList =
    document.getElementById("providerList");

const savedProvidersToggle = document.getElementById("toggleSavedProviders");
const SAVED_PROVIDER_IDS_KEY = "noorslotSavedProviderIds";
let showSavedProvidersOnly = false;
let activeProviderCategory = "barber";

function getSavedProviderIds() {
    try {
        const saved = JSON.parse(localStorage.getItem(SAVED_PROVIDER_IDS_KEY) || "[]");
        return Array.isArray(saved) ? saved.map(String) : [];
    } catch (error) {
        return [];
    }
}

function refreshSavedProvidersToggle() {
    if (!savedProvidersToggle) return;
    const count = getSavedProviderIds().length;
    const active = showSavedProvidersOnly;
    savedProvidersToggle.setAttribute("aria-pressed", String(active));
    savedProvidersToggle.classList.toggle("is-active", active);
    savedProvidersToggle.querySelector("span").textContent = active
        ? `Showing saved (${count}) · Show all`
        : `Saved professionals (${count})`;
}

function toggleSavedProvider(providerId) {
    const id = String(providerId || "");
    if (!id) return;
    const saved = getSavedProviderIds();
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    try {
        localStorage.setItem(SAVED_PROVIDER_IDS_KEY, JSON.stringify(next));
    } catch (error) {
        alert("Could not save this professional on this device.");
        return;
    }
    refreshSavedProvidersToggle();
    if (activeProviderCategory) loadYEWLProviders(activeProviderCategory);
}

savedProvidersToggle?.addEventListener("click", () => {
    showSavedProvidersOnly = !showSavedProvidersOnly;
    refreshSavedProvidersToggle();
    if (activeProviderCategory) loadYEWLProviders(activeProviderCategory);
});
refreshSavedProvidersToggle();

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

                // Keep a manually selected city. The local service finder uses
                // that city as its filter even if the customer also saves GPS.

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

    activeProviderCategory = category;

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
                    const cityTerms = CITY_SEARCH_ALIASES[selectedArea] || [selectedArea];

                    return (
                        categoryMatch &&
                        cityTerms.some(term => providerArea.includes(term))
                    );
                }

                return categoryMatch;

            });

        if (showSavedProvidersOnly) {
            const savedIds = new Set(getSavedProviderIds());
            providers = providers.filter(provider => savedIds.has(String(provider._id)));
        }

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
                    <p>${showSavedProvidersOnly ? "You have no saved professionals in this category yet. Tap Save on a provider card to keep it here." : `No ${formatProviderCategory(category).toLowerCase()} providers are listed${selectedArea && userArea ? ` in ${userArea.value.trim()}` : ""} yet. Try another area or check back soon.`}</p>
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
                        ${provider.isVerified === true ? '<span class="provider-verified-badge"><i class="ri-checkbox-circle-fill" aria-hidden="true"></i> Verified</span>' : ""}
                    </h3>

                    <p>
                        ${formatProviderCategory(provider.category)}
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

                    <p class="provider-card__queue">${provider.queueStatus === "busy" ? `⏳ Walk-ins wait ~${Number(provider.queueWaitMinutes || 0)} min` : provider.queueStatus === "offline" ? "⏸️ Not taking walk-ins" : "✂️ Chair available"}</p>

                    <div class="provider-card__actions">

                        <button type="button" class="button provider-card__save-button" data-save-provider-id="${provider._id}" aria-pressed="${getSavedProviderIds().includes(String(provider._id))}" aria-label="${getSavedProviderIds().includes(String(provider._id)) ? "Remove" : "Save"} ${provider.name || "professional"}">
                            <i class="${getSavedProviderIds().includes(String(provider._id)) ? "ri-heart-fill" : "ri-heart-line"}" aria-hidden="true"></i>
                            ${getSavedProviderIds().includes(String(provider._id)) ? "Saved" : "Save"}
                        </button>

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

            card.querySelector(".provider-card__save-button")?.addEventListener("click", function() {
                toggleSavedProvider(this.dataset.saveProviderId);
            });

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

// Route every expert card to the actual service results, including its full card surface.
function searchForExpertCard(card) {
    const title = card?.querySelector(".expert__name")?.textContent?.trim().toLowerCase() || "";
    const query = /shav|beard/.test(title) ? "beard"
        : /haircut|barber/.test(title) ? "haircut"
        : /bridal/.test(title) ? "bridal"
        : /groom/.test(title) ? "groom"
        : /nail/.test(title) ? "nail"
        : /mehendi|henna/.test(title) ? "mehendi"
        : /massage/.test(title) ? "massage"
        : /facial|skin/.test(title) ? "facial"
        : /hair styling/.test(title) ? "hair"
        : /makeup|occasion|traditional|simple|party|casual/.test(title) ? "makeup"
        : title;
    const finder = document.querySelector(".service__finder");
    const searchInput = document.getElementById("serviceSearchInput");
    const catalog = document.getElementById("serviceCatalog");
    if (finder) finder.open = true;
    if (searchInput && query.length >= 2) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    window.setTimeout(() => catalog?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
}

document.querySelectorAll(".expert__link").forEach(link => {
    link.setAttribute("href", "#services");
    link.addEventListener("click", event => {
        event.preventDefault();
        searchForExpertCard(link.closest(".expert__card"));
    });
});

document.querySelectorAll(".expert__card").forEach(card => {
    card.addEventListener("click", event => {
        if (event.target.closest("a, button, input, select, textarea")) return;
        searchForExpertCard(card);
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
const copySupportUpiButton = document.getElementById("copy-support-upi");
if (copySupportUpiButton) {
    copySupportUpiButton.addEventListener("click", async () => {
        const upiId = copySupportUpiButton.dataset.upiId || "";
        const status = document.getElementById("support-upi-copy-status");
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(upiId);
            } else {
                const temporaryInput = document.createElement("textarea");
                temporaryInput.value = upiId;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";
                document.body.appendChild(temporaryInput);
                temporaryInput.select();
                const copied = document.execCommand("copy");
                temporaryInput.remove();
                if (!copied) throw new Error("Copy was not available in this browser.");
            }
            status.textContent = "UPI ID copied. Open your UPI app and pay to this ID.";
        } catch (error) {
            console.error("Copy UPI ID error:", error);
            status.textContent = "Could not copy. Please select and copy the UPI ID shown above.";
        }
    });
}

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

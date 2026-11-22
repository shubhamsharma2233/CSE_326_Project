// ==========================================
// VENUE DATA
// ==========================================

const defaultVenues = [

  {
    id: 1,
    name: "The Grand Orchid",
    location: "Ludhiana, Punjab",
    category: "Wedding",
    capacity: 800,
    price: 85000,
    rating: "4.9",
    description: "A spacious and elegant banquet venue.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 2,
    name: "Olive Garden Hall",
    location: "Jalandhar, Punjab",
    category: "Party",
    capacity: 300,
    price: 32000,
    rating: "4.8",
    description: "A stylish indoor space for celebrations.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 3,
    name: "The Executive Hub",
    location: "Chandigarh, Punjab",
    category: "Corporate",
    capacity: 180,
    price: 24000,
    rating: "4.7",
    description: "A professional meeting venue.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 4,
    name: "Lakeview Celebration",
    location: "Amritsar, Punjab",
    category: "Wedding",
    capacity: 500,
    price: 62000,
    rating: "4.9",
    description: "A scenic venue with a beautiful event lawn.",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0dze?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 5,
    name: "The Social Studio",
    location: "Ludhiana, Punjab",
    category: "Birthday",
    capacity: 120,
    price: 18000,
    rating: "4.6",
    description: "A modern venue for birthdays and parties.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 6,
    name: "Royal Convention Centre",
    location: "Patiala, Punjab",
    category: "Corporate",
    capacity: 650,
    price: 55000,
    rating: "4.8",
    description: "A large convention space for conferences.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80"
  }

];


// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================

const getCustom = () =>
  JSON.parse(localStorage.getItem("vv_custom_venues") || "[]");

const getBookings = () =>
  JSON.parse(localStorage.getItem("vv_bookings") || "[]");

const allVenues = () => [
  ...defaultVenues,
  ...getCustom()
];

const money = n =>
  "₹" + Number(n).toLocaleString("en-IN");


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(page) {

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  document.getElementById(page + "Page")
    .classList.add("active-page");

  document.querySelectorAll(".nav-link").forEach(b => {
    b.classList.toggle("active", b.dataset.page === page);
  });

  if (page === "venues") {
    renderVenues();
  }

  if (page === "bookings") {
    renderBookings();
  }

  if (page === "admin") {
    renderAdmin();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ==========================================
// SECURITY: DISPLAY TEXT SAFELY
// ==========================================

function escapeHTML(s) {

  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

}

function escapeAttr(s) {
  return escapeHTML(s).replace(/`/g, "&#96;");
}


// ==========================================
// VENUE CARD DESIGN
// ==========================================

function venueCard(v) {

  return `

    <article class="venue-card">

      <div class="venue-image"
        style="background-image:url('${escapeAttr(v.image || "")}')">

        <span class="venue-tag">
          ${escapeHTML(v.category)}
        </span>

      </div>

      <div class="venue-body">

        <h3>${escapeHTML(v.name)}</h3>

        <p class="venue-location">
          ⌖ ${escapeHTML(v.location)}
        </p>

        <div class="venue-meta">

          <span>
            ♙ Up to ${v.capacity} guests
          </span>

          <span>
            ★ ${v.rating || "New"}
          </span>

        </div>

        <div class="venue-bottom">

          <div class="price">
            ${money(v.price)}
            <small>/ event</small>
          </div>

          <button class="small-btn"
            onclick="openBooking(${Number(v.id)})">

            Book now →

          </button>

        </div>

      </div>

    </article>

  `;

}


// ==========================================
// DISPLAY FEATURED VENUES
// ==========================================

function renderFeatured() {

  document.getElementById("featuredGrid").innerHTML =
    allVenues()
      .slice(0, 3)
      .map(venueCard)
      .join("");

}


// ==========================================
// SEARCH, FILTER AND SORT VENUES
// ==========================================

function renderVenues() {

  const q = (
    document.getElementById("searchInput")?.value || ""
  ).toLowerCase();

  const cat =
    document.getElementById("categoryFilter")?.value || "";

  const cap = Number(
    document.getElementById("capacityFilter")?.value || 0
  );

  const sort =
    document.getElementById("sortFilter")?.value || "recommended";


  let list = allVenues().filter(v =>

    (v.name + " " + v.location)
      .toLowerCase()
      .includes(q)

    && (!cat || v.category === cat)

    && (!cap || v.capacity >= cap)

  );


  // Sort by price

  if (sort === "low") {

    list.sort((a, b) => a.price - b.price);

  }

  if (sort === "high") {

    list.sort((a, b) => b.price - a.price);

  }


  document.getElementById("venueGrid").innerHTML =
    list.map(venueCard).join("");


  document.getElementById("emptyVenues")
    .classList.toggle("hidden", list.length > 0);

}


// ==========================================
// CATEGORY QUICK FILTER
// ==========================================

function quickCategory(c) {

  showPage("venues");

  document.getElementById("categoryFilter").value = c;

  renderVenues();

}


// ==========================================
// OPEN BOOKING FORM
// ==========================================

function openBooking(id) {

  const v = allVenues().find(x => x.id === id);

  if (!v) return;


  const form = document.getElementById("bookingForm");

  form.reset();

  form.elements.venueId.value = v.id;


  document.getElementById("modalTitle").textContent =
    "Book " + v.name;

  document.getElementById("modalVenueInfo").textContent =
    `${v.location} · Capacity ${v.capacity} guests`;

  document.getElementById("modalPrice").textContent =
    money(v.price);


  const date = form.elements.date;

  date.min = new Date().toISOString().split("T")[0];


  document.getElementById("bookingModal")
    .classList.remove("hidden");

}


// ==========================================
// CLOSE BOOKING FORM
// ==========================================

function closeModal() {

  document.getElementById("bookingModal")
    .classList.add("hidden");

}


document.getElementById("bookingModal")
  .addEventListener("click", e => {

    if (e.target.id === "bookingModal") {
      closeModal();
    }

  });


// ==========================================
// SUBMIT BOOKING REQUEST
// ==========================================

document.getElementById("bookingForm")
  .addEventListener("submit", e => {

    e.preventDefault();

    const f = e.currentTarget;

    const v = allVenues().find(
      x => x.id === Number(f.elements.venueId.value)
    );


    if (!v) {

      toast("Venue not found.");

      return;

    }


    const booking = {

      id: Date.now(),

      venueId: v.id,

      venueName: v.name,

      price: v.price,

      customer: f.elements.customer.value,

      email: f.elements.email.value,

      phone: f.elements.phone.value,

      date: f.elements.date.value,

      guests: Number(f.elements.guests.value),

      eventType: f.elements.eventType.value,

      requirements: f.elements.requirements.value,

      status: "Pending review",

      created: new Date().toISOString()

    };


    // Check guest capacity

    if (booking.guests > v.capacity) {

      toast(`This venue can host up to ${v.capacity} guests.`);

      return;

    }


    // Check event date

    if (booking.date < new Date().toISOString().split("T")[0]) {

      toast("Please choose a future date.");

      return;

    }


    // Save booking

    const bookings = getBookings();

    bookings.unshift(booking);

    localStorage.setItem(
      "vv_bookings",
      JSON.stringify(bookings)
    );


    closeModal();

    updateCount();

    toast("Booking request submitted successfully!");

    showPage("bookings");

  });


// ==========================================
// DISPLAY MY BOOKINGS
// ==========================================

function renderBookings() {

  const list = getBookings();

  const el = document.getElementById("bookingList");


  if (!list.length) {

    el.innerHTML = `

      <div class="empty-panel">

        <strong>No bookings yet</strong>

        Your booking requests will appear here.
        Explore venues to get started.

      </div>

    `;

    return;

  }


  el.innerHTML = list.map(b => `

    <article class="booking-card">

      <div>

        <h3>${escapeHTML(b.venueName)}</h3>

        <p>
          Booking ID: #${b.id}
        </p>

        <p>
          📅 ${escapeHTML(b.date)}
          · ${b.guests} guests
          · ${escapeHTML(b.eventType)}
        </p>

        <p>
          Booked by ${escapeHTML(b.customer)}
          · ${money(b.price)}
        </p>

        ${b.requirements
          ? `<p>Note: ${escapeHTML(b.requirements)}</p>`
          : ""
        }

        <span class="status">
          ${escapeHTML(b.status)}
        </span>

      </div>

      <div>

        <button class="cancel-btn"
          onclick="cancelBooking(${b.id})">

          Cancel request

        </button>

      </div>

    </article>

  `).join("");

}


// ==========================================
// CANCEL BOOKING
// ==========================================

function cancelBooking(id) {

  if (!confirm("Cancel this booking request?")) {
    return;
  }


  const updatedBookings = getBookings().filter(
    b => b.id !== id
  );


  localStorage.setItem(
    "vv_bookings",
    JSON.stringify(updatedBookings)
  );


  renderBookings();

  updateCount();

  toast("Booking request cancelled.");

}


// ==========================================
// UPDATE BOOKING COUNT
// ==========================================

function updateCount() {

  document.getElementById("bookingCount").textContent =
    getBookings().length;

}


// ==========================================
// ADD NEW VENUE
// ==========================================

document.getElementById("venueForm")
  .addEventListener("submit", e => {

    e.preventDefault();

    const d = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );


    const v = {

      ...d,

      id: Date.now(),

      price: Number(d.price),

      capacity: Number(d.capacity),

      rating: "New",

      image: d.image ||
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80"

    };


    const custom = getCustom();

    custom.push(v);


    localStorage.setItem(
      "vv_custom_venues",
      JSON.stringify(custom)
    );


    e.currentTarget.reset();

    renderAdmin();

    renderFeatured();

    toast("New venue added to the catalogue.");

  });


// ==========================================
// DISPLAY CUSTOM VENUES IN ADMIN PANEL
// ==========================================

function renderAdmin() {

  const el = document.getElementById("adminVenueList");

  const custom = getCustom();


  el.innerHTML = custom.length

    ? custom.map(v => `

        <div class="admin-item">

          <span>
            <strong>${escapeHTML(v.name)}</strong>
            <br>
            ${escapeHTML(v.location)}
          </span>

          <button onclick="deleteVenue(${v.id})">
            Remove
          </button>

        </div>

      `).join("")

    : "<p>No custom venues added yet.</p>";

}


// ==========================================
// DELETE CUSTOM VENUE
// ==========================================

function deleteVenue(id) {

  if (!confirm("Remove this venue?")) {
    return;
  }


  const updated = getCustom().filter(
    v => v.id !== id
  );


  localStorage.setItem(
    "vv_custom_venues",
    JSON.stringify(updated)
  );


  renderAdmin();

  renderFeatured();

  toast("Venue removed.");

}


// ==========================================
// SUCCESS NOTIFICATION
// ==========================================

let toastTimer;

function toast(message) {

  const el = document.getElementById("toast");

  el.textContent = message;

  el.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    el.classList.remove("show");

  }, 2800);

}


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

renderFeatured();

updateCount();
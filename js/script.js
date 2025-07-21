const gallery = document.getElementById("gallery");
const button = document.querySelector("button");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const loadingMessage = document.getElementById("loadingMessage");
const funFactBox = document.getElementById("funFact");

const funFacts = [
  "Did you know? The Sun accounts for 99.86% of the mass in our solar system.",
  "Did you know? Venus is the hottest planet in our solar system — hotter than Mercury!",
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? A spoonful of a neutron star would weigh about 6 billion tons.",
  "Did you know? The Moon is drifting away from Earth at about 1.5 inches per year.",
  "Did you know? NASA’s Voyager 1 is the most distant human-made object — over 14 billion miles away!",
  "Did you know? The Hubble Space Telescope has taken over 1.5 million observations since 1990.",
  "Did you know? Mars has the tallest mountain in the solar system: Olympus Mons.",
  "Did you know? Earth is the only planet not named after a god.",
  "Did you know? A day on Jupiter is only 10 hours long!"
];

// Show one on load
window.addEventListener("DOMContentLoaded", () => {
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  funFactBox.textContent = randomFact;
  funFactBox.classList.remove("hidden");
});

const API_KEY = "dIqgh3OuCnDp7jsB9ZXTSFb3FiYvY50rsnbsdCyU"; // Your NASA key
const APOD_URL = "https://api.nasa.gov/planetary/apod";

// Handle button click
button.addEventListener("click", async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    alert("Please select a valid date range.");
    return;
  }

  gallery.innerHTML = "";
  loadingMessage.classList.remove("hidden");

  try {
    const response = await fetch(
      `${APOD_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) throw new Error("API request failed.");

    const data = await response.json();
    displayImages(data);
  } catch (err) {
    gallery.innerHTML = `<p>Error loading images: ${err.message}</p>`;
  } finally {
    loadingMessage.classList.add("hidden");
  }
});

function displayImages(items) {
  gallery.innerHTML = "";

  const validItems = items.filter(item =>
    item.media_type === "image" || item.media_type === "video"
  ).slice(0, 9);

  if (validItems.length === 0) {
    gallery.innerHTML = `<p>No media found for this date range.</p>`;
    return;
  }

  validItems.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("gallery-item");

    if (item.media_type === "image") {
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p><strong>Date:</strong> ${item.date}</p>
        <p>${item.explanation}</p>
      `;
    } else if (item.media_type === "video") {
      const isYouTube = item.url.includes("youtube.com") || item.url.includes("youtu.be");

      div.innerHTML = `
        ${isYouTube ? `
          <div class="video-wrapper">
            <iframe src="${item.url}" allowfullscreen></iframe>
          </div>
        ` : `
          <a href="${item.url}" target="_blank">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Play_button_icon.png"
                 alt="Video"
                 style="height:200px; object-fit:contain; background:#000; display:block; margin:auto;" />
            <p style="text-align:center; margin-top:5px;">Click to watch video</p>
          </a>
        `}
        <h3>${item.title} <span class="media-tag">📺 Video</span></h3>
        <p><strong>Date:</strong> ${item.date}</p>
        <p>${item.explanation}</p>
      `;
    }

    gallery.appendChild(div);
  });
}

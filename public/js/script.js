// Initialize socket.io
const socket = io();

// Check if the browser supports geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Location sent: Lat: ${latitude}, Long: ${longitude}`); // Debugging

      // Emit the location via Socket.io
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Error getting geolocation:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Initialize map (initial coordinates are set once location is available)
const map = L.map("map").setView([0, 0], 16);

// Show OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap"
}).addTo(map);

// Create markers object
const markers = {};

// Handle receiving location
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log(`Location received: Lat: ${latitude}, Long: ${longitude}`); // Debugging

  // Set map view to the user's location
  map.setView([latitude, longitude], 16);

  // Update marker position or create a new marker
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// Remove marker when user disconnects
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

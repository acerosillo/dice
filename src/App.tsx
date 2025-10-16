import "./app.scss";

import { Card } from './components/Card/Card';

import { useEffect, useState, useRef } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueQuery, setVenueQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openEventIds, setOpenEventIds] = useState([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://partners-endpoint.dice.fm/api/v2/events",
          {
            headers: {
              "x-api-key": import.meta.env.VITE_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);

        setEvents(data.data || data);
        setFilteredEvents(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // 🔍 Handle venue name filtering
  const handleVenueSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setVenueQuery(query);
    const filtered = events.filter((event) =>
      event.venue?.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
    setVisibleCount(12); // Reset when searching
  };

  // 🎵 Toggle preview
  const handlePlayPreview = (event) => {
    const previewUrl =
      event.apple_music_tracks?.[0]?.preview_url ||
      event.spotify_tracks?.[0]?.preview_url;
    const fallbackUrl =
      event.apple_music_tracks?.[0]?.url ||
      event.spotify_tracks?.[0]?.url;

    if (previewUrl) {
      if (isPlaying && audioRef.current.src === previewUrl) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    } else if (fallbackUrl) {
      window.open(fallbackUrl, "_blank");
    }
  };
  // 📅 Helpers
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.toLocaleString("en-GB", { weekday: "short" });
    const dayNum = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const time = date.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${day} ${dayNum} ${month} - ${time.toLowerCase()}`;
  };

  const formatSaleDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleMoreInfo = (id) => {
    setOpenEventIds((prev) =>
      prev.includes(id)
        ? prev.filter((eventId) => eventId !== id)
        : [...prev, id]
    );
  };

  if (loading)
    return <p>Loading events...</p>;
  if (error)
    return <p>Error: {error}</p>;

  // 🔢 Limit events shown
  const visibleEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="wrapper">
      <h1>
        Upcoming Events
      </h1>

      {/* 🔍 Venue Search Input */}
      <div className="search-bar">
        Search Venue : 
        <input
          type="text"
          value={venueQuery}
          onChange={handleVenueSearch}
          placeholder="Enter venue name..."
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p >No events found.</p>
      ) : (
        <>
          <div className="listing">

            {visibleEvents.map((event, index) => (
              <Card
                key={event.id}
                event={event}
                index={index}
                isPlaying={isPlaying}
                openEventIds={openEventIds}
                handlePlayPreview={handlePlayPreview}
                toggleMoreInfo={toggleMoreInfo}
                formatDate={formatDate}
                formatSaleDate={formatSaleDate}
              />
            ))}

          </div>

          {/* 🔽 Load More */}
          {visibleCount < filteredEvents.length && (
            <div>
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="load-more"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

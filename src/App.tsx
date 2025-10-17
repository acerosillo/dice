import "./app.scss";
import { Card } from './components/Card/Card';
import { useEffect, useState, useRef } from "react";
import { formatDate, formatSaleDate } from "./utils/dateUtils"; //helper files

function App() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueQuery, setVenueQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [openEventIds, setOpenEventIds] = useState<string[]>([]);
  const audioRef = useRef(new Audio());
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const handlePlayPreview = (event: any) => {
    const previewUrl =
      event.apple_music_tracks?.[0]?.preview_url ||
      event.spotify_tracks?.[0]?.preview_url;
    const fallbackUrl =
      event.apple_music_tracks?.[0]?.url ||
      event.spotify_tracks?.[0]?.url;

    if (!previewUrl && fallbackUrl) {
      window.open(fallbackUrl, "_blank");
      return;
    }

    if (previewUrl) {
      if (currentPlaying === previewUrl) {
        // If the same song is playing, toggle pause
        audioRef.current.pause();
        setCurrentPlaying(null);
        return;
      }

      // Stop previous and start new one
      audioRef.current.pause();
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setCurrentPlaying(previewUrl);

      audioRef.current.onended = () => setCurrentPlaying(null);
    }
  }

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

        //console.log(data);

        setEvents(data.data || data);
        setFilteredEvents(data.data || data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

  }, []);

  //Handle venue name filtering
  const handleVenueSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setVenueQuery(query);
    const filtered = events.filter((event:any) =>
      event.venue?.toLowerCase().includes(query)
    );
    setFilteredEvents(filtered);
    setVisibleCount(12); // Reset when searching
  };


  const toggleMoreInfo = (id:string) => {
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

  //Limit events shown
  const visibleEvents = filteredEvents.slice(0, visibleCount);

  return (
    <div className="wrapper">

      <div className="search-bar">

        <h1>
          Upcoming Events
        </h1>
        <strong>Search Venue by Name : </strong>
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

            {visibleEvents.map((event: any, index: number) => (
              
              <Card
                key={event.id}
                event={event}
                index={index}
                openEventIds={openEventIds}
                toggleMoreInfo={toggleMoreInfo}
                formatDate={formatDate}
                formatSaleDate={formatSaleDate}
                
                isPlaying={currentPlaying === event.apple_music_tracks?.[0]?.preview_url ||
                     currentPlaying === event.spotify_tracks?.[0]?.preview_url}
                handlePlayPreview={() => handlePlayPreview(event)}

              />
            ))}

          </div>

          {/* Load More */}
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

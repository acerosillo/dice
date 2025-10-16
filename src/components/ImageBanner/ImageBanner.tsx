import './imagebanner.scss';
import Imgix from "react-imgix";

export function ImageBanner({
  event,
  isPlaying,
  handlePlayPreview,
  formatSaleDate,
}) {
  const imageSrc = event.event_images?.landscape || event.images?.[0];
  const hasPreview =
    event.apple_music_tracks?.length > 0 || event.spotify_tracks?.length > 0;

  return (
    <div className="image-banner">
      {/* 🎨 Event Image */}
      {imageSrc ? (
        <Imgix
          src={imageSrc}
          alt={event.name}
          className="w-full h-48 object-cover rounded-xl mb-3"
          width={600}
          sizes="100vw"
          imgixParams={{ fit: "fill" }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-gray-500">
          No image available
        </div>
      )}

      {/* ▶️ Play Preview */}
      {hasPreview && (
        <button
            className={`preview-button ${isPlaying ? "is-playing" : ""}`}
            onClick={() => handlePlayPreview(event)}
            >
            <span className="label">
                {isPlaying}
            </span>
        </button>
      )}

      {/* 🕓 On Sale / Reminder */}
      {event.status === "on-sale" && (
        <div className='reminder-tab'>
      
          {new Date(event.announcement_date) > new Date() ? (
            <span className="ml-2 text-blue-600 font-semibold cursor-pointer">
              Remind me
            </span>
          ) : (
            <>On sale {formatSaleDate(event.announcement_date)}</>
          )}
       
        </div>
      )}
    </div>
  );
}

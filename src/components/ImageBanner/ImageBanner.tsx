import type { ImageBannerProps } from './interface';
import './imagebanner.scss';
import Imgix from "react-imgix";

export const ImageBanner: React.FC<ImageBannerProps> = ({ 
  event,
  isPlaying,
  handlePlayPreview,
  formatSaleDate,
 }) => {

  const imageSrc = event.event_images?.square || event.images?.[0];
  const hasPreview =
    event.apple_music_tracks?.length > 0 || event.spotify_tracks?.length > 0;
    //console.log(event)
  return (
    <div className="image-banner">

      {imageSrc ? (
        <Imgix
          src={imageSrc}
          alt={event.name}
          width={600}
          sizes="100vw"
          imgixParams={{ fit: "fill" }}
        />
      ) : (
        <div>
          No image available
        </div>
      )}

      {hasPreview && (
        <button
            className={`preview-button ${isPlaying ? "is-playing" : ""}`}
            onClick={() => handlePlayPreview(event)}
            >
        </button>
      )}

      {event.status === "on-sale" && (
        <div className='reminder-tab'>
          {new Date(event.announcement_date) > new Date() ? (
            <span>
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

export interface ImageBannerProps {
  event: {
    name: string;
    event_images: {
      square: string;
    };
    images: string;
    apple_music_tracks: string;
    spotify_tracks: string;
    announcement_date: string;
    status: string;
  };
  isPlaying: boolean;
  handlePlayPreview : (event: any) => void;
  formatSaleDate: (isoString: string) => void;
}
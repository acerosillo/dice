export interface CardProps {
  event : {
    id: string,
    description: string;
    name: string;
    venue: string;
    date: string;
    lineup: {
      details: string;
      time: string;
    }[];
    location: {
      city: string;
    };
    sold_out: boolean;
    url: string;
    ticket_types: {
      id: string;
      name: string;
      price: {
        face_value: number;
      };
      sold_out: boolean;
    }[];
    event_images: {
      square: string;
    };
    images: string;
    apple_music_tracks: string;
    spotify_tracks: string;
    announcement_date: string;
    status: string;
  };
  index: number;
  openEventIds: string[];
  toggleMoreInfo: (id: string) => void;
  formatDate: (isoString: string) => string;
  formatSaleDate: (isoString: string) => void;
  isPlaying: boolean;
  handlePlayPreview: (event: any) => void;
}
export interface PlaylistData {
  _id: string;
  author: string;
  title: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
  tracks: string[];
  collaborators: string[];
}

export interface PublicPlaylistData {
  _id: string;
  author: {
    username: string;
  };
  title: string;
  description: string;
  tags: string[];
}

export interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imgSrc: string;
}

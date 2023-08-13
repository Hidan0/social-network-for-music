export interface PlaylistData {
  _id: string;
  author: string;
  title: string;
  description: string;
  tags: string[];
  isPrivate: boolean | undefined;
  tracks: string[] | undefined;
  collaborators: string[] | undefined;
}

export interface PlaylistState {
  _id: string | undefined;
  author: string | undefined;
  title: string | undefined;
  description: string | undefined;
  tags: string[] | undefined;
  isPrivate: boolean | undefined;
  tracks: string[] | undefined;
  collaborators: string[] | undefined;
}

export interface CreatePlaylistData {
  title: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
}

export interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imgSrc: string;
}

export type TrackCache = Record<string, TrackData>;

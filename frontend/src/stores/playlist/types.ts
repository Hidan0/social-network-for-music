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

export interface TrackData {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imgSrc: string;
}

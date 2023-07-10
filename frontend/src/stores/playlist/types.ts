export interface PlaylistData {
  _id: string;
  author: {
    username: string;
  };
  title: string;
  description: string;
  tags: string[];
}

import mongoose from "mongoose";
import regex from "../utils/regex";

export interface IPlaylist {
  title: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
  tracks: string[];
  creator: mongoose.Schema.Types.ObjectId;
  followers: mongoose.Schema.Types.ObjectId[];
}

const PlaylistSchema = new mongoose.Schema<IPlaylist>({
  title: {
    type: String,
    required: true,
    match: [
      regex.playlistTitle,
      `Please insert a valid title: ${regex.playlistTitleDescr}`,
    ],
  },
  description: {
    type: String,
    required: true,
    match: [
      regex.playlistDescription,
      `Please insert a valid description: ${regex.playlistDescriptionDescr}`,
    ],
  },
  tags: {
    type: [
      {
        type: String,
        match: [
          regex.playlistTag,
          `Please insert a valid tag: ${regex.playlistTagDescr}`,
        ],
      },
    ],
    default: [],
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  tracks: {
    type: [String],
    default: [],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

export const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);

export const getPlaylists = () => PlaylistModel.find();
export const getPlaylistsByCreator = (
  creatorId: mongoose.Schema.Types.ObjectId
) => PlaylistModel.find({ creator: creatorId });
export const getPlaylistById = (id: string) => PlaylistModel.findById(id);
export const createPlaylist = (values: Record<string, any>) =>
  new PlaylistModel(values).save().then((playlist) => playlist.toObject());

export const deletePlaylistById = (id: string) =>
  PlaylistModel.findByIdAndDelete(id);
export const updatePlaylistById = (id: string, values: Record<string, any>) =>
  PlaylistModel.findByIdAndUpdate(id, values);

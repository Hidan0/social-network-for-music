import mongoose from "mongoose";
import regex from "../utils/regex";

export interface IPlaylist {
  title: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
  tracks: string[];
  author: mongoose.Schema.Types.ObjectId;
  collaborators: mongoose.Schema.Types.ObjectId[];
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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

export const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);

export const getAllPlaylists = async (id: string) =>
  PlaylistModel.find({ $or: [{ collaborators: { $in: id } }, { author: id }] });

export const getPublicPlaylists = () =>
  PlaylistModel.find({ isPrivate: false }).populate("author", "-_id username");

export const getPlaylistsByCreator = (
  creatorId: mongoose.Schema.Types.ObjectId
) => PlaylistModel.find({ creator: creatorId });
export const getPlaylistById = (id: string) => PlaylistModel.findById(id);
export const createPlaylist = (values: Record<string, any>) =>
  new PlaylistModel(values).save().then((playlist) => playlist.toObject());

export const addCollaboratorToPlaylist = (id: string, collaborator: string) =>
  PlaylistModel.findByIdAndUpdate(id, {
    $push: { collaborators: collaborator },
  });

export const deletePlaylistById = (id: string) =>
  PlaylistModel.findByIdAndDelete(id);
export const updatePlaylistById = (id: string, values: Record<string, any>) =>
  PlaylistModel.findByIdAndUpdate(id, values);

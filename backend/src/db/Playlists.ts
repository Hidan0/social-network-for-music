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

export const getPlaylistsInLibrary = async (id: string) =>
  PlaylistModel.find({ $or: [{ collaborators: { $in: id } }, { author: id }] });

export const getPlaylistsInLibraryOrPublic = async (id: string) =>
  PlaylistModel.find({
    $or: [{ collaborators: { $in: id } }, { author: id }, { isPrivate: false }],
  });

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

export const removeCollaboratorFromPlaylist = (
  id: string,
  collaborator: string
) =>
  PlaylistModel.findByIdAndUpdate(id, {
    $pull: { collaborators: collaborator },
  });

export const deletePlaylistById = (id: string) =>
  PlaylistModel.findByIdAndDelete(id);
export const updatePlaylistById = (id: string, values: Record<string, any>) =>
  PlaylistModel.findByIdAndUpdate(id, values);

export const pushTrackToPlaylist = (id: string, track: string) =>
  PlaylistModel.findByIdAndUpdate(id, { $addToSet: { tracks: track } });
export const removeTrackFromPlaylist = (id: string, track: string) =>
  PlaylistModel.findByIdAndUpdate(id, { $pull: { tracks: track } });

export const findPlaylistsByTitle = (title: string) => {
  const searchKeywords = title.split(" ");
  const regexPatterns = searchKeywords.map(
    (keyword) => new RegExp(keyword, "i")
  );
  return PlaylistModel.find({
    $or: regexPatterns.map((pattern) => ({
      title: { $regex: pattern },
      isPrivate: false,
    })),
  });
};
export const findPlaylistsByTags = (tags: string[]) =>
  PlaylistModel.find({ tags: { $elemMatch: { $in: tags } }, isPrivate: false });
export const findPlaylistsByTrackIds = (trackIds: string[]) =>
  PlaylistModel.find({
    tracks: { $elemMatch: { $in: trackIds } },
    isPrivate: false,
  });

const email = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const emailDescr = "local-name@domain";

const username = /^[\w\-]{4,20}$/;
const usernameDescr =
  "4-20 characters, letters, numbers, hyphens and underscores";

const name = /^[\w\s]{4,25}$/;
const nameDescr = "4-25 characters, letters, numbers, spaces";

const password =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,40}$/;
const passwordDescr =
  "8-40 characters, at least one uppercase, one lowercase, one number and one special character (e.g. @$!%*#?&^)";

const playlistTitle = /^[\w\s\-.,!?:]{4,50}$/;
const playlistTitleDescr =
  "4-50 characters, letters, numbers, spaces and special characters (e.g. -.,!?:)";

const playlistDescription = /^[\w\s\-.,!?:\n@$!%*#?&^]{4,200}$/;
const playlistDescriptionDescr =
  "4-200 characters, letters, numbers, special characters (e.g. -.,!?:@$!%*#?&^), new line";

const playlistTag = /[\w\-]{2,16}$/;
const playlistTagDescr = "2-16 characters, letters, numbers, hyphens";

export default {
  email,
  emailDescr,
  username,
  usernameDescr,
  name,
  nameDescr,
  password,
  passwordDescr,
  playlistTitle,
  playlistTitleDescr,
  playlistDescription,
  playlistDescriptionDescr,
  playlistTag,
  playlistTagDescr,
};

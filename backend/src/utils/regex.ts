const email = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const emailDescr = "local-name@domain";

const username = /^[\w\-]{4,20}$/;
const usernameDescr =
  "4-20 characters, letters, numbers, hyphens and underscores";

const name = /^[\w\ ]{4,25}$/;
const nameDescr = "4-25 characters, letters, numbers, spaces";

const password =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,40}$/;
const passwordDescr =
  "8-40 characters, at least one uppercase, one lowercase, one number and one special character (e.g. @$!%*#?&)";

export default {
  email,
  emailDescr,
  username,
  usernameDescr,
  name,
  nameDescr,
  password,
  passwordDescr,
};

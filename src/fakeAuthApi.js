// Database
const Users = [
  {
    name: "Sohail",
    email: "asohail737@gmail.com",
    password: "123456",
  },
];

const findUserByEmail = (email) => {
  return Users.find((user) => user.email === email);
};

export const loginUserApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = findUserByEmail(email);
      if (user===null || user===undefined) {
        reject({ success: false, status: 404 });
      }
      if (user?.password === password) {
        resolve({ success: true, data: user, status: 200 });
      }
      reject({ success: false, status: 401 });
    }, 1000);
  });
};

export const signupUserApi = (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Users.push({ name, email, password });
      const user = findUserByEmail(email);
      if (user) {
        resolve({ success: true, data: user, status: 201 });
      }
      reject({ success: false, status: 401 });
    }, 1000);
  });
};

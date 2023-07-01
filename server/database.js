const jwt = require("jsonwebtoken");

const patients = [
  {
    id: 1,
    name: "Jay Patel",
    mobileNo: 85116,
    gender: "Male",
    address: "Morbi",
    disease: "Headache",
    present: false,
  },
  {
    id: 2,
    name: "Rinkal Patel",
    mobileNo: 92966,
    gender: "Female",
    address: "Morbi",
    disease: "Flu",
    present: false,
  },
  {
    id: 3,
    name: "Nikunj Chadamiya",
    mobileNo: 96879,
    gender: "Male",
    address: "Rajkot",
    disease: "Allergies",
    present: false,
  },
  {
    id: 4,
    name: "Payal Chadamiya",
    mobileNo: 95106,
    gender: "Female",
    address: "Rajkot",
    disease: "Asthma",
    present: false,
  },
  {
    id: 5,
    name: "Sarthak Saradva",
    mobileNo: 95682,
    gender: "Male",
    address: "Ahmedabad",
    disease: "Anxiety",
    present: false,
  },
  {
    id: 6,
    name: "Swati Saradva",
    mobileNo: 98351,
    gender: "Female",
    address: "Ahmedabad",
    disease: "Cold",
    present: false,
  },
];

let admin = {
  id: "admin",
  username: "admin",
  password: "admin",
  name: "Jay Patel",
  mobileNo: "8551622685",
  gender: "male",
  dateOfBirth: "07-02-1997",
  role: "SR. Developer",
  email: "jay@gmail.com",
  address: "Morbi",
};

const database = {
  login: function ({ username, password }) {
    if (username === admin.username) {
      if (password === admin.password) {
        const payload = {
          id: admin.id,
          username: admin.username,
        };
        debugger;

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        const user = { ...admin };
        delete user.password;
        return {
          user: user,
          token: jwtToken,
        };
      } else {
        throw new Error("Incorrect Password. Please enter correct Password.");
      }
    } else {
      throw new Error("User not found. Please enter correct Username.");
    }
  },

  updateAdminDetails: function (details) {
    const fount = admin.id === details.id;

    if (fount) {
      admin = {
        ...admin,
        ...details,
      };
    } else {
      throw new Error("Admin record doesn't found.");
    }
  },

  getPatientList: function () {
    return patients;
  },

  addPatientDetails: function (details) {
    const id = patients.length;

    patients.push({
      id: Number(id) + 1,
      ...details,
    });
  },

  updatePatientDetails: function (details, id) {
    const index = patients.findIndex((p) => p.id == id);

    if (index > -1) {
      patients[index] = {
        ...patients[index],
        ...details,
      };
    } else {
      throw new Error("Patient record doesn't found.");
    }
  },

  removePatient: function (id) {
    const index = patients.findIndex((p) => p.id == id);

    if (index > -1) {
      patients.splice(index, 1);
    } else {
      throw new Error("Patient record doesn't found.");
    }
  },
};

module.exports = database;

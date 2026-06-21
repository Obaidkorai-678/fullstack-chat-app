import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "sophia23@gmail.com",
    fullName: "Sophia",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "emma23@gmail.com",
    fullName: "Emma",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "olivia23@gmail.com",
    fullName: "Olivia",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava23@gmail.com",
    fullName: "Ava",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "mia23@gmail.com",
    fullName: "Mia",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "amelia23@gmail.com",
    fullName: "Amelia",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte23@gmail.com",
    fullName: "Charlotte",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "isabella23@gmail.com",
    fullName: "Isabella",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    email: "harper23@gmail.com",
    fullName: "Harper",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    email: "evelyn23@gmail.com",
    fullName: "Evelyn",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },

  // Male Users
  {
    email: "james23@gmail.com",
    fullName: "James",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william23@gmail.com",
    fullName: "William",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin23@gmail.com",
    fullName: "Benjamin",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas23@gmail.com",
    fullName: "Lucas",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry23@gmail.com",
    fullName: "Henry",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander23@gmail.com",
    fullName: "Alexander",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel23@gmail.com",
    fullName: "Daniel",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    email: "ethan23@gmail.com",
    fullName: "Ethan",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    email: "mason23@gmail.com",
    fullName: "Mason",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "logan23@gmail.com",
    fullName: "Logan",
    password: "12345678",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(usersWithHashedPasswords);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
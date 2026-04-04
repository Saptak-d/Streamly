🎬 Streamly

Streamly is a backend-focused personal project inspired by modern video streaming and social platforms.
It is designed to explore real-world backend architecture, MongoDB data modeling, and advanced aggregation pipelines.

This project prioritizes backend correctness, scalability, and learning over UI or search features.

🚀 Project Purpose

Streamly was built as a learning-driven personal project to:

Design a realistic backend for a video streaming platform

Model complex relationships between users, videos, likes, playlists, and subscriptions

Implement secure authentication using JWT

Master MongoDB aggregation pipelines

Build production-style REST APIs

🧱 Tech Stack
Backend

Node.js

Express.js

Database

MongoDB

Mongoose ODM

Authentication & Media

JWT (Access & Refresh Tokens)

Multer – file uploads

Cloudinary – image & video storage

❌ No validation library used
❌ No search functionality implemented yet

✨ Features

Streamly supports a wide range of backend features commonly found in video-based social platforms.

🔐 Authentication & User Management

User registration & login

JWT-based authentication (access & refresh tokens)

Secure logout & token refresh

Change password

Fetch current user

Update profile details

Update avatar & cover image

Channel profile retrieval

Watch history tracking

📹 Channel & Video Features

Upload videos

Fetch channel videos

Track video views

Maintain watch history

Channel analytics using aggregation:

Total videos

Total views

Total subscribers

Total likes

❤️ Likes System (Unified)

Like / unlike videos

Like / unlike comments

Like / unlike tweets

Fetch all liked videos of a user

Single likes collection used across multiple entities

💬 Comments

Add comments on videos

Update comments

Delete comments

Fetch all comments of a video

Ownership-based authorization

📂 Playlist Management

Streamly includes a full playlist system, similar to real streaming platforms.

Playlist Features

Create playlists

Update playlist name & description

Add videos to playlists

Prevent duplicate videos in a playlist

Remove videos from playlists

Delete playlists

Fetch:

All playlists of a user

A single playlist by ID

🔔 Subscriptions

Subscribe / unsubscribe to channels

Fetch subscribers of a channel

Fetch channels a user is subscribed to

Subscriber counts derived via aggregation

🐦 Tweet-like Micro Posts

Create text-based posts (tweets)

Update tweets

Delete tweets

Fetch all tweets by a user

Tweets support likes via the unified like system

📊 Advanced Aggregation Usage

Streamly heavily uses MongoDB aggregation pipelines to:

Compute channel statistics

Populate nested relationships

Aggregate likes across multiple videos

Reduce multiple DB queries into single pipelines

Key operators used:

$lookup

$lookup with pipeline

$expr

$in

$addFields

$project

🗂️ Project Structure (High Level)
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
└── index.js

⚙️ Environment Setup
1️⃣ Install dependencies
npm install

2️⃣ Create environment file

Create a .env file in the root directory.

You can refer to .env.example for guidance.

Required environment variables:
PORT=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

3️⃣ Start the development server
npm run dev


✅ That’s it.
Your backend server will be up and running.

Server runs on:

http://localhost:<PORT>

🔒 Authorization & Security

All protected routes require authentication

JWT middleware injects authenticated user into req.user

Ownership checks are enforced in controllers

Only content owners can modify or delete their data

⚠️ Current Limitations

❌ No search functionality

❌ No frontend UI

❌ No caching (Redis)

📈 Learning Outcomes

Through Streamly, I gained experience in:

Advanced MongoDB aggregation pipelines

Backend system design

JWT authentication & authorization

Complex relationship handling

Production-style REST API development

🧩 Future Enhancements

Implement search

Add Redis caching

Improve analytics with time-based insights

Extend playlist & recommendation logic

📌 Why Streamly?

Streamly is not a basic CRUD application.
It is built to simulate real backend challenges and demonstrate:

Strong MongoDB fundamentals

Advanced aggregation knowledge

Clean backend architecture

Scalable API design

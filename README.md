# RanchBnB ![Logo]
![Logo](<frontend/images/logo ranch no back ground.png>)



**Live Site:** 
[https://ranchdnb.onrender.com] 
**Project Repo:** 
[https://github.com/Dtaylor0128/mod5-bnb-project]

---

## **Table of Contents**
- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [Frontend Routes](#frontend-routes)
- [API Endpoints](#api-endpoints)
- [Redux Store](#redux-store)
- [Setup & Installation](#setup--installation)
- [Tech Stack](#tech-stack)
- [Known Issues](#known-issues)
- [Development Notes](#development-notes)
- [Contact](#contact)

---

## **About**
**RanchBnB** is a full-stack clone of Airbnb focused on ranch and countryside stays. Users can sign up, list properties, upload images, leave reviews, and manage their listings.

---

## **Features**
- User authentication & session management
- Create, read, update, and delete spots (listings)
- Upload multiple spot images with live previews
- Leave and view reviews (delete disabled for now)
- Manage your own spots dashboard
- Responsive UI for mobile and desktop

---

## **Screenshots**
### Home Page

![Home Page Screenshot](<frontend/images/Screenshot 2025-06-30 140839.png>)

### Database Schema
![DB Screenshot](<frontend/images/Screenshot 2025-06-30 151007.png>)


---

## **Database Schema**
> _See the full schema at [dbdiagram.io](https://dbdiagram.io/d/bnb-project-schema-6791b84e37f5d6cbeba313fa)._

**Main Tables & Associations:**
- **Users**: Own spots, write reviews, make bookings
- **Spots**: Belong to users, have many images, reviews, bookings
- **SpotImages**: Belong to spots
- **Reviews**: Belong to spots and users
- **Bookings**: Belong to spots and users

**_Corrected Schema Screenshot Below:_**
![Database Schema](./screenshots/database-schema.png)

---

## **Frontend Routes**
| Path                  | Component          | Description                 |
|-----------------------|-------------------|-----------------------------|
| `/`                   | HomePage          | All spots                   |
| `/spots/new`          | CreateSpotForm    | Create a new spot           |
| `/spots/:spotId`      | SpotDetailsPage   | Spot details & reviews      |
| `/spots/:spotId/edit` | UpdateSpotForm    | Edit a spot                 |
| `/spots/current`      | ManageSpotsPage   | Manage your spots           |
| `/login`              | LoginForm         | User login                  |
| `/signup`             | SignupForm        | User signup                 |

---

## **API Endpoints**
| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/api/spots`                    | Get all spots                  |
| POST   | `/api/spots`                    | Create a new spot              |
| PUT    | `/api/spots/:id`                | Update a spot                  |
| DELETE | `/api/spots/:id`                | Delete a spot                  |
| POST   | `/api/spots/:spotId/images`     | Add image to spot              |
| DELETE | `/api/spot-images/:imageId`     | Delete spot image              |
| GET    | `/api/reviews/:spotId`          | Get reviews for a spot         |
| POST   | `/api/reviews/:spotId`          | Add review                     |
| DELETE | `/api/reviews/:reviewId`        | Delete review (disabled)       |

---

## **Redux Store**

{
session: { user: null | { ... } },
spots: {
allSpots: { [spotId]: { ...spotData } },
singleSpot: { ... }
},
reviews: {
bySpotId: { [spotId]: { [reviewId]: { ...reviewData } } }
}
}

---

## **Setup & Installation**
1. Clone this repo and the [repo](https://github.com/Dtaylor0128/mod5-bnb-project)
2. Install dependencies: `npm install`
3. Set up your `.env` file
4. Run database migrations and seeders
5. Start backend and frontend servers: `npm start` or `npm run dev`
6. Visit [localhost:5173](http://localhost:8001)

---

## **Tech Stack**
- React, Redux, Redux Toolkit
- Express, Sequelize, PostgreSQL
- Node.js, JavaScript, HTML, CSS
- Multer, bcrypt, JWT
- Render (deployment)

---

## **Known Issues**
- **Review delete** is currently disabled
- **Delete spot** works, but requires a manual refresh to update UI
- **Bookings* disabled current a developing feature
- Some minor image validation improvements pending
-

---

## **Development Notes**
- Used a single `images` object for all image state to avoid loops
- Used async/await for sequential image CRUD operations
- Navigation after delete is handled in the parent component to avoid React Router context errors

---

## **Contact**
Questions? Reach out at [dtaylor0128@gmail.com](mailto:dtaylor0128@gmail.com)

![Logo](frontend/public/ranchBNB-letters.png)
---

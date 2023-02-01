# Isaqshoots-V2

A media gallery app based on **M**ongoDB, **E**xpress, **V**ue.js and **N**ode.js stack.

Passport.js was used to handle authentication.

Cloudinary for storing media.

This repo consists of the Vue generated built files in server/public folder.

You can find the Vue FE here - https://github.com/OmarA3Khan/Ishaqshoots-V2-FE

The web app is hosted on render and you can find it here - http://www.isaqshoots.com/

## Features
Admin can
* create, edit, and remove media files
* create, edit, and remove FAQs
* edit the About section
* structure the media files and display them together as an album or can display them as individual photos.
* Users can view the media and book a private session through a form.

Here's a screenshot of the Admin Page

<img width="1469" alt="Screenshot at Feb 01 15-01-10" src="https://user-images.githubusercontent.com/80813676/216026826-002c68f1-c8b5-4823-986e-a25a73ff91e3.png">

## Run it locally
Install mongodb
Create a cloudinary account to get an API key and secret code
```
git clone https://github.com/OmarA3Khan/Isaqshoots-V2.git

cd isaqshoots

npm install
```

## Built With
* Node.js - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* express - Fast, unopinionated, minimalist web framework for Node.js
* MongoDB - A source-available cross-platform document-oriented database program
* Mongoose - Elegant MongoDB object modeling for Node.js
* Vue.js - An open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications.

Create a .env file in the root of the project and add the following:
```
DATABASEURL=<url>
CLOUDINARY_api_key=<cloudinary_api_key>
CLOUDINARY_api_secret=<cloudinary_secret_key>
PASSPORT_secret=<secret>
```

Run ```npm start```

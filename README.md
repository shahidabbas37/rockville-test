# Rockville Test by Shahid Abbas

# Getting Started

1 Clone the project repository to your local machine.

2 Change your directory to the project folder.
$ cd project
Install project dependencies by running:
$ npm install
To start the project, run the following command:
$ npm run start:dev

# Database

The MongoDB Atlas DB URL is configured and exported from the config/index.ts file.

# Seeding Data

The seeder data is defined in the seeders/seed-data.ts file, and the MoviesService has a method called seedData(). You can use this method to seed the database with initial data. To do so, please uncomment the following line of code in your main.ts file:

// Uncomment the following line to seed data
// const moviesService = app.get(MoviesService);
// await moviesService.seedData(moviesData);

By uncommenting this code, you can ensure that the latest data from the seed-data.ts file is seeded into the database.

# Recommanded Movies

To list recommended movies, a query is used to identify movies with high ratings and those that have been uploaded most recently. This approach aims to provide users with movies that are both highly rated and recently added.

# Postman Collection

You can import the Postman collection for this project. The collection JSON file is included with the project and is named 'rockville Shahid-Test.postman_collection.json'. Import this collection into your Postman for testing the API endpoints.

# Environment Variables

The project includes environment variables that are set in the config index file. This setup is done to simplify the interview process, so you don't need to set additional environment variables.

# Uploading a Profile Picture

To upload a profile picture, use the provided API endpoint for profile picture upload.

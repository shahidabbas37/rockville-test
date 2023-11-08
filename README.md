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

To generate a list of recommended movies, a query is employed to filter out movies with high ratings and those that have been uploaded most recently. These recommendations are further refined by taking into account the user's age group. For instance, users aged 5 to 15 are recommended animated movies, while those aged 16 to 30 receive action movie recommendations. Users aged 30 and above will find comedy movies in their recommendations. Additionally, the user's favorite categories play a role in suggesting movies as well as added pagination. This combined approach ensures that users are presented with highly-rated and recently added movies that align with their age group and preferences.


# Postman Collection

You can import the Postman collection for this project. The collection JSON file is included with the project and is named 'rockville Shahid-Test.postman_collection.json'. Import this collection into your Postman for testing the API endpoints.

# Environment Variables

The project includes environment variables that are set in the config index file. This setup is done to simplify the interview process, so you don't need to set additional environment variables.

# Uploading a Profile Picture

To upload a profile picture, use the provided API endpoint for profile picture upload.

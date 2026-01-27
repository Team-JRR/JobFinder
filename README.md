# JobFinder

An app designed to help someone searching for a job organize their work. Create a profile and fill it out with the jobs that interest you! Find jobs in your area that relate to your interests. Track your current progress with them. Make sure you don't fall for any phoney links with our reporting system. Get a job in no time with JobFinder, which streamlines the process! (WIP)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

* Make sure you have installed all dependencies with npm.
* Allow your distribution files to be made with ```npm run build```. (You can end it after the first build successful build if you do not wish to make changes, but otherwise it will continue running due to the ```--watch``` tag.)
* Make sure MongoDB is running with ```mongod```.
* Then you can run the application with ```npm start```.

### Prerequisites

The application is designed to run in a ubuntu terminal.
You need Node, ideally installed with NVM, and then you need access to npm to install all of the apps other required dependencies. 

### Environment Variables

Ensure that you have the following, use the ```.env.example``` for reference.
* ```app_id```, ```app_key```  - For the AdZuna API.
* ```GOOGLE_CLIENT_ID```, ```GOOGLE_CLIENT_SECRET``` - Setup for Google OAuth.
* ```secret``` - Setup for the Express Sessions Middleware.

### Prerequisites

You need Node 22, ideally installed with NVM, and then you need access to NPM to install all of the apps other required dependencies.

### Deployment

To add this to a running web server, you simply need to clone it, and run the getting started steps above. We recommend AWS with Ubuntu.

Sometimes, on virtual machines, Mongo won't know where to put its files, which will require extra config. If you want to get it running fast, create directories '/mongo/data/db' in the root, and then run ```mongod --dbpath ./mongo/data/db```

### Coding style tests

We used ESLint to enforce style. We used the base rules as our project hasn't yet necessitated special styling. Our code styling isn't strictly enforced just yet.

## Known Issues

When creating a job, if you put in something that is not a link as the job link, when trying to view the job link you'll be redirected to a blank page.

Server endpoints are all in one file, which is bad practice.

Some of the UI on the Dashboard is difficult to understand.

## Ideas for Changes

Add a section called 'Planning to Apply' to the job tracker.

Allow users to put in a jobs location and/or their website, rather than just their website.

Clicking on a job on the FindJobs page to see a further description should also give you a way to add the job to your tracker.

Jobs should have descriptions as well, which the user can input to keep notes, or that can be pulled in from the AdZuna API.

Find an automated way to approve user tags, rather than require the attention of an admin. For example, maybe if the tag produces more than a certain number of results, it gets accepted automatically.

## Built With

* React
* Express
* Express Session
* MongoDB
* NodeJS - 22
* Material UI
* Dotenv
* Webpack
* ESLint
* Nodemon
* Adzuna API

## Authors

* Ryan S.
* Rowan B.
* Jaylin J.
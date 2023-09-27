# Exercise tracker

## FreeCodeCamp Challenge

[Challenge Link](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker)

<hr/>

## Initialize aplication on local machine

```bash

git clone https://github.com/Beqa-Beqa/Fcc-Excercise-Tracker.git #Clones the repository on your machine

npm install #Installs neccessary dependencies

npm start #Runs nodemon on index.js that will let you inspect your app on localhost

```

<h4>This application is an exercise tracker.
You can create users and with user id you can add a new exercise to it's logs.
You can also get all the users list with `GET` request on `/api/users` route.
You can get user's logs information by making a `GET` request on `/api/users/:id/logs`.
Additionaly to logs request you can add `[from]&[to]&[limit]` parameters that will filter the result for you
`[from]` and `[to]` are date formats (yyyy-mm-dd) and `[limit]` is an integer value.
</h4>
<br/>
<h4>Keep in mind to create .env file and add your mongodb [MONGO_URI] variable in it with respective value</h4>
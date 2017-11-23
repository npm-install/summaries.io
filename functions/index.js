const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const sendgrid = require("sendgrid");
const client = sendgrid("YOUR_SG_API_KEY");
const axios = require("axios");
const Promise = require("bluebird");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

function dateMaker() {
  let date2 = Date().split(" ");
  const monthToNum = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };
  return `${date2[3]}-${monthToNum[date2[1]]}-${date2[2]} `;
}

function parseBody(body) {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email(body.from);
  const toEmail = new helper.Email(body.to);
  const subject = body.subject;
  const content = new helper.Content("text/html", body.content);
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);
  return mail.toJSON();
}

exports.httpEmail = functions.https.onRequest((req, res) =>
  Promise.resolve()
    .then(_ => {
      if (req.method !== "POST") {
        const error = new Error("Only POST requests are accepted");
        error.code = 405;
        throw error;
      }

      const request = client.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: parseBody(req.body)
      });

      return client.API(request);
    })
    .then(response => (response.body ? res.send(response.body) : res.end()))
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
);

exports.makeSummaries1 = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require("./keys");

  // First we retrieve the list of sources
  const newsSources = [
    // "abc-news",
    // "al-jazeera-english",
    // "ars-technica",
    // "associated-press",
    // "axios",
    // "bleacher-report",
    // "bloomberg",
    // "business-insider",
    // "buzzfeed",
    // "cbs-news",
    // "cnbc",
    // "cnn",
    // "crypto-coins-news",
    // "engadget",
    // "entertainment-weekly",
    // "espn"
    "fortune",
    // "hacker-news",
    "ign",
    "mashable",
    "msnbc",
    "national-geographic",
    "nbc-news",
    "nfl-news",
    "nhl-news",
    "politico",
    "polygon",
    "reuters",
    "techcrunch",
    "the-hill",
    "the-huffington-post",
    "the-new-york-times",
    "the-verge",
    "the-wall-street-journal",
    "the-washington-post",
    "time",
    "usa-today",
    "vice-news",
    "wired"
  ];
  let articles = [];

  // What is today's date?
  const date = dateMaker();

  Promise.map(newsSources, getSource)
  .then(result => {
    Promise.map(result, writeSource)
      .then(_ => {
        response.json("Successfully wrote all articles to the database, ayyy :)");
      })
      .catch((err) => {
        console.error('Error writing to the database on a source,', err.message)
        response.json('Error writing to the database on atleast one source, check logs')
      })
  })
  .catch((err) => {
    console.log('Error getting sources, ', err.message)
    response.json('Error getting sources')
  })


  // Function definition to getSource
  function getSource(newsSource) {
    const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${
      newsSource
    }&apiKey=${newsKey}`;

    return axios.get(newsUrl).then(response => {
      articles = response.data.articles.map(async article => {
        const sumsObj = await axios
          .get(
            `http://api.smmry.com/&SM_API_KEY=${sumKey}&&SM_LENGTH=2&SM_URL=${
              article.url
            }`
          )
          .catch(console.error);
        const updatedArticle = Object.assign({}, article, {
          summary: sumsObj.data.sm_api_content || "API MAXED OUT"
        });
        return updatedArticle;
      });
      return Promise.all(articles);
    });
  }

  // Write source to the database
  function writeSource (data) {
    const newsSource = data[0].source.id
    const batch = admin.firestore().batch();
    const dayRef = admin
    .firestore()
    .collection("sources")
    .doc(newsSource)
    .collection("days")
    .doc(date)
    .collection("articles");

  data.forEach(article => {
    batch.set(dayRef.doc(article.title), { ...article });
  });

  batch
    .commit()
    .then(() => {
      console.log(
        "added " +
          articles.length +
          " from " +
          newsSource +
          " to Firestore"
      );
    })
    .catch(() => {
      console.log(
        "ERROR: Failed to write" +
          articles.length +
          " from " +
          newsSource +
          " to Firestore"
      );
    });

  }
});

exports.makeSummaries2 = functions.https.onRequest((request, response) => {
  const { newsKey, sumKey } = require("./keys");

  // First we retrieve the list of sources
  const newsSources = [
    "abc-news",
    "al-jazeera-english",
    "ars-technica",
    "associated-press",
    "axios",
    "bleacher-report",
    "bloomberg",
    "business-insider",
    "buzzfeed",
    "cbs-news",
    "cnbc",
    "cnn",
    "crypto-coins-news",
    "engadget"
    // // "entertainment-weekly",
    // // "espn"
    // "fortune",
    // // // "hacker-news",
    // // "ign",
    // // "mashable",
    // // "msnbc",
    // // "national-geographic",
    // // "nbc-news",
    // // "nfl-news",
    // // "nhl-news",
    // // "politico",
    // // "polygon",
    // "reuters",
    // "techcrunch",
    // "the-hill",
    // "the-huffington-post",
    // "the-new-york-times",
    // "the-verge",
    // "the-wall-street-journal",
    // "the-washington-post",
    // "time",
    // "usa-today",
    // "vice-news",
    // "wired"
  ];
  let articles = [];

  // What is today's date?
  const date = dateMaker();

  Promise.map(newsSources, getSource)
  .then(result => {
    Promise.map(result, writeSource)
      .then(_ => {
        response.json("Successfully wrote all articles to the database, ayyy :)");
      })
      .catch((err) => {
        console.error('Error writing to the database on a source,', err.message)
        response.json('Error writing to the database on atleast one source, check logs')
      })
  })
  .catch((err) => {
    console.log('Error getting sources, ', err.message)
    response.json('Error getting sources')
  })


  // Function definition to getSource
  function getSource(newsSource) {
    const newsUrl = `https://newsapi.org/v2/top-headlines?sources=${
      newsSource
    }&apiKey=${newsKey}`;

    return axios.get(newsUrl).then(response => {
      articles = response.data.articles.map(async article => {
        const sumsObj = await axios
          .get(
            `http://api.smmry.com/&SM_API_KEY=${sumKey}&&SM_LENGTH=2&SM_URL=${
              article.url
            }`
          )
          .catch(console.error);
        const updatedArticle = Object.assign({}, article, {
          summary: sumsObj.data.sm_api_content || "API MAXED OUT"
        });
        return updatedArticle;
      });
      return Promise.all(articles);
    });
  }

  // Write source to the database
  function writeSource (data) {
    const newsSource = data[0].source.id
    const batch = admin.firestore().batch();
    const dayRef = admin
    .firestore()
    .collection("sources")
    .doc(newsSource)
    .collection("days")
    .doc(date)
    .collection("articles");

  data.forEach(article => {
    batch.set(dayRef.doc(article.title), { ...article });
  });

  batch
    .commit()
    .then(() => {
      console.log(
        "added " +
          articles.length +
          " from " +
          newsSource +
          " to Firestore"
      );
    })
    .catch(() => {
      console.log(
        "ERROR: Failed to write" +
          articles.length +
          " from " +
          newsSource +
          " to Firestore"
      );
    });

  }
});

exports.makeEmails = functions.https.onRequest((request, response) => {
  const rec = admin
    .firestore()
    .collection("users")
    // Here add a where query to filter by requested time
    // For now, let's generate Adrien's email
    .where("email", "==", "q@q.com")
    .get()
    .then(function(users) {
      users.forEach(function(user) {
        admin
          .firestore()
          .collection("users")
          .doc(user.id)
          .collection("subscriptions")
          .get()
          .then(subscriptions => {
            subscriptions.forEach(subscription => {
              console.log(subscription.id);
            });
          })
          .catch(console.error);
      });
    })
    .catch(console.error);

  response.send("hello");
});

// Source List Reference
//
// "abc-news",
// "al-jazeera-english",
// "ars-technica",
// "associated-press",
// "axios",
// "bleacher-report",
// "bloomberg",
// "business-insider",
// "buzzfeed",
// "cbs-news",
// "cnbc",
// "cnn",
// "crypto-coins-news",
// "engadget",
// // "entertainment-weekly",
// // "espn",
// "fortune",
// "hacker-news",
// "ign",
// "mashable"
// "msnbc",
// "national-geographic",
// "nbc-news",
// "nfl-news",
// "nhl-news",
// "politico",
// "polygon",
// 'reddit-r-all',
// "reuters",
// "techcrunch",
// "the-hill",
// "the-huffington-post",
// "the-new-york-times",
// "the-verge",
// "the-wall-street-journal",
// "the-washington-post",
// "time",
// "usa-today",
// "vice-news",
// "wired"

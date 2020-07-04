const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const ShowTimes = require('./ShowTimes')
const mongoose = require('mongoose')
require('dotenv').config();
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true }, () => {
    console.log("Connected to DB")
});

mongoose.set('debug', true);

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB connected successfully");
    connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            console.log(err);
        } else {
            for (i = 0; i < names.length; i++) {
                console.log(names[i].name);
                if ((names[i].name = "showtimes")) {
                    console.log("showtimes Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "showtimes",
                        function (err, result) {
                            console.log("Collection dropped");
                        }
                    );
                    console.log("showtimes Collection No Longer Available");
                } else {
                    console.log("Collection doesn't exist");
                }
            }
        }
    });
});


async function parse(movieName, date, html) {
    const browser = await puppeteer.launch({ headless: true });

    var content = fs.readFileSync(html, 'utf8');
    const page = await browser.newPage();
    await page.setContent(content);
    const details = await page.$$(".site.sitecgv")
    for (let i = 0; i < details.length; i++) {
        const theaterName = await details[i].$eval(".site > h3", h3 => h3.innerText)
        const showTimes = await details[i].$$("ul > li")
        for (let j = 0; j < showTimes.length; j++) {
            const showTime = await showTimes[j].$eval("a span", span => span.innerText)
            const bookingLink = await showTimes[j].$eval("a", a => a.getAttribute('href'))
            let object = new ShowTimes({
                movieName: formatString(movieName),
                date: date,
                theaterName: theaterName,
                showTime: showTime,
                bookingLink: bookingLink
            })

            await object.save()
        }
    }
    await browser.close();
    // await mongoose.connection.close();
};

function formatString(str) {
    return str
        .replace(/(\B)[^ ]*/g, match => (match.toLowerCase()))
        .replace(/^[^ ]/g, match => (match.toUpperCase()));
}


module.exports = parse;

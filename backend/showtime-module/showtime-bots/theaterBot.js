const puppeteer = require('puppeteer');
const Cities = require('./Cities')
const mongoose = require('mongoose')
const fs = require('fs')
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
                if ((names[i].name = "cities")) {
                    console.log("cities Collection Exists in DB");
                    mongoose.connection.db.dropCollection(
                        "cities",
                        function (err, result) {
                            console.log("Collection dropped");
                        }
                    );
                    console.log("cities Collection No Longer Available");
                } else {
                    console.log("Collection doesn't exist");
                }
            }
        }
    });
});

(async function theaterBot() {
    try {

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

        const page = await browser.newPage();

        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"
        );

        page.setViewport({ width: 1920, height: 1080 })

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
                req.abort();
            }
            else {
                req.continue();
            }
        })

        await page.goto('https://www.cgv.vn/default/cinox/site/')
        await page.waitForSelector(".main-container", { timeout: 15000 });
        const locations = await page.$$(".cinemas-area > ul > li")
        var Locations = []
        for (let i = 0; i < locations.length; i++) {
            var location = await locations[i].$eval("span", span => span.innerText)
            var location_id = await locations[i].$eval("span", span => span.getAttribute("id"))
            Locations.push({ 'location_id': location_id, "location_name": location, "theaters": [] })
        }

        //  const theaters = await page.$$(".cinemas-list > ul > li")
        var results = await page.evaluate(async (Locations) => {
            let elements = Array.from(document.querySelectorAll(".cinemas-list > ul > li"));
            for (let j = 0; j < elements.length; j++) {
                for (let k = 0; k < Locations.length; k++) {
                    if (elements[j].className === Locations[k]['location_id']) {
                        Locations[k]['theaters'].push(elements[j].innerText.trim())
                    }
                }
            }
            return Locations

            // let links = elements.map(element => {
            //     return element.className
            // })
            // return links;
        }, Locations)


        for (let m = 0; m < results.length; m++) {
            let obj = new Cities({
                city: results[m]['location_name'],
                theaters: results[m]['theaters']
            })
            await obj.save()
        }

        console.log("Done");
        fs.appendFile("log.txt", `Done scraping THEATERS at ${Date(Date.now()).toString()}\r\n`, function (err) {
            if (err) throw err;
            console.log('Updated!');
        })

        await mongoose.connection.close();
        await browser.close();
    }
    catch (e) {
        console.log(e)
    }
})();
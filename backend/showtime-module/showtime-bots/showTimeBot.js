const puppeteer = require('puppeteer');
const axios = require('axios')
const fs = require('fs-extra');
const qs = require('querystring');
const parse = require('./htmlParser')

async function main(date){

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

    // Wait for page to load
    for (let i = 0; i < 12; i++) {

        await page.goto("https://www.cgv.vn/en/movies/now-showing.html/");
        // Wait for page to load
        await page.waitForSelector(".main-container");
        var movieList = await page.$$(".film-lists");
        var li = movieList[i];
        var movie_name = await li.$eval(".product-info > .product-name a", a => a.innerText);

        var booking_id = await li.$eval("ul > li > button", el => el.getAttribute("onClick"))
        var sliced_id = await booking_id.slice(14,22);
        
        // console.log(movie_name, sliced_id)
        var parsedDate = new Date(date)
        var formatted_date = parsedDate.toISOString().split('T')[0].replace(/-/g,"")
        axios({
            method: 'post',
            url: 'https://www.cgv.vn/default/cinemas/product/ajaxschedule/',
            data: qs.stringify({
                id: sliced_id,
                dy: formatted_date
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
        .then(res => {
            fs.writeFile('show-times.html', res.data)
            parse(movie_name, formatted_date, './show-times.html')
        })
        .catch(err => { console.log(err) })
    }

    await browser.close()
}

async function execute(){
    for (let i = 0; i < 5; i++) {
        var date = new Date();
        var temp = date.setDate(date.getDate() + i)
        console.log(i)
        // Delete await before main(temp). Seems to work now. Still have no clue how all of this works
        main(temp)
    }
}

execute()



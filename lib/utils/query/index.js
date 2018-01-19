'use strict';

var
    Puppeteer = require('puppeteer'),
    defaults = require('../../defaults');

exports = module.exports = {

    query_found: false,
    max_iterations: 20,

    /**
     * Returns the query_id for the hashtag page search
     * @module Utils.query
     * @param {String} _hashtag
     * @return {Number} Query ID - ID for the query call for searching posts that contain a given hashtag
     */
    tags: async (_hashtag) => {
        try {
            let query_id;

            const browser = await Puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterceptionEnabled(true);
            page.on('request', (request) => {
                if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
                    request.abort();
                } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
                    query_id = request.url.split('=')[1].split('&')[0];
                    exports.query_found = true;
                } else {
                    request.continue();
                }
            });
            await page.goto(defaults.URL_INSTAGRAM_EXPLORE_TAGS + _hashtag);

            // Click on 'more images'
            await page.click('._1cr2e._epyes');
            await exports.scrollPage(page);

            browser.close();

            return query_id;

        } catch (error) {
            return error;
        }
    },

    scrollPage: async (page, scrollDelay = 1000) => {
      try {
        let previousHeight,
            iteration = 0;

        while (exports.query_found == false || iteration < exports.max_iterations) {
          previousHeight = await page.evaluate('document.body.scrollHeight');
          await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
          await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
          await page.waitFor(scrollDelay);
          iteration++;
        }
      } catch(e) { }
    },

    /**
     * Returns the query_id for the user page search
     * @module Utils.query
     * @param {String} _hashtag
     * @return {Number} Query ID - ID for the query call for searching posts of a given user
     */
    user: async (_username) => {
        try {
            let query_id;

            const browser = await Puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterceptionEnabled(true);
            page.on('request', (request) => {
                if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
                    request.abort();
                } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
                    query_id = request.url.split('=')[1].split('&')[0];
                } else {
                    request.continue();
                }
            });
            await page.goto(defaults.URL_INSTAGRAM + _username);

            // Click on 'more images'
            await page.click('._1cr2e._epyes');

            browser.close();

            return query_id;

        } catch (error) {
            return error;
        }
    },

    /**
     * Returns the query_id for the comments in a media page
     * @module Utils.query
     * @param {String} _shortcode
     * @return {Number} Query ID - ID for the query call for searching comments of a given post
     */
    comments: async (_shortcode) => {
        try {
            let query_id;

            const browser = await Puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterceptionEnabled(true);
            page.on('request', (request) => {
                if (/\.(png|jpg|jpeg|gif|webp)$/i.test(request.url)) {
                    request.abort();
                } else if (request.url.startsWith(defaults.URL_INSTAGRAM_GRAPHQL_QUERY)) {
                    query_id = request.url.split('=')[1].split('&')[0];
                } else {
                    request.continue();
                }
            });

            await page.goto(defaults.URL_INSTAGRAM_MEDIA_SHORTCODE + _shortcode);

            // Click on 'more images'
            await page.click('._m3m1c._1s3cd');

            browser.close();

            return query_id;

        } catch (error) {
            return error;
        }
    }

}

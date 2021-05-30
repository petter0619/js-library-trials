const puppeteer = require('puppeteer');

const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

const start = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 70,
        args: [
            '--window-size=1920,1080'
        ]
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1450, height: 680 });

    // Go to My 4DX login page
    await page.goto('https://my-4dx.herokuapp.com/');

    // Log in
    await page.click('input#email');
    await page.type('input#email', 'petter.carlsson@appliedtechnology.se');
    await page.click('input#password');
    await page.type('input#password', '123456');
    await page.click('button[type="submit"]');

    // Open dropdown nav
    await page.waitForSelector('button.navbar__button');
    await page.click('button.navbar__button');

    // Navigate to the Wig Session (commitment) page
    await page.waitForSelector('a[href="/wig-session"]');
    await page.click('a[href="/wig-session"]');

    // Make commitment
    await page.waitForSelector('input#commitmentName');
    await page.click('input#commitmentName');
    await page.type('input#commitmentName', 'Made with Puppeteer!');
    await page.evaluate(() => {
        let elements = document.querySelectorAll('button[type="submit"]');
        elements[2].click();
    });

    // Check commitment text content
    await page.waitForSelector('label[for="commitment-0"]')
    let element = await page.$('label[for="commitment-0"]')
    let value = await page.evaluate(el => el.textContent, element)
    console.log(value) // For potential test

    // Remove commitment
    // await page.waitForSelector('button.commitment-item__delete-btn');
    await page.click('button.commitment-item__delete-btn');

    // Log out
    await page.click('button.navbar__button');
    await wait(1000);
    await page.evaluate(() => {
        let lgBtn = document.querySelector('#root > header > nav > ul > li:nth-child(9) > a');
        lgBtn.click();
    });

    // Close browser
    await wait(1500);
    browser.close();
}

start();
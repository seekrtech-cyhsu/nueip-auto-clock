import GeoLocation from './geo_location'
import Credentials from './credentials'
import PunchType from './punch_type'

const pp = require('puppeteer')

function selectorForPunchType(type: PunchType): string {
    switch (type) {
    case PunchType.IN:
        return '#clockin'
    case PunchType.OUT:
        return '#clockout'
    default:
        throw 'Invalid type'
    }
}

async function waitForTextInputAndFill(selector: string, value: string, page: any) {
    await page.waitForSelector(selector)
    await page.type(selector, value)
}

async function punch(type: PunchType, companyLocation: GeoLocation, credentials: Credentials) {
    const browser = await pp.launch({ headless: false })

    const context = browser.defaultBrowserContext()
    await context.overridePermissions('https://cloud.nueip.com/', ['geolocation'])
    
    const page = await browser.newPage()
    await page.setGeolocation(companyLocation)
    await page.goto('https://cloud.nueip.com/login/')
    
    await waitForTextInputAndFill('#dept_input:not([disabled])', credentials.companyName, page)
    await waitForTextInputAndFill('#username_input:not([disabled])', credentials.username, page)
    await waitForTextInputAndFill('#password-input:not([disabled])', credentials.password, page)

    const loginButtonSelector = '#login-button'
    await page.waitForSelector(loginButtonSelector)

    await Promise.all([
        page.waitForNavigation(),
        page.click(loginButtonSelector)
    ])
    
    await page.goto('https://cloud.nueip.com/home', { waitUntil: 'networkidle0' })

    // const clockInButtonSelector = selectorForPunchType(type)
    // await page.waitForSelector(clockInButtonSelector)
    // page.click(clockInButtonSelector)
    
    // page.waitForResponse('https://cloud.nueip.com/time_clock/ajax')
    
    // await browser.close()
}

export default punch
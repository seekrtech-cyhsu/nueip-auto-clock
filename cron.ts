import punch from './lib/punch';
import PunchType from './lib/punch_type';
import timeout from './lib/timeout';

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const coordinates = { 
    latitude: parseFloat(process.env.LATITUDE!), 
    longitude: parseFloat(process.env.LONGITUDE!)
}

const credentials = { 
    companyName: process.env.COMPANY_NAME!, 
    username: process.env.USERNAME!, 
    password: process.env.PASSWORD! 
}

const now = new Date()
const punchType = now.getHours() < 12 ? PunchType.IN : PunchType.OUT

console.log(`Current time: ${now}`)
console.log(`Perform ${ punchType == PunchType.IN ? 'clock in' : 'clock out'}`)

const MAX_WAITING_TIME = 120 * 1000

const waitingTime = Math.random() * MAX_WAITING_TIME

console.log(`Wait for ${waitingTime} ms`)

timeout(waitingTime)
    .then(() => punch(punchType, coordinates, credentials))
    .then(console.log)
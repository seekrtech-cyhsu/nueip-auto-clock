const moment = require('moment-timezone')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

import { calendar_v3 } from 'googleapis'

async function _isWorkDay() {
    const cal = new calendar_v3.Calendar({
        auth: process.env.GOOGLE_API_KEY!
    })
    
    const startOfToday = moment().startOf('day')
    const startOfTomorrow = moment().add(1, 'day').startOf('day')
    
    const calendar = process.env.GOOGLE_CALENDAR_ID!
    const options = { 
        calendarId: calendar, 
        timeMin: startOfToday.tz('UTC').format(),
        timeMax: startOfTomorrow.tz('UTC').format(),
        maxResults: 1
    }
    
    let result = await cal.events.list(options)
    let items = result.data.items
    if (items) {
        const eventName = process.env.GOOGLE_CALENDAR_EVENT_NAME
        let count = items!.filter(event => event.summary === eventName).length
        return count > 0
    }
    
    return false
}

async function isWorkDay() {
    try {
        return await _isWorkDay()
    } catch (error) {
        console.error('Check work day error: ', error)
        return false
    }
} 

export default isWorkDay

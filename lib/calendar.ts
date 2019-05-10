import moment from 'moment-timezone'
import { calendar_v3 } from 'googleapis'

import path from 'path'
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

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

    const result = await cal.events.list(options)
    const items = result.data.items
    if (items) {
        const eventName = process.env.GOOGLE_CALENDAR_EVENT_NAME
        const count = items!.filter(event => event.summary === eventName).length
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

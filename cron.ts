import moment from 'moment-timezone'

import path from 'path'
import punch from './lib/punch'
import PunchType from './lib/punch_type'
import timeout from './lib/timeout'
import sendEmail from './lib/zapier_hook'
import isWorkDay from './lib/calendar'

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

let logs: string[] = []

const pushLog = (message: string) => {
    logs.push(message)
    console.log(message)
}

async function performClockAction() {
    try {
        const isTodayWorkDay = await isWorkDay()
        if (!isTodayWorkDay) {
            return 'Not a workday. Exit.'
        }

        pushLog(`Current time: ${now}`)
        pushLog(`Perform ${ punchType == PunchType.IN ? 'clock in' : 'clock out'}`)

        const MAX_WAITING_TIME = 133 * 1000

        const waitingTime = Math.random() * MAX_WAITING_TIME

        pushLog(`Wait for ${waitingTime} ms`)
        await timeout(waitingTime)

        let imageData = await punch(punchType, coordinates, credentials)

        let dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        let title = `${dateTime} 打卡結果`

        let message = [
            logs.map(l => `<p>${l}</p>`).join('\n'),
            `<img style="width: 100%" src="data:image/png;base64, ${imageData}" />`
        ].join('\n')

        return await sendEmail(title, message)
    } catch (error) {
        try {
            let dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
            let title = `[失敗] ${dateTime} 打卡結果`

            let message = [
                logs.map(l => `<p>${l}</p>`).join('\n'),
                `<pre>${error}<pre>`
            ].join('\n')

            return await sendEmail(title, message)
        } catch (e) {
            console.error('Send failure message error: ', e)
        }
    }
}

performClockAction()
    .then(console.log)
    .catch(console.error)
    .finally(() => console.log('Finish.'))

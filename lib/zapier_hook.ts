import request from 'request-promise'

async function sendEmail(subject: string, message: string) {
    const url = process.env.ZAPIER_HOOK_URL

    if (!url) {
        console.log('Zapier send email trigger is not configured.')
        return
    }

    const options = {
        method: 'POST',
        uri: url!,
        body: { subject, message },
        json: true
    }
    return await request.post(options)
}

export default sendEmail

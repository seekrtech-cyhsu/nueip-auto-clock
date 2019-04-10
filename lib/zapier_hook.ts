const request = require('request-promise')

async function sendEmail(subject: string, message: string) {
    const options = {
        method: 'POST',
        uri: process.env.ZAPIER_HOOK_URL!,
        body: { subject, message },
        json: true
    };
    return await request.post(options)
}

export default sendEmail
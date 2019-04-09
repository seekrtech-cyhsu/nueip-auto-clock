import punch from './lib/punch';
import PunchType from './lib/punch_type';

require('dotenv').config()

const coordinates = { 
    latitude: parseFloat(process.env.LATITUDE!), 
    longitude: parseFloat(process.env.LONGITUDE!)
}

const credentials = { 
    companyName: process.env.COMPANY_NAME!, 
    username: process.env.USERNAME!, 
    password: process.env.PASSWORD! 
}

punch(PunchType.IN, coordinates, credentials).then(() => console.log('ok'))
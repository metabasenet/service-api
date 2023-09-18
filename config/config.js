import _ from 'lodash'
import development from './development.js'
import production from './production.js'
import database from './database.js'

export const env = process.env.NODE_ENV || 'development'

const configs = {
    development: development,
    production: production
}

const defaultConfig = {
    env: env
}

const config = _.merge(defaultConfig, configs[env])
config.database = database[env]
export default config

import 'dotenv/config'

import { ActivityType, IntentsBitField } from 'discord.js'
import { ClientOptions } from 'discordx'
import { container } from 'tsyringe'

import { CustomLogger } from './services/logger.service.js'
import type { MainOptions } from './utils/types.js'


const logger = container.resolve(CustomLogger)

export const CONSTANTS = {
	version: '1.0.0',
	discordjs: '14.15.3'
}

const clientOptions: ClientOptions = {
    botId: process.env.BOT_ID,
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildIntegrations
    ],
    silent: process.env.NODE_ENV === 'development' ? false : true,
    simpleCommand: {
        prefix: process.env.BOT_PREFIX
    },
    logger,
    botGuilds: process.env.DEV_GUILD_ID && process.env.NODE_ENV === 'development' ? process.env.DEV_GUILD_ID.split(', ') : undefined
}

const config = {
    token: process.env.BOT_TOKEN,
    devGuildId: process.env.DEV_GUILD_ID,
    ownerId: process.env.OWNER_ID,
    activity: {
        name: `s'accroupit au bord de la pelouse`,
        type: ActivityType.Playing
    }
}

export const clubOptions = {
    clubID: process.env.FC_CLUB_ID,
    clubPlatform: process.env.FC_CLUB_PLATFORM
}

export const globalConfig: MainOptions = {
    clientOptions,
    config,
    clubOptions
}
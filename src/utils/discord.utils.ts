import { 
    ButtonBuilder,
    ButtonInteraction,
    CacheType,
    Channel,
    CommandInteraction, DiscordAPIError, GuildMember, InteractionReplyOptions, 
    MessageComponentInteraction, TextChannel, VoiceBasedChannel, ChannelType, 
    TextBasedChannel,
    EmbedBuilder
} from 'discord.js'
import { DisTubeError } from 'distube'

import { BaseError } from '../exceptions/base.exception.js'


export class DiscordUtils {
    public static async replyOrFollowUp(
        interaction: CommandInteraction | MessageComponentInteraction, 
        replyOptions: (InteractionReplyOptions & { ephemeral?: boolean }) | string
    ): Promise<CommandInteraction<CacheType> | MessageComponentInteraction<CacheType>> {

        // if interaction is already replied
        if (interaction.replied) {
            await interaction.followUp(replyOptions)
            return interaction
        }

        // if interaction is deferred but not replied
        if (interaction.deferred) {
            await interaction.editReply(replyOptions)
            return interaction
        }

        // if interaction is not handled yet
        await interaction.reply(replyOptions)

        return interaction
    }


    public static async joinIfVoiceChannel(interaction: CommandInteraction): Promise<VoiceBasedChannel | undefined> {
        if (
            !interaction.guild ||
            !interaction.channel ||
            !(interaction.member instanceof GuildMember)
        ) {
            interaction.reply(
              '> Your request could not be processed, please try again later'
            )
      
            setTimeout(() => interaction.deleteReply(), 15e3)

            return
        }
      
        if (
            !(interaction.member instanceof GuildMember) ||
            !interaction.member.voice.channel
        ) {
            interaction.reply('> You are not in the voice channel')
      
            setTimeout(() => interaction.deleteReply(), 15e3)
            return
        }
      
        await interaction.deferReply()
        
        return interaction.member.voice.channel
    }

    private static async handleErrorReply(
        interaction: CommandInteraction | MessageComponentInteraction, 
        replyOptions: (InteractionReplyOptions & { ephemeral?: boolean }) | string
    ) {
        await this.replyOrFollowUp(interaction, replyOptions)
        setTimeout(() => interaction.deleteReply(), 15e3)
    }

    public static async handleInteractionError(interaction: CommandInteraction | ButtonInteraction, error: unknown) {
        if(error instanceof DiscordAPIError) {
            await this.handleErrorReply(interaction, `> **DiscordAPIError**: ${error.message}`)
            throw error
        }

        if(error instanceof DisTubeError) {
            await this.handleErrorReply(interaction, `> **MusicPlayerError**: ${error.message}`)
            throw error
        }

        if(error instanceof BaseError) {
            await this.handleErrorReply(
                interaction, `> **${error.name}${error.status ? ` ${error.status}` : ''}**: ${error.message}`
            )
            throw error
        }
        
        if(error instanceof Error) {
            await this.handleErrorReply(interaction, `> **Error**: ${error.message}`)
            throw error
        }

        throw new Error(error as any)
    }

    public static async sendTextSoundboard(channel: TextBasedChannel, components: any[]): Promise<void> {
        // Vérifier si le canal existe et s'il s'agit d'un canal textuel
        console.log("🚀 ~ DiscordUtils ~ sendMessage ~ channel:", channel)
        if (channel && channel.isTextBased()) {
            try {
                // Envoyer le message dans le canal
                await channel.send({
                    content: 'Soundboard',
                    components: components
                });
                
            } catch (error) {
                console.error(`Failed to send message: ${error}`);
            }
        } else {
            console.error(`Channel with ID ${channel.id} not found or is not a text channel.`);
        }
    }
    

	public static getInteractionMember(interaction: CommandInteraction): GuildMember {
		return (interaction.member ? interaction.member : interaction!.guild!.members!.me) as GuildMember
	}
}
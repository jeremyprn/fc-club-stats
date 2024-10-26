import { inject, singleton } from "tsyringe";
import { SearchResult } from "distube";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	GuildMember,
	MessageActionRowComponentBuilder,
	TextBasedChannel,
	User,
	VoiceBasedChannel,
} from "discord.js";

import { CustomLogger } from "./logger.service.js";
import type { MusicPlayerOptions } from "../utils/types.js";
import { MusicManager } from "./music.service.js";
import { DiscordUtils } from "../utils/discord.utils.js";
import { ButtonComponent } from "discordx";

const defaultIntroSounds: Array<{
	id: string;
	name: string;
	url: string;
	startAt?: number;
	endedAt?: number;
}> = [
	{
		id: "712631152598319136",
		name: "Aksel",
		url: "https://www.youtube.com/watch?v=GvE_T6ksVD8",
		startAt: 72,
		endedAt: 85,
	},
	{
		id: "806159692497158205",
		name: "Alpé",
		url: "https://www.youtube.com/watch?v=Qqjw6gOzfdk",
		startAt: 3,
		endedAt: 14,
	},
	{
		id: "761018361446400021",
		name: "Rama",
		url: "https://www.youtube.com/watch?v=zNPXnAVyAUA",
		startAt: 0,
		endedAt: 12,
	},
	// {
	// 	id: "337289686768812034",
	// 	name: "Victor",
	// 	url: "https://www.youtube.com/watch?v=T4_luBn-Mzo",
	// },
	// {
	// 	id: "375767450488406018",
	// 	name: "Racim",
	// 	url: "https://www.youtube.com/watch?v=T4_luBn-Mzo",
	// },
	// {
	// 	id: "1173738392824066058",
	// 	name: "Alexis",
	// 	url: "https://www.youtube.com/watch?v=T4_luBn-Mzo",
	// },
	{
		id: "755667944255651862",
		name: "Jerem",
		url: "https://www.youtube.com/watch?v=BZVJQpQzP_I&",
		startAt: 15,
		endedAt: 40,
	},
	{
		id: "223174801181769728",
		name: "Chichi",
		url: "https://www.youtube.com/watch?v=pOMmS27LY1g",
		startAt: 46,
	},
];

@singleton()
export class SoundboardManager {
	protected results: SearchResult[];
	protected playersSounds: Array<{ music: SearchResult; player: User }>;

	constructor(
		@inject("musicOpts") public opts: MusicPlayerOptions,
		private musicManager: MusicManager,
		private logger: CustomLogger
	) {
		this.results = [];
		this.playersSounds = [];
	}

	// Detect if a user is joining the voice channel, and play a sound
	async playSoundOnUserJoin() {
		this.logger.info("Playing sound on user join...");

		this.opts.client.on("voiceStateUpdate", async (oldState, newState) => {
			if (newState.channel && newState.member?.user.bot) return;

			if (newState.channel && !oldState.channel) {
				const player = newState.member?.user;
				const playerSound = defaultIntroSounds.find(
					(sound) => sound.id === player?.id
				);

				if (!playerSound) return;
				const queue = this.musicManager.player.getQueue(newState.guild);
				if (queue) {
					await this.musicManager.player.stop(newState.guild);
				}

				this.playIntroSound(
					newState.channel,
					playerSound,
					newState.member as GuildMember
				);
			}
		});
	}

	async playIntroSound(
		voiceChannel: VoiceBasedChannel,
		playerSound: any,
		member: GuildMember
	) {
		// Play the intro sound
		await this.musicManager.player.play(voiceChannel, playerSound.url, {
			skip: true,
		});

		// Seek to the start of the sound
		if (playerSound.startAt) {
			const newQueue = this.musicManager.player.getQueue(member);
			newQueue?.seek(playerSound.startAt);
		}

		// Stop the sound after 'endedAt' seconds or 15 seconds
		setTimeout(
			async () => {
				const currentQueue = this.musicManager.player.getQueue(member);
				if (currentQueue) {
					await this.musicManager.player.stop(member);
					this.logger.info("Sound stopped after 15 seconds.");
				}
			},
			playerSound.endedAt
				? (playerSound.endedAt - playerSound.startAt!) * 1000
				: 15000
		);
	}

	async playBlankSound(voiceChannel: VoiceBasedChannel, member: GuildMember) {
		const playSound = async () => {
			this.logger.info("Playing blank sound...");
			await this.musicManager.player.play(
				voiceChannel,
				"https://www.youtube.com/watch?v=5vgjzF_vijQ",
				{
					member: member,
				}
			);
		};
		await playSound();
		setInterval(playSound, 60000);
	}

	async displaySoundboard() {
		this.logger.info("Displaying soundboard...");

		const button = new ButtonBuilder()
			.setLabel(`⏸/▶`)
			.setStyle(ButtonStyle.Primary)
			.setCustomId("play-brak");

		// Récupérer le canal textuel à partir de l'ID fourni
		const client = this.opts.client;
		client.on("ready", async () => {
			const channel = client.channels.cache.get(
				"1251323352883269673"
			) as TextBasedChannel;

			let currentEmbed: EmbedBuilder | undefined;
			const buttonRow1 =
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					button
				);
			await DiscordUtils.sendTextSoundboard(channel!, [buttonRow1]);
		});
	}

	async start() {
		this.logger.info("Soundboard service is working...");
		this.playSoundOnUserJoin();
		// this.displaySoundboard();
	}

	// @ButtonComponent({ id: "play-brak" })
	// async pauseResumeButton(interaction: ButtonInteraction): Promise<void> {
	// 	const voiceChannel = await DiscordUtils.joinIfVoiceChannel(interaction);
	// 	if (!voiceChannel) return;
	// 	if (!interaction.guildId) return;

	// 	const member: GuildMember =
	// 		DiscordUtils.getInteractionMember(interaction);

	// 	await this.musicManager.player.play(voiceChannel, songName, {
	// 		member: member,
	// 	});
	// }
}

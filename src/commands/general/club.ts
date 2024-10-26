import {
	CommandInteraction,
	EmbedBuilder,
} from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { Category } from "@discordx/utilities";
import { injectable } from "tsyringe";

import { DiscordUtils } from "../../utils/discord.utils.js";
import { ClubManager } from "../../services/club.service.js";

@Discord()
@Category("club")
@SlashGroup({
	name: "club",
	description: "Commands for getting infos about club",
})
@SlashGroup("club")
@injectable()
export class Club {
	constructor(
		private clubManager: ClubManager,
	) {
		this.clubManager = clubManager;
	}
	@Slash({
		name: "info",
		description: "Get club info",
	})
	public async getClubInfo(interaction: CommandInteraction): Promise<void> {
		try {
			if (!interaction) throw Error("No interaction found");

			const [club, clubStats] = await Promise.all([
				this.clubManager.getClubInfo(),
				this.clubManager.getClubStats(),
			]);

			const clubEmbed = new EmbedBuilder()
				.setTimestamp()
				.setAuthor({
					name: "~ Opta Ernesto 🤓",
				})
				.setTitle(`**${club.name.toUpperCase()}**`)
				.setDescription(
					`_Statistiques du club_\n
                    **🔥 Bilan général** : ${clubStats.wins}v  ‎ - ‎  ${clubStats.ties}n  ‎ - ‎  ${clubStats.losses}d \n
                    **⚽ Buts marqués** : ${clubStats.goals} \n
                    **🛡️ Buts encaissés** : ${clubStats.goalsAgainst} \n
                    **🏆 Matchs championnat** : ${clubStats.leagueAppearances} \n
                    **🎯 Matchs playoff** : ${clubStats.gamesPlayedPlayoff} \n
                    **📊 Total matchs** : ${clubStats.gamesPlayed} \n
                    `
				)
				.setColor("#ff810a");

			await DiscordUtils.replyOrFollowUp(interaction, {
				embeds: [clubEmbed],
			});
			console.log("getClubInfo");
		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err);
		}
	}
}

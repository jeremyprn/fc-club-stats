import {
	CommandInteraction,
} from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { Category } from "@discordx/utilities";
import { injectable } from "tsyringe";

import { DiscordUtils } from "../../utils/discord.utils.js";
import { SoundboardManager } from "../../services/soundboard.service.js";

@Discord()
@Category("soundboard")
@SlashGroup({
	name: "soundboard",
	description: "Commands for getting infos about soundboard",
})
@SlashGroup("soundboard")
@injectable()
export class Club {
	constructor(
		private soundboardManager: SoundboardManager,
	) {
        this.soundboardManager = soundboardManager;
	}
	@Slash({
		name: "display",
		description: "Display soundboard",
	})
	public async displaySoundboard(interaction: CommandInteraction): Promise<void> {
		try {
			if (!interaction) throw Error("No interaction found");

            console.log("displaySoundboard");

            return;

		} catch (err) {
			DiscordUtils.handleInteractionError(interaction, err);
		}
	}
}

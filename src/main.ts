import "reflect-metadata";
import "dotenv/config";

import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { autoInjectable, container, delay, inject } from "tsyringe";

import type {
	ClubOptions,
	MainOptions,
	MusicPlayerOptions,
} from "./utils/types.js";
import { globalConfig } from "./config.js";
import { CustomLogger } from "./services/logger.service.js";
import { ErrorHandler } from "./services/error-handler.service.js";
import { MusicManager } from "./services/music.service.js";
import { ClubManager } from "./services/club.service.js";
import { SoundboardManager } from "./services/soundboard.service.js";

@autoInjectable()
export class Main {
	public client: Client;

	constructor(
		public opts: MainOptions,
		private logger?: CustomLogger,
		private errorHandler?: ErrorHandler,
		@inject(delay(() => MusicManager)) private musicManager?: MusicManager,
		@inject(delay(() => ClubManager)) private clubManager?: ClubManager,
		@inject(delay(() => SoundboardManager)) private soundboardManager?: SoundboardManager
		
	) {
		this.opts = opts;
		this.client = new Client(this.opts.clientOptions);
		this.logger?.info(`Starting app...`);
	}

	public async bot(token: string) {
		try {
			await importx(
				`${dirname(import.meta.url)}/{events,commands,api}/**/*.{ts,js}`
			);

			await this.client.login(token);
			this.logger?.info("Bot has logged in...");
		} catch (err) {
			throw err;
		}
	}

	public async start() {
		DIService.engine =
			tsyringeDependencyRegistryEngine.setInjector(container);
		await this.errorHandler?.start();
		await this.musicManager?.start();
		await this.clubManager?.start();
		await this.soundboardManager?.start();

		const { token } = await this.checkEnvs();

		await this.bot(token);
	}

	private async checkEnvs() {
		// all
		if (!this.opts.config.token) {
			throw Error("No BOT_TOKEN specified!");
		}

		if (!this.opts.clientOptions.simpleCommand?.prefix) {
			this.logger?.warn(
				"No BOT_PREFIX specified! If you want to use legacy message commands you must provide it"
			);
		}

		if (!this.opts.clientOptions.botId) {
			this.logger?.warn("No BOT_ID specified!");
		}

		if (!this.opts.clubOptions.clubID) {
			this.logger?.warn("No CLUB_ID specified!");
		}

		if (!this.opts.clubOptions.clubPlatform) {
			this.logger?.warn("No CLUB_PLATFORM specified!");
		}

		// NODE ENV = 'development' or 'production'
		// development
		if (process.env.NODE_ENV === "development") {
			if (!this.opts.config.devGuildId) {
				throw Error("No DEV_GUILD_ID specified!");
			}
			if (!this.opts.config.ownerId) {
				throw Error("No OWNER_ID specified!");
			}
		}

		// production
		if (process.env.NODE_ENV === "production") {
			if (!this.opts.config.ownerId) {
				this.logger?.warn(
					'No OWNER_ID specified! If you want be able to use "owner" commands you must provide it'
				);
			}
		}

		this.logger?.info("Enviroment variables are checked...");

		return {
			nodeEnv: process.env.NODE_ENV,
			token: this.opts.config.token,
			devGuildId: this.opts.config.devGuildId,
			ownerId: this.opts.config.ownerId,
		};
	}
}

const fcClubStats = container
	.register<Main>("fc-club-stats", { useValue: new Main(globalConfig) })
	.resolve<Main>("fc-club-stats");

if (container.isRegistered("fc-club-stats")) {
	const fcClubStats = container.resolve<Main>("fc-club-stats");
	container.register<MusicPlayerOptions>("musicOpts", {
		useValue: {
			client: fcClubStats.client,
		},
		
	});
	container.register<MusicPlayerOptions>("soundboardOpts", {
		useValue: {
			client: fcClubStats.client,
		},
	});
	container.register<ClubOptions>("clubOpts", {
		useValue: {
			clubID: fcClubStats.opts.clubOptions.clubID,
			clubPlatform: fcClubStats.opts.clubOptions.clubPlatform,
		},
	});
}

fcClubStats.start();

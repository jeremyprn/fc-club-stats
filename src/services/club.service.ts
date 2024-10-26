import { inject, singleton } from "tsyringe";
import { CustomLogger } from "./logger.service.js";
import type { ClubOptions } from "../utils/types.js";
import { BaseError } from "../exceptions/base.exception.js";
import { ClubJson, ClubStatsJson } from "../utils/types.js";

@singleton()
export class ClubManager {
    public readonly club : any

	public constructor(
		@inject("clubOpts") public opts: ClubOptions,
		private logger: CustomLogger
	) {
        this.club = {
            id : this.opts.clubID,
            platform : this.opts.clubPlatform
        };
    }

	public async getClubInfo() {
		this.logger.info("Getting club info...");

		const response = await fetch(
			`https://proclubs.ea.com/api/fc/clubs/info?platform=${this.club.platform}&clubIds=${this.club.id}`
		);

		const baseErrorValues = {
			name: "HTTP Error",
			status: response.status,
		};

		if (response.status !== 200) {
			throw new BaseError({
				...baseErrorValues,
				message: response.statusText,
			});
		}

		if (response.status !== 200) {
			throw new BaseError({
				...baseErrorValues,
				message: `Provided club ID: ${this.club.id} is invalid or club is not found on platform: ${this.club.platform}`,
			});
		}

		const ClubJson: ClubJson = (await response.json()) as ClubJson;
		return ClubJson[this.club.id!];
	}

	public async getClubStats() {
		this.logger.info("Getting club stats...");

		const response = await fetch(
			`https://proclubs.ea.com/api/fc/clubs/overallStats?platform=${this.club.platform}&clubIds=${this.club.id}`
		);

		const baseErrorValues = {
			name: "HTTP Error",
			status: response.status,
		};

		if (response.status !== 200) {
			throw new BaseError({
				...baseErrorValues,
				message: response.statusText,
			});
		}

		if (response.status !== 200) {
			throw new BaseError({
				...baseErrorValues,
				message: `Provided club ID: ${this.club.id} is invalid or club is not found on platform: ${this.club.platform}`,
			});
		}

		const ClubStatsJson = (await response.json()) as any;
		return ClubStatsJson[0] as ClubStatsJson;
	}

    public async getPlayerStats() {
        this.logger.info("Getting player stats...");

        const response = await fetch(
            `https://proclubs.ea.com/api/fc/members/career/stats?platform=${this.club.platform}&clubId=${this.club.id}`
        );
    }

    public async listen() {
        this.logger.info("Club manager is listening to events...");
    }

	public async start() {
        this.logger.info("Club manager is working...");
	}
}

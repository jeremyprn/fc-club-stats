import { ActivityType } from "discord.js";
import { Client, ClientOptions } from "discordx";

export interface FeatureEnabledGuardOptions {
	enabled: boolean;
	feature: string;
	reason?: string;
}

export interface MainOptions {
	clientOptions: ClientOptions;
	config: {
		token: string | undefined;
		devGuildId?: string | undefined;
		ownerId?: string | undefined;
		activity: {
			name: string;
			type: ActivityType;
		};
	};
	clubOptions: ClubOptions;
}

export interface ClubOptions {
	clubID: string | undefined;
	clubPlatform: string | undefined;
}

export interface MusicPlayerOptions {
	client: Client;
}

export interface CommandDocs {
	name: string;
	description: string;
	category: string | undefined;
}

export interface ClubJson {
	[key: string]: {
		name: string;
		clubId: number;
		regionId: number;
		teamId: number;
		customKit: {
			stadName: string;
			kitId: string;
			seasonalTeamId: string;
			seasonalKitId: string;
			selectedKitType: string;
			customKitId: string;
			customAwayKitId: string;
			customThirdKitId: string;
			customKeeperKitId: string;
			kitColor1: string;
			kitColor2: string;
			kitColor3: string;
			kitColor4: string;
			kitAColor1: string;
			kitAColor2: string;
			kitAColor3: string;
			kitAColor4: string;
			kitThrdColor1: string;
			kitThrdColor2: string;
			kitThrdColor3: string;
			kitThrdColor4: string;
			dCustomKit: string;
			crestColor: string;
			crestAssetId: string;
		};
	};
}

export interface ClubStatsJson {
	clubId: string;
	bestDivision: string | null;
	bestFinishGroup: string | null;
	finishesInDivision1Group1: string;
	finishesInDivision2Group1: string;
	finishesInDivision3Group1: string;
	finishesInDivision4Group1: string;
	finishesInDivision5Group1: string;
	finishesInDivision6Group1: string;
	gamesPlayed: string;
	gamesPlayedPlayoff: string;
	goals: string;
	goalsAgainst: string;
	promotions: string;
	relegations: string;
	losses: string;
	ties: string;
	wins: string;
	lastMatch0: string;
	lastMatch1: string;
	lastMatch2: string;
	lastMatch3: string;
	lastMatch4: string;
	lastMatch5: string;
	lastMatch6: string;
	lastMatch7: string;
	lastMatch8: string;
	lastMatch9: string;
	lastOpponent0: string;
	lastOpponent1: string;
	lastOpponent2: string;
	lastOpponent3: string;
	lastOpponent4: string;
	lastOpponent5: string;
	lastOpponent6: string;
	lastOpponent7: string;
	lastOpponent8: string;
	lastOpponent9: string;
	wstreak: string;
	unbeatenstreak: string;
	skillRating: string;
	reputationtier: string;
	leagueAppearances: string;
}

export interface PlayerStatsJson {
	members: PlayerStats[];
}

export interface PlayerStats {
	name: string;
	proPos: string;
	gamesPlayed: string;
	goals: string;
	assists: string;
	manOfTheMatch: string;
	ratingAve: string;
	prevGoals: string;
	favoritePosition: string;
}

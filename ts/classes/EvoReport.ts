namespace bh {
	export class EvoReport {
		public wildCards: number;
		public minSot: number;
		public maxSot: number;
		public minGold: number;
		public maxGold: number;

		public constructor(card: PlayerBattleCard, evo: number) {
			this.wildCards = data.wildsForEvo(card.rarityType, evo);
			this.minSot = data.getMinSotNeeded(card.rarityType, evo);
			this.maxSot = data.getMaxSotNeeded(card.rarityType, evo);
			this.minGold = data.getMinGoldNeeded(card.rarityType, evo);
			// this.maxGold = data.getMaxGoldNeeded(card.playerCard, evo);
		}
	}
	export class EvoReportCard {
		public reports: EvoReport[] = [];
		public get next() { return this.reports[0]; }

		public get wildCards() { return this.reports.reduce((count, report) => count + report.wildCards, 0); }
		public get minSot() { return this.reports.reduce((count, report) => count + report.minSot, 0); }
		public get maxSot() { return this.reports.reduce((count, report) => count + report.maxSot, 0); }
		public get minGold() { return this.reports.reduce((count, report) => count + report.minGold, 0); }
		public get maxGold() { return this.reports.reduce((count, report) => count + report.maxGold, 0); }

		public constructor(card: PlayerBattleCard) {
			var evo = card.evo,
				max = data.getMaxEvo(card.rarityType);
			for (var i = evo; i < max; i++) {
				this.reports.push(new EvoReport(card, i));
			}
		}
	}
}
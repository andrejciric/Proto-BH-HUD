namespace bh {
	export class PlayerBattleCard {
		private _bc: IDataBattleCard;
		public playerCard: IPlayer.PlayerCard;

		private _rowChildren() {
			var html = "";
			if (!this.isUnknown) {
				var me = Player.me,
					activeRecipe = new Recipe(this, true);
				if (activeRecipe) {
					var goldNeeded = data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count,
						goldOwned = me.gold,
						goldColor = goldOwned < goldNeeded ? `bg-danger` : `bg-success`;
					html += `<div>${getImg20("misc", "Coin")} Gold <span class="badge pull-right ${goldColor}">${utils.formatNumber(goldOwned)} / ${utils.formatNumber(goldNeeded)}</span></div>`;
					activeRecipe.all.forEach(recipeItem => {
						var item = me.inventory.find(item => item.guid == recipeItem.item.guid);
						html += PlayerInventoryItem.toRowHtml(item, item.count, recipeItem.max * this.count);
					});
					var wcNeeded = data.getMaxWildCardsNeeded(this) * this.count,
						wcOwned = me.wildCards[this.rarityType] && me.wildCards[this.rarityType].count || 0,
						wcColor = wcOwned < wcNeeded ? `bg-danger` : `bg-success`;
					html += `<div>${getImg20("cardtypes", "WildCard")} ${RarityType[this.rarityType]} WC <span class="badge pull-right ${wcColor}">${utils.formatNumber(wcOwned)} / ${utils.formatNumber(wcNeeded)}</span></div>`;
				}
			}
			return html;
		}
		private _rowHtml(badgeValue?: number, badgeCss?: string) {
			var badgeHtml = badgeValue ? `<span class="badge pull-right ${badgeCss||""}">${badgeValue}</span>` : ``,
				children = typeof(badgeValue) == "number" || this.isMaxed ? `` : this._rowChildren(),
				content = renderExpandable(this.playerCard.id, `${this.fullHtml}${badgeHtml}`, children);
			return `<div -class="${ElementType[this.elementType]}" data-element-type="${this.elementType}" data-rarity-type="${this.rarityType}" data-klass-type="${this.klassType}" data-brag="${this.brag ? "Brag" : ""}">${content}</div>`;
		}

		public constructor(playerCard: IPlayer.PlayerCard) {
			this.playerCard = playerCard;
			this._bc = data.cards.battle.find(playerCard.configId);
			if (!this._bc) { utils.logMissingCard(this); }
		}

		// BattleCard pass-through
		public get brag() { return this._bc && this._bc.brag || false; }
		public get effects() { return this._bc && this._bc.effects || []; }
		public get elementType() { return this._bc ? this._bc.elementType : null; }
		public get klassType() { return this._bc ? this._bc.klassType : null; }
		public get lower() { return this.name.toLowerCase(); }
		public get mats() { return this._bc && this._bc.mats || null; }
		public get maxValues() { return this._bc && this._bc.maxValues || []; }
		public get minValues() { return this._bc && this._bc.minValues || [[]]; }
		public get perkBase() { return this._bc && this._bc.perkBase || 0; }
		public get perks() { return this._bc && this._bc.perks || []; }
		public get name() { return this._bc && this._bc.name || this.playerCard && this.playerCard.configId; }
		public get rarityType() { return this._bc ? this._bc.rarityType : null; }
		// public get target() { return this._bc && this._bc.targets[0] || null; }
		public get targets() { return this._bc && this._bc.targets || null; }
		public get tier() { return this._bc && this._bc.tier || null; }
		public get turns() { return this._bc && this._bc.turns || 0; }
		// public get type() { return this._bc && this._bc.types[0] || null; }
		public get types() { return this._bc && this._bc.types || null; }

		// PlayerCard pass-through
		public get evo() { return this.playerCard && this.playerCard.evolutionLevel || 0; }
		public get guid() { return this.playerCard && this.playerCard.configId; }
		public get level() { return this.playerCard && (this.playerCard.level + 1) || 0; }

		// New for PlayerBattleCard
		public get battleOrBragImage() { return getImg20("cardtypes", this.brag ? "Brag" : "BattleCard"); }
		public count = 1;
		public get evoLevel() { return `${this.evo}.${("0"+this.level).slice(-2)}`; }
		public get formattedValue() { return this.value ? utils.formatNumber(this.value) : ""; }
		public get fullHtml() {
			var count = this.count > 1 ? `x${this.count}` : ``,
				typeAndValue = this.value ? ` (${this.typeImage} ${this.formattedValue})` : ``,
				stars = utils.evoToStars(this.rarityType, this.evoLevel),
				name = this.name
					.replace(/Mischievous/, "Misch.")
					.replace(/Protection/, "Prot.")
					.replace(/-[\w-]+-/, "-...-");
			return `${this.battleOrBragImage} ${this.evoLevel} <small>${stars}</small> ${name} ${count} ${typeAndValue}`;
		}
		public get isActive() { return (this.evo > 0 || this.level > 1) && !this.isMaxed; }
		public get isMaxed() { return this.evoLevel == ["1.10", "2.20", "3.35", "4.50", "5.50"][this.rarityType]; }
		public get isUnknown() { return !this._bc; }
		public get maxWildCardsNeeded() { return data.getMaxWildCardsNeeded(this) * this.count; }
		public get nextWildCardsNeeded() { return data.getNextWildCardsNeeded(this) * this.count; }
		public get maxMaxSotNeeded() { return data.calcMaxSotNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxSotNeeded() { return data.getMaxSotNeeded(this.rarityType, this.evo) * this.count; }
		public get maxMaxGoldNeeded() { return data.calcMaxGoldNeeded(this.playerCard, this.evoLevel) * this.count; }
		public get nextMaxGoldNeeded() { return data.getMaxGoldNeeded(this.rarityType, this.evo) * this.count; }
		public get powerRating() { return PowerRating.ratePlayerCard(this.playerCard); }
		public get rarityEvoLevel() { return `${RarityType[this.rarityType][0]}.${this.evoLevel}`; }
		public get rowHtml() { return this._rowHtml();  }
		// public get goldHtml() { return this._rowHtml(this.maxMaxGoldNeeded);  }
		// public get wcHtml() { return this._rowHtml(this.maxWildCardsNeeded);  }
		public get scoutHtml() { return `${this.rarityEvoLevel} ${this.name} ${this.count > 1 ? `x${this.count}` : ``}`; }
		public get typeImage() { return this.types.length ? getImg12("cardtypes", this.types[0]) : ``; }
		public get value() { return this.playerCard && data.cards.battle.calculateValue(this.playerCard) || 0; };

		public matches(other: PlayerBattleCard): boolean { return this._bc && other._bc && this._bc.guid == other._bc.guid && this.evoLevel == other.evoLevel; }
		public matchesElement(element: GameElement) { return !element || this.elementType === ElementType[element]; }
		public matchesHero(hero: Hero) { return !hero || (this.matchesElement(<GameElement>ElementType[hero.elementType]) && this.klassType === hero.klassType); }
		public matchesRarity(rarity: GameRarity) { return !rarity || this.rarityType === RarityType[rarity]; }
		public toRowHtml(needed: number, owned: number) { return this._rowHtml(needed, owned < needed ? "bg-danger" : "bg-success"); }
	}
}
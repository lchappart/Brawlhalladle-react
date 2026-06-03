# Brawlhalladle

Jeu de devinettes inspiré de Wordle, basé sur les légendes **Brawlhalla** (API officielle).

## Équipe

- Perraud Maxence
- Boudegna Philippe
- Chappart Léo

## Modes

- **Classique** — légende du jour avec indices (stats, arme, surnom, citation)
- **Illimité** — parties classiques enchaînées
- **Brawldoku** — grille armes × légendes (quotidien et illimité)
- **Legend Stat** — devine une stat mystère

## Installation

```bash
npm install
cp .env.example .env
# Renseigner VITE_BRAWLHALLA_API_KEY dans .env
npm run dev
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run preview` — prévisualiser le build

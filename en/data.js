/*
=============================================================================
[File Guide] data.js (Database)
- Purpose: Database containing unit recipes, grades, and jewel data in English.
=============================================================================
*/

const JEWEL_RAW_DATA = [
    "Garnet", "Garnet", "ATK +200%, ATK SPD -30%", "ATK +250%, ATK SPD +30%",
    "Amethyst", "Amethyst", "Unit Accel +25%, Move SPD +100%", "Unit Accel +40%, Move SPD +150%",
    "Aquamarine", "Aquamarine", "Grants RXD Grade", "Grants SXD Grade if 2 equipped",
    "Diamond", "Diamond", "Prevents destruction on Limit Break", "Refunds 40 Gas & Resets",
    "Emerald", "Emerald", "Stage 5+ Total DMG +30%", "Stage 3+ Total DMG +45%",
    "Pearl", "Pearl", "Unit Enhancement +100%", "Unit Enhancement +200%",
    "Ruby", "Ruby", "ATK +150%, Move SPD -75%", "ATK +250%, Move SPD +100%",
    "Peridot", "Peridot", "Grants Detection (Range 8)", "Grants Detection (Range 12) + ATK 100%",
    "Sapphire", "Sapphire", "Accel x2 (60 min)", "Accel x2 for 90 min, then +33% Accel permanently",
    "Opal", "Opal", "Jewel Equip Slots +3", "Jewel Equip Slots +6, ATK +125%",
    "Topaz", "Topaz", "ATK SPD +15%, Max 2 equipped at once", "",
    "Turquoise", "Turquoise", "Raptor Jackpot chance x3", "",
    "Bloodstone", "Bloodstone", "Total DMG +20%, 9% chance to destroy unit when equipped", "",
    "Spinel", "Spinel", "Unit Accel +30% after 20 mins", "",
    "Fluorite", "Fluorite", "Total DMG -80% for 30 mins, then Total DMG +20%", "",
    "Lapis", "Lapis", "ATK +10% every 10 rounds (Max 20 times)", "",
    "Heliodor", "Heliodor", "ATK +200%, then ATK -10% every 20 rounds", "",
    "Jet", "Jet", "Total DMG +20%, Must choose 2 units (effect applied to one)", "",
    "Agate", "Agate", "Unit Accel +9%, Can equip 3 at once (5/15% destroy chance each)", "",
    "Olivine", "Olivine", "Final Enhance Chance x10, Enhance Effect x3", "",
    "Hyacinth", "Hyacinth", "ATK +150%, Range +3, Immobile", "",
    "Chrysoberyl", "Chrysoberyl", "All basic stats reach maximum", "",
    "Padparadscha", "Padparadscha", "Total DMG +33% after 108 mins", "",
    "Tanzanite", "Tanzanite", "Swap Enhance/Limit Break stats of 2 units", "",
    "Rubellite", "Rubellite", "Total DMG & Unit Accel +25%, 1% chance to destroy", ""
];

const RAW_UNIT_DATABASE = [
    // [ T-Bio ]
    ["Warmonger", "Magic", "T-Bio", "", ""],
    ["Sniper", "Magic", "T-Bio", "", ""],
    ["Hammer Securities", "Magic", "T-Bio", "", ""],
    ["Death Head", "Rare", "T-Bio", "Warmonger[1]+Hammer Securities[1]", "Warmonger[1],Hammer Securities[1]"],
    ["Spectre", "Rare", "T-Bio", "Sniper[1]+Hammer Securities[1]", "Sniper[1],Hammer Securities[1]"],
    ["Jim Raynor", "Epic", "T-Bio", "Death Head[1]+Spectre[1]", "Warmonger[1],Sniper[1],Hammer Securities[2]"],
    ["Stukov", "Unique", "T-Bio", "Jim Raynor[1]+Kerrigan[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],
    ["Nova", "Hell", "T-Bio", "Stukov[2]+Hybrid Dominator[1]", "Warmonger[3],Sniper[3],Hammer Securities[6],Primal Roach[2],Primal Lurker[2],Primal Hydralisk[4]"],
    ["Commando Raynor", "Legend", "T-Bio", "Nova[1]+General Warfield[1]", "Warmonger[4],Sniper[8],Hammer Securities[12],Dark Zealot[1],Dark High Templar[1],Dark Archon[2],Primal Roach[3],Primal Lurker[3],Primal Hydralisk[6]"],
    ["Tosh", "Hidden", "T-Bio", "Spectre[2]+Hammer Securities[3]", "Sniper[2],Hammer Securities[5]"],
    ["Miner", "Hidden", "T-Bio", "Helper(500kills+)[1]+Tauren Toilet[1]", "Warmonger[4],Dark Immortal[4],Helper[1]"],
    ["Swan", "Hidden", "T-Bio", "Dominion Marauder[2]+Raven[1]+Auto Turret[1]", "Warmonger[8],Hammer Securities[6],Raven[1],Auto Turret[5]"],
    ["Miles Blaze Lewis", "Hidden", "T-Bio", "Prometheus Company(X,90%+)+Dominion Marauder[2]+Crimson Archon(10kills+)[1]", "Dark Archon[4],Warmonger[8],Sniper[4],Hammer Securities[10],Spartan Company[4]"],
    ["Murloc Marine", "Hidden", "T-Bio", "Death Head[3]+Ravasaur(Burrow)[2]", "Warmonger[3],Hammer Securities[3],Primal Roach[2],Primal Hydralisk[2]"],
    ["General Warfield", "Hidden", "T-Bio", "Stukov[1]+Spectre[4]", "Warmonger[1],Sniper[5],Hammer Securities[6],Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],
    ["Stetman", "Hidden", "T-Bio", "Murloc Marine[1]+Tauren Toilet[1]", "Warmonger[7],Hammer Securities[3],Dark Immortal[4],Primal Roach[2],Primal Hydralisk[2]"],
    ["Dominion Marauder", "Hidden", "T-Bio", "Tauren Space Marine[2]+Hammer Securities[3]", "Warmonger[4],Hammer Securities[3]"],
    ["Tauren Space Marine", "Hidden", "T-Bio", "Warmonger(SS+)[2]", "Warmonger[2]"],
    ["Tauren Toilet", "Hidden", "T-Bio", "Tauren Space Marine[2]+Annihilator[1]", "Warmonger[4],Dark Immortal[4]"],
    ["Tychus Findlay", "Hidden", "T-Bio", "Swan(X+)[1]+Stetman(X+)[1]", "Warmonger[15],Hammer Securities[9],Dark Immortal[4],Primal Roach[2],Primal Hydralisk[2],Auto Turret[5]"],
    ["Prometheus Company", "Hidden", "T-Bio", "Tosh(SSS+)[2]+Spartan Company[4]", "Sniper[4],Hammer Securities[10],Spartan Company[4]"],
    ["Special Ops Nova", "Super Hidden", "T-Bio", "Commando Raynor(SXD,300%+,300kills+)[1]+Tychus Findlay(SXD,300%+,300kills+)[1]+Omegalisk(X+,150%+)[2]", "Warmonger[19],Sniper[8],Hammer Securities[21],Dark Zealot[5],Dark High Templar[5],Dark Archon[10],Primal Roach[15],Primal Lurker[13],Primal Hydralisk[28],Auto Turret[5]"],

    // [ T-Mech ]
    ["Spartan Company", "Magic", "T-Mech", "", ""],
    ["Diamondback", "Magic", "T-Mech", "", ""],
    ["Siege Breaker", "Magic", "T-Mech", "", ""],
    ["Blackhammer", "Rare", "T-Mech", "Spartan Company[1]+Siege Breaker[1]", "Spartan Company[1],Siege Breaker[1]"],
    ["ARES", "Rare", "T-Mech", "Diamondback[1]+Siege Breaker[1]", "Diamondback[1],Siege Breaker[1]"],
    ["Archangel", "Epic", "T-Mech", "Blackhammer[1]+ARES[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2]"],
    ["Odin", "Unique", "T-Mech", "Archangel[2]", "Diamondback[2],Spartan Company[2],Siege Breaker[4]"],
    ["Hyperion", "Hell", "T-Mech", "Odin[2]+Void Ray[1]", "Diamondback[5],Spartan Company[5],Siege Breaker[10],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Gorgon Battlecruiser", "Legend", "T-Mech", "Hyperion[1]+Science Vessel[1]", "Diamondback[11],Spartan Company[7],Siege Breaker[18],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Science Vessel", "Hidden", "T-Mech", "Odin[1]+ARES[4]", "Diamondback[6],Spartan Company[2],Siege Breaker[8]"],
    ["Raven", "Hidden", "T-Mech", "Widow Mine[2]+WarHound[3]+Garbage[1]", "Vulture-MinePlant[24],Diamondback[3],Spartan Company[6],Dark Zealot[2]"],
    ["Arch Fighter", "Hidden", "T-Mech", "Archangel(SSS+)[4]", "Diamondback[4],Spartan Company[4],Siege Breaker[8]"],
    ["Drakken Laser Drill", "Hidden", "T-Mech", "Siege Breaker[3]+ARES[2]", "Diamondback[2],Siege Breaker[5]"],
    ["Widow Mine", "Hidden", "T-Mech", "Spider Mine (Planted by Vulture)[12]", "Vulture-MinePlant[12]"],
    ["Pride of Augustgrad", "Hidden", "T-Mech", "Gorgon Battlecruiser(0 Upgrades Left,1000kills)[1]+Blackhammer(SSS)[4]", "Diamondback[11],Spartan Company[11],Siege Breaker[22],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Zeus Lander", "Hidden", "T-Mech", "Pirate Capital Ship(Lv11)[1]+Hercules Bomber(Lv11)[1]+Massive Disaster (Skill Used)[1]", "Spartan Company[21],Diamondback[22],Siege Breaker[34],Dark Zealot[2],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2],Vulture-MinePlant[24],Massive Disaster[1]"],
    ["Sky Fury", "Hidden", "T-Mech", "Arch Fighter(Limit Break 3+,500kills+)[1]+Wrathwalker(X+)[1]", "Diamondback[4],Spartan Company[4],Siege Breaker[8],Dark Sentry[2],Dark Stalker[2],Dark Immortal[4]"],
    ["Garbage", "Hidden", "T-Mech", "Diamondback[3]+Dark Zealot[2]", "Diamondback[3],Dark Zealot[2]"],
    ["WarHound", "Hidden", "T-Mech", "Spartan Company(SS+)[2]", "Spartan Company[2]"],
    ["Hercules Bomber", "Hidden", "T-Mech", "Raven(X+)[1]+Science Vessel(X+)[1]", "Vulture-MinePlant[24],Diamondback[9],Spartan Company[8],Siege Breaker[8],Dark Zealot[2]"],
    ["NUKE SYSTEM", "Hidden", "T-Mech", "Tauren Toilet[1]+Garbage[2]+Crimson Archon[1]", "Warmonger[4],Diamondback[6],Dark Zealot[4],Dark Archon[4],Dark Immortal[4]"],
    ["Pirate Capital Ship", "Hidden", "T-Mech", "Arch Fighter[2]+Hyperion(X+,90%+)[1]", "Diamondback[13],Spartan Company[13],Siege Breaker[26],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Terratron", "Super Hidden", "T-Mech", "Gorgon Battlecruiser(SXD,300%+,300kills+)[1]+Pirate Capital Ship(SXD,300%+,300kills+)[1]+Swan(XD+)[2]", "Warmonger[16],Hammer Securities[12],Diamondback[24],Spartan Company[20],Siege Breaker[44],Dark Sentry[2],Dark Stalker[2],Dark Immortal[4],Auto Turret[10]"],

    // [ P-Bio ]
    ["Dark Zealot", "Magic", "P-Bio", "", ""],
    ["Dark High Templar", "Magic", "P-Bio", "", ""],
    ["Dark Archon", "Magic", "P-Bio", "", ""],
    ["Stone Zealot", "Rare", "P-Bio", "Dark Zealot[1]+Dark Archon[1]", "Dark Zealot[1],Dark Archon[1]"],
    ["Purifier Adept", "Rare", "P-Bio", "Dark High Templar[1]+Dark Archon[1]", "Dark High Templar[1],Dark Archon[1]"],
    ["Zeratul", "Epic", "P-Bio", "Stone Zealot[1]+Purifier Adept[1]", "Dark Zealot[1],Dark High Templar[1],Dark Archon[2]"],
    ["Hybrid Dominator", "Unique", "P-Bio", "Zeratul[1]+Jim Raynor[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[1],Dark High Templar[1],Dark Archon[2]"],
    ["Vorazun", "Hell", "P-Bio", "Hybrid Dominator[2]+Hybrid Reaver[1]", "Warmonger[3],Sniper[3],Hammer Securities[6],Dark Zealot[3],Dark High Templar[3],Dark Archon[6]"],
    ["Artanis", "Legend", "P-Bio", "Vorazun[1]+Tassadar[1]", "Warmonger[3],Sniper[3],Hammer Securities[6],Dark Zealot[4],Dark High Templar[8],Dark Archon[12],Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],
    ["Lasarra", "Hidden", "P-Bio", "Crimson Archon[1]+Stone Zealot[3]", "Dark Zealot[3],Dark Archon[7]"],
    ["Malash", "Hidden", "P-Bio", "Alarak(XD+,200%+)[1]+Drakken Laser Drill (Kill Alarak)[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Diamondback[2],Siege Breaker[5],Dark Zealot[9],Dark High Templar[13],Dark Archon[6]"],
    ["Centurion", "Hidden", "P-Bio", "Dark Templar(SSS)[2]", "Dark Zealot[2],Dark High Templar[2]"],
    ["Crimson Archon", "Hidden", "P-Bio", "Dark Archon[4]", "Dark Archon[4]"],
    ["Ascendant", "Hidden", "P-Bio", "Sentinel[2]+Stone Zealot[2]", "Dark Zealot[6],Dark High Templar[4],Dark Archon[2]"],
    ["Alarak", "Hidden", "P-Bio", "Blood Hunter[2]+Hybrid Dominator(X+)[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[9],Dark High Templar[13],Dark Archon[6]"],
    ["Dark Templar", "Hidden", "P-Bio", "Dark High Templar(SS+)[1]+Dark Zealot(SS+)[1]", "Dark High Templar[1],Dark Zealot[1]"],
    ["Karax", "Hidden", "P-Bio", "Ascendant[2]+Hybrid Dominator(X+)[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[13],Dark High Templar[9],Dark Archon[6]"],
    ["Talandar", "Hidden", "P-Bio", "Karax(X+,90%+)[1]+Alarak(X+,90%+)[1]", "Warmonger[2],Sniper[2],Hammer Securities[4],Dark Zealot[22],Dark High Templar[22],Dark Archon[12]"],
    ["Tassadar", "Hidden", "P-Bio", "Hybrid Dominator[1]+Purifier Adept[4]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[1],Dark High Templar[5],Dark Archon[6]"],
    ["Sentinel", "Hidden", "P-Bio", "Dark Templar(SS)[2]", "Dark Zealot[2],Dark High Templar[2]"],
    ["Blood Hunter", "Hidden", "P-Bio", "Centurion[2]+Purifier Adept[2]", "Dark Zealot[4],Dark High Templar[6],Dark Archon[2]"],
    ["Amon", "Super Hidden", "P-Bio", "Talandar(SXD,300%+,300kills+)[1]+Artanis(SXD,300%+,300kills+)[1]+Tal'Darim Tempest(XD+)[2]", "Warmonger[5],Sniper[5],Hammer Securities[10],Dark Zealot[26],Dark High Templar[30],Dark Archon[40],Dark Sentry[8],Dark Immortal[20],Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],

    // [ P-Mech ]
    ["Dark Sentry", "Magic", "P-Mech", "", ""],
    ["Dark Stalker", "Magic", "P-Mech", "", ""],
    ["Dark Immortal", "Magic", "P-Mech", "", ""],
    ["Instigator", "Rare", "P-Mech", "Dark Stalker[1]+Dark Immortal[1]", "Dark Stalker[1],Dark Immortal[1]"],
    ["Havoc", "Rare", "P-Mech", "Dark Sentry[1]+Dark Immortal[1]", "Dark Sentry[1],Dark Immortal[1]"],
    ["Colossus", "Epic", "P-Mech", "Havoc[1]+Instigator[1]", "Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Void Ray", "Unique", "P-Mech", "Archangel[1]+Colossus[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Sentry[1],Dark Stalker[1],Dark Immortal[2]"],
    ["Wrathwalker", "Unique", "P-Mech", "Colossus[2]", "Dark Sentry[2],Dark Stalker[2],Dark Immortal[4]"],
    ["Void Seeker", "Hell", "P-Mech", "Wrathwalker[2]+Void Ray[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Sentry[5],Dark Stalker[5],Dark Immortal[10]"],
    ["Selendis", "Legend", "P-Mech", "Void Seeker[1]+Purifier Colossus[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Sentry[7],Dark Stalker[11],Dark Immortal[18]"],
    ["Energizer", "Hidden", "P-Mech", "Dark Sentry(SS+)[2]", "Dark Sentry[2]"],
    ["Annihilator", "Hidden", "P-Mech", "Dark Immortal[4]", "Dark Immortal[4]"],
    ["Mothership Core", "Hidden", "P-Mech", "Warp Prism[1]+Void Ray[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Sentry[3],Dark Stalker[1],Dark Immortal[6]"],
    ["Mohandar", "Hidden", "P-Mech", "Purifier Colossus(X+)[1]+Void Ray[4]", "Diamondback[4],Spartan Company[4],Siege Breaker[8],Dark Sentry[6],Dark Stalker[10],Dark Immortal[16]"],
    ["MotherShip", "Hidden", "P-Mech", "Wrathwalker[2]+Mothership Core[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Sentry[7],Dark Stalker[5],Dark Immortal[14]"],
    ["Purifier Warden", "Hidden", "P-Mech", "MotherShip(Lv11,0 Upgrades Left,Skill Used)[3]", "Diamondback[3],Spartan Company[3],Siege Breaker[6],Dark Sentry[21],Dark Stalker[15],Dark Immortal[42]"],
    ["Purifier Colossus", "Hidden", "P-Mech", "Wrathwalker[1]+Instigator[4]", "Dark Sentry[2],Dark Stalker[6],Dark Immortal[8]"],
    ["Warp Prism", "Hidden", "P-Mech", "Annihilator[1]+Energizer[1]", "Dark Sentry[2],Dark Immortal[4]"],
    ["Khaydarin Monolith", "Hidden", "P-Mech", "Instigator(SSS+)[9]", "Dark Stalker[9],Dark Immortal[9]"],
    ["Tal'Darim Mothership", "Hidden", "P-Mech", "MotherShip(X+,90%+)[1]+Tal'Darim Tempest(X+)[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Archon[8],Dark Sentry[11],Dark Stalker[5],Dark Immortal[24]"],
    ["Tal'Darim Tempest", "Hidden", "P-Mech", "Tempest[2]+Crimson Archon[2]", "Dark Archon[8],Dark Sentry[4],Dark Immortal[10]"],
    ["Tempest", "Hidden", "P-Mech", "Havoc[2]+Dark Immortal[3]", "Dark Sentry[2],Dark Immortal[5]"],
    ["Skylord", "Hidden", "P-Mech", "Selendis(X+,90%+)[1]+Tal'Darim Tempest(X+)[1]", "Diamondback[1],Spartan Company[1],Siege Breaker[2],Dark Archon[8],Dark Sentry[11],Dark Stalker[11],Dark Immortal[28]"],
    ["Spear of Adun", "Super Hidden", "P-Mech", "Selendis(SXD,300%+,300kills+)[1]+Tal'Darim Mothership(SXD,300%+,300kills+)[1]+Karax(X+,150%+)[2]", "Warmonger[2],Sniper[2],Hammer Securities[4],Diamondback[2],Spartan Company[2],Siege Breaker[4],Dark Zealot[26],Dark High Templar[18],Dark Archon[20],Dark Sentry[18],Dark Stalker[16],Dark Immortal[42]"],

    // [ Zerg/Neutral ]
    ["Primal Roach", "Magic", "Zerg/Neutral", "", ""],
    ["Primal Lurker", "Magic", "Zerg/Neutral", "", ""],
    ["Primal Hydralisk", "Magic", "Zerg/Neutral", "", ""],
    ["Brutalisk", "Rare", "Zerg/Neutral", "Primal Lurker[1]+Primal Hydralisk[1]", "Primal Lurker[1],Primal Hydralisk[1]"],
    ["Ravasaur", "Rare", "Zerg/Neutral", "Primal Roach[1]+Primal Hydralisk[1]", "Primal Roach[1],Primal Hydralisk[1]"],
    ["Kerrigan", "Epic", "Zerg/Neutral", "Brutalisk[1]+Ravasaur[1]", "Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],
    ["Hybrid Reaver", "Unique", "Zerg/Neutral", "Kerrigan[1]+Zeratul[1]", "Dark Zealot[1],Dark High Templar[1],Dark Archon[2],Primal Roach[1],Primal Lurker[1],Primal Hydralisk[2]"],
    ["Leviathan", "Hell", "Zerg/Neutral", "Hybrid Reaver[2]+Stukov[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[2],Dark High Templar[2],Dark Archon[4],Primal Roach[3],Primal Lurker[3],Primal Hydralisk[6]"],
    ["Atosilope", "Hell", "Zerg/Neutral", "Yeti(F)[2]", "Yeti(F)[2]"],
    ["Tastelope", "Hell", "Zerg/Neutral", "Yeti(M)[2]", "Yeti(M)[2]"],
    ["K5 Kerrigan", "Legend", "Zerg/Neutral", "Leviathan[1]+Kraith[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[3],Dark High Templar[3],Dark Archon[6],Primal Roach[4],Primal Lurker[8],Primal Hydralisk[12]"],
    ["Vile Roach", "Hidden", "Zerg/Neutral", "Primal Roach[3]+Dark Stalker[2]", "Primal Roach[3],Dark Stalker[2]"],
    ["Swarm Host", "Hidden", "Zerg/Neutral", "Primal Lurker(SS+)[2]", "Primal Lurker[2]"],
    ["Dehaka", "Hidden", "Zerg/Neutral", "Dehaka's Cocoon[1]+Queen(SXD)[1]", "Warmonger[7],Hammer Securities[3],Dark Immortal[4],Primal Roach[3],Primal Lurker[4],Primal Hydralisk[3]"],
    ["Dehaka's Cocoon", "Hidden", "Zerg/Neutral", "Dehaka's Right Arm[1]+Stetman(SXD)[1]", "Warmonger[7],Hammer Securities[3],Dark Immortal[4],Primal Roach[2],Primal Hydralisk[2]"],
    ["Dehaka's Right Arm", "Hidden", "Zerg/Neutral", "Zerg Up 20+ before Round 100 [(Other Race Up 0)[1], Reversal Lottery 10 times[1], Life Lottery 3 times-Summon[1]]", "None"],
    ["Nydus Destroyer", "Hidden", "Zerg/Neutral", "Atosilope(X+,200%+,Lv7)[4]", "Yeti(F)[8]"],
    ["Brood Lord", "Hidden", "Zerg/Neutral", "Queen[2]+Kraith[1]", "Dark Zealot[1],Dark High Templar[1],Dark Archon[2],Primal Roach[3],Primal Lurker[13],Primal Hydralisk[8]"],
    ["Viper", "Hidden", "Zerg/Neutral", "Queen[1]+Drone(SS+)[3]", "Primal Roach[2],Primal Lurker[4],Primal Hydralisk[3]"],
    ["Guardian", "Hidden", "Zerg/Neutral", "Viper(X+)[1]+Swarm Host(Burrow)[2]", "Primal Roach[2],Primal Lurker[8],Primal Hydralisk[3]"],
    ["Apocalisk", "Hidden", "Zerg/Neutral", "Omegalisk(X+,90%+,100kills+)[2]+Odin(10kills+)[1]", "Spartan Company[2],Diamondback[2],Siege Breaker[4],Dark Zealot[4],Dark High Templar[4],Dark Archon[8],Primal Roach[10],Primal Lurker[10],Primal Hydralisk[20]"],
    ["Aleksander", "Hidden", "Zerg/Neutral", "Devourer[1]+Guardian[1]+Hyperion(Fully Upgraded)[1]+Stukov(SXD)[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Spartan Company[5],Diamondback[5],Siege Breaker[10],Dark Sentry[1],Dark Stalker[3],Dark Immortal[2],Primal Roach[8],Primal Lurker[13],Primal Hydralisk[8]"],
    ["Omegalisk", "Hidden", "Zerg/Neutral", "Hybrid Reaver[2]+Kerrigan[3]", "Dark Zealot[2],Dark High Templar[2],Dark Archon[4],Primal Roach[5],Primal Lurker[5],Primal Hydralisk[10]"],
    ["Drone", "Hidden", "Zerg/Neutral", "Primal Roach(Burrow)[1]+Primal Hydralisk(Burrow)[2]", "Primal Roach[1],Primal Hydralisk[2]"],
    ["Kraith", "Hidden", "Zerg/Neutral", "Hybrid Reaver[1]+Brutalisk[4]", "Dark Zealot[1],Dark High Templar[1],Dark Archon[2],Primal Roach[1],Primal Lurker[5],Primal Hydralisk[6]"],
    ["Torrasque", "Hidden", "Zerg/Neutral", "Omegalisk(X+,90%+)[1]+Vile Roach[2]", "Dark Zealot[2],Dark High Templar[2],Dark Archon[4],Dark Stalker[4],Primal Roach[11],Primal Lurker[5],Primal Hydralisk[10]"],
    ["Devourer", "Hidden", "Zerg/Neutral", "Viper[1]+Vile Roach(X+)[1]", "Dark Stalker[2],Primal Roach[5],Primal Lurker[4],Primal Hydralisk[3]"],
    ["Spore Cannon", "Hidden", "Zerg/Neutral", "Drone(Mini Sunken Skill Used,Hidden Shrine Placed,SSS+)[12]", "Primal Roach[8],Primal Hydralisk[4]"],
    ["Queen", "Hidden", "Zerg/Neutral", "Swarm Host[2]+Ravasaur[1]", "Primal Roach[1],Primal Lurker[4],Primal Hydralisk[1]"],
    ["Hybridlope", "Hidden", "Zerg/Neutral", "Atosilope(Lv7)[1]+Tastelope(Lv7)[1]", "Yeti(F)[2],Yeti(M)[2]"],
    ["Xel'Naga Kerrigan", "Super Hidden", "Zerg/Neutral", "K5 Kerrigan(SXD,300%+,300kills+)[1]+Torrasque(SXD,300%+,300kills+)[1]+Raven(X+,150%+)[2]", "Vulture-MinePlant[48],Warmonger[1],Sniper[1],Hammer Securities[2],Diamondback[6],Spartan Company[12],Dark Zealot[9],Dark High Templar[5],Dark Archon[10],Dark Stalker[4],Primal Roach[15],Primal Lurker[13],Primal Hydralisk[22]"],
    ["Overmind", "Super Hidden", "Zerg/Neutral", "Hybridlope(SXD+,300%+,Lv7)[2]+Tassadar(XD+)[1]+Kraith(XD+)[1]+Science Vessel(XD+)[1]+Purifier Colossus(XD+)[1]+General Warfield(XD+)[1]", "Warmonger[2],Sniper[6],Hammer Securities[8],Diamondback[6],Spartan Company[2],Siege Breaker[8],Dark Zealot[2],Dark High Templar[6],Dark Archon[8],Dark Sentry[2],Dark Stalker[6],Dark Immortal[8],Primal Roach[2],Primal Lurker[6],Primal Hydralisk[8],Yeti(F)[4],Yeti(M)[4]"],

    // [ Hybrid ]
    ["Void Thrasher", "Hidden", "Hybrid", "Hybrid Nemesis(XD+,200%+,Lv11)[1]+Destroyer(XD+,200%+,Lv11)[1]", "Warmonger[2],Sniper[2],Hammer Securities[4],Dark Zealot[3],Dark High Templar[11],Dark Archon[14],Primal Roach[3],Primal Lurker[13],Primal Hydralisk[8]"],
    ["Sarah Kerrigan", "Hidden", "Hybrid", "Nova(X+,90%+)[1]+K5 Kerrigan(X+,90%+)[1]", "Warmonger[4],Sniper[4],Hammer Securities[8],Dark Zealot[4],Dark High Templar[4],Dark Archon[8],Primal Roach[6],Primal Lurker[10],Primal Hydralisk[16]"],
    ["Amon's Xel'Naga Construct", "Hidden", "Hybrid", "Xel'Naga Construct(RXD)[1]+Destroyer(XD+)[1]", "Vulture-MinePlant[8],Warmonger[1],Sniper[1],Hammer Securities[2],Diamondback[17],Spartan Company[16],Siege Breaker[24],Dark Zealot[15],Dark High Templar[9],Dark Archon[6],Dark Sentry[12],Dark Stalker[20],Dark Immortal[32]"],
    ["Artifact", "Hidden", "Hybrid", "Artifact Fragment[5]", "Artifact Fragment[5]"],
    ["Xel'Naga Construct", "Hidden", "Hybrid", "Karax(XD+)[1]+Mohandar(X+)[1]", "Warmonger[1],Sniper[1],Hammer Securities[2],Diamondback[4],Spartan Company[4],Siege Breaker[8],Dark Zealot[13],Dark High Templar[9],Dark Archon[6],Dark Sentry[6],Dark Stalker[10],Dark Immortal[16]"],
    ["Tyrannozor", "Hidden", "Hybrid", "Torrasque(XD+)[1]+Tastelope(X+)[2]", "Dark Zealot[2],Dark High Templar[2],Dark Archon[4],Dark Stalker[4],Primal Roach[11],Primal Lurker[5],Primal Hydralisk[10],Yeti(M)[4]"],
    ["Destroyer", "Hidden", "Hybrid", "Mohandar(X+,90%+)[1]+Hercules Bomber(X+,90%+)[1]", "Vulture-MinePlant[24],Diamondback[13],Spartan Company[12],Siege Breaker[16],Dark Zealot[2],Dark Sentry[6],Dark Stalker[10],Dark Immortal[14]"],
    ["Hybrid Nemesis", "Hidden", "Hybrid", "Brood Lord(X+,90%+)[1]+Tassadar(X+)[2]", "Warmonger[1],Sniper[1],Hammer Securities[2],Dark Zealot[2],Dark High Templar[6],Dark Archon[8],Primal Roach[3],Primal Lurker[13],Primal Hydralisk[8]"],
    ["Hybrid Mobius", "Hidden", "Hybrid", "Pirate Capital Ship(X+,Limit Break 3+)[1]+Tal'Darim Mothership(X+,Limit Break 3+)[1]+God of Time (Skill Used)[1]", "Diamondback[14],Spartan Company[14],Siege Breaker[28],Dark Archon[8],Dark Sentry[12],Dark Stalker[6],Dark Immortal[26],God of Time[1]"],
    ["Hybrid Behemoth", "Hidden", "Hybrid", "Alarak(X+,90%+)[1]+General Warfield(X+)[2]", "Warmonger[3],Sniper[11],Hammer Securities[14],Dark High Templar[13],Dark Zealot[9],Dark Archon[6],Primal Roach[2],Primal Lurker[2],Primal Hydralisk[4]"],
    ["The Last Dominator", "Hidden", "Hybrid", "Sarah Kerrigan(XD+,200%+,Lv11)[1]+Hybrid Behemoth(XD+,200%+,Lv11)[1]", "Warmonger[7],Sniper[15],Hammer Securities[22],Dark Zealot[13],Dark High Templar[17],Dark Archon[14],Primal Roach[8],Primal Lurker[12],Primal Hydralisk[20]"],
    ["Narud", "Super Hidden", "Hybrid", "Void Thrasher(SXD,300%+,300~999kills)[2]+Sarah Kerrigan(X+,150%+)[2]", "Warmonger[12],Sniper[12],Hammer Securities[24],Diamondback[26],Spartan Company[24],Siege Breaker[32],Dark Zealot[18],Dark High Templar[30],Dark Archon[44],Dark Sentry[12],Dark Stalker[20],Dark Immortal[32],Primal Roach[18],Primal Lurker[46],Primal Hydralisk[48],Vulture-MinePlant[48]"]
];

/* -------------------------------------------------------------
※ Settings for Calculator engine logic (English Adapted)
-------------------------------------------------------------
*/
const gradeColorsRaw = { "Magic":"var(--grade-magic)", "Rare":"var(--grade-rare)", "Epic":"var(--grade-epic)", "Unique":"var(--grade-unique)", "Hell":"var(--grade-hell)", "Legend":"var(--grade-legend)", "Hidden":"var(--grade-hidden)", "Super Hidden":"var(--grade-super)" };
const GRADE_ORDER = ["Magic","Rare","Epic","Unique","Hell","Legend","Hidden","Super Hidden"];
const IGNORE_PARSE_RECIPES = ["Undiscovered","None","","Zerg Up 20+ before Round 100 [(Other Race Up 0)[1], Reversal Lottery 10 times[1], Life Lottery 3 times-Summon[1]]"];
const dashboardAtoms = [
    {name:"Warmonger"},{name:"Spartan Company"},{name:"Dark Zealot"},{name:"Dark Sentry"},{name:"Primal Roach"},
    {name:"Sniper"},{name:"Diamondback"},{name:"Dark High Templar"},{name:"Dark Stalker"},{name:"Primal Lurker"},
    {name:"Hammer Securities"},{name:"Siege Breaker"},{name:"Dark Archon"},{name:"Dark Immortal"},{name:"Primal Hydralisk"},
    {name:"Widow Mine"},{name:"Auto Turret"},{name:"Yeti(F)"},{name:"Yeti(M)"},{name:"GOT/Massive"}
];
const specialKeywordMap = [
    {keys:["Auto Turret"],atom:"Auto Turret"},
    {keys:["Burrow"],atom:"Burrow"},
    {keys:["Mine","Vulture"],atom:"Widow Mine",divider:12},
    {keys:["Yeti(F)","YetiF"],atom:"Yeti(F)"},
    {keys:["Yeti(M)","YetiM"],atom:"Yeti(M)"},
    {keys:["Massive","Disaster"],atom:"GOT/Massive",subKey:"Massive"},
    {keys:["God of Time","GOT"],atom:"GOT/Massive",subKey:"GOT"}
];
const TAB_CATEGORIES = [
    {key:"T-Bio",label:"T-Bio"},{key:"T-Mech",label:"T-Mech"},{key:"P-Bio",label:"P-Bio"},
    {key:"P-Mech",label:"P-Mech"},{key:"Zerg/Neutral",label:"Zerg/Neutral"},{key:"Hybrid",label:"Hybrid"}
];
const GRADE_SHORT = { Magic:'M', Rare:'R', Epic:'E', Unique:'U', Hell:'HE', Legend:'L', Hidden:'H', 'Super Hidden':'SH' };
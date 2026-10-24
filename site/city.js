// The city — every fact that makes this calendar Seattle's rather than
// another town's, in one place. The browser (filter.js, app.js) and the
// build (scripts/*.mjs) both read it; nothing else names a venue or a team.
// Built 2026-10-15 from the Lower Queen Anne site's file (its 25 rooms and
// their sources kept as they are) plus Pioneer Square's rooms, the rest of
// the city's Ticketmaster venues, four rooms with calendars of their own
// (Jazz Alley, Meany Center, Town Hall, the zoo) and the big sheds a drive
// away. A sister site is this file, its own index.html and styles.css, and
// its own source scrapers — see README "Another city".
//
// Loaded before filter.js (a plain script, so the river site and the tests
// can share it): it sets globalThis.LQACity.
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right (Steve, 2026-09-10; Sounders were not
  // on his list and sit last rather than being dropped). Per team:
  //   re        the title match (Storm and Reign need the fuller name —
  //             bare "storm"/"reign" shows up in concert titles)
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   name/abbr the club's full name and scoreboard abbreviation as its
  //             league lists them, for a first paint before teams.json
  //             arrives (the feed's own values take precedence)
  //   espn      the club on ESPN's scoreboard, for the live game block
  //             (the PWHL feed refuses browser requests, so the Torrent
  //             have none)
  //   season    where the build reads the season schedule (schedules.mjs:
  //             mlb, nhl, espn, pwhl, seawolves); form the record/standing
  //   club      the club's name on Ticketmaster, for the away-game
  //             sold-out checks; news the outlets beside ESPN; wiki the
  //             season page; youtube the club's and league's channels;
  //             opens when the season usually starts; division the
  //             rivals a record is kept against
  // Nothing here assumes a club is Seattle's: the Huskies are Washington
  // (WASH), the Seawolves play in Tukwila.
  var ST = function (path) { return ['https://www.seattletimes.com/sports/' + path + '/feed/', 'Seattle Times']; };
  var TEAMS = [
    { slug: 'seahawks', label: 'Seahawks', re: /seahawks/i, sport: 'football', venue: 'Lumen Field', colors: ['#002244', '#69be28'],
      espn: { sport: 'football', league: 'nfl', id: '26' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', schedule: 'https://www.seahawks.com/schedule/',
      club: 'Seattle Seahawks', opens: 'September', wiki: { title: 'Seattle Seahawks', startYear: true },
      news: [ST('seahawks'), ['https://www.seahawks.com/rss/news', 'Seahawks.com'], ['https://www.fieldgulls.com/rss/current.xml', 'Field Gulls']],
      youtube: ['UCzkFCRiMcOBeef8xcaqipmw', 'UCDVYQ4Zhbm3S2dlz7P1GBDg'] }, // @Seahawks, @NFL
    { slug: 'mariners', label: 'Mariners', re: /mariners/i, sport: 'baseball', venue: 'T-Mobile Park', colors: ['#0c2c56', '#005c5c'],
      espn: { sport: 'baseball', league: 'mlb', id: '12' }, season: { kind: 'mlb', id: 136 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png', schedule: 'https://www.mlb.com/mariners/schedule',
      club: 'Seattle Mariners', opens: 'late March', wiki: { title: 'Seattle Mariners' },
      division: ['HOU', 'LAA', 'ATH', 'TEX'], // AL West, by the abbreviations the schedule carries (ATH since the Athletics left Oakland)
      news: [ST('mariners'), ['https://www.mlb.com/mariners/feeds/news/rss.xml', 'MLB.com'], ['https://www.lookoutlanding.com/rss/current.xml', 'Lookout Landing']],
      youtube: ['UCWWLs-O8JGYYcNea7AgumAA'] }, // @mariners (MLB's clips come from statsapi)
    { slug: 'kraken', label: 'Kraken', re: /kraken/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#001628', '#99d9d9'],
      espn: { sport: 'hockey', league: 'nhl', id: '124292' }, season: { kind: 'nhl', abbrev: 'SEA' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/sea.png', schedule: 'https://www.nhl.com/kraken/schedule',
      club: 'Seattle Kraken', opens: 'early October', wiki: { title: 'Seattle Kraken' },
      news: [ST('kraken'), ['https://soundofhockey.com/feed/', 'Sound Of Hockey'], ['https://www.davyjoneslockerroom.com/rss/current.xml', "Davy Jones' Locker Room"]],
      youtube: ['UCxspiBq2xf5pLjz9_NMjoyw'] }, // @seattlekraken (the NHL's clips come from api-web)
    { slug: 'storm', label: 'Storm', re: /seattle storm/i, sport: 'basketball', venue: 'Climate Pledge Arena', colors: ['#2c5234', '#fee11a'],
      espn: { sport: 'basketball', league: 'wnba', id: '14' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/sea.png', schedule: 'https://storm.wnba.com/schedule/',
      club: 'Seattle Storm', opens: 'May', wiki: { title: 'Seattle Storm' },
      news: [ST('storm')],
      youtube: ['UCv4xLXLA_aElluuaTWXN1jA', 'UCO9a_ryN_l7DIDS-VIt-zmw'] }, // @SeattleStormOfficial, @WNBA
    { slug: 'reign', label: 'Reign', re: /reign fc|seattle reign/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#0a2240', '#c5a05a'],
      espn: { sport: 'soccer', league: 'usa.nwsl', id: '15363' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/15363.png', schedule: 'https://www.reignfc.com/schedule',
      club: 'Seattle Reign', opens: 'March', wiki: { title: 'Seattle Reign FC' },
      news: [ST('reign')],
      youtube: ['UCokzki4ovbASTy0MGok5DpQ', 'UCL4xu08EDu0ZFZsBJUB0chw'] }, // @reignfc, @nwslsoccer
    // PWHL, first season 2025-26. The crest is the league's stat-feed copy;
    // the league site has no per-team schedule URL — the team page holds it.
    { slug: 'torrent', label: 'Torrent', re: /seattle torrent/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#0b2340', '#3fb6c4'],
      season: { kind: 'pwhl', id: 8 }, form: { kind: 'pwhl', id: 8 },
      logo: 'https://assets.leaguestat.com/pwhl/logos/8.png', schedule: 'https://www.thepwhl.com/en/teams/seattle-torrent',
      club: 'Seattle Torrent', opens: 'late November', wiki: { title: 'Seattle Torrent' },
      news: [ST('torrent')],
      youtube: ['UC3NYPPud40AIuTNrV9uU6Fw', 'UCuocIhnQvPAhk6eOopf0CfA'] }, // @PWHL__Seattle, @thepwhlofficial
    // Seattle Seawolves: Major League Rugby (since 2018), Starfire Stadium in Tukwila; no ESPN coverage
    { slug: 'seawolves', label: 'Seawolves', re: /seawolves/i, sport: 'rugby', venue: 'Starfire Stadium', colors: ['#003057', '#6cbe45'],
      season: { kind: 'seawolves' }, form: { kind: 'seawolves' },
      inject: { name: 'Seattle Seawolves', url: 'https://tickets.seawolves.rugby/events' }, // no ticket feed for Starfire: the home matches enter the listing from the schedule, linked to the club's ticket page
      logo: 'https://www.seawolves.rugby/images/seawolves-logo.png', schedule: 'https://www.seawolves.rugby/schedule',
      club: 'Seattle Seawolves', opens: 'March', wiki: { title: 'Seattle Seawolves' },
      youtube: ['UCPcMc2KfvSO0YGfxzrbzy3w', 'UCIynwDVqRK7KTUy72_kSBhA'] }, // @seattleseawolvesrugby, @USMLR
    // Washington Huskies football (Big Ten), Husky Stadium on Montlake; ESPN's college-football feeds cover them like a pro club
    { slug: 'huskies', label: 'Huskies', name: 'Washington Huskies', abbr: 'WASH', re: /huskies/i, sport: 'football', venue: 'Husky Stadium', colors: ['#4b2e83', '#b7a57a'],
      espn: { sport: 'football', league: 'college-football', id: '264' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://gohuskies.com/sports/football/schedule' }, // likewise, no ticket feed for Husky Stadium
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png', schedule: 'https://gohuskies.com/sports/football/schedule',
      club: 'Washington Huskies', wiki: { title: 'Washington Huskies football', teamPage: true }, // college seasons are titled "2026 Washington Huskies football team", not "… season"
      news: [ST('uw-husky-football'), ['https://www.uwdawgpound.com/rss/current.xml', 'UW Dawg Pound']] },
    { slug: 'sounders', label: 'Sounders', re: /sounders/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#236192', '#5d9741'],
      espn: { sport: 'soccer', league: 'usa.1', id: '9726' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/9726.png', schedule: 'https://www.soundersfc.com/schedule/',
      club: 'Seattle Sounders', opens: 'late February', wiki: { title: 'Seattle Sounders FC' },
      news: [ST('sounders'), ['https://www.sounderatheart.com/feed', 'Sounder at Heart']],
      youtube: ['UCVhbRUhe_hfmgi-UN1gcQzw', 'UCSZbXT5TLLW_i-5W8FZpFsg'] }, // @SoundersFC, @MLS
  ];

  // The venues, one record each — the campus first by size, then the
  // places a bus ride away, then the festivals. Per venue:
  //   capacity how many people the place holds, the one measure of an
  //            event's size the sources agree on (none report attendance
  //            or sell-outs except DICE): the arena's concert
  //            configuration, a theatre's house, a festival's day crowd
  //   area     'town' for the bus rides — the stadiums and the Convention
  //            Center listed for their size, the music rooms downtown, in
  //            SoDo and Belltown for their nights out; absent = campus
  //   festival its rows go in the panel's Festivals group whatever the
  //            area; its days are one series
  //   type     the event type when the title decides nothing (non-game
  //            stadium bookings are shows; SIFF specials are festival
  //            programming; Ticketmaster's own segment comes first)
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph; a venue with
  //            neither gets a hue hashed from its name
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest: the site's icon
  //            via Google's favicon service where it serves 100px+, the
  //            site's own file where that's sharper, a line-art logo under
  //            site/marks/ for a bar (McCaw Hall only publishes 16px, so
  //            none)
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs);
  //            soldOut 'tm' = the checker reads the event pages in Chrome,
  //            'ticketweb' = a plain fetch of the TicketWeb pages
  var VENUES = {
    'Climate Pledge Arena': {
      geo: [47.6219, -122.35399],
      capacity: 18100,
      type: 'concert',
      cssVar: '--v-cpa',
      color: '#4da3f0',
      url: 'https://climatepledgearena.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=climatepledgearena.com&sz=128',
      tm: { id: 'KovZ917Ahkk', match: 'climate pledge', fallbackUrl: 'https://climatepledgearena.com/events/', exclude: /climate pledge arena tours?|all access pass/i },
      soldOut: 'tm',
    },
    'Seattle Center': {
      geo: [47.6215, -122.351],
      capacity: 10000,
      type: 'community',
      cssVar: '--v-seactr',
      color: '#6a72e6',
      url: 'https://www.seattlecenter.com/events/event-calendar',
      icon: 'https://www.seattlecenter.com/Dev/Logos/logobug.png',
    },
    'McCaw Hall': {
      geo: [47.62398, -122.35039],
      capacity: 2900,
      type: 'arts',
      cssVar: '--v-mccaw',
      color: '#d158a7',
      url: 'https://www.mccawhall.com/events',
    },
    'Seattle Rep': {
      geo: [47.62393, -122.3536],
      capacity: 850,
      type: 'arts',
      cssVar: '--v-rep',
      color: '#f0827a',
      url: 'https://www.seattlerep.org/plays/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=www.seattlerep.org&sz=128',
    },
    MoPOP: {
      geo: [47.62146, -122.34818],
      capacity: 800,
      type: 'community',
      cssVar: '--v-mopop',
      color: '#e88ad8',
      url: 'https://www.mopop.org/events',
    },
    'Children\'s Theatre': {
      geo: [47.62046, -122.35226],
      capacity: 480,
      type: 'arts',
      cssVar: '--v-sct',
      color: '#6cc9db',
      url: 'https://www.sct.org/tickets-shows/calendar/',
    },
    'Cornish Playhouse': {
      geo: [47.62403, -122.35242],
      capacity: 460,
      type: 'arts',
      cssVar: '--v-cornish',
      color: '#3ecf97',
      url: 'https://www.seattlecenter.com/events/event-calendar?cats=173',
      icon: 'https://www.google.com/s2/favicons?domain=www.cornish.edu&sz=128',
    },
    'SIFF Cinema Uptown': {
      geo: [47.62348, -122.35711],
      capacity: 450,
      type: 'community',
      cssVar: '--v-siff',
      color: '#b596e0',
      url: 'https://www.siff.net/calendar',
      icon: 'https://www.siff.net/images/SIFF_favicon_03.png',
    },
    'Pacific Science Center': {
      geo: [47.61941, -122.35078],
      capacity: 400,
      type: 'community',
      cssVar: '--v-pacsci',
      color: '#62b8f7',
      url: 'https://pacificsciencecenter.org/events/',
    },
    'The Vera Project': {
      geo: [47.6231, -122.35388],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-vera',
      color: '#a26be6',
      url: 'https://theveraproject.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=theveraproject.org&sz=128',
    },
    'On the Boards': {
      geo: [47.62583, -122.35819],
      capacity: 300,
      type: 'arts',
      cssVar: '--v-otb',
      color: '#e07ae0',
      url: 'https://ontheboards.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=ontheboards.org&sz=128',
    },
    KEXP: {
      geo: [47.62296, -122.35515],
      capacity: 200,
      type: 'concert',
      cssVar: '--v-kexp',
      color: '#b48cf5',
      url: 'https://www.kexp.org/events/kexp-events/',
    },
    'T-Mobile Park': {
      geo: [47.5914, -122.33251],
      capacity: 47900,
      type: 'concert',
      cssVar: '--v-tmobile',
      color: '#8ad8e0',
      url: 'https://www.mlb.com/mariners/ballpark/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.mlb.com&sz=128',
      tm: { id: 'KovZpZAEevAA', match: 't-mobile park', fallbackUrl: 'https://www.mlb.com/mariners', exclude: /ballpark tour|flex membership/i },
      soldOut: 'tm',
    },
    'Lumen Field': {
      geo: [47.59535, -122.33164],
      capacity: 68700,
      type: 'concert',
      cssVar: '--v-lumen',
      color: '#8b8fe8',
      url: 'https://www.lumenfield.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.lumenfield.com&sz=128',
      tm: { id: 'KovZpZAEknnA', match: 'lumen field', fallbackUrl: 'https://www.lumenfield.com/', exclude: /stadium tour|notification list/i },
      soldOut: 'tm',
    },
    'Husky Stadium': {
      geo: [47.65037, -122.30198],
      capacity: 70000,
      type: 'concert',
      cssVar: '--v-husky',
      color: '#c4a0f0',
      url: 'https://gohuskies.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=gohuskies.com&sz=128',
    },
    'Convention Center': {
      geo: [47.61139, -122.33255],
      capacity: 20000,
      type: 'expo',
      cssVar: '--v-scc',
      color: '#7fa7cc',
      url: 'https://seattlecc.com/upcoming-events/',
    },
    'Starfire Stadium': {
      url: 'https://www.starfiresports.com/',
      geo: [47.47009, -122.24938],
      capacity: 4500,
      area: 'town',
    },
    'Paramount Theatre': {
      geo: [47.61324, -122.33136],
      capacity: 2800,
      type: 'concert',
      cssVar: '--v-paramount',
      color: '#e39a6e',
      url: 'https://www.stgpresents.org/stg-venues/paramount-theatre/',
      icon: 'https://www.google.com/s2/favicons?domain=www.stgpresents.org&sz=128',
      tm: { id: 'KovZpZAFkvEA', match: 'paramount', fallbackUrl: 'https://www.stgpresents.org/stg-venues/paramount-theatre/', exclude: /theatre tours?/i },
      soldOut: 'tm',
    },
    'Showbox at the Market': {
      geo: [47.60851, -122.33947],
      capacity: 1150,
      type: 'concert',
      cssVar: '--v-showbox',
      color: '#e8c45a',
      url: 'https://www.showboxpresents.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.showboxpresents.com&sz=128',
    },
    'Showbox SoDo': {
      geo: [47.58805, -122.33393],
      capacity: 1800,
      type: 'concert',
      cssVar: '--v-sodo',
      color: '#aab8d6',
      url: 'https://www.showboxpresents.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.showboxpresents.com&sz=128',
    },
    'The Crocodile': {
      geo: [47.61465, -122.34907],
      capacity: 750,
      type: 'concert',
      cssVar: '--v-croc',
      color: '#7ed67f',
      url: 'https://calendar.thecrocodile.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.thecrocodile.com&sz=128',
      tm: { id: 'KovZpZA1vFtA,rZ7HnEZae-Y,ZFr9jZ7kkv', match: 'crocodile', fallbackUrl: 'https://calendar.thecrocodile.com/' },
      soldOut: 'ticketweb',
    },
    // ---- Pioneer Square's rooms (pioneersquare.seattle.here.events, as they are there) ----
    'Baba Yaga': { // 124 S Washington St — the cocktail bar with a stage: shows on TicketWeb, karaoke and trivia on ma.to
      geo: [47.601, -122.33315],
      capacity: 200,
      type: 'concert',
      cssVar: '--v-baba',
      color: '#ea8686',
      url: 'https://babayagaseattle.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=babayagaseattle.com&sz=128',
      tm: { id: 'rZ7HnEZ17jbAS', match: 'baba yaga', fallbackUrl: 'https://babayagaseattle.com/events' },
      // no soldOut tag: its TicketWeb pages answer 506 to a plain fetch and a bare page to a browser-impersonating one (2026-10-15), so there is no status to read
      // the bar's own site says "we are updating our events" (SpotHopper, empty API); ma.to's venue page carries the weekly nights as schema.org Events
      feed: { kind: 'jsonld', url: 'https://ma.to/venue/babayagaseattle', drop: /taco tuesday/i },
      alias: /baba yaga/i,
    },
    'Central Saloon': { // 207 1st Ave S, Seattle's oldest bar (1892) and a 300-cap club; its own WordPress calendar
      geo: [47.6006, -122.3344],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-central',
      color: '#eab486',
      url: 'https://centralsaloon.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=centralsaloon.com&sz=128',
      // Modern Events Calendar list: its JSON-LD has the dates but no clocks, so the cards are read (date span + time span); TM KovZpZA1kaJA is empty
      feed: { kind: 'cards', url: 'https://centralsaloon.com/events/', item: /<article class="mec-event-article/, title: /class="mec-event-title"><a[^>]*href="([^"]+)"[^>]*>([^<]+)</, when: /mec-start-date-label">([^<]+)<\/span>[\s\S]{0,800}?mec-start-time">([^<]+)</ },
      alias: /central saloon/i,
    },
    'Seattle Jazz Fellowship': { // 109 S Washington St — the listening room, five nights a week; Squarespace
      geo: [47.59993, -122.33364],
      capacity: 100,
      type: 'concert',
      cssVar: '--v-sjf',
      color: '#eadb86',
      url: 'https://seattlejazzfellowship.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=seattlejazzfellowship.org&sz=128',
      feed: { kind: 'squarespace', url: 'https://seattlejazzfellowship.org/events' },
      alias: /jazz fellowship/i,
    },
    'Trinity Nightclub': { // 111 Yesler Way — three rooms, the weekend parties on Eventbrite
      geo: [47.6016, -122.33325],
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-trinity',
      color: '#c486ea',
      url: 'https://www.trinitynightclub.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.trinitynightclub.com&sz=128',
      feed: { kind: 'linked', url: 'https://www.trinitynightclub.com/', match: /eventbrite\.com\/e\//, max: 40 },
      alias: /trinity nightclub|trinity seattle/i,
    },
    'Nordo': { // Café Nordo's Culinarium, 109 S Main St — dinner theatre; Squarespace calendar
      geo: [47.59993, -122.33364],
      capacity: 100,
      type: 'arts',
      cssVar: '--v-nordo',
      color: '#ea86c8',
      url: 'https://www.cafenordo.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=www.cafenordo.com&sz=128',
      feed: { kind: 'squarespace', url: 'https://www.cafenordo.com/calendar' },
      alias: /caf[eé] nordo|nordo'?s? culinarium|culinarium/i,
    },
    'Occidental Square': { // the park — markets, the flea, the art walk; the Downtown Seattle Association programs it
      geo: [47.60048, -122.33315],
      capacity: 2000,
      type: 'community',
      cssVar: '--v-occidental',
      color: '#86ea9a',
      url: 'https://www.downtownseattle.org/places/occidental-square/',
      icon: 'https://www.google.com/s2/favicons?domain=www.downtownseattle.org&sz=128',
      feed: { kind: 'tribe', url: 'https://www.downtownseattle.org/wp-json/tribe/events/v1/events?venue=53729' },
      alias: /occidental (square|park)/i,
    },
    "Owl 'n Thistle": { // 808 Post Ave — the Irish pub with music most nights; its site prints a weekly schedule, no dates, so the build writes the week out (fetch-events.mjs)
      geo: [47.60334, -122.33567],
      capacity: 100,
      type: 'concert',
      cssVar: '--v-owl',
      color: '#b8ea86',
      url: 'https://owlnthistle.com/live-music-schedule',
      icon: 'https://www.google.com/s2/favicons?domain=owlnthistle.com&sz=128',
      alias: /owl ?'?n'? ?thistle/i,
    },
    'Klondike Gold Rush NHP': { // 319 2nd Ave S — the National Park Service's Seattle unit, in the Cadillac Hotel: ranger talks, Living Voices
      geo: [47.59938, -122.33186],
      capacity: 100,
      type: 'community',
      cssVar: '--v-klondike',
      color: '#eac786',
      url: 'https://www.nps.gov/klse/planyourvisit/calendar.htm',
      icon: 'https://www.google.com/s2/favicons?domain=www.nps.gov&sz=128',
      feed: { kind: 'nps', url: 'https://developer.nps.gov/api/v1/events?parkCode=klse' },
      alias: /klondike|cadillac hotel/i,
    },
    'Around Pioneer Square': { // everything else the Alliance's neighbourhood calendar lists — galleries, museums, walks, pop-ups (groundsVenue)
      geo: [47.60186, -122.33392],
      capacity: 500,
      type: 'community',
      cssVar: '--v-around',
      color: '#86d9ea',
      url: 'https://pioneersquare.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=pioneersquare.org&sz=128',
    },
    'WAMU Theater': { // inside Lumen Field's event centre, 7,000 standing
      geo: [47.59315, -122.3329],
      capacity: 7000,
      type: 'concert',
      cssVar: '--v-wamu',
      color: '#a6a1ea',
      url: 'https://www.wamutheater.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.wamutheater.com&sz=128',
      tm: { id: 'KovZpZAFFE7A', match: 'wamu', fallbackUrl: 'https://www.wamutheater.com/', exclude: /amplified access|parking/i },
      alias: /wamu theat/i,
    },
    'Waterfront Park': { // Pier 62 and the new park along Alaskan Way, a ten-minute walk west — Friends of Waterfront Park's tours, films, dances and markets, from the cards on its events page
      geo: [47.60711, -122.34142],
      capacity: 2000,
      type: 'community',
      cssVar: '--v-waterfront',
      color: '#86c9ea',
      url: 'https://waterfrontparkseattle.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=waterfrontparkseattle.org&sz=128',
      feed: { kind: 'cards', url: 'https://waterfrontparkseattle.org/events/',
        item: /<div class="grid-item"/, title: /<a href="([^"]+)">[\s\S]*?<h4 class="widont ">([\s\S]*?)<\/h4>/,
        when: /<h3 class="widont ">([\s\S]*?)<\/h3><h3 class="widont date-time">([^<]*)<\/h3>/ },
      alias: /waterfront park|pier 62/i,
    },
    // ---- the rest of the city, and the sheds a drive away (area 'town') ----
    'Neptune Theatre': { // STG's University District house, under two Ticketmaster ids
      geo: [47.66114, -122.31403],
      capacity: 800,
      type: 'concert',
      cssVar: '--v-neptune',
      color: '#e9ab85',
      url: 'https://www.stgpresents.org/stg-venues/neptune-theatre/',
      icon: 'https://www.google.com/s2/favicons?domain=www.stgpresents.org&sz=128',
      tm: { id: 'KovZpZAFnltA,rZ7HnEZ17fdqg', match: 'neptune', fallbackUrl: 'https://www.stgpresents.org/stg-venues/neptune-theatre/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Moore Theatre': { // STG's old Belltown house
      geo: [47.61173, -122.34111],
      capacity: 1800,
      type: 'concert',
      cssVar: '--v-moore',
      color: '#e9be85',
      url: 'https://www.stgpresents.org/stg-venues/moore-theatre/',
      icon: 'https://www.google.com/s2/favicons?domain=www.stgpresents.org&sz=128',
      tm: { id: 'KovZpZA1vFJA', match: 'moore', fallbackUrl: 'https://www.stgpresents.org/stg-venues/moore-theatre/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Benaroya Hall': { // the Seattle Symphony's hall and its Taper Auditorium and recital hall, three Ticketmaster ids
      geo: [47.60812, -122.33697],
      capacity: 2500,
      type: 'arts',
      cssVar: '--v-benaroya',
      color: '#e9d185',
      url: 'https://www.benaroyahall.org/',
      icon: 'https://www.google.com/s2/favicons?domain=www.benaroyahall.org&sz=128',
      tm: { id: 'Z6r9jZeFde,Z7r9jZadcG,KovZpZAaIEvA', match: 'benaroya', fallbackUrl: 'https://www.benaroyahall.org/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    '5th Avenue Theatre': { // the musicals house
      geo: [47.60917, -122.33398],
      capacity: 2130,
      type: 'arts',
      cssVar: '--v-fifth',
      color: '#e9e485',
      url: 'https://www.5thavenue.org/shows/',
      icon: 'https://www.google.com/s2/favicons?domain=www.5thavenue.org&sz=128',
      tm: { id: 'KovZpa3Mze,ZAr9jZ6ehK', match: '5th avenue', fallbackUrl: 'https://www.5thavenue.org/shows/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'ACT Theatre': { // A Contemporary Theatre, listed on Ticketmaster as the Union Arts Center (its Eagles Auditorium building's new name)
      geo: [47.61085, -122.33233],
      capacity: 400,
      type: 'arts',
      cssVar: '--v-act',
      color: '#dce985',
      url: 'https://www.acttheatre.org/',
      icon: 'https://www.google.com/s2/favicons?domain=www.acttheatre.org&sz=128',
      tm: { id: 'ZAr9jZ1e-x', match: 'union arts', fallbackUrl: 'https://www.acttheatre.org/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Taproot Theatre': { // Greenwood's playhouse
      geo: [47.6908, -122.35628],
      capacity: 225,
      type: 'arts',
      cssVar: '--v-taproot',
      color: '#c9e985',
      url: 'https://taproottheatre.org/',
      icon: 'https://www.google.com/s2/favicons?domain=taproottheatre.org&sz=128',
      tm: { id: 'ZFr9jZe66d', match: 'taproot', fallbackUrl: 'https://taproottheatre.org/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Triple Door': { // the supper club under Wild Ginger, two ids
      geo: [47.60864, -122.33768],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-tripledoor',
      color: '#b6e985',
      url: 'https://www.thetripledoor.net/',
      icon: 'https://www.google.com/s2/favicons?domain=www.thetripledoor.net&sz=128',
      tm: { id: 'ZFr9jZAFvA,KovZpZA1ekJA', match: 'triple door', fallbackUrl: 'https://www.thetripledoor.net/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Jazz Alley': { // Dimitriou's Jazz Alley — its own calendar page (cards: a run of nights is one row per night; sets are 7:30, with a 9:30 late set on weekends)
      geo: [47.61458, -122.33915],
      capacity: 450,
      type: 'concert',
      cssVar: '--v-jazzalley',
      color: '#a4e985',
      url: 'https://www.jazzalley.com/www-home/calendar.jsp',
      icon: 'https://www.google.com/s2/favicons?domain=www.jazzalley.com&sz=128',
      feed: { kind: 'cards', url: 'https://www.jazzalley.com/www-home/calendar.jsp', time: '19:30',
        item: /<div class="news-box"/, title: /<a href="([^"]+)"><h2>([^<]+)<\/h2>/,
        when: /<em class="date">(?:[A-Za-z]{3}, )?([A-Za-z]{3} \d{1,2})( - )?(?:[A-Za-z]{3}, )?((?:[A-Za-z]{3} \d{1,2})?, \d{4})/ },
    },
    'Meany Center': { // UW's performing-arts hall — the season page's cards (the opening night of each run; no clock printed)
      geo: [47.65566, -122.31066],
      capacity: 1200,
      type: 'arts',
      cssVar: '--v-meany',
      color: '#91e985',
      url: 'https://meanycenter.org/tickets/season',
      icon: 'https://www.google.com/s2/favicons?domain=meanycenter.org&sz=128',
      feed: { kind: 'cards', url: 'https://meanycenter.org/tickets/season',
        item: /class="views-row/, title: /<div class="listing-title"><a href="([^"]+)">([^<]+)<\/a>/,
        when: /<span class='month'>([^<]+)<\/span><span class='date'>([^<]+)<\/span>/ },
    },
    'Town Hall Seattle': { // talks, readings and concerts in the First Hill hall — its Events Calendar feed, the rows at its own rooms only (it also lists partner events across town)
      geo: [47.60902, -122.32994],
      capacity: 850,
      type: 'arts',
      cssVar: '--v-townhall',
      color: '#85e98c',
      url: 'https://townhallseattle.org/events/',
      icon: 'https://www.google.com/s2/favicons?domain=townhallseattle.org&sz=128',
      feed: { kind: 'tribe', url: 'https://townhallseattle.org/wp-json/tribe/events/v1/events', rooms: /great hall|forum|wyncote|town hall/i },
    },
    'Woodland Park Zoo': { // ZooTunes in summer, the zoo's own event days the rest of the year — its Events Calendar feed
      geo: [47.66914, -122.35096],
      capacity: 5000,
      type: 'community',
      cssVar: '--v-zoo',
      color: '#85e99f',
      url: 'https://www.zoo.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.zoo.org&sz=128',
      feed: { kind: 'tribe', url: 'https://www.zoo.org/wp-json/tribe/events/v1/events', drop: /member|volunteer|camp\b|class\b/i },
    },
    'Alaska Airlines Arena': { // Hec Edmundson Pavilion — Huskies basketball and volleyball, graduations
      geo: [47.65218, -122.30212],
      capacity: 10000,
      type: 'sports',
      cssVar: '--v-heced',
      color: '#85e9b2',
      url: 'https://gohuskies.com/',
      icon: 'https://www.google.com/s2/favicons?domain=gohuskies.com&sz=128',
      tm: { id: 'Z6r9jZFeae', match: 'alaska airlines arena', fallbackUrl: 'https://gohuskies.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    Neumos: { // Capitol Hill's Pike Street room (box office on AXS; Ticketmaster carries the listings)
      geo: [47.61383, -122.31963],
      capacity: 650,
      type: 'concert',
      cssVar: '--v-neumos',
      color: '#85e9c4',
      url: 'https://www.neumos.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.neumos.com&sz=128',
      tm: { id: 'ZFr9jZAFvF', match: 'neumos', fallbackUrl: 'https://www.neumos.com/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    Barboza: { // the basement room under Neumos
      geo: [47.61383, -122.31963],
      capacity: 200,
      type: 'concert',
      cssVar: '--v-barboza',
      color: '#85e9d7',
      url: 'https://www.neumos.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.neumos.com&sz=128',
      tm: { id: 'Z7r9jZaetY', match: 'barboza', fallbackUrl: 'https://www.neumos.com/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Chop Suey': { // Capitol Hill's Madison Street club
      geo: [47.61353, -122.31446],
      capacity: 500,
      type: 'concert',
      cssVar: '--v-chopsuey',
      color: '#85e8e9',
      url: 'https://chopsuey.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=chopsuey.com&sz=128',
      tm: { id: 'rZ7HnEZa7ck', match: 'chop suey', fallbackUrl: 'https://chopsuey.com/calendar', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Clock-Out Lounge': { // Beacon Hill's bar and pizza stage, two ids
      geo: [47.55905, -122.30374],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-clockout',
      color: '#85d6e9',
      url: 'https://clockoutlounge.com/',
      icon: 'https://www.google.com/s2/favicons?domain=clockoutlounge.com&sz=128',
      tm: { id: 'rZ7HnEZ1734_P,Z7r9jZadEF', match: 'clock-out', fallbackUrl: 'https://clockoutlounge.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Royal Room': { // 5000 Rainier Ave S, Columbia City — jazz, soul and songwriter nights; its box office is Stranger Tickets, read from there (2026-10-19)
      geo: [47.5569, -122.28427],
      capacity: 200,
      type: 'concert',
      cssVar: '--v-royalroom',
      color: '#c4a9ef',
      url: 'https://theroyalroomseattle.com/',
      icon: 'https://www.google.com/s2/favicons?domain=theroyalroomseattle.com&sz=128',
      feed: { kind: 'boldtype', url: 'https://www.strangertickets.com', city: 'Seattle', rooms: /\broyal room\b/i, drop: /season (?:tickets?|pass(?:es)?)|gift card/i },
      alias: /\broyal room\b/i,
    },
    'El Corazon': { // the Eastlake rock room and its Funhouse next door (the Funhouse's two ids fold in)
      geo: [47.61889, -122.32932],
      capacity: 800,
      type: 'concert',
      cssVar: '--v-elcorazon',
      color: '#85c3e9',
      url: 'https://elcorazonseattle.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=elcorazonseattle.com&sz=128',
      tm: { id: 'ZFr9jZAa7a,Z7r9jZadJk,rZ7HnEZ1734qg', match: 'corazon', fallbackUrl: 'https://elcorazonseattle.com/calendar', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Nectar Lounge': { // Fremont's club, two ids
      geo: [47.65239, -122.35385],
      capacity: 400,
      type: 'concert',
      cssVar: '--v-nectar',
      color: '#85b0e9',
      url: 'https://www.nectarlounge.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.nectarlounge.com&sz=128',
      tm: { id: 'ZFr9jZ6e67,rZ7HnEZakFh', match: 'nectar', fallbackUrl: 'https://www.nectarlounge.com/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Tractor Tavern': { // Ballard Avenue's roots room (TicketWeb primaries through Ticketmaster)
      geo: [47.66571, -122.3828],
      capacity: 400,
      type: 'concert',
      cssVar: '--v-tractor',
      color: '#859de9',
      url: 'https://www.tractortavern.com/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=www.tractortavern.com&sz=128',
      tm: { id: 'rZ7HnEZa7PM', match: 'tractor', fallbackUrl: 'https://www.tractortavern.com/calendar', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Sunset Tavern': { // Ballard Avenue's small stage (Ticketmaster carries its listings; the bar sells on DICE)
      geo: [47.66812, -122.38599],
      capacity: 250,
      type: 'concert',
      cssVar: '--v-sunset',
      color: '#858be9',
      url: 'https://sunsettavern.com/shows',
      icon: 'https://www.google.com/s2/favicons?domain=sunsettavern.com&sz=128',
      tm: { id: 'rZ7HnEZa7IN', match: 'sunset tavern', fallbackUrl: 'https://sunsettavern.com/shows', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    Substation: { // the Ballard club on 15th
      geo: [47.66136, -122.36544],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-substation',
      color: '#9285e9',
      url: 'https://www.substationseattle.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.substationseattle.com&sz=128',
      tm: { id: 'rZ7HnEZ17fekA', match: 'substation', fallbackUrl: 'https://www.substationseattle.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Fremont Abbey': { // the arts hall in the old church
      geo: [47.65919, -122.34968],
      capacity: 300,
      type: 'concert',
      cssVar: '--v-abbey',
      color: '#a585e9',
      url: 'https://fremontabbey.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=fremontabbey.org&sz=128',
      tm: { id: 'rZ7HnEZ173bFA', match: 'fremont abbey', fallbackUrl: 'https://fremontabbey.org/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Hidden Hall': { // Fremont's High Dive, renamed in 2026
      geo: [47.65162, -122.35421],
      capacity: 400,
      type: 'concert',
      cssVar: '--v-hiddenhall',
      color: '#b885e9',
      url: 'https://highdiveseattle.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=highdiveseattle.com&sz=128',
      tm: { id: 'rZ7HnEZ17q0Of', match: 'hidden hall', fallbackUrl: 'https://highdiveseattle.com/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Rabbit Box': { // the Pike Place Market theatre and comedy room
      geo: [47.60886, -122.34057],
      capacity: 150,
      type: 'arts',
      cssVar: '--v-rabbitbox',
      color: '#cb85e9',
      url: 'https://www.rabbitboxseattle.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.rabbitboxseattle.com&sz=128',
      tm: { id: 'rZ7HnEZ174kAI', match: 'rabbit box', fallbackUrl: 'https://www.rabbitboxseattle.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Ballard Homestead': { // the Fremont Abbey's second room, a hall in old Ballard
      geo: [47.67704, -122.38675],
      capacity: 150,
      type: 'concert',
      cssVar: '--v-homestead',
      color: '#dd85e9',
      url: 'https://ballardhomestead.org/',
      icon: 'https://www.google.com/s2/favicons?domain=ballardhomestead.org&sz=128',
      tm: { id: 'rZ7HnEZ17fvaP', match: 'ballard homestead', fallbackUrl: 'https://ballardhomestead.org/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Kerry Hall': { // Cornish's Capitol Hill hall: recitals, dance, the odd touring show
      geo: [47.62532, -122.32307],
      capacity: 400,
      type: 'arts',
      cssVar: '--v-kerry',
      color: '#e985e2',
      url: 'https://www.cornish.edu/events/',
      icon: 'https://www.google.com/s2/favicons?domain=www.cornish.edu&sz=128',
      tm: { id: 'KovZ917AYPu', match: 'kerry hall', fallbackUrl: 'https://www.cornish.edu/events/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Tacoma Dome': { // the arena tours that skip Climate Pledge, 35 miles south
      geo: [47.23689, -122.42695],
      capacity: 23000,
      area: 'town',
      type: 'concert',
      cssVar: '--v-tacomadome',
      color: '#e985cf',
      url: 'https://www.tacomadome.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.tacomadome.org&sz=128',
      tm: { id: 'KovZpa3zGe', match: 'tacoma dome', fallbackUrl: 'https://www.tacomadome.org/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'White River Amphitheatre': { // Auburn's summer shed (May to September)
      geo: [47.228, -122.084], // placed by hand
      capacity: 20000,
      area: 'town',
      type: 'concert',
      cssVar: '--v-whiteriver',
      color: '#e985bd',
      url: 'https://www.whiteriveramphitheatre.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.whiteriveramphitheatre.com&sz=128',
      tm: { id: 'KovZpZAEkd1A', match: 'white river', fallbackUrl: 'https://www.whiteriveramphitheatre.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'accesso ShoWare Center': { // Kent — the Thunderbirds' rink and mid-size shows
      geo: [47.38766, -122.24],
      capacity: 6500,
      area: 'town',
      type: 'sports',
      cssVar: '--v-showare',
      color: '#e985aa',
      url: 'https://www.accessoshowarecenter.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.accessoshowarecenter.com&sz=128',
      tm: { id: 'ZFr9jZ6aAe', match: 'showare', fallbackUrl: 'https://www.accessoshowarecenter.com/events', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Chateau Ste. Michelle': { // Woodinville's winery lawn, summer concerts only
      geo: [47.72929, -122.14937],
      capacity: 4300,
      area: 'town',
      type: 'concert',
      cssVar: '--v-stemichelle',
      color: '#e98597',
      url: 'https://www.ste-michelle.com/visit-us/summer-concerts',
      icon: 'https://www.google.com/s2/favicons?domain=www.ste-michelle.com&sz=128',
      tm: { id: 'KovZpZAFkkJA', match: 'ste. michelle', fallbackUrl: 'https://www.ste-michelle.com/visit-us/summer-concerts', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Muckleshoot Casino': { // Auburn — the casino's events center
      geo: [47.29033, -122.19559],
      capacity: 2500,
      area: 'town',
      type: 'concert',
      cssVar: '--v-muckleshoot',
      color: '#e98685',
      url: 'https://www.muckleshootcasino.com/entertainment',
      icon: 'https://www.google.com/s2/favicons?domain=www.muckleshootcasino.com&sz=128',
      tm: { id: 'KovZ917AJEj', match: 'muckleshoot', fallbackUrl: 'https://www.muckleshootcasino.com/entertainment', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    'Emerald Queen Casino': { // Tacoma — the casino's showroom
      geo: [47.23787, -122.40825],
      capacity: 2000,
      area: 'town',
      type: 'concert',
      cssVar: '--v-eqc',
      color: '#e99985',
      url: 'https://www.emeraldqueen.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.emeraldqueen.com&sz=128',
      tm: { id: 'KovZpa3qIe', match: 'emerald queen', fallbackUrl: 'https://www.emeraldqueen.com/', exclude: /\bparking\b|\btours?\b|season (?:tickets?|pass)|membership|club (?:level|seating)/i },
    },
    // ---- the festivals ----
    Bumbershoot: {
      geo: [47.6225, -122.3505], // placed by hand
      capacity: 25000,
      festival: true,
      cssVar: '--v-bumber',
      color: '#e8a35a',
      url: 'https://bumbershoot.com/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=bumbershoot.com&sz=128',
    },
    'Northwest Folklife': {
      geo: [47.6208, -122.3498], // placed by hand
      capacity: 50000,
      festival: true,
      cssVar: '--v-folklife',
      color: '#8fc26a',
      url: 'https://www.nwfolklife.org/festival/',
      icon: 'https://www.google.com/s2/favicons?domain=nwfolklife.org&sz=128',
    },
    PrideFest: {
      geo: [47.62, -122.3522], // placed by hand
      capacity: 50000,
      festival: true,
      cssVar: '--v-pride',
      color: '#e07bb5',
      url: 'https://www.seattlepridefest.org/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=www.seattlepridefest.org&sz=128',
    },
    'Capitol Hill Block Party': {
      geo: [47.6142, -122.3185], // placed by hand
      capacity: 30000,
      festival: true,
      cssVar: '--v-chbp',
      color: '#a6b85a',
      url: 'https://www.capitolhillblockparty.com/artists',
      icon: 'https://www.google.com/s2/favicons?domain=www.capitolhillblockparty.com&sz=128',
    },
  };

  // City-wide feeds — neighbourhood calendars that name their own rooms.
  // Each is pinned to one row by `venue` (the Alliance for Pioneer Square's
  // two pages → Around Pioneer Square), as on the Pioneer Square site.
  var FEEDS = [
    { kind: 'cards', label: 'Alliance for Pioneer Square', url: 'https://pioneersquare.org/events/', type: 'community', venue: 'Around Pioneer Square',
      item: /<div class="grid-item"/, title: /<h3><a href="([^"]+)">([^<]+)<\/a>/, when: /<strong>([^<]+)<\/strong>/, place: /<\/strong><\/p>\s*<p>([^<]*)<\/p>/,
      drop: /office hours/i }, // the Alliance's own drop-in hours are not events
    // First Thursday Art Walk — the Alliance lists each month's walk on its own page, dated but with no clock (5 to 8 PM every first Thursday)
    { kind: 'cards', label: 'First Thursday Art Walk', url: 'https://pioneersquare.org/art-walks/', type: 'arts', time: '17:00', venue: 'Around Pioneer Square',
      item: /<div class="grid-item"/, title: /<h3><a href="([^"]+)">([^<]+)<\/a>/, when: /<strong>([^<]+)<\/strong>/ },
  ];

  // The panel's Seattle column folds by neighbourhood (Steve, 2026-10-18:
  // "it's getting too big"): one row per neighbourhood, in this order, the
  // rooms under a chevron; a room in no list goes under HOODS_REST. Around
  // the Sound and the festivals keep their own groups.
  var HOODS = [
    { label: 'Seattle Center', venues: ['Climate Pledge Arena', 'Seattle Center', 'McCaw Hall', 'Seattle Rep', 'Cornish Playhouse', 'SIFF Cinema Uptown', 'Pacific Science Center', 'MoPOP', 'Children\'s Theatre', 'The Vera Project', 'On the Boards', 'KEXP'] },
    { label: 'Downtown & Belltown', venues: ['Paramount Theatre', 'Moore Theatre', 'Benaroya Hall', '5th Avenue Theatre', 'ACT Theatre', 'Showbox at the Market', 'The Crocodile', 'Triple Door', 'Jazz Alley', 'Rabbit Box', 'Town Hall Seattle', 'Convention Center', 'Waterfront Park'] },
    { label: 'Pioneer Square', venues: ['Baba Yaga', 'Central Saloon', 'Seattle Jazz Fellowship', 'Trinity Nightclub', 'Nordo', 'Owl \'n Thistle', 'Occidental Square', 'Klondike Gold Rush NHP', 'Around Pioneer Square'] },
    { label: 'SoDo & the Stadiums', venues: ['Lumen Field', 'T-Mobile Park', 'WAMU Theater', 'Showbox SoDo'] },
    { label: 'Capitol Hill', venues: ['Neumos', 'Barboza', 'Chop Suey', 'El Corazon', 'Kerry Hall'] },
    { label: 'University District', venues: ['Husky Stadium', 'Alaska Airlines Arena', 'Neptune Theatre', 'Meany Center'] },
    { label: 'Ballard & North', venues: ['Tractor Tavern', 'Sunset Tavern', 'Ballard Homestead', 'Substation', 'Fremont Abbey', 'Nectar Lounge', 'Hidden Hall', 'Woodland Park Zoo', 'Taproot Theatre'] },
    { label: 'South Seattle', venues: ['Clock-Out Lounge', 'Royal Room'] },
  ];
  var HOODS_REST = 'Elsewhere in Seattle';

  // The usual view: every room on but the campus museums, the cinema, the
  // Convention Center, the zoo, the park service and the two neighbourhood
  // catch-alls — the reader is looking for a show, not a lecture series.
  var DEFAULT_ON = ['Climate Pledge Arena', 'Seattle Center', 'McCaw Hall', 'Seattle Rep', 'Cornish Playhouse', 'The Vera Project', 'On the Boards', 'T-Mobile Park', 'Lumen Field', 'Husky Stadium', 'Paramount Theatre', 'Showbox at the Market', 'Showbox SoDo', 'The Crocodile', 'Baba Yaga', 'Central Saloon', 'Seattle Jazz Fellowship', 'Trinity Nightclub', 'Nordo', 'Occidental Square', 'Owl \'n Thistle', 'WAMU Theater', 'Waterfront Park', 'Neptune Theatre', 'Moore Theatre', 'Benaroya Hall', '5th Avenue Theatre', 'ACT Theatre', 'Taproot Theatre', 'Triple Door', 'Jazz Alley', 'Meany Center', 'Town Hall Seattle', 'Alaska Airlines Arena', 'Neumos', 'Barboza', 'Chop Suey', 'Clock-Out Lounge', 'Royal Room', 'El Corazon', 'Nectar Lounge', 'Tractor Tavern', 'Sunset Tavern', 'Substation', 'Fremont Abbey', 'Hidden Hall', 'Rabbit Box', 'Ballard Homestead', 'Tacoma Dome', 'White River Amphitheatre', 'accesso ShoWare Center', 'Chateau Ste. Michelle', 'Muckleshoot Casino', 'Emerald Queen Casino', 'Bumbershoot', 'Northwest Folklife', 'PrideFest'];
  var DEFAULT_OFF = ['SIFF Cinema Uptown', 'Pacific Science Center', 'MoPOP', 'Children\'s Theatre', 'KEXP', 'Convention Center', 'Kerry Hall', 'Klondike Gold Rush NHP', 'Woodland Park Zoo', 'Around Pioneer Square', 'Starfire Stadium', 'Capitol Hill Block Party'];
  var PREFS_KNOWN_FROM = 'SIFF Cinema Uptown'; // the first default-off venue: a fresh site, so every saved pref set already knows them all

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order; 'community' (grounds
  // events, walks, classes, SIFF specials) has no row since 2026-10-05 —
  // the festivals got rows of their own ("festivals doesn't need to be in
  // event type anymore") — the type still exists on events and in the
  // share code, it just can't be switched. 'movie' survives from the badge
  // era so the saved movies-hidden default and the no-movies feed carry.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — arena tours to tavern shows' },
    { key: 'sports', label: 'Sports', title: 'Pro and college games' },
    { key: 'arts', label: 'Arts & Theater', title: 'Opera, ballet, plays, comedy, dance' },
    { key: 'movie', label: 'Movies', title: 'Film screenings at SIFF Cinema Uptown — unchecked by default' },
    { key: 'community', label: 'Community', title: 'Markets, walks, art walks, park days and the neighbourhood calendars' },
    { key: 'expo', label: 'Conventions', title: 'Conventions, conferences, trade and consumer shows — the Convention Center, Exhibition Hall, Fisher Pavilion' },
  ];
  var MOVIE_VENUE = 'SIFF Cinema Uptown'; // the cinema: a view of only its movies is the "movies" view, not a venue view

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 87 slots from the first build (2026-10-15): 17 base-36 digits; 88 with
  // the Royal Room (2026-10-19): 18.
  var CODE_LENGTH = 18;
  var REGISTRY = [
    ['venue', 'Climate Pledge Arena'], ['venue', 'Seattle Center'], ['venue', 'McCaw Hall'],
    ['venue', 'Seattle Rep'], ['venue', 'MoPOP'], ['venue', 'Children\'s Theatre'],
    ['venue', 'Cornish Playhouse'], ['venue', 'SIFF Cinema Uptown'], ['venue', 'Pacific Science Center'],
    ['venue', 'The Vera Project'], ['venue', 'On the Boards'], ['venue', 'KEXP'],
    ['venue', 'T-Mobile Park'], ['venue', 'Lumen Field'], ['venue', 'Husky Stadium'],
    ['venue', 'Convention Center'], ['venue', 'Starfire Stadium'], ['venue', 'Paramount Theatre'],
    ['venue', 'Showbox at the Market'], ['venue', 'Showbox SoDo'], ['venue', 'The Crocodile'],
    ['venue', 'Baba Yaga'], ['venue', 'Central Saloon'], ['venue', 'Seattle Jazz Fellowship'],
    ['venue', 'Trinity Nightclub'], ['venue', 'Nordo'], ['venue', 'Occidental Square'],
    ['venue', 'Owl \'n Thistle'], ['venue', 'Klondike Gold Rush NHP'], ['venue', 'Around Pioneer Square'],
    ['venue', 'WAMU Theater'], ['venue', 'Waterfront Park'], ['venue', 'Neptune Theatre'],
    ['venue', 'Moore Theatre'], ['venue', 'Benaroya Hall'], ['venue', '5th Avenue Theatre'],
    ['venue', 'ACT Theatre'], ['venue', 'Taproot Theatre'], ['venue', 'Triple Door'],
    ['venue', 'Jazz Alley'], ['venue', 'Meany Center'], ['venue', 'Town Hall Seattle'],
    ['venue', 'Woodland Park Zoo'], ['venue', 'Alaska Airlines Arena'], ['venue', 'Neumos'],
    ['venue', 'Barboza'], ['venue', 'Chop Suey'], ['venue', 'Clock-Out Lounge'],
    ['venue', 'El Corazon'], ['venue', 'Nectar Lounge'], ['venue', 'Tractor Tavern'],
    ['venue', 'Sunset Tavern'], ['venue', 'Substation'], ['venue', 'Fremont Abbey'],
    ['venue', 'Hidden Hall'], ['venue', 'Rabbit Box'], ['venue', 'Ballard Homestead'],
    ['venue', 'Kerry Hall'], ['venue', 'Tacoma Dome'], ['venue', 'White River Amphitheatre'],
    ['venue', 'accesso ShoWare Center'], ['venue', 'Chateau Ste. Michelle'], ['venue', 'Muckleshoot Casino'],
    ['venue', 'Emerald Queen Casino'], ['venue', 'Bumbershoot'], ['venue', 'Northwest Folklife'],
    ['venue', 'PrideFest'], ['venue', 'Capitol Hill Block Party'], ['badge', 'concert'],
    ['badge', 'sports'], ['badge', 'arts'], ['badge', 'movie'],
    ['badge', 'community'], ['badge', 'expo'], ['team', 'seahawks'],
    ['team', 'mariners'], ['team', 'kraken'], ['team', 'storm'],
    ['team', 'reign'], ['team', 'torrent'], ['team', 'seawolves'],
    ['team', 'huskies'], ['team', 'sounders'], ['cap', 'stadium'],
    ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'], ['venue', 'Royal Room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Seattle', // the board drops it from the clubs' names ("Seattle Kraken" → Kraken)
    presetDefault: 'The big rooms — ' + DEFAULT_ON.join(', ') + ' — every team and type except Movies',
    presetNeighborhood: 'Just Seattle — nothing in Tacoma, Auburn, Kent or Woodinville',
    presetBig: 'Only the places that hold 2,000 or more — the stadiums, the arena, McCaw Hall',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing Seattle only, nothing around the Sound.', big: 'Showing the big rooms only — the arena, the stadiums, McCaw Hall.' },
  };

  global.LQACity = {
    key: 'seattle',
    name: 'Seattle',
    site: 'https://seattle.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; seattle-events/1.0; +https://seattle.here.events/)',
    tz: 'America/Los_Angeles', tzName: 'Pacific', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Washington", stateOutline: 'M6.9 5.6L9.4 5.6L12.6 5.6L15.9 5.6L19.2 5.6L21.6 5.6L21.6 7.4L21.6 9.2L21.7 11.0L21.7 12.8L21.7 14.7L21.6 15.4L21.9 16.3L22.0 16.9L20.0 16.9L18.0 16.9L16.6 16.9L15.5 17.1L13.2 17.9L11.0 18.2L9.8 18.0L8.6 18.4L7.5 18.3L7.0 17.8L6.3 16.3L5.7 16.3L5.2 15.9L4.1 15.9L3.7 15.5L3.8 14.9L4.1 14.4L3.5 13.6L3.7 13.0L3.5 13.3L3.3 12.3L2.6 10.1L2.0 8.7L2.2 7.9L3.6 8.6L5.7 8.9L6.3 9.0L6.7 9.0L7.0 9.0L7.3 9.8L6.9 10.1L6.0 11.4L6.1 11.8L6.6 11.5L6.2 11.4L6.6 10.8L7.1 10.2L7.4 9.6L7.6 10.0L7.3 10.5L7.2 10.8L7.5 11.4L7.4 12.1L7.1 12.0L6.9 11.9L6.5 12.2L6.6 12.6L7.1 12.7L7.5 12.1L7.9 11.9L8.0 11.1L7.9 10.6L8.0 10.3L8.1 9.7L8.3 9.2L7.9 8.7L7.9 9.0L7.6 8.7L7.7 8.3L7.7 7.9L7.3 7.7L7.3 7.5L7.7 7.4L7.6 6.8L7.5 6.4L7.2 6.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain and PRODID never change
    // (changing them re-creates every event in subscribers' calendars)
    ics: { name: 'Seattle Events', short: 'Seattle Events', teams: 'Seattle home teams — every season', prodid: '-//here.events//seattle-events//EN', uidDomain: 'fosdal.net',
      desc: 'Upcoming events across Seattle — Climate Pledge Arena\\, the stadiums\\, the theatres and the music rooms' },
    teams: TEAMS,
    // the Map view (site/local-map.js, the Map stop): the ground scripts/build-local-map.mjs draws into site/local-map.json
    // — the shoreline, the named lakes and the main roads inside bbox, read once from OpenStreetMap at build time (© OSM
    // contributors, ODbL, credited in Sources) — with a pin on every room above that carries geo: [lat, lon] (Nominatim once,
    // the festivals and White River by hand). Steve, 2026-10-24: Kona first ("local map view for event locations"), then lqa and Seattle.
    map: {
      kind: 'urban',
      bbox: [47.2, -122.56, 47.76, -122.05], // south, west, north, east — Tacoma and White River at the foot, Woodinville at the top right
      home: [47.548, -122.43, 47.7, -122.27], // the view at first: the city itself; the fit button shows the whole Sound
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.8,
      labels: [
        { name: 'Ballard', lat: 47.6685, lon: -122.3846, anchor: 'end' },
        { name: 'Fremont', lat: 47.651, lon: -122.35, anchor: 'start' },
        { name: 'Greenwood', lat: 47.6905, lon: -122.355, anchor: 'end' },
        { name: 'University District', lat: 47.661, lon: -122.313, anchor: 'start' },
        { name: 'Capitol Hill', lat: 47.623, lon: -122.318, anchor: 'start' },
        { name: 'Queen Anne', lat: 47.637, lon: -122.357, anchor: 'end' },
        { name: 'Downtown', lat: 47.608, lon: -122.336, anchor: 'end' },
        { name: 'Pioneer Square', lat: 47.6015, lon: -122.333, anchor: 'end' },
        { name: 'SoDo', lat: 47.588, lon: -122.33, anchor: 'end' },
        { name: 'Beacon Hill', lat: 47.566, lon: -122.311, anchor: 'start' },
        { name: 'Columbia City', lat: 47.559, lon: -122.287, anchor: 'start' },
        { name: 'West Seattle', lat: 47.568, lon: -122.386, anchor: 'end' },
        { name: 'Shoreline', lat: 47.756, lon: -122.341, anchor: 'end' },
        { name: 'Kirkland', lat: 47.677, lon: -122.206, anchor: 'start' },
        { name: 'Bellevue', lat: 47.61, lon: -122.201, anchor: 'start' },
        { name: 'Redmond', lat: 47.674, lon: -122.121, anchor: 'start' },
        { name: 'Woodinville', lat: 47.754, lon: -122.163, anchor: 'start' },
        { name: 'Renton', lat: 47.483, lon: -122.217, anchor: 'start' },
        { name: 'Tukwila', lat: 47.474, lon: -122.26, anchor: 'end' },
        { name: 'Kent', lat: 47.381, lon: -122.235, anchor: 'start' },
        { name: 'Federal Way', lat: 47.322, lon: -122.313, anchor: 'end' },
        { name: 'Auburn', lat: 47.307, lon: -122.229, anchor: 'start' },
        { name: 'Tacoma', lat: 47.253, lon: -122.444, anchor: 'end' },
        { name: 'Puget Sound', lat: 47.52, lon: -122.47, kind: 'water', anchor: 'middle' },
        { name: 'Elliott Bay', lat: 47.603, lon: -122.368, kind: 'water', anchor: 'middle' },
        { name: 'Lake Washington', lat: 47.62, lon: -122.25, kind: 'water', anchor: 'middle' },
        { name: 'Lake Union', lat: 47.639, lon: -122.335, kind: 'water', anchor: 'middle' },
        { name: 'Lake Sammamish', lat: 47.6, lon: -122.09, kind: 'water', anchor: 'middle' },
        { name: 'Commencement Bay', lat: 47.285, lon: -122.43, kind: 'water', anchor: 'middle' },
      ],
    },
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    feeds: FEEDS,
    hoods: HOODS, hoodsRest: HOODS_REST,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: 'Seattle Center', // where the Seattle Center sweep's unnamed sub-spots (lawns, courtyards, stages) are filed; the Alliance feeds are pinned to Around Pioneer Square instead
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);

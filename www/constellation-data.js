// constellation-data.js — астрономические данные звёзд и созвездий
//
// ИСТОЧНИКИ (авторитетные первичные, без ручного/алгоритмического угадывания):
//  1. Топология (list of star-to-star lines) — Stellarium sky culture "modern_iau":
//     https://github.com/Stellarium/stellarium/blob/master/skycultures/modern_iau/index.json
//     Это фигуры Sky & Telescope (Alan MacRobert, при участии Roger Sinnott и Rick
//     Fienberg), официально размещённые на сайте IAU. Линии заданы как
//     последовательности Hipparcos-номеров и скопированы 1:1, без изменений.
//  2. Координаты и звёздная величина — Hipparcos Main Catalogue (I/239/hip_main.dat),
//     скачан напрямую с CDS FTP: https://cdsarc.cds.unistra.fr/vizier/ftp/cats/I/239/
//  3. Собственные имена звёзд — Stellarium skycultures/common_star_names.fab (по HIP).
//
// STAR_DATA[starId] = { id, hip, name, ra, dec, magnitude }
//   starId = "HIP<номер>" — стабильный уникальный идентификатор звезды.
//   ra/dec — астрономические координаты (градусы), используются только для
//   идентификации звезды, НЕ для отображения на экране.
//
// CONSTELLATION_DATA[code] = { id, name, nameRu, nameLa, stars, lines, display }
//   code — трёхбуквенный IAU-код (напр. "Ori").
//   stars — список starId, входящих в созвездие.
//   lines — список пар [starIdA, starIdB], топология рисунка (скопирована из
//   Stellarium modern_iau, не сгенерирована алгоритмически).
//   display.stars[starId] = {x, y} — координаты ТОЛЬКО для отрисовки SVG
//   (viewBox 160×240), получены гномонической проекцией вокруг центра
//   созвездия. Это не RA/Dec и не должны использоваться как таковые.
//
// STAR_REWARD_POOL — детерминированный порядок выдачи звёзд игроку.
//   Построен волнами: 88 созвездий отсортированы по magnitude их самой яркой
//   звезды (ярче → тусклее, tie-break — IAU-код по алфавиту); внутри каждого
//   созвездия звёзды отсортированы по magnitude (ярче → тусклее); волна N
//   берёт N-ю по яркости звезду из каждого созвездия, у которого она есть.
//   Одна физическая звезда, общая для нескольких созвездий, встречается в
//   пуле только один раз. Полностью детерминировано, без Math.random().

(function () {
  const STAR_DATA = {
  "HIP677": {
    "id": "HIP677",
    "hip": 677,
    "name": "Alpheratz",
    "ra": 2.09653333,
    "dec": 29.09082805,
    "magnitude": 2.07
  },
  "HIP746": {
    "id": "HIP746",
    "hip": 746,
    "name": "Caph",
    "ra": 2.29204036,
    "dec": 59.15021814,
    "magnitude": 2.28
  },
  "HIP765": {
    "id": "HIP765",
    "hip": 765,
    "name": null,
    "ra": 2.35224949,
    "dec": -45.74698836,
    "magnitude": 3.88
  },
  "HIP1067": {
    "id": "HIP1067",
    "hip": 1067,
    "name": "Algenib",
    "ra": 3.30895828,
    "dec": 15.18361593,
    "magnitude": 2.83
  },
  "HIP1562": {
    "id": "HIP1562",
    "hip": 1562,
    "name": null,
    "ra": 4.85701265,
    "dec": -8.82382948,
    "magnitude": 3.56
  },
  "HIP1599": {
    "id": "HIP1599",
    "hip": 1599,
    "name": null,
    "ra": 5.00797581,
    "dec": -64.8776232,
    "magnitude": 4.23
  },
  "HIP2021": {
    "id": "HIP2021",
    "hip": 2021,
    "name": null,
    "ra": 6.41334183,
    "dec": -77.25503511,
    "magnitude": 2.82
  },
  "HIP2081": {
    "id": "HIP2081",
    "hip": 2081,
    "name": "Ankaa",
    "ra": 6.57028075,
    "dec": -42.30512197,
    "magnitude": 2.4
  },
  "HIP2484": {
    "id": "HIP2484",
    "hip": 2484,
    "name": null,
    "ra": 7.88566992,
    "dec": -62.95808549,
    "magnitude": 4.36
  },
  "HIP2912": {
    "id": "HIP2912",
    "hip": 2912,
    "name": null,
    "ra": 9.22016239,
    "dec": 33.71935227,
    "magnitude": 4.34
  },
  "HIP3031": {
    "id": "HIP3031",
    "hip": 3031,
    "name": null,
    "ra": 9.63958024,
    "dec": 29.312369,
    "magnitude": 4.34
  },
  "HIP3092": {
    "id": "HIP3092",
    "hip": 3092,
    "name": null,
    "ra": 9.83165567,
    "dec": 30.86122579,
    "magnitude": 3.27
  },
  "HIP3179": {
    "id": "HIP3179",
    "hip": 3179,
    "name": "Schedar",
    "ra": 10.12661349,
    "dec": 56.53740928,
    "magnitude": 2.24
  },
  "HIP3419": {
    "id": "HIP3419",
    "hip": 3419,
    "name": "Diphda",
    "ra": 10.89678452,
    "dec": -17.9866841,
    "magnitude": 2.04
  },
  "HIP3693": {
    "id": "HIP3693",
    "hip": 3693,
    "name": null,
    "ra": 11.83495908,
    "dec": 24.26737703,
    "magnitude": 4.08
  },
  "HIP3786": {
    "id": "HIP3786",
    "hip": 3786,
    "name": null,
    "ra": 12.17039736,
    "dec": 7.58520186,
    "magnitude": 4.44
  },
  "HIP3881": {
    "id": "HIP3881",
    "hip": 3881,
    "name": null,
    "ra": 12.45345723,
    "dec": 41.07895474,
    "magnitude": 4.53
  },
  "HIP4427": {
    "id": "HIP4427",
    "hip": 4427,
    "name": null,
    "ra": 14.17708808,
    "dec": 60.71674966,
    "magnitude": 2.15
  },
  "HIP4436": {
    "id": "HIP4436",
    "hip": 4436,
    "name": null,
    "ra": 14.18790699,
    "dec": 38.49925513,
    "magnitude": 3.86
  },
  "HIP4463": {
    "id": "HIP4463",
    "hip": 4463,
    "name": null,
    "ra": 14.30178237,
    "dec": 23.41775997,
    "magnitude": 4.4
  },
  "HIP4577": {
    "id": "HIP4577",
    "hip": 4577,
    "name": null,
    "ra": 14.65144118,
    "dec": -29.35746436,
    "magnitude": 4.3
  },
  "HIP4906": {
    "id": "HIP4906",
    "hip": 4906,
    "name": null,
    "ra": 15.73606615,
    "dec": 7.89007256,
    "magnitude": 4.27
  },
  "HIP5165": {
    "id": "HIP5165",
    "hip": 5165,
    "name": null,
    "ra": 16.52127713,
    "dec": -46.71849042,
    "magnitude": 3.32
  },
  "HIP5348": {
    "id": "HIP5348",
    "hip": 5348,
    "name": "Wurren",
    "ra": 17.0960837,
    "dec": -55.24583235,
    "magnitude": 3.94
  },
  "HIP5364": {
    "id": "HIP5364",
    "hip": 5364,
    "name": null,
    "ra": 17.14693197,
    "dec": -10.181928,
    "magnitude": 3.46
  },
  "HIP5434": {
    "id": "HIP5434",
    "hip": 5434,
    "name": null,
    "ra": 17.37550908,
    "dec": 47.2418241,
    "magnitude": 4.26
  },
  "HIP5447": {
    "id": "HIP5447",
    "hip": 5447,
    "name": "Mirach",
    "ra": 17.43248991,
    "dec": 35.62083048,
    "magnitude": 2.07
  },
  "HIP5586": {
    "id": "HIP5586",
    "hip": 5586,
    "name": null,
    "ra": 17.91494471,
    "dec": 30.08972962,
    "magnitude": 4.51
  },
  "HIP5742": {
    "id": "HIP5742",
    "hip": 5742,
    "name": null,
    "ra": 18.43723014,
    "dec": 24.58376482,
    "magnitude": 4.67
  },
  "HIP6193": {
    "id": "HIP6193",
    "hip": 6193,
    "name": null,
    "ra": 19.86657455,
    "dec": 27.26408682,
    "magnitude": 4.74
  },
  "HIP6537": {
    "id": "HIP6537",
    "hip": 6537,
    "name": null,
    "ra": 21.00604671,
    "dec": -8.18275372,
    "magnitude": 3.6
  },
  "HIP6686": {
    "id": "HIP6686",
    "hip": 6686,
    "name": "Ruchbah",
    "ra": 21.45251267,
    "dec": 60.23540347,
    "magnitude": 2.66
  },
  "HIP6867": {
    "id": "HIP6867",
    "hip": 6867,
    "name": null,
    "ra": 22.0914236,
    "dec": -43.31772906,
    "magnitude": 3.41
  },
  "HIP7083": {
    "id": "HIP7083",
    "hip": 7083,
    "name": null,
    "ra": 22.81242306,
    "dec": -49.07307701,
    "magnitude": 3.93
  },
  "HIP7097": {
    "id": "HIP7097",
    "hip": 7097,
    "name": "Alpherg",
    "ra": 22.87080776,
    "dec": 15.34583101,
    "magnitude": 3.62
  },
  "HIP7588": {
    "id": "HIP7588",
    "hip": 7588,
    "name": "Achernar",
    "ra": 24.42813204,
    "dec": -57.23666007,
    "magnitude": 0.45
  },
  "HIP7607": {
    "id": "HIP7607",
    "hip": 7607,
    "name": "Nembus",
    "ra": 24.49792651,
    "dec": 48.62848641,
    "magnitude": 3.59
  },
  "HIP7884": {
    "id": "HIP7884",
    "hip": 7884,
    "name": null,
    "ra": 25.35794814,
    "dec": 5.48760445,
    "magnitude": 4.45
  },
  "HIP8068": {
    "id": "HIP8068",
    "hip": 8068,
    "name": null,
    "ra": 25.9150637,
    "dec": 50.6887655,
    "magnitude": 4.01
  },
  "HIP8102": {
    "id": "HIP8102",
    "hip": 8102,
    "name": null,
    "ra": 26.02136441,
    "dec": -15.93955597,
    "magnitude": 3.49
  },
  "HIP8198": {
    "id": "HIP8198",
    "hip": 8198,
    "name": "Torcular",
    "ra": 26.34828629,
    "dec": 9.15764102,
    "magnitude": 4.26
  },
  "HIP8645": {
    "id": "HIP8645",
    "hip": 8645,
    "name": "Baten Kaitos",
    "ra": 27.86504416,
    "dec": -10.33494526,
    "magnitude": 3.74
  },
  "HIP8796": {
    "id": "HIP8796",
    "hip": 8796,
    "name": "Mothallah",
    "ra": 28.27041595,
    "dec": 29.57939727,
    "magnitude": 3.42
  },
  "HIP8832": {
    "id": "HIP8832",
    "hip": 8832,
    "name": "Mesarthim",
    "ra": 28.38235506,
    "dec": 19.29409264,
    "magnitude": 3.88
  },
  "HIP8886": {
    "id": "HIP8886",
    "hip": 8886,
    "name": "Segin",
    "ra": 28.59868107,
    "dec": 63.67014686,
    "magnitude": 3.35
  },
  "HIP8903": {
    "id": "HIP8903",
    "hip": 8903,
    "name": "Sheratan",
    "ra": 28.65978771,
    "dec": 20.80829949,
    "magnitude": 2.64
  },
  "HIP9007": {
    "id": "HIP9007",
    "hip": 9007,
    "name": null,
    "ra": 28.98680207,
    "dec": -51.60958673,
    "magnitude": 3.69
  },
  "HIP9236": {
    "id": "HIP9236",
    "hip": 9236,
    "name": null,
    "ra": 29.69113269,
    "dec": -61.56992444,
    "magnitude": 2.86
  },
  "HIP9487": {
    "id": "HIP9487",
    "hip": 9487,
    "name": "Alrescha",
    "ra": 30.51166929,
    "dec": 2.76376048,
    "magnitude": 3.82
  },
  "HIP9640": {
    "id": "HIP9640",
    "hip": 9640,
    "name": "Almach",
    "ra": 30.97466283,
    "dec": 42.32984832,
    "magnitude": 2.1
  },
  "HIP9677": {
    "id": "HIP9677",
    "hip": 9677,
    "name": null,
    "ra": 31.12262534,
    "dec": -29.29683966,
    "magnitude": 4.68
  },
  "HIP9884": {
    "id": "HIP9884",
    "hip": 9884,
    "name": "Hamal",
    "ra": 31.79285757,
    "dec": 23.46277743,
    "magnitude": 2.01
  },
  "HIP10064": {
    "id": "HIP10064",
    "hip": 10064,
    "name": null,
    "ra": 32.38550383,
    "dec": 34.98739204,
    "magnitude": 3
  },
  "HIP10670": {
    "id": "HIP10670",
    "hip": 10670,
    "name": null,
    "ra": 34.32848216,
    "dec": 33.84732099,
    "magnitude": 4.03
  },
  "HIP10826": {
    "id": "HIP10826",
    "hip": 10826,
    "name": "Mira",
    "ra": 34.83661103,
    "dec": -2.97706055,
    "magnitude": 6.47
  },
  "HIP11001": {
    "id": "HIP11001",
    "hip": 11001,
    "name": null,
    "ra": 35.43759585,
    "dec": -68.6594239,
    "magnitude": 4.08
  },
  "HIP11407": {
    "id": "HIP11407",
    "hip": 11407,
    "name": null,
    "ra": 36.74627081,
    "dec": -47.70382692,
    "magnitude": 4.24
  },
  "HIP11484": {
    "id": "HIP11484",
    "hip": 11484,
    "name": null,
    "ra": 37.03965786,
    "dec": 8.4600887,
    "magnitude": 4.3
  },
  "HIP11767": {
    "id": "HIP11767",
    "hip": 11767,
    "name": "Polaris",
    "ra": 37.94614689,
    "dec": 89.26413805,
    "magnitude": 1.97
  },
  "HIP12225": {
    "id": "HIP12225",
    "hip": 12225,
    "name": null,
    "ra": 39.35110362,
    "dec": -52.54308845,
    "magnitude": 5.3
  },
  "HIP12387": {
    "id": "HIP12387",
    "hip": 12387,
    "name": null,
    "ra": 39.87061789,
    "dec": 0.3285168,
    "magnitude": 4.08
  },
  "HIP12413": {
    "id": "HIP12413",
    "hip": 12413,
    "name": null,
    "ra": 39.94966387,
    "dec": -42.89163328,
    "magnitude": 4.74
  },
  "HIP12484": {
    "id": "HIP12484",
    "hip": 12484,
    "name": null,
    "ra": 40.16491631,
    "dec": -54.54992422,
    "magnitude": 5.21
  },
  "HIP12486": {
    "id": "HIP12486",
    "hip": 12486,
    "name": null,
    "ra": 40.16638213,
    "dec": -39.85530905,
    "magnitude": 4.11
  },
  "HIP12653": {
    "id": "HIP12653",
    "hip": 12653,
    "name": null,
    "ra": 40.63816025,
    "dec": -50.80082665,
    "magnitude": 5.4
  },
  "HIP12706": {
    "id": "HIP12706",
    "hip": 12706,
    "name": "Kaffaljidhma",
    "ra": 40.82551897,
    "dec": 3.23617162,
    "magnitude": 3.47
  },
  "HIP12770": {
    "id": "HIP12770",
    "hip": 12770,
    "name": null,
    "ra": 41.03064356,
    "dec": -13.85867594,
    "magnitude": 4.24
  },
  "HIP12777": {
    "id": "HIP12777",
    "hip": 12777,
    "name": null,
    "ra": 41.04869991,
    "dec": 49.22866639,
    "magnitude": 4.1
  },
  "HIP12828": {
    "id": "HIP12828",
    "hip": 12828,
    "name": null,
    "ra": 41.23488901,
    "dec": 10.11421979,
    "magnitude": 4.27
  },
  "HIP12843": {
    "id": "HIP12843",
    "hip": 12843,
    "name": null,
    "ra": 41.27492276,
    "dec": -18.57265077,
    "magnitude": 4.47
  },
  "HIP13147": {
    "id": "HIP13147",
    "hip": 13147,
    "name": null,
    "ra": 42.27233113,
    "dec": -32.40628403,
    "magnitude": 4.45
  },
  "HIP13209": {
    "id": "HIP13209",
    "hip": 13209,
    "name": "Bharani",
    "ra": 42.49578911,
    "dec": 27.26079044,
    "magnitude": 3.61
  },
  "HIP13268": {
    "id": "HIP13268",
    "hip": 13268,
    "name": "Miram",
    "ra": 42.67413655,
    "dec": 55.89552955,
    "magnitude": 3.77
  },
  "HIP13531": {
    "id": "HIP13531",
    "hip": 13531,
    "name": null,
    "ra": 43.564427,
    "dec": 52.76248991,
    "magnitude": 3.93
  },
  "HIP13701": {
    "id": "HIP13701",
    "hip": 13701,
    "name": "Azha",
    "ra": 44.10668245,
    "dec": -8.89760976,
    "magnitude": 3.89
  },
  "HIP13847": {
    "id": "HIP13847",
    "hip": 13847,
    "name": "Acamar",
    "ra": 44.5654818,
    "dec": -40.30473491,
    "magnitude": 2.88
  },
  "HIP13884": {
    "id": "HIP13884",
    "hip": 13884,
    "name": null,
    "ra": 44.69902505,
    "dec": -64.07129717,
    "magnitude": 4.98
  },
  "HIP13954": {
    "id": "HIP13954",
    "hip": 13954,
    "name": null,
    "ra": 44.92873469,
    "dec": 8.90740111,
    "magnitude": 4.71
  },
  "HIP14135": {
    "id": "HIP14135",
    "hip": 14135,
    "name": "Menkar",
    "ra": 45.56991279,
    "dec": 4.08992539,
    "magnitude": 2.54
  },
  "HIP14146": {
    "id": "HIP14146",
    "hip": 14146,
    "name": null,
    "ra": 45.59830468,
    "dec": -23.62433613,
    "magnitude": 4.08
  },
  "HIP14240": {
    "id": "HIP14240",
    "hip": 14240,
    "name": null,
    "ra": 45.90376552,
    "dec": -59.73761994,
    "magnitude": 5.12
  },
  "HIP14328": {
    "id": "HIP14328",
    "hip": 14328,
    "name": null,
    "ra": 46.19912598,
    "dec": 53.50645031,
    "magnitude": 2.91
  },
  "HIP14354": {
    "id": "HIP14354",
    "hip": 14354,
    "name": null,
    "ra": 46.29373754,
    "dec": 38.84053298,
    "magnitude": 3.32
  },
  "HIP14576": {
    "id": "HIP14576",
    "hip": 14576,
    "name": "Algol",
    "ra": 47.04220716,
    "dec": 40.9556512,
    "magnitude": 2.09
  },
  "HIP14632": {
    "id": "HIP14632",
    "hip": 14632,
    "name": null,
    "ra": 47.26201363,
    "dec": 49.61350009,
    "magnitude": 4.05
  },
  "HIP14668": {
    "id": "HIP14668",
    "hip": 14668,
    "name": "Misam",
    "ra": 47.37345463,
    "dec": 44.85788896,
    "magnitude": 3.79
  },
  "HIP14879": {
    "id": "HIP14879",
    "hip": 14879,
    "name": "Dalim",
    "ra": 48.01783332,
    "dec": -28.98910623,
    "magnitude": 3.8
  },
  "HIP15474": {
    "id": "HIP15474",
    "hip": 15474,
    "name": null,
    "ra": 49.87904033,
    "dec": -21.7579421,
    "magnitude": 3.7
  },
  "HIP15510": {
    "id": "HIP15510",
    "hip": 15510,
    "name": null,
    "ra": 49.97177014,
    "dec": -43.07154929,
    "magnitude": 4.26
  },
  "HIP15863": {
    "id": "HIP15863",
    "hip": 15863,
    "name": "Mirfak",
    "ra": 51.08061889,
    "dec": 49.86124281,
    "magnitude": 1.79
  },
  "HIP15900": {
    "id": "HIP15900",
    "hip": 15900,
    "name": null,
    "ra": 51.20349011,
    "dec": 9.02906504,
    "magnitude": 3.61
  },
  "HIP16083": {
    "id": "HIP16083",
    "hip": 16083,
    "name": null,
    "ra": 51.79217049,
    "dec": 9.7327724,
    "magnitude": 3.73
  },
  "HIP16228": {
    "id": "HIP16228",
    "hip": 16228,
    "name": null,
    "ra": 52.26722684,
    "dec": 59.94033461,
    "magnitude": 4.21
  },
  "HIP16537": {
    "id": "HIP16537",
    "hip": 16537,
    "name": "Ran",
    "ra": 53.23509009,
    "dec": -9.45830584,
    "magnitude": 3.72
  },
  "HIP16611": {
    "id": "HIP16611",
    "hip": 16611,
    "name": null,
    "ra": 53.44686638,
    "dec": -21.63281597,
    "magnitude": 4.26
  },
  "HIP16852": {
    "id": "HIP16852",
    "hip": 16852,
    "name": null,
    "ra": 54.21882896,
    "dec": 0.40283316,
    "magnitude": 4.29
  },
  "HIP16870": {
    "id": "HIP16870",
    "hip": 16870,
    "name": null,
    "ra": 54.2736588,
    "dec": -40.27451075,
    "magnitude": 4.57
  },
  "HIP17358": {
    "id": "HIP17358",
    "hip": 17358,
    "name": null,
    "ra": 55.7311754,
    "dec": 47.7876533,
    "magnitude": 3.01
  },
  "HIP17378": {
    "id": "HIP17378",
    "hip": 17378,
    "name": "Rana",
    "ra": 55.81231706,
    "dec": -9.76519868,
    "magnitude": 3.52
  },
  "HIP17440": {
    "id": "HIP17440",
    "hip": 17440,
    "name": null,
    "ra": 56.04814541,
    "dec": -64.80709398,
    "magnitude": 3.84
  },
  "HIP17448": {
    "id": "HIP17448",
    "hip": 17448,
    "name": "Atik",
    "ra": 56.07969347,
    "dec": 32.28827325,
    "magnitude": 3.84
  },
  "HIP17593": {
    "id": "HIP17593",
    "hip": 17593,
    "name": null,
    "ra": 56.53542672,
    "dec": -12.1017353,
    "magnitude": 4.43
  },
  "HIP17651": {
    "id": "HIP17651",
    "hip": 17651,
    "name": null,
    "ra": 56.71245432,
    "dec": -23.248438,
    "magnitude": 4.22
  },
  "HIP17678": {
    "id": "HIP17678",
    "hip": 17678,
    "name": null,
    "ra": 56.80929799,
    "dec": -74.23924251,
    "magnitude": 3.26
  },
  "HIP17874": {
    "id": "HIP17874",
    "hip": 17874,
    "name": null,
    "ra": 57.36367035,
    "dec": -36.2001125,
    "magnitude": 4.17
  },
  "HIP17884": {
    "id": "HIP17884",
    "hip": 17884,
    "name": null,
    "ra": 57.38035594,
    "dec": 65.52600645,
    "magnitude": 4.39
  },
  "HIP17959": {
    "id": "HIP17959",
    "hip": 17959,
    "name": null,
    "ra": 57.58948256,
    "dec": 71.33236777,
    "magnitude": 4.59
  },
  "HIP18216": {
    "id": "HIP18216",
    "hip": 18216,
    "name": null,
    "ra": 58.42784574,
    "dec": -24.61221253,
    "magnitude": 4.64
  },
  "HIP18246": {
    "id": "HIP18246",
    "hip": 18246,
    "name": null,
    "ra": 58.53299363,
    "dec": 31.88365776,
    "magnitude": 2.84
  },
  "HIP18532": {
    "id": "HIP18532",
    "hip": 18532,
    "name": null,
    "ra": 59.46342138,
    "dec": 40.01027315,
    "magnitude": 2.9
  },
  "HIP18543": {
    "id": "HIP18543",
    "hip": 18543,
    "name": "Zaurak",
    "ra": 59.50720862,
    "dec": -13.50824471,
    "magnitude": 2.97
  },
  "HIP18597": {
    "id": "HIP18597",
    "hip": 18597,
    "name": null,
    "ra": 59.68640623,
    "dec": -61.40015059,
    "magnitude": 4.56
  },
  "HIP18614": {
    "id": "HIP18614",
    "hip": 18614,
    "name": "Menkib",
    "ra": 59.74124892,
    "dec": 35.79102701,
    "magnitude": 3.98
  },
  "HIP18673": {
    "id": "HIP18673",
    "hip": 18673,
    "name": null,
    "ra": 59.98115045,
    "dec": -24.01625677,
    "magnitude": 4.62
  },
  "HIP18724": {
    "id": "HIP18724",
    "hip": 18724,
    "name": null,
    "ra": 60.17008591,
    "dec": 12.49037571,
    "magnitude": 3.41
  },
  "HIP18907": {
    "id": "HIP18907",
    "hip": 18907,
    "name": null,
    "ra": 60.78907003,
    "dec": 5.98930909,
    "magnitude": 3.91
  },
  "HIP19167": {
    "id": "HIP19167",
    "hip": 19167,
    "name": null,
    "ra": 61.64606374,
    "dec": 50.35135022,
    "magnitude": 4.25
  },
  "HIP19343": {
    "id": "HIP19343",
    "hip": 19343,
    "name": null,
    "ra": 62.16530527,
    "dec": 47.71259359,
    "magnitude": 3.96
  },
  "HIP19587": {
    "id": "HIP19587",
    "hip": 19587,
    "name": "Beid",
    "ra": 62.96638834,
    "dec": -6.8377787,
    "magnitude": 4.04
  },
  "HIP19747": {
    "id": "HIP19747",
    "hip": 19747,
    "name": null,
    "ra": 63.5003388,
    "dec": -42.29387294,
    "magnitude": 3.85
  },
  "HIP19780": {
    "id": "HIP19780",
    "hip": 19780,
    "name": null,
    "ra": 63.60596306,
    "dec": -62.47397888,
    "magnitude": 3.33
  },
  "HIP19812": {
    "id": "HIP19812",
    "hip": 19812,
    "name": null,
    "ra": 63.72440722,
    "dec": 48.40937312,
    "magnitude": 4.12
  },
  "HIP19893": {
    "id": "HIP19893",
    "hip": 19893,
    "name": null,
    "ra": 64.00621426,
    "dec": -51.48709578,
    "magnitude": 4.26
  },
  "HIP19921": {
    "id": "HIP19921",
    "hip": 19921,
    "name": null,
    "ra": 64.12118133,
    "dec": -59.30174841,
    "magnitude": 4.44
  },
  "HIP20042": {
    "id": "HIP20042",
    "hip": 20042,
    "name": null,
    "ra": 64.47341068,
    "dec": -33.79833145,
    "magnitude": 3.55
  },
  "HIP20070": {
    "id": "HIP20070",
    "hip": 20070,
    "name": null,
    "ra": 64.56073112,
    "dec": 50.29563944,
    "magnitude": 4.6
  },
  "HIP20205": {
    "id": "HIP20205",
    "hip": 20205,
    "name": "Prima Hyadum",
    "ra": 64.94805793,
    "dec": 15.62770031,
    "magnitude": 3.65
  },
  "HIP20455": {
    "id": "HIP20455",
    "hip": 20455,
    "name": "Secunda Hyadum",
    "ra": 65.73344722,
    "dec": 17.5425843,
    "magnitude": 3.77
  },
  "HIP20535": {
    "id": "HIP20535",
    "hip": 20535,
    "name": "Beemim",
    "ra": 66.00902233,
    "dec": -34.01698632,
    "magnitude": 3.97
  },
  "HIP20889": {
    "id": "HIP20889",
    "hip": 20889,
    "name": "Ain",
    "ra": 67.15388879,
    "dec": 19.18052092,
    "magnitude": 3.53
  },
  "HIP20894": {
    "id": "HIP20894",
    "hip": 20894,
    "name": "Chamukuy",
    "ra": 67.16531219,
    "dec": 15.8709468,
    "magnitude": 3.4
  },
  "HIP21060": {
    "id": "HIP21060",
    "hip": 21060,
    "name": null,
    "ra": 67.70874038,
    "dec": -44.95374351,
    "magnitude": 5.07
  },
  "HIP21248": {
    "id": "HIP21248",
    "hip": 21248,
    "name": null,
    "ra": 68.3776229,
    "dec": -29.76583186,
    "magnitude": 4.49
  },
  "HIP21281": {
    "id": "HIP21281",
    "hip": 21281,
    "name": null,
    "ra": 68.49882684,
    "dec": -55.04500559,
    "magnitude": 3.3
  },
  "HIP21393": {
    "id": "HIP21393",
    "hip": 21393,
    "name": "Theemin",
    "ra": 68.88779874,
    "dec": -30.56231049,
    "magnitude": 3.81
  },
  "HIP21421": {
    "id": "HIP21421",
    "hip": 21421,
    "name": "Aldebaran",
    "ra": 68.98000195,
    "dec": 16.50976164,
    "magnitude": 0.87
  },
  "HIP21444": {
    "id": "HIP21444",
    "hip": 21444,
    "name": null,
    "ra": 69.07975243,
    "dec": -3.352448,
    "magnitude": 3.93
  },
  "HIP21770": {
    "id": "HIP21770",
    "hip": 21770,
    "name": null,
    "ra": 70.14092957,
    "dec": -41.86357034,
    "magnitude": 4.44
  },
  "HIP21861": {
    "id": "HIP21861",
    "hip": 21861,
    "name": null,
    "ra": 70.51435953,
    "dec": -37.14476616,
    "magnitude": 5.04
  },
  "HIP22109": {
    "id": "HIP22109",
    "hip": 22109,
    "name": null,
    "ra": 71.37558764,
    "dec": -3.25462465,
    "magnitude": 4.01
  },
  "HIP22449": {
    "id": "HIP22449",
    "hip": 22449,
    "name": "Tabit",
    "ra": 72.45890935,
    "dec": 6.96124744,
    "magnitude": 3.19
  },
  "HIP22509": {
    "id": "HIP22509",
    "hip": 22509,
    "name": null,
    "ra": 72.65300943,
    "dec": 8.90025258,
    "magnitude": 4.35
  },
  "HIP22549": {
    "id": "HIP22549",
    "hip": 22549,
    "name": null,
    "ra": 72.80152507,
    "dec": 5.60510146,
    "magnitude": 3.68
  },
  "HIP22783": {
    "id": "HIP22783",
    "hip": 22783,
    "name": null,
    "ra": 73.51254425,
    "dec": 66.34266029,
    "magnitude": 4.26
  },
  "HIP22797": {
    "id": "HIP22797",
    "hip": 22797,
    "name": null,
    "ra": 73.5628985,
    "dec": 2.44067149,
    "magnitude": 3.71
  },
  "HIP22845": {
    "id": "HIP22845",
    "hip": 22845,
    "name": null,
    "ra": 73.7237672,
    "dec": 10.15114511,
    "magnitude": 4.64
  },
  "HIP22957": {
    "id": "HIP22957",
    "hip": 22957,
    "name": null,
    "ra": 74.09300449,
    "dec": 13.51457755,
    "magnitude": 4.06
  },
  "HIP23015": {
    "id": "HIP23015",
    "hip": 23015,
    "name": "Hassaleh",
    "ra": 74.24840098,
    "dec": 33.16613537,
    "magnitude": 2.69
  },
  "HIP23040": {
    "id": "HIP23040",
    "hip": 23040,
    "name": null,
    "ra": 74.32175175,
    "dec": 53.75208289,
    "magnitude": 4.43
  },
  "HIP23123": {
    "id": "HIP23123",
    "hip": 23123,
    "name": null,
    "ra": 74.63709525,
    "dec": 1.71403506,
    "magnitude": 4.47
  },
  "HIP23416": {
    "id": "HIP23416",
    "hip": 23416,
    "name": "Almaaz",
    "ra": 75.49222507,
    "dec": 43.82331397,
    "magnitude": 3.03
  },
  "HIP23453": {
    "id": "HIP23453",
    "hip": 23453,
    "name": "Saclateni",
    "ra": 75.61950025,
    "dec": 41.07588953,
    "magnitude": 3.69
  },
  "HIP23467": {
    "id": "HIP23467",
    "hip": 23467,
    "name": null,
    "ra": 75.67918703,
    "dec": -71.31432608,
    "magnitude": 5.3
  },
  "HIP23522": {
    "id": "HIP23522",
    "hip": 23522,
    "name": null,
    "ra": 75.854572,
    "dec": 60.44228144,
    "magnitude": 4.03
  },
  "HIP23595": {
    "id": "HIP23595",
    "hip": 23595,
    "name": null,
    "ra": 76.10129897,
    "dec": -35.48287057,
    "magnitude": 4.55
  },
  "HIP23607": {
    "id": "HIP23607",
    "hip": 23607,
    "name": null,
    "ra": 76.1422432,
    "dec": 15.40418059,
    "magnitude": 4.65
  },
  "HIP23685": {
    "id": "HIP23685",
    "hip": 23685,
    "name": null,
    "ra": 76.36521705,
    "dec": -22.37085673,
    "magnitude": 3.19
  },
  "HIP23693": {
    "id": "HIP23693",
    "hip": 23693,
    "name": null,
    "ra": 76.37787652,
    "dec": -57.47298928,
    "magnitude": 4.71
  },
  "HIP23767": {
    "id": "HIP23767",
    "hip": 23767,
    "name": "Haedus",
    "ra": 76.62862102,
    "dec": 41.23464074,
    "magnitude": 3.18
  },
  "HIP23875": {
    "id": "HIP23875",
    "hip": 23875,
    "name": "Cursa",
    "ra": 76.96264146,
    "dec": -5.08626282,
    "magnitude": 2.78
  },
  "HIP24305": {
    "id": "HIP24305",
    "hip": 24305,
    "name": null,
    "ra": 78.2328046,
    "dec": -16.20542901,
    "magnitude": 3.29
  },
  "HIP24327": {
    "id": "HIP24327",
    "hip": 24327,
    "name": null,
    "ra": 78.30785422,
    "dec": -12.94128833,
    "magnitude": 4.36
  },
  "HIP24436": {
    "id": "HIP24436",
    "hip": 24436,
    "name": "Rigel",
    "ra": 78.63446353,
    "dec": -8.20163919,
    "magnitude": 0.18
  },
  "HIP24608": {
    "id": "HIP24608",
    "hip": 24608,
    "name": "Capella",
    "ra": 79.17206517,
    "dec": 45.99902927,
    "magnitude": 0.08
  },
  "HIP24845": {
    "id": "HIP24845",
    "hip": 24845,
    "name": null,
    "ra": 79.89385817,
    "dec": -13.17677698,
    "magnitude": 4.29
  },
  "HIP25281": {
    "id": "HIP25281",
    "hip": 25281,
    "name": null,
    "ra": 81.11923774,
    "dec": -2.39713844,
    "magnitude": 3.35
  },
  "HIP25336": {
    "id": "HIP25336",
    "hip": 25336,
    "name": "Bellatrix",
    "ra": 81.28278416,
    "dec": 6.34973451,
    "magnitude": 1.64
  },
  "HIP25428": {
    "id": "HIP25428",
    "hip": 25428,
    "name": "Elnath",
    "ra": 81.57290804,
    "dec": 28.60787346,
    "magnitude": 1.65
  },
  "HIP25606": {
    "id": "HIP25606",
    "hip": 25606,
    "name": "Nihal",
    "ra": 82.06135971,
    "dec": -20.75923214,
    "magnitude": 2.81
  },
  "HIP25859": {
    "id": "HIP25859",
    "hip": 25859,
    "name": null,
    "ra": 82.8030645,
    "dec": -35.47043592,
    "magnitude": 3.86
  },
  "HIP25930": {
    "id": "HIP25930",
    "hip": 25930,
    "name": "Mintaka",
    "ra": 83.00166562,
    "dec": -0.2990934,
    "magnitude": 2.25
  },
  "HIP25985": {
    "id": "HIP25985",
    "hip": 25985,
    "name": "Arneb",
    "ra": 83.18255798,
    "dec": -17.82229227,
    "magnitude": 2.58
  },
  "HIP26069": {
    "id": "HIP26069",
    "hip": 26069,
    "name": null,
    "ra": 83.40631813,
    "dec": -62.48985585,
    "magnitude": 3.76
  },
  "HIP26207": {
    "id": "HIP26207",
    "hip": 26207,
    "name": "Meissa",
    "ra": 83.78449043,
    "dec": 9.93416294,
    "magnitude": 3.39
  },
  "HIP26311": {
    "id": "HIP26311",
    "hip": 26311,
    "name": "Alnilam",
    "ra": 84.05338572,
    "dec": -1.20191725,
    "magnitude": 1.69
  },
  "HIP26451": {
    "id": "HIP26451",
    "hip": 26451,
    "name": "Tianguan",
    "ra": 84.41118447,
    "dec": 21.14259299,
    "magnitude": 2.97
  },
  "HIP26634": {
    "id": "HIP26634",
    "hip": 26634,
    "name": "Phact",
    "ra": 84.91224975,
    "dec": -34.07404941,
    "magnitude": 2.65
  },
  "HIP26727": {
    "id": "HIP26727",
    "hip": 26727,
    "name": "Alnitak",
    "ra": 85.18968672,
    "dec": -1.94257841,
    "magnitude": 1.74
  },
  "HIP27072": {
    "id": "HIP27072",
    "hip": 27072,
    "name": null,
    "ra": 86.11656241,
    "dec": -22.44748663,
    "magnitude": 3.59
  },
  "HIP27100": {
    "id": "HIP27100",
    "hip": 27100,
    "name": null,
    "ra": 86.19341279,
    "dec": -65.7355408,
    "magnitude": 4.34
  },
  "HIP27288": {
    "id": "HIP27288",
    "hip": 27288,
    "name": null,
    "ra": 86.73895728,
    "dec": -14.82194717,
    "magnitude": 3.55
  },
  "HIP27321": {
    "id": "HIP27321",
    "hip": 27321,
    "name": null,
    "ra": 86.82118054,
    "dec": -51.06671329,
    "magnitude": 3.85
  },
  "HIP27366": {
    "id": "HIP27366",
    "hip": 27366,
    "name": "Saiph",
    "ra": 86.93911641,
    "dec": -9.66960186,
    "magnitude": 2.07
  },
  "HIP27530": {
    "id": "HIP27530",
    "hip": 27530,
    "name": null,
    "ra": 87.45656999,
    "dec": -56.1664886,
    "magnitude": 4.5
  },
  "HIP27628": {
    "id": "HIP27628",
    "hip": 27628,
    "name": "Wazn",
    "ra": 87.7398034,
    "dec": -35.76929225,
    "magnitude": 3.12
  },
  "HIP27654": {
    "id": "HIP27654",
    "hip": 27654,
    "name": null,
    "ra": 87.82980343,
    "dec": -20.87751376,
    "magnitude": 3.76
  },
  "HIP27890": {
    "id": "HIP27890",
    "hip": 27890,
    "name": null,
    "ra": 88.52458376,
    "dec": -63.09102096,
    "magnitude": 4.65
  },
  "HIP27913": {
    "id": "HIP27913",
    "hip": 27913,
    "name": null,
    "ra": 88.59618305,
    "dec": 20.27641498,
    "magnitude": 4.39
  },
  "HIP27989": {
    "id": "HIP27989",
    "hip": 27989,
    "name": "Betelgeuse",
    "ra": 88.79287161,
    "dec": 7.40703634,
    "magnitude": 0.45
  },
  "HIP28103": {
    "id": "HIP28103",
    "hip": 28103,
    "name": null,
    "ra": 89.10132627,
    "dec": -14.16803805,
    "magnitude": 3.71
  },
  "HIP28199": {
    "id": "HIP28199",
    "hip": 28199,
    "name": null,
    "ra": 89.38421613,
    "dec": -35.28330688,
    "magnitude": 4.36
  },
  "HIP28328": {
    "id": "HIP28328",
    "hip": 28328,
    "name": null,
    "ra": 89.78662719,
    "dec": -42.81510761,
    "magnitude": 3.96
  },
  "HIP28358": {
    "id": "HIP28358",
    "hip": 28358,
    "name": null,
    "ra": 89.88145972,
    "dec": 54.28498197,
    "magnitude": 3.72
  },
  "HIP28360": {
    "id": "HIP28360",
    "hip": 28360,
    "name": "Menkalinan",
    "ra": 89.88237261,
    "dec": 44.94743492,
    "magnitude": 1.9
  },
  "HIP28380": {
    "id": "HIP28380",
    "hip": 28380,
    "name": "Mahasim",
    "ra": 89.93015897,
    "dec": 37.21276409,
    "magnitude": 2.65
  },
  "HIP28614": {
    "id": "HIP28614",
    "hip": 28614,
    "name": null,
    "ra": 90.59579323,
    "dec": 9.64736756,
    "magnitude": 4.12
  },
  "HIP28716": {
    "id": "HIP28716",
    "hip": 28716,
    "name": null,
    "ra": 90.9799315,
    "dec": 20.13845865,
    "magnitude": 4.64
  },
  "HIP28734": {
    "id": "HIP28734",
    "hip": 28734,
    "name": null,
    "ra": 91.0300689,
    "dec": 23.26363207,
    "magnitude": 4.16
  },
  "HIP28910": {
    "id": "HIP28910",
    "hip": 28910,
    "name": null,
    "ra": 91.53889172,
    "dec": -14.93528629,
    "magnitude": 4.67
  },
  "HIP29038": {
    "id": "HIP29038",
    "hip": 29038,
    "name": null,
    "ra": 91.89300774,
    "dec": 14.76852318,
    "magnitude": 4.42
  },
  "HIP29271": {
    "id": "HIP29271",
    "hip": 29271,
    "name": null,
    "ra": 92.55918047,
    "dec": -74.7525279,
    "magnitude": 5.08
  },
  "HIP29426": {
    "id": "HIP29426",
    "hip": 29426,
    "name": null,
    "ra": 92.98498656,
    "dec": 14.20881425,
    "magnitude": 4.45
  },
  "HIP29651": {
    "id": "HIP29651",
    "hip": 29651,
    "name": null,
    "ra": 93.71390194,
    "dec": -6.27472737,
    "magnitude": 3.99
  },
  "HIP29655": {
    "id": "HIP29655",
    "hip": 29655,
    "name": "Propus",
    "ra": 93.71956952,
    "dec": 22.50682376,
    "magnitude": 3.31
  },
  "HIP29997": {
    "id": "HIP29997",
    "hip": 29997,
    "name": null,
    "ra": 94.71158258,
    "dec": 69.3200343,
    "magnitude": 4.76
  },
  "HIP30060": {
    "id": "HIP30060",
    "hip": 30060,
    "name": null,
    "ra": 94.90579498,
    "dec": 59.01090518,
    "magnitude": 4.44
  },
  "HIP30277": {
    "id": "HIP30277",
    "hip": 30277,
    "name": null,
    "ra": 95.52852147,
    "dec": -33.43627251,
    "magnitude": 3.85
  },
  "HIP30324": {
    "id": "HIP30324",
    "hip": 30324,
    "name": "Mirzam",
    "ra": 95.6749475,
    "dec": -17.95591658,
    "magnitude": 1.98
  },
  "HIP30343": {
    "id": "HIP30343",
    "hip": 30343,
    "name": "Tejat",
    "ra": 95.73996302,
    "dec": 22.51385027,
    "magnitude": 2.87
  },
  "HIP30419": {
    "id": "HIP30419",
    "hip": 30419,
    "name": null,
    "ra": 95.94207368,
    "dec": 4.59283881,
    "magnitude": 4.39
  },
  "HIP30438": {
    "id": "HIP30438",
    "hip": 30438,
    "name": "Canopus",
    "ra": 95.98787763,
    "dec": -52.69571799,
    "magnitude": -0.62
  },
  "HIP30867": {
    "id": "HIP30867",
    "hip": 30867,
    "name": null,
    "ra": 97.20447548,
    "dec": -7.03305042,
    "magnitude": 3.76
  },
  "HIP30883": {
    "id": "HIP30883",
    "hip": 30883,
    "name": null,
    "ra": 97.24079361,
    "dec": 20.2121672,
    "magnitude": 4.13
  },
  "HIP31216": {
    "id": "HIP31216",
    "hip": 31216,
    "name": null,
    "ra": 98.22595658,
    "dec": 7.33297921,
    "magnitude": 4.47
  },
  "HIP31592": {
    "id": "HIP31592",
    "hip": 31592,
    "name": null,
    "ra": 99.17082883,
    "dec": -19.25570928,
    "magnitude": 3.95
  },
  "HIP31681": {
    "id": "HIP31681",
    "hip": 31681,
    "name": "Alhena",
    "ra": 99.42792641,
    "dec": 16.39941482,
    "magnitude": 1.93
  },
  "HIP31685": {
    "id": "HIP31685",
    "hip": 31685,
    "name": null,
    "ra": 99.44029869,
    "dec": -43.19592394,
    "magnitude": 3.17
  },
  "HIP31978": {
    "id": "HIP31978",
    "hip": 31978,
    "name": null,
    "ra": 100.24442101,
    "dec": 9.89576021,
    "magnitude": 4.66
  },
  "HIP32246": {
    "id": "HIP32246",
    "hip": 32246,
    "name": "Mebsuta",
    "ra": 100.98304088,
    "dec": 25.13115531,
    "magnitude": 3.06
  },
  "HIP32349": {
    "id": "HIP32349",
    "hip": 32349,
    "name": "Sirius",
    "ra": 101.28854105,
    "dec": -16.71314306,
    "magnitude": -1.44
  },
  "HIP32362": {
    "id": "HIP32362",
    "hip": 32362,
    "name": "Alzirr",
    "ra": 101.3226398,
    "dec": 12.89605513,
    "magnitude": 3.35
  },
  "HIP32578": {
    "id": "HIP32578",
    "hip": 32578,
    "name": null,
    "ra": 101.96523679,
    "dec": 2.41218914,
    "magnitude": 4.48
  },
  "HIP32607": {
    "id": "HIP32607",
    "hip": 32607,
    "name": null,
    "ra": 102.04807134,
    "dec": -61.94197988,
    "magnitude": 3.24
  },
  "HIP33018": {
    "id": "HIP33018",
    "hip": 33018,
    "name": null,
    "ra": 103.1972503,
    "dec": 33.96136985,
    "magnitude": 3.6
  },
  "HIP33152": {
    "id": "HIP33152",
    "hip": 33152,
    "name": null,
    "ra": 103.53314518,
    "dec": -24.18422296,
    "magnitude": 3.89
  },
  "HIP33160": {
    "id": "HIP33160",
    "hip": 33160,
    "name": null,
    "ra": 103.54783633,
    "dec": -12.03859273,
    "magnitude": 4.08
  },
  "HIP33347": {
    "id": "HIP33347",
    "hip": 33347,
    "name": null,
    "ra": 104.03427636,
    "dec": -17.05424675,
    "magnitude": 4.36
  },
  "HIP33449": {
    "id": "HIP33449",
    "hip": 33449,
    "name": null,
    "ra": 104.31916052,
    "dec": 58.42305973,
    "magnitude": 4.35
  },
  "HIP33579": {
    "id": "HIP33579",
    "hip": 33579,
    "name": "Adhara",
    "ra": 104.65644451,
    "dec": -28.97208931,
    "magnitude": 1.5
  },
  "HIP33694": {
    "id": "HIP33694",
    "hip": 33694,
    "name": null,
    "ra": 105.0160332,
    "dec": 76.97744152,
    "magnitude": 4.55
  },
  "HIP34045": {
    "id": "HIP34045",
    "hip": 34045,
    "name": "Muliphein",
    "ra": 105.93955493,
    "dec": -15.63325876,
    "magnitude": 4.11
  },
  "HIP34088": {
    "id": "HIP34088",
    "hip": 34088,
    "name": "Mekbuda",
    "ra": 106.02723079,
    "dec": 20.57029939,
    "magnitude": 4.01
  },
  "HIP34444": {
    "id": "HIP34444",
    "hip": 34444,
    "name": "Wezen",
    "ra": 107.09785853,
    "dec": -26.39320776,
    "magnitude": 1.83
  },
  "HIP34481": {
    "id": "HIP34481",
    "hip": 34481,
    "name": null,
    "ra": 107.18676883,
    "dec": -70.49919435,
    "magnitude": 3.78
  },
  "HIP34693": {
    "id": "HIP34693",
    "hip": 34693,
    "name": null,
    "ra": 107.78496505,
    "dec": 30.24528065,
    "magnitude": 4.41
  },
  "HIP34769": {
    "id": "HIP34769",
    "hip": 34769,
    "name": null,
    "ra": 107.96608486,
    "dec": -0.49278056,
    "magnitude": 4.15
  },
  "HIP35228": {
    "id": "HIP35228",
    "hip": 35228,
    "name": null,
    "ra": 109.20762844,
    "dec": -67.95717248,
    "magnitude": 3.97
  },
  "HIP35264": {
    "id": "HIP35264",
    "hip": 35264,
    "name": null,
    "ra": 109.28568399,
    "dec": -37.09748689,
    "magnitude": 2.71
  },
  "HIP35350": {
    "id": "HIP35350",
    "hip": 35350,
    "name": null,
    "ra": 109.52336162,
    "dec": 16.54047526,
    "magnitude": 3.58
  },
  "HIP35550": {
    "id": "HIP35550",
    "hip": 35550,
    "name": "Wasat",
    "ra": 110.0307889,
    "dec": 21.98233941,
    "magnitude": 3.5
  },
  "HIP35904": {
    "id": "HIP35904",
    "hip": 35904,
    "name": "Aludra",
    "ra": 111.02377104,
    "dec": -29.30311979,
    "magnitude": 2.45
  },
  "HIP36046": {
    "id": "HIP36046",
    "hip": 36046,
    "name": null,
    "ra": 111.43198371,
    "dec": 27.79828561,
    "magnitude": 3.78
  },
  "HIP36145": {
    "id": "HIP36145",
    "hip": 36145,
    "name": null,
    "ra": 111.67858726,
    "dec": 49.21164489,
    "magnitude": 4.61
  },
  "HIP36188": {
    "id": "HIP36188",
    "hip": 36188,
    "name": "Gomeisa",
    "ra": 111.78780121,
    "dec": 8.28940893,
    "magnitude": 2.89
  },
  "HIP36850": {
    "id": "HIP36850",
    "hip": 36850,
    "name": "Castor",
    "ra": 113.65001898,
    "dec": 31.88863645,
    "magnitude": 1.58
  },
  "HIP36917": {
    "id": "HIP36917",
    "hip": 36917,
    "name": null,
    "ra": 113.8455718,
    "dec": -28.36927798,
    "magnitude": 4.65
  },
  "HIP36962": {
    "id": "HIP36962",
    "hip": 36962,
    "name": null,
    "ra": 113.98071783,
    "dec": 26.89600343,
    "magnitude": 4.06
  },
  "HIP37229": {
    "id": "HIP37229",
    "hip": 37229,
    "name": null,
    "ra": 114.70783872,
    "dec": -26.8038924,
    "magnitude": 3.8
  },
  "HIP37279": {
    "id": "HIP37279",
    "hip": 37279,
    "name": "Procyon",
    "ra": 114.82724194,
    "dec": 5.22750767,
    "magnitude": 0.4
  },
  "HIP37447": {
    "id": "HIP37447",
    "hip": 37447,
    "name": null,
    "ra": 115.31198612,
    "dec": -9.55108315,
    "magnitude": 3.94
  },
  "HIP37677": {
    "id": "HIP37677",
    "hip": 37677,
    "name": null,
    "ra": 115.95196716,
    "dec": -28.9548352,
    "magnitude": 3.94
  },
  "HIP37740": {
    "id": "HIP37740",
    "hip": 37740,
    "name": null,
    "ra": 116.11195237,
    "dec": 24.39812929,
    "magnitude": 3.57
  },
  "HIP37826": {
    "id": "HIP37826",
    "hip": 37826,
    "name": "Pollux",
    "ra": 116.33068263,
    "dec": 28.02631031,
    "magnitude": 1.16
  },
  "HIP38070": {
    "id": "HIP38070",
    "hip": 38070,
    "name": null,
    "ra": 117.02156206,
    "dec": -25.93718054,
    "magnitude": 4.4
  },
  "HIP38170": {
    "id": "HIP38170",
    "hip": 38170,
    "name": "Azmidi",
    "ra": 117.32357809,
    "dec": -24.85978401,
    "magnitude": 3.34
  },
  "HIP38827": {
    "id": "HIP38827",
    "hip": 38827,
    "name": null,
    "ra": 119.19475729,
    "dec": -52.98240062,
    "magnitude": 3.46
  },
  "HIP39429": {
    "id": "HIP39429",
    "hip": 39429,
    "name": "Naos",
    "ra": 120.89612561,
    "dec": -40.00318846,
    "magnitude": 2.21
  },
  "HIP39757": {
    "id": "HIP39757",
    "hip": 39757,
    "name": "Tureis",
    "ra": 121.88625899,
    "dec": -24.30443677,
    "magnitude": 2.83
  },
  "HIP39794": {
    "id": "HIP39794",
    "hip": 39794,
    "name": null,
    "ra": 121.98266997,
    "dec": -68.61713647,
    "magnitude": 4.35
  },
  "HIP39863": {
    "id": "HIP39863",
    "hip": 39863,
    "name": null,
    "ra": 122.14857362,
    "dec": -2.98377649,
    "magnitude": 4.36
  },
  "HIP39953": {
    "id": "HIP39953",
    "hip": 39953,
    "name": null,
    "ra": 122.38314727,
    "dec": -47.33661177,
    "magnitude": 1.75
  },
  "HIP40526": {
    "id": "HIP40526",
    "hip": 40526,
    "name": "Tarf",
    "ra": 124.12895101,
    "dec": 9.18566295,
    "magnitude": 3.53
  },
  "HIP40702": {
    "id": "HIP40702",
    "hip": 40702,
    "name": null,
    "ra": 124.6302785,
    "dec": -76.91998251,
    "magnitude": 4.05
  },
  "HIP41037": {
    "id": "HIP41037",
    "hip": 41037,
    "name": "Avior",
    "ra": 125.62860299,
    "dec": -59.50953829,
    "magnitude": 1.86
  },
  "HIP41075": {
    "id": "HIP41075",
    "hip": 41075,
    "name": "Alsciaukat",
    "ra": 125.70887544,
    "dec": 43.18837233,
    "magnitude": 4.25
  },
  "HIP41312": {
    "id": "HIP41312",
    "hip": 41312,
    "name": null,
    "ra": 126.43435936,
    "dec": -66.13652042,
    "magnitude": 3.77
  },
  "HIP41704": {
    "id": "HIP41704",
    "hip": 41704,
    "name": "Muscida",
    "ra": 127.56679232,
    "dec": 60.7184311,
    "magnitude": 3.35
  },
  "HIP42313": {
    "id": "HIP42313",
    "hip": 42313,
    "name": null,
    "ra": 129.41419739,
    "dec": 5.70379868,
    "magnitude": 4.14
  },
  "HIP42402": {
    "id": "HIP42402",
    "hip": 42402,
    "name": "Minchir",
    "ra": 129.68936993,
    "dec": 3.34147477,
    "magnitude": 4.45
  },
  "HIP42515": {
    "id": "HIP42515",
    "hip": 42515,
    "name": null,
    "ra": 130.02556894,
    "dec": -35.30830091,
    "magnitude": 3.97
  },
  "HIP42799": {
    "id": "HIP42799",
    "hip": 42799,
    "name": null,
    "ra": 130.80619315,
    "dec": 3.39866539,
    "magnitude": 4.3
  },
  "HIP42806": {
    "id": "HIP42806",
    "hip": 42806,
    "name": "Asellus Borealis ",
    "ra": 130.82172127,
    "dec": 21.46859609,
    "magnitude": 4.66
  },
  "HIP42828": {
    "id": "HIP42828",
    "hip": 42828,
    "name": null,
    "ra": 130.89811451,
    "dec": -33.18641133,
    "magnitude": 3.68
  },
  "HIP42911": {
    "id": "HIP42911",
    "hip": 42911,
    "name": "Asellus Australis",
    "ra": 131.17129209,
    "dec": 18.15486399,
    "magnitude": 3.94
  },
  "HIP42913": {
    "id": "HIP42913",
    "hip": 42913,
    "name": "Alsephina",
    "ra": 131.17582214,
    "dec": -54.70856797,
    "magnitude": 1.93
  },
  "HIP43103": {
    "id": "HIP43103",
    "hip": 43103,
    "name": null,
    "ra": 131.67430955,
    "dec": 28.76000509,
    "magnitude": 4.03
  },
  "HIP43109": {
    "id": "HIP43109",
    "hip": 43109,
    "name": "Ashlesha",
    "ra": 131.6943593,
    "dec": 6.41890691,
    "magnitude": 3.38
  },
  "HIP43234": {
    "id": "HIP43234",
    "hip": 43234,
    "name": null,
    "ra": 132.10825351,
    "dec": 5.83788486,
    "magnitude": 4.35
  },
  "HIP43409": {
    "id": "HIP43409",
    "hip": 43409,
    "name": null,
    "ra": 132.63338051,
    "dec": -27.71005869,
    "magnitude": 4.02
  },
  "HIP43813": {
    "id": "HIP43813",
    "hip": 43813,
    "name": null,
    "ra": 133.84868687,
    "dec": 5.9455277,
    "magnitude": 3.11
  },
  "HIP44066": {
    "id": "HIP44066",
    "hip": 44066,
    "name": "Acubens",
    "ra": 134.62165408,
    "dec": 11.85777198,
    "magnitude": 4.26
  },
  "HIP44127": {
    "id": "HIP44127",
    "hip": 44127,
    "name": "Talitha",
    "ra": 134.80349479,
    "dec": 48.04234956,
    "magnitude": 3.12
  },
  "HIP44248": {
    "id": "HIP44248",
    "hip": 44248,
    "name": null,
    "ra": 135.16146765,
    "dec": 41.78344401,
    "magnitude": 3.96
  },
  "HIP44382": {
    "id": "HIP44382",
    "hip": 44382,
    "name": null,
    "ra": 135.61166181,
    "dec": -66.39584369,
    "magnitude": 4
  },
  "HIP44471": {
    "id": "HIP44471",
    "hip": 44471,
    "name": "Alkaphrah",
    "ra": 135.90649494,
    "dec": 47.15665934,
    "magnitude": 3.57
  },
  "HIP44700": {
    "id": "HIP44700",
    "hip": 44700,
    "name": null,
    "ra": 136.63245022,
    "dec": 38.45225024,
    "magnitude": 4.56
  },
  "HIP44816": {
    "id": "HIP44816",
    "hip": 44816,
    "name": "Suhail",
    "ra": 136.99907126,
    "dec": -43.43262406,
    "magnitude": 2.23
  },
  "HIP45238": {
    "id": "HIP45238",
    "hip": 45238,
    "name": "Miaplacidus",
    "ra": 138.30100329,
    "dec": -69.71747245,
    "magnitude": 1.67
  },
  "HIP45336": {
    "id": "HIP45336",
    "hip": 45336,
    "name": null,
    "ra": 138.59080529,
    "dec": 2.31502422,
    "magnitude": 3.89
  },
  "HIP45556": {
    "id": "HIP45556",
    "hip": 45556,
    "name": "Aspidiske",
    "ra": 139.27261834,
    "dec": -59.27526115,
    "magnitude": 2.21
  },
  "HIP45688": {
    "id": "HIP45688",
    "hip": 45688,
    "name": null,
    "ra": 139.71111394,
    "dec": 36.80289763,
    "magnitude": 3.82
  },
  "HIP45860": {
    "id": "HIP45860",
    "hip": 45860,
    "name": null,
    "ra": 140.26441169,
    "dec": 34.39252592,
    "magnitude": 3.14
  },
  "HIP45941": {
    "id": "HIP45941",
    "hip": 45941,
    "name": "Markeb",
    "ra": 140.52845511,
    "dec": -55.01069531,
    "magnitude": 2.47
  },
  "HIP46146": {
    "id": "HIP46146",
    "hip": 46146,
    "name": null,
    "ra": 141.16366395,
    "dec": 26.18244091,
    "magnitude": 4.47
  },
  "HIP46390": {
    "id": "HIP46390",
    "hip": 46390,
    "name": "Alphard",
    "ra": 141.8968826,
    "dec": -8.65868335,
    "magnitude": 1.99
  },
  "HIP46515": {
    "id": "HIP46515",
    "hip": 46515,
    "name": null,
    "ra": 142.31140615,
    "dec": -35.9513478,
    "magnitude": 4.51
  },
  "HIP46651": {
    "id": "HIP46651",
    "hip": 46651,
    "name": null,
    "ra": 142.67547063,
    "dec": -40.46688763,
    "magnitude": 3.6
  },
  "HIP46733": {
    "id": "HIP46733",
    "hip": 46733,
    "name": null,
    "ra": 142.88154025,
    "dec": 63.06179545,
    "magnitude": 3.65
  },
  "HIP46750": {
    "id": "HIP46750",
    "hip": 46750,
    "name": "Alterf",
    "ra": 142.93016816,
    "dec": 22.96806545,
    "magnitude": 4.32
  },
  "HIP46853": {
    "id": "HIP46853",
    "hip": 46853,
    "name": null,
    "ra": 143.21802191,
    "dec": 51.67860208,
    "magnitude": 3.17
  },
  "HIP46952": {
    "id": "HIP46952",
    "hip": 46952,
    "name": null,
    "ra": 143.5557374,
    "dec": 36.39761338,
    "magnitude": 4.54
  },
  "HIP47431": {
    "id": "HIP47431",
    "hip": 47431,
    "name": "Ukdah",
    "ra": 144.96389156,
    "dec": -1.14265722,
    "magnitude": 3.9
  },
  "HIP47908": {
    "id": "HIP47908",
    "hip": 47908,
    "name": null,
    "ra": 146.4629267,
    "dec": 23.77427792,
    "magnitude": 2.97
  },
  "HIP48319": {
    "id": "HIP48319",
    "hip": 48319,
    "name": null,
    "ra": 147.74871542,
    "dec": 59.03910437,
    "magnitude": 3.78
  },
  "HIP48356": {
    "id": "HIP48356",
    "hip": 48356,
    "name": "Zhang",
    "ra": 147.86951033,
    "dec": -14.84654997,
    "magnitude": 4.11
  },
  "HIP48437": {
    "id": "HIP48437",
    "hip": 48437,
    "name": null,
    "ra": 148.12696211,
    "dec": -8.10491559,
    "magnitude": 5.07
  },
  "HIP48455": {
    "id": "HIP48455",
    "hip": 48455,
    "name": "Rasalas",
    "ra": 148.19149028,
    "dec": 26.00708498,
    "magnitude": 3.88
  },
  "HIP48774": {
    "id": "HIP48774",
    "hip": 48774,
    "name": null,
    "ra": 149.2156452,
    "dec": -54.5677973,
    "magnitude": 3.52
  },
  "HIP49402": {
    "id": "HIP49402",
    "hip": 49402,
    "name": null,
    "ra": 151.28121856,
    "dec": -13.06467435,
    "magnitude": 4.6
  },
  "HIP49583": {
    "id": "HIP49583",
    "hip": 49583,
    "name": null,
    "ra": 151.83313948,
    "dec": 16.76266572,
    "magnitude": 3.48
  },
  "HIP49593": {
    "id": "HIP49593",
    "hip": 49593,
    "name": null,
    "ra": 151.85718812,
    "dec": 35.24469176,
    "magnitude": 4.49
  },
  "HIP49641": {
    "id": "HIP49641",
    "hip": 49641,
    "name": null,
    "ra": 151.98456489,
    "dec": -0.37162786,
    "magnitude": 4.48
  },
  "HIP49669": {
    "id": "HIP49669",
    "hip": 49669,
    "name": "Regulus",
    "ra": 152.09358075,
    "dec": 11.96719513,
    "magnitude": 1.36
  },
  "HIP49841": {
    "id": "HIP49841",
    "hip": 49841,
    "name": null,
    "ra": 152.64748785,
    "dec": -12.35383921,
    "magnitude": 3.61
  },
  "HIP50099": {
    "id": "HIP50099",
    "hip": 50099,
    "name": null,
    "ra": 153.43449551,
    "dec": -70.03792169,
    "magnitude": 3.29
  },
  "HIP50191": {
    "id": "HIP50191",
    "hip": 50191,
    "name": null,
    "ra": 153.68447399,
    "dec": -42.12206281,
    "magnitude": 3.85
  },
  "HIP50335": {
    "id": "HIP50335",
    "hip": 50335,
    "name": "Adhafera",
    "ra": 154.17251805,
    "dec": 23.4173284,
    "magnitude": 3.43
  },
  "HIP50371": {
    "id": "HIP50371",
    "hip": 50371,
    "name": null,
    "ra": 154.27085535,
    "dec": -61.33231977,
    "magnitude": 3.39
  },
  "HIP50372": {
    "id": "HIP50372",
    "hip": 50372,
    "name": "Tania Borealis",
    "ra": 154.27469564,
    "dec": 42.91446855,
    "magnitude": 3.45
  },
  "HIP50583": {
    "id": "HIP50583",
    "hip": 50583,
    "name": "Algieba",
    "ra": 154.99234054,
    "dec": 19.84186032,
    "magnitude": 2.01
  },
  "HIP50801": {
    "id": "HIP50801",
    "hip": 50801,
    "name": "Tania Australis",
    "ra": 155.58251355,
    "dec": 41.4994335,
    "magnitude": 3.06
  },
  "HIP51056": {
    "id": "HIP51056",
    "hip": 51056,
    "name": null,
    "ra": 156.47861301,
    "dec": 33.79626364,
    "magnitude": 4.72
  },
  "HIP51069": {
    "id": "HIP51069",
    "hip": 51069,
    "name": null,
    "ra": 156.52293768,
    "dec": -16.83609584,
    "magnitude": 3.83
  },
  "HIP51172": {
    "id": "HIP51172",
    "hip": 51172,
    "name": null,
    "ra": 156.78814953,
    "dec": -31.06780228,
    "magnitude": 4.28
  },
  "HIP51233": {
    "id": "HIP51233",
    "hip": 51233,
    "name": null,
    "ra": 156.97121865,
    "dec": 36.70747818,
    "magnitude": 4.2
  },
  "HIP51362": {
    "id": "HIP51362",
    "hip": 51362,
    "name": null,
    "ra": 157.36971129,
    "dec": -2.73904701,
    "magnitude": 5.19
  },
  "HIP51437": {
    "id": "HIP51437",
    "hip": 51437,
    "name": null,
    "ra": 157.57292935,
    "dec": -0.63697208,
    "magnitude": 5.08
  },
  "HIP51576": {
    "id": "HIP51576",
    "hip": 51576,
    "name": null,
    "ra": 158.0061825,
    "dec": -61.68536031,
    "magnitude": 3.3
  },
  "HIP51839": {
    "id": "HIP51839",
    "hip": 51839,
    "name": null,
    "ra": 158.86757668,
    "dec": -78.60781379,
    "magnitude": 4.11
  },
  "HIP52419": {
    "id": "HIP52419",
    "hip": 52419,
    "name": null,
    "ra": 160.73927802,
    "dec": -64.39447937,
    "magnitude": 2.74
  },
  "HIP52633": {
    "id": "HIP52633",
    "hip": 52633,
    "name": null,
    "ra": 161.44639899,
    "dec": -80.54020283,
    "magnitude": 4.45
  },
  "HIP52727": {
    "id": "HIP52727",
    "hip": 52727,
    "name": null,
    "ra": 161.69217542,
    "dec": -49.42012517,
    "magnitude": 2.69
  },
  "HIP52943": {
    "id": "HIP52943",
    "hip": 52943,
    "name": null,
    "ra": 162.40596699,
    "dec": -16.19413208,
    "magnitude": 3.11
  },
  "HIP53229": {
    "id": "HIP53229",
    "hip": 53229,
    "name": "Praecipua",
    "ra": 163.32766612,
    "dec": 34.21556641,
    "magnitude": 3.79
  },
  "HIP53253": {
    "id": "HIP53253",
    "hip": 53253,
    "name": null,
    "ra": 163.3731926,
    "dec": -58.85326474,
    "magnitude": 3.78
  },
  "HIP53502": {
    "id": "HIP53502",
    "hip": 53502,
    "name": null,
    "ra": 164.17915128,
    "dec": -37.1374629,
    "magnitude": 4.6
  },
  "HIP53740": {
    "id": "HIP53740",
    "hip": 53740,
    "name": "Alkes",
    "ra": 164.94478664,
    "dec": -18.29909723,
    "magnitude": 4.08
  },
  "HIP53910": {
    "id": "HIP53910",
    "hip": 53910,
    "name": "Merak",
    "ra": 165.4599615,
    "dec": 56.38234478,
    "magnitude": 2.34
  },
  "HIP54061": {
    "id": "HIP54061",
    "hip": 54061,
    "name": "Dubhe",
    "ra": 165.93265365,
    "dec": 61.75111888,
    "magnitude": 1.81
  },
  "HIP54301": {
    "id": "HIP54301",
    "hip": 54301,
    "name": null,
    "ra": 166.6353096,
    "dec": -62.42413654,
    "magnitude": 4.62
  },
  "HIP54463": {
    "id": "HIP54463",
    "hip": 54463,
    "name": null,
    "ra": 167.14748181,
    "dec": -58.97504198,
    "magnitude": 3.93
  },
  "HIP54539": {
    "id": "HIP54539",
    "hip": 54539,
    "name": null,
    "ra": 167.41608092,
    "dec": 44.49855337,
    "magnitude": 3
  },
  "HIP54682": {
    "id": "HIP54682",
    "hip": 54682,
    "name": null,
    "ra": 167.91452617,
    "dec": -22.82560642,
    "magnitude": 4.46
  },
  "HIP54751": {
    "id": "HIP54751",
    "hip": 54751,
    "name": null,
    "ra": 168.15008453,
    "dec": -60.3176307,
    "magnitude": 4.59
  },
  "HIP54872": {
    "id": "HIP54872",
    "hip": 54872,
    "name": "Zosma",
    "ra": 168.52671705,
    "dec": 20.52403384,
    "magnitude": 2.56
  },
  "HIP54879": {
    "id": "HIP54879",
    "hip": 54879,
    "name": "Chertan",
    "ra": 168.56017036,
    "dec": 15.4297631,
    "magnitude": 3.33
  },
  "HIP55203": {
    "id": "HIP55203",
    "hip": 55203,
    "name": "Alula Australis",
    "ra": 169.54683333333335,
    "dec": 31.530777777777775,
    "magnitude": 3.79
  },
  "HIP55219": {
    "id": "HIP55219",
    "hip": 55219,
    "name": "Alula Borealis",
    "ra": 169.61981385,
    "dec": 33.09423881,
    "magnitude": 3.49
  },
  "HIP55282": {
    "id": "HIP55282",
    "hip": 55282,
    "name": null,
    "ra": 169.83551103,
    "dec": -14.77904358,
    "magnitude": 3.56
  },
  "HIP55425": {
    "id": "HIP55425",
    "hip": 55425,
    "name": null,
    "ra": 170.25184266,
    "dec": -54.49101395,
    "magnitude": 3.9
  },
  "HIP55434": {
    "id": "HIP55434",
    "hip": 55434,
    "name": null,
    "ra": 170.28436733,
    "dec": 6.02935289,
    "magnitude": 4.05
  },
  "HIP55642": {
    "id": "HIP55642",
    "hip": 55642,
    "name": null,
    "ra": 170.98070334,
    "dec": 10.52969772,
    "magnitude": 4
  },
  "HIP55687": {
    "id": "HIP55687",
    "hip": 55687,
    "name": null,
    "ra": 171.15252245,
    "dec": -10.85938276,
    "magnitude": 4.81
  },
  "HIP55705": {
    "id": "HIP55705",
    "hip": 55705,
    "name": null,
    "ra": 171.22076335,
    "dec": -17.68401748,
    "magnitude": 4.06
  },
  "HIP56211": {
    "id": "HIP56211",
    "hip": 56211,
    "name": "Giausar",
    "ra": 172.85120199,
    "dec": 69.33112161,
    "magnitude": 3.82
  },
  "HIP56243": {
    "id": "HIP56243",
    "hip": 56243,
    "name": null,
    "ra": 172.9419714,
    "dec": -59.44206384,
    "magnitude": 5.07
  },
  "HIP56343": {
    "id": "HIP56343",
    "hip": 56343,
    "name": null,
    "ra": 173.25107936,
    "dec": -31.85752405,
    "magnitude": 3.54
  },
  "HIP56633": {
    "id": "HIP56633",
    "hip": 56633,
    "name": null,
    "ra": 174.17061875,
    "dec": -9.80225368,
    "magnitude": 4.7
  },
  "HIP57283": {
    "id": "HIP57283",
    "hip": 57283,
    "name": null,
    "ra": 176.19066226,
    "dec": -18.35061467,
    "magnitude": 4.71
  },
  "HIP57363": {
    "id": "HIP57363",
    "hip": 57363,
    "name": null,
    "ra": 176.40236386,
    "dec": -66.72884344,
    "magnitude": 3.63
  },
  "HIP57380": {
    "id": "HIP57380",
    "hip": 57380,
    "name": null,
    "ra": 176.46487734,
    "dec": 6.52981394,
    "magnitude": 4.04
  },
  "HIP57399": {
    "id": "HIP57399",
    "hip": 57399,
    "name": "Taiyangshou",
    "ra": 176.51305887,
    "dec": 47.77933701,
    "magnitude": 3.69
  },
  "HIP57632": {
    "id": "HIP57632",
    "hip": 57632,
    "name": "Denebola",
    "ra": 177.26615977,
    "dec": 14.57233687,
    "magnitude": 2.14
  },
  "HIP57757": {
    "id": "HIP57757",
    "hip": 57757,
    "name": "Zavijava",
    "ra": 177.67202553,
    "dec": 1.76537705,
    "magnitude": 3.59
  },
  "HIP57936": {
    "id": "HIP57936",
    "hip": 57936,
    "name": null,
    "ra": 178.22733867,
    "dec": -33.90813014,
    "magnitude": 4.29
  },
  "HIP58001": {
    "id": "HIP58001",
    "hip": 58001,
    "name": "Phecda",
    "ra": 178.45725536,
    "dec": 53.69473296,
    "magnitude": 2.41
  },
  "HIP58188": {
    "id": "HIP58188",
    "hip": 58188,
    "name": null,
    "ra": 179.00409802,
    "dec": -17.15080863,
    "magnitude": 5.17
  },
  "HIP58484": {
    "id": "HIP58484",
    "hip": 58484,
    "name": null,
    "ra": 179.90704708,
    "dec": -78.22181833,
    "magnitude": 4.88
  },
  "HIP58948": {
    "id": "HIP58948",
    "hip": 58948,
    "name": null,
    "ra": 181.30279,
    "dec": 8.73284563,
    "magnitude": 4.12
  },
  "HIP59196": {
    "id": "HIP59196",
    "hip": 59196,
    "name": null,
    "ra": 182.08976505,
    "dec": -50.72240999,
    "magnitude": 2.58
  },
  "HIP59199": {
    "id": "HIP59199",
    "hip": 59199,
    "name": "Alchiba",
    "ra": 182.10313607,
    "dec": -24.72877993,
    "magnitude": 4.02
  },
  "HIP59316": {
    "id": "HIP59316",
    "hip": 59316,
    "name": null,
    "ra": 182.53135773,
    "dec": -22.61979211,
    "magnitude": 3.02
  },
  "HIP59449": {
    "id": "HIP59449",
    "hip": 59449,
    "name": null,
    "ra": 182.9131309,
    "dec": -52.36841559,
    "magnitude": 3.97
  },
  "HIP59747": {
    "id": "HIP59747",
    "hip": 59747,
    "name": "Imai",
    "ra": 183.78648733,
    "dec": -58.74890179,
    "magnitude": 2.79
  },
  "HIP59774": {
    "id": "HIP59774",
    "hip": 59774,
    "name": "Megrez",
    "ra": 183.85603795,
    "dec": 57.03259792,
    "magnitude": 3.32
  },
  "HIP59803": {
    "id": "HIP59803",
    "hip": 59803,
    "name": "Gienah",
    "ra": 183.95194937,
    "dec": -17.5419837,
    "magnitude": 2.58
  },
  "HIP59929": {
    "id": "HIP59929",
    "hip": 59929,
    "name": null,
    "ra": 184.39431802,
    "dec": -67.96067161,
    "magnitude": 4.06
  },
  "HIP60000": {
    "id": "HIP60000",
    "hip": 60000,
    "name": null,
    "ra": 184.58726633,
    "dec": -79.31226899,
    "magnitude": 4.24
  },
  "HIP60129": {
    "id": "HIP60129",
    "hip": 60129,
    "name": "Zaniah",
    "ra": 184.97663096,
    "dec": -0.66674709,
    "magnitude": 3.89
  },
  "HIP60718": {
    "id": "HIP60718",
    "hip": 60718,
    "name": "Acrux",
    "ra": 186.64975585,
    "dec": -63.09905586,
    "magnitude": 0.77
  },
  "HIP60742": {
    "id": "HIP60742",
    "hip": 60742,
    "name": null,
    "ra": 186.73469831,
    "dec": 28.26861975,
    "magnitude": 4.35
  },
  "HIP60823": {
    "id": "HIP60823",
    "hip": 60823,
    "name": null,
    "ra": 187.01004828,
    "dec": -50.2306048,
    "magnitude": 3.91
  },
  "HIP60965": {
    "id": "HIP60965",
    "hip": 60965,
    "name": "Algorab",
    "ra": 187.4665965,
    "dec": -16.51509397,
    "magnitude": 2.94
  },
  "HIP61084": {
    "id": "HIP61084",
    "hip": 61084,
    "name": "Gacrux",
    "ra": 187.79137202,
    "dec": -57.11256922,
    "magnitude": 1.59
  },
  "HIP61199": {
    "id": "HIP61199",
    "hip": 61199,
    "name": null,
    "ra": 188.11712896,
    "dec": -72.1329759,
    "magnitude": 3.84
  },
  "HIP61281": {
    "id": "HIP61281",
    "hip": 61281,
    "name": null,
    "ra": 188.37101041,
    "dec": 69.78820992,
    "magnitude": 3.85
  },
  "HIP61317": {
    "id": "HIP61317",
    "hip": 61317,
    "name": "Chara",
    "ra": 188.43788561,
    "dec": 41.35676779,
    "magnitude": 4.24
  },
  "HIP61359": {
    "id": "HIP61359",
    "hip": 61359,
    "name": "Kraz",
    "ra": 188.59680864,
    "dec": -23.39662306,
    "magnitude": 2.65
  },
  "HIP61585": {
    "id": "HIP61585",
    "hip": 61585,
    "name": null,
    "ra": 189.29618208,
    "dec": -69.13553358,
    "magnitude": 2.69
  },
  "HIP61789": {
    "id": "HIP61789",
    "hip": 61789,
    "name": null,
    "ra": 189.96900602,
    "dec": -39.98724188,
    "magnitude": 4.63
  },
  "HIP61932": {
    "id": "HIP61932",
    "hip": 61932,
    "name": null,
    "ra": 190.38002079,
    "dec": -48.95988553,
    "magnitude": 2.2
  },
  "HIP61941": {
    "id": "HIP61941",
    "hip": 61941,
    "name": "Porrima",
    "ra": 190.41667557,
    "dec": -1.44952231,
    "magnitude": 2.74
  },
  "HIP62322": {
    "id": "HIP62322",
    "hip": 62322,
    "name": null,
    "ra": 191.57029013,
    "dec": -68.10809405,
    "magnitude": 3.04
  },
  "HIP62434": {
    "id": "HIP62434",
    "hip": 62434,
    "name": "Mimosa",
    "ra": 191.93049537,
    "dec": -59.68873246,
    "magnitude": 1.25
  },
  "HIP62956": {
    "id": "HIP62956",
    "hip": 62956,
    "name": "Alioth",
    "ra": 193.5068041,
    "dec": 55.95984301,
    "magnitude": 1.76
  },
  "HIP63090": {
    "id": "HIP63090",
    "hip": 63090,
    "name": "Minelauva",
    "ra": 193.90201366,
    "dec": 3.39759862,
    "magnitude": 3.39
  },
  "HIP63125": {
    "id": "HIP63125",
    "hip": 63125,
    "name": "Cor Caroli",
    "ra": 194.00767051,
    "dec": 38.31824617,
    "magnitude": 2.89
  },
  "HIP63608": {
    "id": "HIP63608",
    "hip": 63608,
    "name": "Vindemiatrix",
    "ra": 195.54483557,
    "dec": 10.95910186,
    "magnitude": 2.85
  },
  "HIP63613": {
    "id": "HIP63613",
    "hip": 63613,
    "name": null,
    "ra": 195.56573968,
    "dec": -71.54879865,
    "magnitude": 3.61
  },
  "HIP64238": {
    "id": "HIP64238",
    "hip": 64238,
    "name": null,
    "ra": 197.48755015,
    "dec": -5.53892987,
    "magnitude": 4.38
  },
  "HIP64241": {
    "id": "HIP64241",
    "hip": 64241,
    "name": "Diadem",
    "ra": 197.49812263,
    "dec": 17.52911621,
    "magnitude": 4.32
  },
  "HIP64394": {
    "id": "HIP64394",
    "hip": 64394,
    "name": null,
    "ra": 197.97051117,
    "dec": 27.87603769,
    "magnitude": 4.23
  },
  "HIP64962": {
    "id": "HIP64962",
    "hip": 64962,
    "name": null,
    "ra": 199.7302224,
    "dec": -23.17141246,
    "magnitude": 2.99
  },
  "HIP65109": {
    "id": "HIP65109",
    "hip": 65109,
    "name": null,
    "ra": 200.15027321,
    "dec": -36.71208109,
    "magnitude": 2.75
  },
  "HIP65378": {
    "id": "HIP65378",
    "hip": 65378,
    "name": "Mizar",
    "ra": 200.98091604,
    "dec": 54.92541525,
    "magnitude": 2.23
  },
  "HIP65474": {
    "id": "HIP65474",
    "hip": 65474,
    "name": "Spica",
    "ra": 201.2983523,
    "dec": -11.16124491,
    "magnitude": 0.98
  },
  "HIP65936": {
    "id": "HIP65936",
    "hip": 65936,
    "name": null,
    "ra": 202.76111861,
    "dec": -39.40727983,
    "magnitude": 3.9
  },
  "HIP66249": {
    "id": "HIP66249",
    "hip": 66249,
    "name": "Heze",
    "ra": 203.673978,
    "dec": -0.59593821,
    "magnitude": 3.38
  },
  "HIP66657": {
    "id": "HIP66657",
    "hip": 66657,
    "name": null,
    "ra": 204.97196962,
    "dec": -53.46636269,
    "magnitude": 2.29
  },
  "HIP67275": {
    "id": "HIP67275",
    "hip": 67275,
    "name": null,
    "ra": 206.81681937,
    "dec": 17.45677436,
    "magnitude": 4.5
  },
  "HIP67301": {
    "id": "HIP67301",
    "hip": 67301,
    "name": "Alkaid",
    "ra": 206.8856088,
    "dec": 49.31330288,
    "magnitude": 1.85
  },
  "HIP67464": {
    "id": "HIP67464",
    "hip": 67464,
    "name": null,
    "ra": 207.3762392,
    "dec": -41.68765971,
    "magnitude": 3.41
  },
  "HIP67927": {
    "id": "HIP67927",
    "hip": 67927,
    "name": "Muphrid",
    "ra": 208.6713175,
    "dec": 18.39858742,
    "magnitude": 2.68
  },
  "HIP68002": {
    "id": "HIP68002",
    "hip": 68002,
    "name": null,
    "ra": 208.88514539,
    "dec": -47.28826634,
    "magnitude": 2.55
  },
  "HIP68245": {
    "id": "HIP68245",
    "hip": 68245,
    "name": null,
    "ra": 209.56785278,
    "dec": -42.10070526,
    "magnitude": 3.83
  },
  "HIP68282": {
    "id": "HIP68282",
    "hip": 68282,
    "name": null,
    "ra": 209.6698807,
    "dec": -44.8035314,
    "magnitude": 3.87
  },
  "HIP68520": {
    "id": "HIP68520",
    "hip": 68520,
    "name": null,
    "ra": 210.41159648,
    "dec": 1.54458338,
    "magnitude": 4.23
  },
  "HIP68702": {
    "id": "HIP68702",
    "hip": 68702,
    "name": "Hadar",
    "ra": 210.95601898,
    "dec": -60.3729784,
    "magnitude": 0.61
  },
  "HIP68756": {
    "id": "HIP68756",
    "hip": 68756,
    "name": "Thuban",
    "ra": 211.09760837,
    "dec": 64.37580873,
    "magnitude": 3.67
  },
  "HIP68862": {
    "id": "HIP68862",
    "hip": 68862,
    "name": null,
    "ra": 211.5116084,
    "dec": -41.17958035,
    "magnitude": 4.36
  },
  "HIP68895": {
    "id": "HIP68895",
    "hip": 68895,
    "name": null,
    "ra": 211.59278733,
    "dec": -26.68201883,
    "magnitude": 3.25
  },
  "HIP68933": {
    "id": "HIP68933",
    "hip": 68933,
    "name": "Menkent",
    "ra": 211.67218608,
    "dec": -36.36869575,
    "magnitude": 2.06
  },
  "HIP69483": {
    "id": "HIP69483",
    "hip": 69483,
    "name": null,
    "ra": 213.37062458,
    "dec": 51.78999066,
    "magnitude": 4.53
  },
  "HIP69673": {
    "id": "HIP69673",
    "hip": 69673,
    "name": "Arcturus",
    "ra": 213.91811403,
    "dec": 19.18726997,
    "magnitude": -0.05
  },
  "HIP69701": {
    "id": "HIP69701",
    "hip": 69701,
    "name": "Syrma",
    "ra": 214.00368717,
    "dec": -5.99952622,
    "magnitude": 4.07
  },
  "HIP69732": {
    "id": "HIP69732",
    "hip": 69732,
    "name": "Xuange",
    "ra": 214.09656821,
    "dec": 46.08791894,
    "magnitude": 4.18
  },
  "HIP70090": {
    "id": "HIP70090",
    "hip": 70090,
    "name": null,
    "ra": 215.13949709,
    "dec": -37.88526711,
    "magnitude": 4.05
  },
  "HIP70497": {
    "id": "HIP70497",
    "hip": 70497,
    "name": null,
    "ra": 216.30008064,
    "dec": 51.85171354,
    "magnitude": 4.04
  },
  "HIP70638": {
    "id": "HIP70638",
    "hip": 70638,
    "name": null,
    "ra": 216.73225313,
    "dec": -83.66785308,
    "magnitude": 4.31
  },
  "HIP71053": {
    "id": "HIP71053",
    "hip": 71053,
    "name": null,
    "ra": 217.95774098,
    "dec": 30.37114497,
    "magnitude": 3.57
  },
  "HIP71075": {
    "id": "HIP71075",
    "hip": 71075,
    "name": "Seginus",
    "ra": 218.01982421,
    "dec": 38.30788348,
    "magnitude": 3.04
  },
  "HIP71352": {
    "id": "HIP71352",
    "hip": 71352,
    "name": null,
    "ra": 218.87688163,
    "dec": -42.15774562,
    "magnitude": 2.33
  },
  "HIP71683": {
    "id": "HIP71683",
    "hip": 71683,
    "name": "Rigil Kentaurus",
    "ra": 219.92041034,
    "dec": -60.83514707,
    "magnitude": -0.01
  },
  "HIP71795": {
    "id": "HIP71795",
    "hip": 71795,
    "name": null,
    "ra": 220.28716819,
    "dec": 13.72833113,
    "magnitude": 3.78
  },
  "HIP71860": {
    "id": "HIP71860",
    "hip": 71860,
    "name": null,
    "ra": 220.48239101,
    "dec": -47.38814127,
    "magnitude": 2.3
  },
  "HIP71908": {
    "id": "HIP71908",
    "hip": 71908,
    "name": null,
    "ra": 220.62785433,
    "dec": -64.97456957,
    "magnitude": 3.18
  },
  "HIP71957": {
    "id": "HIP71957",
    "hip": 71957,
    "name": null,
    "ra": 220.76484284,
    "dec": -5.6574291,
    "magnitude": 3.87
  },
  "HIP72105": {
    "id": "HIP72105",
    "hip": 72105,
    "name": "Izar",
    "ra": 221.24687869,
    "dec": 27.07417383,
    "magnitude": 2.35
  },
  "HIP72220": {
    "id": "HIP72220",
    "hip": 72220,
    "name": null,
    "ra": 221.56246594,
    "dec": 1.8929383,
    "magnitude": 3.73
  },
  "HIP72370": {
    "id": "HIP72370",
    "hip": 72370,
    "name": null,
    "ra": 221.96552567,
    "dec": -79.04471242,
    "magnitude": 3.83
  },
  "HIP72571": {
    "id": "HIP72571",
    "hip": 72571,
    "name": null,
    "ra": 222.5727779,
    "dec": -27.96021925,
    "magnitude": 4.42
  },
  "HIP72607": {
    "id": "HIP72607",
    "hip": 72607,
    "name": "Kochab",
    "ra": 222.67664751,
    "dec": 74.15547596,
    "magnitude": 2.07
  },
  "HIP72622": {
    "id": "HIP72622",
    "hip": 72622,
    "name": "Zubenelgenubi",
    "ra": 222.71990536,
    "dec": -16.04161047,
    "magnitude": 2.75
  },
  "HIP73273": {
    "id": "HIP73273",
    "hip": 73273,
    "name": null,
    "ra": 224.63314193,
    "dec": -43.13386699,
    "magnitude": 2.68
  },
  "HIP73334": {
    "id": "HIP73334",
    "hip": 73334,
    "name": null,
    "ra": 224.79041254,
    "dec": -42.10414199,
    "magnitude": 3.13
  },
  "HIP73555": {
    "id": "HIP73555",
    "hip": 73555,
    "name": "Nekkar",
    "ra": 225.48663804,
    "dec": 40.39063671,
    "magnitude": 3.49
  },
  "HIP73714": {
    "id": "HIP73714",
    "hip": 73714,
    "name": "Brachium",
    "ra": 226.01775793,
    "dec": -25.28185602,
    "magnitude": 3.25
  },
  "HIP74395": {
    "id": "HIP74395",
    "hip": 74395,
    "name": null,
    "ra": 228.07167982,
    "dec": -52.09907465,
    "magnitude": 3.41
  },
  "HIP74666": {
    "id": "HIP74666",
    "hip": 74666,
    "name": null,
    "ra": 228.87543241,
    "dec": 33.31510222,
    "magnitude": 3.46
  },
  "HIP74785": {
    "id": "HIP74785",
    "hip": 74785,
    "name": "Zubeneschamali",
    "ra": 229.25196591,
    "dec": -9.38286694,
    "magnitude": 2.61
  },
  "HIP74824": {
    "id": "HIP74824",
    "hip": 74824,
    "name": null,
    "ra": 229.3790009,
    "dec": -58.80087882,
    "magnitude": 4.07
  },
  "HIP74946": {
    "id": "HIP74946",
    "hip": 74946,
    "name": null,
    "ra": 229.72787007,
    "dec": -68.67946723,
    "magnitude": 2.87
  },
  "HIP75097": {
    "id": "HIP75097",
    "hip": 75097,
    "name": "Pherkad",
    "ra": 230.1822884,
    "dec": 71.83397308,
    "magnitude": 3
  },
  "HIP75141": {
    "id": "HIP75141",
    "hip": 75141,
    "name": null,
    "ra": 230.34306833,
    "dec": -40.64745946,
    "magnitude": 3.22
  },
  "HIP75177": {
    "id": "HIP75177",
    "hip": 75177,
    "name": null,
    "ra": 230.45181856,
    "dec": -36.26116729,
    "magnitude": 3.57
  },
  "HIP75264": {
    "id": "HIP75264",
    "hip": 75264,
    "name": null,
    "ra": 230.67036465,
    "dec": -44.68957314,
    "magnitude": 3.37
  },
  "HIP75323": {
    "id": "HIP75323",
    "hip": 75323,
    "name": null,
    "ra": 230.84440733,
    "dec": -59.32069839,
    "magnitude": 4.48
  },
  "HIP75458": {
    "id": "HIP75458",
    "hip": 75458,
    "name": "Edasich",
    "ra": 231.2324337,
    "dec": 58.96602354,
    "magnitude": 3.29
  },
  "HIP75695": {
    "id": "HIP75695",
    "hip": 75695,
    "name": "Nusakan",
    "ra": 231.95771631,
    "dec": 29.10549164,
    "magnitude": 3.66
  },
  "HIP76127": {
    "id": "HIP76127",
    "hip": 76127,
    "name": null,
    "ra": 233.23248309,
    "dec": 31.35915517,
    "magnitude": 4.14
  },
  "HIP76267": {
    "id": "HIP76267",
    "hip": 76267,
    "name": "Alphecca",
    "ra": 233.67162293,
    "dec": 26.71491041,
    "magnitude": 2.22
  },
  "HIP76276": {
    "id": "HIP76276",
    "hip": 76276,
    "name": null,
    "ra": 233.7007926,
    "dec": 10.53885916,
    "magnitude": 3.8
  },
  "HIP76297": {
    "id": "HIP76297",
    "hip": 76297,
    "name": null,
    "ra": 233.78525156,
    "dec": -41.16669497,
    "magnitude": 2.8
  },
  "HIP76333": {
    "id": "HIP76333",
    "hip": 76333,
    "name": "Zubenelhakrabi",
    "ra": 233.88141398,
    "dec": -14.78955365,
    "magnitude": 3.91
  },
  "HIP76440": {
    "id": "HIP76440",
    "hip": 76440,
    "name": null,
    "ra": 234.17994543,
    "dec": -66.31690469,
    "magnitude": 4.11
  },
  "HIP76470": {
    "id": "HIP76470",
    "hip": 76470,
    "name": null,
    "ra": 234.25607748,
    "dec": -28.13507099,
    "magnitude": 3.6
  },
  "HIP76600": {
    "id": "HIP76600",
    "hip": 76600,
    "name": null,
    "ra": 234.66410153,
    "dec": -29.77768935,
    "magnitude": 3.66
  },
  "HIP76852": {
    "id": "HIP76852",
    "hip": 76852,
    "name": null,
    "ra": 235.38788463,
    "dec": 19.67050566,
    "magnitude": 4.51
  },
  "HIP76952": {
    "id": "HIP76952",
    "hip": 76952,
    "name": null,
    "ra": 235.68599269,
    "dec": 26.29551419,
    "magnitude": 3.81
  },
  "HIP77055": {
    "id": "HIP77055",
    "hip": 77055,
    "name": null,
    "ra": 236.01443312,
    "dec": 77.79449901,
    "magnitude": 4.29
  },
  "HIP77070": {
    "id": "HIP77070",
    "hip": 77070,
    "name": "Unukalhai",
    "ra": 236.06664914,
    "dec": 6.42551971,
    "magnitude": 2.63
  },
  "HIP77233": {
    "id": "HIP77233",
    "hip": 77233,
    "name": null,
    "ra": 236.54672877,
    "dec": 15.42192602,
    "magnitude": 3.65
  },
  "HIP77450": {
    "id": "HIP77450",
    "hip": 77450,
    "name": "Gudja",
    "ra": 237.18503586,
    "dec": 18.1417793,
    "magnitude": 4.09
  },
  "HIP77512": {
    "id": "HIP77512",
    "hip": 77512,
    "name": null,
    "ra": 237.39874182,
    "dec": 26.06854936,
    "magnitude": 4.59
  },
  "HIP77516": {
    "id": "HIP77516",
    "hip": 77516,
    "name": null,
    "ra": 237.40527375,
    "dec": -3.43014112,
    "magnitude": 3.54
  },
  "HIP77622": {
    "id": "HIP77622",
    "hip": 77622,
    "name": null,
    "ra": 237.70371344,
    "dec": 4.4775798,
    "magnitude": 3.71
  },
  "HIP77634": {
    "id": "HIP77634",
    "hip": 77634,
    "name": null,
    "ra": 237.7397573,
    "dec": -33.62710488,
    "magnitude": 3.97
  },
  "HIP77760": {
    "id": "HIP77760",
    "hip": 77760,
    "name": null,
    "ra": 238.16747684,
    "dec": 42.44998796,
    "magnitude": 4.6
  },
  "HIP77952": {
    "id": "HIP77952",
    "hip": 77952,
    "name": null,
    "ra": 238.78670013,
    "dec": -63.42974973,
    "magnitude": 2.83
  },
  "HIP78072": {
    "id": "HIP78072",
    "hip": 78072,
    "name": null,
    "ra": 239.11247598,
    "dec": 15.66473327,
    "magnitude": 3.85
  },
  "HIP78104": {
    "id": "HIP78104",
    "hip": 78104,
    "name": "Iklil",
    "ra": 239.22119438,
    "dec": -29.21401221,
    "magnitude": 3.87
  },
  "HIP78159": {
    "id": "HIP78159",
    "hip": 78159,
    "name": null,
    "ra": 239.39709121,
    "dec": 26.87802632,
    "magnitude": 4.14
  },
  "HIP78265": {
    "id": "HIP78265",
    "hip": 78265,
    "name": "Fang",
    "ra": 239.71300283,
    "dec": -26.1140428,
    "magnitude": 2.89
  },
  "HIP78384": {
    "id": "HIP78384",
    "hip": 78384,
    "name": null,
    "ra": 240.03058543,
    "dec": -38.39664079,
    "magnitude": 3.42
  },
  "HIP78401": {
    "id": "HIP78401",
    "hip": 78401,
    "name": "Dschubba",
    "ra": 240.08338225,
    "dec": -22.62162024,
    "magnitude": 2.29
  },
  "HIP78493": {
    "id": "HIP78493",
    "hip": 78493,
    "name": null,
    "ra": 240.36079431,
    "dec": 29.85107821,
    "magnitude": 4.98
  },
  "HIP78527": {
    "id": "HIP78527",
    "hip": 78527,
    "name": null,
    "ra": 240.4737656,
    "dec": 58.56443739,
    "magnitude": 4.01
  },
  "HIP78639": {
    "id": "HIP78639",
    "hip": 78639,
    "name": null,
    "ra": 240.80358419,
    "dec": -49.22972074,
    "magnitude": 4.65
  },
  "HIP78820": {
    "id": "HIP78820",
    "hip": 78820,
    "name": "Acrab",
    "ra": 241.35931206,
    "dec": -19.80539286,
    "magnitude": 2.56
  },
  "HIP78914": {
    "id": "HIP78914",
    "hip": 78914,
    "name": null,
    "ra": 241.6225984,
    "dec": -45.17327517,
    "magnitude": 4.73
  },
  "HIP79101": {
    "id": "HIP79101",
    "hip": 79101,
    "name": null,
    "ra": 242.19249715,
    "dec": 44.93481883,
    "magnitude": 4.23
  },
  "HIP79374": {
    "id": "HIP79374",
    "hip": 79374,
    "name": "Jabbah",
    "ra": 242.99891879,
    "dec": -19.46064684,
    "magnitude": 4
  },
  "HIP79593": {
    "id": "HIP79593",
    "hip": 79593,
    "name": "Yed Prior",
    "ra": 243.58652601,
    "dec": -3.69397562,
    "magnitude": 2.73
  },
  "HIP79822": {
    "id": "HIP79822",
    "hip": 79822,
    "name": null,
    "ra": 244.37708768,
    "dec": 75.75470385,
    "magnitude": 4.95
  },
  "HIP79882": {
    "id": "HIP79882",
    "hip": 79882,
    "name": "Yed Posterior",
    "ra": 244.58016994,
    "dec": -4.69260809,
    "magnitude": 3.23
  },
  "HIP79992": {
    "id": "HIP79992",
    "hip": 79992,
    "name": null,
    "ra": 244.93519958,
    "dec": 46.31327084,
    "magnitude": 3.91
  },
  "HIP80000": {
    "id": "HIP80000",
    "hip": 80000,
    "name": null,
    "ra": 244.96069832,
    "dec": -50.15537923,
    "magnitude": 4.01
  },
  "HIP80047": {
    "id": "HIP80047",
    "hip": 80047,
    "name": null,
    "ra": 245.08681283,
    "dec": -78.69565609,
    "magnitude": 4.68
  },
  "HIP80112": {
    "id": "HIP80112",
    "hip": 80112,
    "name": "Alniyat",
    "ra": 245.29717718,
    "dec": -25.59275259,
    "magnitude": 2.9
  },
  "HIP80170": {
    "id": "HIP80170",
    "hip": 80170,
    "name": null,
    "ra": 245.48018203,
    "dec": 19.15302185,
    "magnitude": 3.74
  },
  "HIP80331": {
    "id": "HIP80331",
    "hip": 80331,
    "name": "Athebyne",
    "ra": 245.99794523,
    "dec": 61.51407536,
    "magnitude": 2.73
  },
  "HIP80343": {
    "id": "HIP80343",
    "hip": 80343,
    "name": null,
    "ra": 246.02582204,
    "dec": -20.03721137,
    "magnitude": 4.48
  },
  "HIP80463": {
    "id": "HIP80463",
    "hip": 80463,
    "name": "Cujam",
    "ra": 246.35387324,
    "dec": 14.03341514,
    "magnitude": 4.57
  },
  "HIP80473": {
    "id": "HIP80473",
    "hip": 80473,
    "name": null,
    "ra": 246.39633811,
    "dec": -23.44711764,
    "magnitude": 4.57
  },
  "HIP80569": {
    "id": "HIP80569",
    "hip": 80569,
    "name": null,
    "ra": 246.75599294,
    "dec": -18.45619698,
    "magnitude": 4.22
  },
  "HIP80582": {
    "id": "HIP80582",
    "hip": 80582,
    "name": null,
    "ra": 246.79603256,
    "dec": -47.5547359,
    "magnitude": 4.46
  },
  "HIP80628": {
    "id": "HIP80628",
    "hip": 80628,
    "name": null,
    "ra": 246.95094563,
    "dec": -8.37170055,
    "magnitude": 4.62
  },
  "HIP80763": {
    "id": "HIP80763",
    "hip": 80763,
    "name": "Antares",
    "ra": 247.35194804,
    "dec": -26.43194608,
    "magnitude": 1.06
  },
  "HIP80816": {
    "id": "HIP80816",
    "hip": 80816,
    "name": "Kornephoros",
    "ra": 247.55525697,
    "dec": 21.4896485,
    "magnitude": 2.78
  },
  "HIP80883": {
    "id": "HIP80883",
    "hip": 80883,
    "name": "Marfik",
    "ra": 247.72850509,
    "dec": 1.98410056,
    "magnitude": 3.82
  },
  "HIP80894": {
    "id": "HIP80894",
    "hip": 80894,
    "name": null,
    "ra": 247.78497886,
    "dec": -16.61264015,
    "magnitude": 4.29
  },
  "HIP81008": {
    "id": "HIP81008",
    "hip": 81008,
    "name": null,
    "ra": 248.15165942,
    "dec": 11.48823391,
    "magnitude": 4.84
  },
  "HIP81065": {
    "id": "HIP81065",
    "hip": 81065,
    "name": null,
    "ra": 248.36443409,
    "dec": -78.89695917,
    "magnitude": 3.86
  },
  "HIP81126": {
    "id": "HIP81126",
    "hip": 81126,
    "name": null,
    "ra": 248.52578863,
    "dec": 42.43689565,
    "magnitude": 4.2
  },
  "HIP81266": {
    "id": "HIP81266",
    "hip": 81266,
    "name": "Paikauhale",
    "ra": 248.97066423,
    "dec": -28.21596156,
    "magnitude": 2.82
  },
  "HIP81377": {
    "id": "HIP81377",
    "hip": 81377,
    "name": null,
    "ra": 249.28970847,
    "dec": -10.5671518,
    "magnitude": 2.54
  },
  "HIP81693": {
    "id": "HIP81693",
    "hip": 81693,
    "name": null,
    "ra": 250.32282132,
    "dec": 31.60188695,
    "magnitude": 2.81
  },
  "HIP81833": {
    "id": "HIP81833",
    "hip": 81833,
    "name": null,
    "ra": 250.72391068,
    "dec": 38.92246103,
    "magnitude": 3.48
  },
  "HIP81852": {
    "id": "HIP81852",
    "hip": 81852,
    "name": null,
    "ra": 250.7725818,
    "dec": -77.51657182,
    "magnitude": 4.23
  },
  "HIP82080": {
    "id": "HIP82080",
    "hip": 82080,
    "name": null,
    "ra": 251.49233961,
    "dec": 82.03725071,
    "magnitude": 4.21
  },
  "HIP82273": {
    "id": "HIP82273",
    "hip": 82273,
    "name": "Atria",
    "ra": 252.16610742,
    "dec": -69.02763503,
    "magnitude": 1.91
  },
  "HIP82363": {
    "id": "HIP82363",
    "hip": 82363,
    "name": null,
    "ra": 252.44629764,
    "dec": -59.04131648,
    "magnitude": 3.77
  },
  "HIP82396": {
    "id": "HIP82396",
    "hip": 82396,
    "name": "Larawag",
    "ra": 252.54268738,
    "dec": -34.29260982,
    "magnitude": 2.29
  },
  "HIP82514": {
    "id": "HIP82514",
    "hip": 82514,
    "name": "Xamidimura",
    "ra": 252.96766195,
    "dec": -38.04732717,
    "magnitude": 3
  },
  "HIP82729": {
    "id": "HIP82729",
    "hip": 82729,
    "name": null,
    "ra": 253.64627156,
    "dec": -42.36075916,
    "magnitude": 3.62
  },
  "HIP83000": {
    "id": "HIP83000",
    "hip": 83000,
    "name": null,
    "ra": 254.41779418,
    "dec": 9.37505626,
    "magnitude": 3.19
  },
  "HIP83081": {
    "id": "HIP83081",
    "hip": 83081,
    "name": null,
    "ra": 254.65512817,
    "dec": -55.99005508,
    "magnitude": 3.12
  },
  "HIP83153": {
    "id": "HIP83153",
    "hip": 83153,
    "name": null,
    "ra": 254.89602773,
    "dec": -53.16049005,
    "magnitude": 4.06
  },
  "HIP83207": {
    "id": "HIP83207",
    "hip": 83207,
    "name": null,
    "ra": 255.07252582,
    "dec": 30.92633926,
    "magnitude": 3.92
  },
  "HIP83895": {
    "id": "HIP83895",
    "hip": 83895,
    "name": "Aldhibah",
    "ra": 257.19677111,
    "dec": 65.71463676,
    "magnitude": 3.17
  },
  "HIP84012": {
    "id": "HIP84012",
    "hip": 84012,
    "name": "Sabik",
    "ra": 257.59442659,
    "dec": -15.72514757,
    "magnitude": 2.43
  },
  "HIP84143": {
    "id": "HIP84143",
    "hip": 84143,
    "name": null,
    "ra": 258.038233,
    "dec": -43.23849039,
    "magnitude": 3.32
  },
  "HIP84345": {
    "id": "HIP84345",
    "hip": 84345,
    "name": "Rasalgethi",
    "ra": 258.66192687,
    "dec": 14.39025314,
    "magnitude": 2.78
  },
  "HIP84379": {
    "id": "HIP84379",
    "hip": 84379,
    "name": "Sarin",
    "ra": 258.75801735,
    "dec": 24.83958739,
    "magnitude": 3.12
  },
  "HIP84380": {
    "id": "HIP84380",
    "hip": 84380,
    "name": null,
    "ra": 258.76189282,
    "dec": 36.80915527,
    "magnitude": 3.16
  },
  "HIP84970": {
    "id": "HIP84970",
    "hip": 84970,
    "name": null,
    "ra": 260.50243371,
    "dec": -24.99948797,
    "magnitude": 3.27
  },
  "HIP85112": {
    "id": "HIP85112",
    "hip": 85112,
    "name": null,
    "ra": 260.92072033,
    "dec": 37.14592396,
    "magnitude": 4.15
  },
  "HIP85258": {
    "id": "HIP85258",
    "hip": 85258,
    "name": null,
    "ra": 261.32498828,
    "dec": -55.52982397,
    "magnitude": 2.84
  },
  "HIP85267": {
    "id": "HIP85267",
    "hip": 85267,
    "name": null,
    "ra": 261.34858274,
    "dec": -56.37768824,
    "magnitude": 3.31
  },
  "HIP85423": {
    "id": "HIP85423",
    "hip": 85423,
    "name": null,
    "ra": 261.8386001,
    "dec": -29.86669942,
    "magnitude": 4.28
  },
  "HIP85670": {
    "id": "HIP85670",
    "hip": 85670,
    "name": "Rastaban",
    "ra": 262.60823708,
    "dec": 52.30135901,
    "magnitude": 2.79
  },
  "HIP85693": {
    "id": "HIP85693",
    "hip": 85693,
    "name": "Maasym",
    "ra": 262.68457505,
    "dec": 26.1106045,
    "magnitude": 4.41
  },
  "HIP85696": {
    "id": "HIP85696",
    "hip": 85696,
    "name": "Lesath",
    "ra": 262.69099501,
    "dec": -37.29574016,
    "magnitude": 2.7
  },
  "HIP85727": {
    "id": "HIP85727",
    "hip": 85727,
    "name": null,
    "ra": 262.77490395,
    "dec": -60.68360667,
    "magnitude": 3.6
  },
  "HIP85792": {
    "id": "HIP85792",
    "hip": 85792,
    "name": null,
    "ra": 262.96050661,
    "dec": -49.87598159,
    "magnitude": 2.84
  },
  "HIP85822": {
    "id": "HIP85822",
    "hip": 85822,
    "name": "Yildun",
    "ra": 263.05373826,
    "dec": 86.58632924,
    "magnitude": 4.35
  },
  "HIP85829": {
    "id": "HIP85829",
    "hip": 85829,
    "name": null,
    "ra": 263.06616249,
    "dec": 55.17280674,
    "magnitude": 4.86
  },
  "HIP85927": {
    "id": "HIP85927",
    "hip": 85927,
    "name": "Shaula",
    "ra": 263.40219373,
    "dec": -37.10374835,
    "magnitude": 1.62
  },
  "HIP86032": {
    "id": "HIP86032",
    "hip": 86032,
    "name": "Rasalhague",
    "ra": 263.73335321,
    "dec": 12.56057584,
    "magnitude": 2.08
  },
  "HIP86228": {
    "id": "HIP86228",
    "hip": 86228,
    "name": "Sargas",
    "ra": 264.32969072,
    "dec": -42.99782155,
    "magnitude": 1.86
  },
  "HIP86263": {
    "id": "HIP86263",
    "hip": 86263,
    "name": null,
    "ra": 264.39677181,
    "dec": -15.39840835,
    "magnitude": 3.54
  },
  "HIP86414": {
    "id": "HIP86414",
    "hip": 86414,
    "name": null,
    "ra": 264.86621847,
    "dec": 46.00632216,
    "magnitude": 3.82
  },
  "HIP86670": {
    "id": "HIP86670",
    "hip": 86670,
    "name": null,
    "ra": 265.62199908,
    "dec": -39.02992092,
    "magnitude": 2.39
  },
  "HIP86742": {
    "id": "HIP86742",
    "hip": 86742,
    "name": "Cebalrai",
    "ra": 265.86823714,
    "dec": 4.56691684,
    "magnitude": 2.76
  },
  "HIP86929": {
    "id": "HIP86929",
    "hip": 86929,
    "name": null,
    "ra": 266.43334347,
    "dec": -64.7237345,
    "magnitude": 3.61
  },
  "HIP86974": {
    "id": "HIP86974",
    "hip": 86974,
    "name": null,
    "ra": 266.61549553,
    "dec": 27.72249917,
    "magnitude": 3.42
  },
  "HIP87073": {
    "id": "HIP87073",
    "hip": 87073,
    "name": null,
    "ra": 266.89617137,
    "dec": -40.12698197,
    "magnitude": 2.99
  },
  "HIP87108": {
    "id": "HIP87108",
    "hip": 87108,
    "name": null,
    "ra": 266.97322515,
    "dec": 2.70745875,
    "magnitude": 3.75
  },
  "HIP87261": {
    "id": "HIP87261",
    "hip": 87261,
    "name": "Fuyue",
    "ra": 267.4643802,
    "dec": -37.04337105,
    "magnitude": 3.19
  },
  "HIP87585": {
    "id": "HIP87585",
    "hip": 87585,
    "name": "Grumium",
    "ra": 268.38178961,
    "dec": 56.87245216,
    "magnitude": 3.73
  },
  "HIP87808": {
    "id": "HIP87808",
    "hip": 87808,
    "name": null,
    "ra": 269.06324389,
    "dec": 37.25052158,
    "magnitude": 3.86
  },
  "HIP87833": {
    "id": "HIP87833",
    "hip": 87833,
    "name": "Eltanin",
    "ra": 269.15157439,
    "dec": 51.48895101,
    "magnitude": 2.24
  },
  "HIP87933": {
    "id": "HIP87933",
    "hip": 87933,
    "name": null,
    "ra": 269.44096106,
    "dec": 29.24792527,
    "magnitude": 3.7
  },
  "HIP88048": {
    "id": "HIP88048",
    "hip": 88048,
    "name": null,
    "ra": 269.75665662,
    "dec": -9.77334973,
    "magnitude": 3.32
  },
  "HIP88635": {
    "id": "HIP88635",
    "hip": 88635,
    "name": "Alnasl",
    "ra": 271.45218586,
    "dec": -30.42365007,
    "magnitude": 2.98
  },
  "HIP88714": {
    "id": "HIP88714",
    "hip": 88714,
    "name": null,
    "ra": 271.65782832,
    "dec": -50.09145462,
    "magnitude": 3.65
  },
  "HIP88794": {
    "id": "HIP88794",
    "hip": 88794,
    "name": null,
    "ra": 271.88562824,
    "dec": 28.76247025,
    "magnitude": 3.84
  },
  "HIP88866": {
    "id": "HIP88866",
    "hip": 88866,
    "name": null,
    "ra": 272.14496186,
    "dec": -63.66804844,
    "magnitude": 4.33
  },
  "HIP89112": {
    "id": "HIP89112",
    "hip": 89112,
    "name": null,
    "ra": 272.80740093,
    "dec": -45.95432704,
    "magnitude": 4.52
  },
  "HIP89341": {
    "id": "HIP89341",
    "hip": 89341,
    "name": "Polis",
    "ra": 273.44086963,
    "dec": -21.05883031,
    "magnitude": 3.84
  },
  "HIP89642": {
    "id": "HIP89642",
    "hip": 89642,
    "name": null,
    "ra": 274.4072049,
    "dec": -36.76128103,
    "magnitude": 3.1
  },
  "HIP89908": {
    "id": "HIP89908",
    "hip": 89908,
    "name": null,
    "ra": 275.18933831,
    "dec": 71.33772734,
    "magnitude": 4.22
  },
  "HIP89931": {
    "id": "HIP89931",
    "hip": 89931,
    "name": "Kaus Media",
    "ra": 275.24842337,
    "dec": -29.82803914,
    "magnitude": 2.72
  },
  "HIP89937": {
    "id": "HIP89937",
    "hip": 89937,
    "name": null,
    "ra": 275.25974572,
    "dec": 72.73369763,
    "magnitude": 3.55
  },
  "HIP89962": {
    "id": "HIP89962",
    "hip": 89962,
    "name": null,
    "ra": 275.32883578,
    "dec": -2.897122,
    "magnitude": 3.23
  },
  "HIP90098": {
    "id": "HIP90098",
    "hip": 90098,
    "name": null,
    "ra": 275.80675239,
    "dec": -61.49390506,
    "magnitude": 4.35
  },
  "HIP90185": {
    "id": "HIP90185",
    "hip": 90185,
    "name": "Kaus Australis",
    "ra": 276.04310967,
    "dec": -34.3843146,
    "magnitude": 1.79
  },
  "HIP90422": {
    "id": "HIP90422",
    "hip": 90422,
    "name": null,
    "ra": 276.74345947,
    "dec": -45.96832919,
    "magnitude": 3.49
  },
  "HIP90496": {
    "id": "HIP90496",
    "hip": 90496,
    "name": "Kaus Borealis",
    "ra": 276.99278955,
    "dec": -25.42124732,
    "magnitude": 2.82
  },
  "HIP90568": {
    "id": "HIP90568",
    "hip": 90568,
    "name": null,
    "ra": 277.20723319,
    "dec": -49.07003097,
    "magnitude": 4.1
  },
  "HIP90595": {
    "id": "HIP90595",
    "hip": 90595,
    "name": null,
    "ra": 277.29938301,
    "dec": -14.56580499,
    "magnitude": 4.67
  },
  "HIP90982": {
    "id": "HIP90982",
    "hip": 90982,
    "name": null,
    "ra": 278.37566714,
    "dec": -42.31245871,
    "magnitude": 4.62
  },
  "HIP91117": {
    "id": "HIP91117",
    "hip": 91117,
    "name": null,
    "ra": 278.80182442,
    "dec": -8.24330819,
    "magnitude": 3.85
  },
  "HIP91262": {
    "id": "HIP91262",
    "hip": 91262,
    "name": "Vega",
    "ra": 279.23410832,
    "dec": 38.78299311,
    "magnitude": 0.03
  },
  "HIP91726": {
    "id": "HIP91726",
    "hip": 91726,
    "name": null,
    "ra": 280.56842553,
    "dec": -9.05255357,
    "magnitude": 4.7
  },
  "HIP91792": {
    "id": "HIP91792",
    "hip": 91792,
    "name": null,
    "ra": 280.75889095,
    "dec": -71.42772867,
    "magnitude": 4.01
  },
  "HIP91919": {
    "id": "HIP91919",
    "hip": 91919,
    "name": null,
    "ra": 281.08473883,
    "dec": 39.66997686,
    "magnitude": 4.67
  },
  "HIP91971": {
    "id": "HIP91971",
    "hip": 91971,
    "name": null,
    "ra": 281.19306613,
    "dec": 37.60505025,
    "magnitude": 4.34
  },
  "HIP92041": {
    "id": "HIP92041",
    "hip": 92041,
    "name": null,
    "ra": 281.41397083,
    "dec": -26.9907794,
    "magnitude": 3.17
  },
  "HIP92175": {
    "id": "HIP92175",
    "hip": 92175,
    "name": null,
    "ra": 281.79365558,
    "dec": -4.74782871,
    "magnitude": 4.22
  },
  "HIP92420": {
    "id": "HIP92420",
    "hip": 92420,
    "name": "Sheliak",
    "ra": 282.51997462,
    "dec": 33.36267788,
    "magnitude": 3.52
  },
  "HIP92609": {
    "id": "HIP92609",
    "hip": 92609,
    "name": null,
    "ra": 283.05431892,
    "dec": -62.18756062,
    "magnitude": 4.22
  },
  "HIP92791": {
    "id": "HIP92791",
    "hip": 92791,
    "name": null,
    "ra": 283.62620294,
    "dec": 36.89860518,
    "magnitude": 4.22
  },
  "HIP92855": {
    "id": "HIP92855",
    "hip": 92855,
    "name": "Nunki",
    "ra": 283.81631956,
    "dec": -26.29659428,
    "magnitude": 2.05
  },
  "HIP92946": {
    "id": "HIP92946",
    "hip": 92946,
    "name": "Alya",
    "ra": 284.05483475,
    "dec": 4.20352956,
    "magnitude": 4.62
  },
  "HIP93015": {
    "id": "HIP93015",
    "hip": 93015,
    "name": null,
    "ra": 284.23766942,
    "dec": -67.23353511,
    "magnitude": 4.4
  },
  "HIP93085": {
    "id": "HIP93085",
    "hip": 93085,
    "name": null,
    "ra": 284.43241556,
    "dec": -21.10662433,
    "magnitude": 3.52
  },
  "HIP93194": {
    "id": "HIP93194",
    "hip": 93194,
    "name": "Sulafat",
    "ra": 284.73593568,
    "dec": 32.68955312,
    "magnitude": 3.25
  },
  "HIP93244": {
    "id": "HIP93244",
    "hip": 93244,
    "name": null,
    "ra": 284.90578844,
    "dec": 15.06847757,
    "magnitude": 4.02
  },
  "HIP93429": {
    "id": "HIP93429",
    "hip": 93429,
    "name": null,
    "ra": 285.42017236,
    "dec": -5.73901832,
    "magnitude": 4.02
  },
  "HIP93506": {
    "id": "HIP93506",
    "hip": 93506,
    "name": "Ascella",
    "ra": 285.65301428,
    "dec": -29.88011429,
    "magnitude": 2.6
  },
  "HIP93683": {
    "id": "HIP93683",
    "hip": 93683,
    "name": null,
    "ra": 286.17055765,
    "dec": -21.74135451,
    "magnitude": 3.76
  },
  "HIP93747": {
    "id": "HIP93747",
    "hip": 93747,
    "name": "Okab",
    "ra": 286.3525518,
    "dec": 13.86370983,
    "magnitude": 2.99
  },
  "HIP93805": {
    "id": "HIP93805",
    "hip": 93805,
    "name": null,
    "ra": 286.56229139,
    "dec": -4.88233456,
    "magnitude": 3.43
  },
  "HIP93825": {
    "id": "HIP93825",
    "hip": 93825,
    "name": null,
    "ra": 286.60433158,
    "dec": -37.06275714,
    "magnitude": 4.23
  },
  "HIP93864": {
    "id": "HIP93864",
    "hip": 93864,
    "name": null,
    "ra": 286.73517629,
    "dec": -27.66981416,
    "magnitude": 3.32
  },
  "HIP94005": {
    "id": "HIP94005",
    "hip": 94005,
    "name": null,
    "ra": 287.08722077,
    "dec": -40.4966376,
    "magnitude": 4.57
  },
  "HIP94114": {
    "id": "HIP94114",
    "hip": 94114,
    "name": "Meridiana",
    "ra": 287.36782635,
    "dec": -37.90423953,
    "magnitude": 4.11
  },
  "HIP94141": {
    "id": "HIP94141",
    "hip": 94141,
    "name": "Albaldah",
    "ra": 287.44097404,
    "dec": -21.02352534,
    "magnitude": 2.88
  },
  "HIP94160": {
    "id": "HIP94160",
    "hip": 94160,
    "name": null,
    "ra": 287.50730185,
    "dec": -39.34070677,
    "magnitude": 4.1
  },
  "HIP94376": {
    "id": "HIP94376",
    "hip": 94376,
    "name": "Altais",
    "ra": 288.13814581,
    "dec": 67.66131695,
    "magnitude": 3.07
  },
  "HIP94779": {
    "id": "HIP94779",
    "hip": 94779,
    "name": null,
    "ra": 289.27545794,
    "dec": 53.36816064,
    "magnitude": 3.8
  },
  "HIP95168": {
    "id": "HIP95168",
    "hip": 95168,
    "name": null,
    "ra": 290.41823037,
    "dec": -17.84725155,
    "magnitude": 3.92
  },
  "HIP95501": {
    "id": "HIP95501",
    "hip": 95501,
    "name": null,
    "ra": 291.37396941,
    "dec": 3.11457923,
    "magnitude": 3.36
  },
  "HIP95771": {
    "id": "HIP95771",
    "hip": 95771,
    "name": "Anser",
    "ra": 292.17671261,
    "dec": 24.66516482,
    "magnitude": 4.44
  },
  "HIP95853": {
    "id": "HIP95853",
    "hip": 95853,
    "name": null,
    "ra": 292.42641389,
    "dec": 51.72946747,
    "magnitude": 3.76
  },
  "HIP95947": {
    "id": "HIP95947",
    "hip": 95947,
    "name": "Albireo",
    "ra": 292.68035529,
    "dec": 27.9596948,
    "magnitude": 3.05
  },
  "HIP96468": {
    "id": "HIP96468",
    "hip": 96468,
    "name": null,
    "ra": 294.18031892,
    "dec": -1.28655047,
    "magnitude": 4.36
  },
  "HIP96757": {
    "id": "HIP96757",
    "hip": 96757,
    "name": "Sham",
    "ra": 295.02409394,
    "dec": 18.01393839,
    "magnitude": 4.39
  },
  "HIP96837": {
    "id": "HIP96837",
    "hip": 96837,
    "name": null,
    "ra": 295.26222378,
    "dec": 17.47612356,
    "magnitude": 4.39
  },
  "HIP97165": {
    "id": "HIP97165",
    "hip": 97165,
    "name": "Fawaris",
    "ra": 296.24350878,
    "dec": 45.13069195,
    "magnitude": 2.86
  },
  "HIP97278": {
    "id": "HIP97278",
    "hip": 97278,
    "name": "Tarazed",
    "ra": 296.56487567,
    "dec": 10.61326869,
    "magnitude": 2.72
  },
  "HIP97365": {
    "id": "HIP97365",
    "hip": 97365,
    "name": null,
    "ra": 296.84693842,
    "dec": 18.53425912,
    "magnitude": 3.68
  },
  "HIP97433": {
    "id": "HIP97433",
    "hip": 97433,
    "name": null,
    "ra": 297.04255658,
    "dec": 70.26783533,
    "magnitude": 3.84
  },
  "HIP97649": {
    "id": "HIP97649",
    "hip": 97649,
    "name": "Altair",
    "ra": 297.6945086,
    "dec": 8.86738491,
    "magnitude": 0.76
  },
  "HIP97804": {
    "id": "HIP97804",
    "hip": 97804,
    "name": null,
    "ra": 298.11818257,
    "dec": 1.00567827,
    "magnitude": 3.87
  },
  "HIP97886": {
    "id": "HIP97886",
    "hip": 97886,
    "name": null,
    "ra": 298.36533677,
    "dec": 24.07952568,
    "magnitude": 4.57
  },
  "HIP98036": {
    "id": "HIP98036",
    "hip": 98036,
    "name": "Alshain",
    "ra": 298.82819233,
    "dec": 6.40793334,
    "magnitude": 3.71
  },
  "HIP98337": {
    "id": "HIP98337",
    "hip": 98337,
    "name": null,
    "ra": 299.68911516,
    "dec": 19.49209287,
    "magnitude": 3.51
  },
  "HIP98495": {
    "id": "HIP98495",
    "hip": 98495,
    "name": null,
    "ra": 300.14747226,
    "dec": -72.91018443,
    "magnitude": 3.97
  },
  "HIP99240": {
    "id": "HIP99240",
    "hip": 99240,
    "name": null,
    "ra": 302.17441713,
    "dec": -66.17932101,
    "magnitude": 3.55
  },
  "HIP99473": {
    "id": "HIP99473",
    "hip": 99473,
    "name": null,
    "ra": 302.82610327,
    "dec": -0.82147569,
    "magnitude": 3.24
  },
  "HIP99848": {
    "id": "HIP99848",
    "hip": 99848,
    "name": null,
    "ra": 303.8679927,
    "dec": 47.7142053,
    "magnitude": 3.96
  },
  "HIP100064": {
    "id": "HIP100064",
    "hip": 100064,
    "name": "Algedi",
    "ra": 304.5134103,
    "dec": -12.54485877,
    "magnitude": 3.58
  },
  "HIP100345": {
    "id": "HIP100345",
    "hip": 100345,
    "name": "Dabih",
    "ra": 305.25269347,
    "dec": -14.78140119,
    "magnitude": 3.05
  },
  "HIP100453": {
    "id": "HIP100453",
    "hip": 100453,
    "name": "Sadr",
    "ra": 305.55708346,
    "dec": 40.2566815,
    "magnitude": 2.23
  },
  "HIP100751": {
    "id": "HIP100751",
    "hip": 100751,
    "name": "Peacock",
    "ra": 306.41187347,
    "dec": -56.73488071,
    "magnitude": 1.94
  },
  "HIP101093": {
    "id": "HIP101093",
    "hip": 101093,
    "name": null,
    "ra": 307.39511383,
    "dec": 62.99413722,
    "magnitude": 4.21
  },
  "HIP101421": {
    "id": "HIP101421",
    "hip": 101421,
    "name": "Aldulfin",
    "ra": 308.30318657,
    "dec": 11.30333217,
    "magnitude": 4.03
  },
  "HIP101769": {
    "id": "HIP101769",
    "hip": 101769,
    "name": "Rotanev",
    "ra": 309.38695734,
    "dec": 14.59520289,
    "magnitude": 3.64
  },
  "HIP101772": {
    "id": "HIP101772",
    "hip": 101772,
    "name": null,
    "ra": 309.39162365,
    "dec": -47.29166239,
    "magnitude": 3.11
  },
  "HIP101958": {
    "id": "HIP101958",
    "hip": 101958,
    "name": "Sualocin",
    "ra": 309.90939395,
    "dec": 15.9120527,
    "magnitude": 3.77
  },
  "HIP102098": {
    "id": "HIP102098",
    "hip": 102098,
    "name": "Deneb",
    "ra": 310.3579727,
    "dec": 45.28033423,
    "magnitude": 1.25
  },
  "HIP102281": {
    "id": "HIP102281",
    "hip": 102281,
    "name": null,
    "ra": 310.86477381,
    "dec": 15.07468224,
    "magnitude": 4.43
  },
  "HIP102333": {
    "id": "HIP102333",
    "hip": 102333,
    "name": null,
    "ra": 311.00911122,
    "dec": -51.92084051,
    "magnitude": 4.51
  },
  "HIP102395": {
    "id": "HIP102395",
    "hip": 102395,
    "name": null,
    "ra": 311.2398153,
    "dec": -66.20323826,
    "magnitude": 3.42
  },
  "HIP102422": {
    "id": "HIP102422",
    "hip": 102422,
    "name": null,
    "ra": 311.32195263,
    "dec": 61.83679404,
    "magnitude": 3.41
  },
  "HIP102485": {
    "id": "HIP102485",
    "hip": 102485,
    "name": null,
    "ra": 311.52402547,
    "dec": -25.27051682,
    "magnitude": 4.13
  },
  "HIP102488": {
    "id": "HIP102488",
    "hip": 102488,
    "name": "Aljanah",
    "ra": 311.55180091,
    "dec": 33.96945334,
    "magnitude": 2.48
  },
  "HIP102532": {
    "id": "HIP102532",
    "hip": 102532,
    "name": null,
    "ra": 311.66465833,
    "dec": 16.12477326,
    "magnitude": 4.27
  },
  "HIP102618": {
    "id": "HIP102618",
    "hip": 102618,
    "name": "Albali",
    "ra": 311.91888574,
    "dec": -9.49568988,
    "magnitude": 3.78
  },
  "HIP102831": {
    "id": "HIP102831",
    "hip": 102831,
    "name": null,
    "ra": 312.49199793,
    "dec": -33.7796732,
    "magnitude": 4.89
  },
  "HIP102978": {
    "id": "HIP102978",
    "hip": 102978,
    "name": null,
    "ra": 312.95540084,
    "dec": -26.91912642,
    "magnitude": 4.12
  },
  "HIP102989": {
    "id": "HIP102989",
    "hip": 102989,
    "name": null,
    "ra": 312.99481827,
    "dec": -33.17796029,
    "magnitude": 6.06
  },
  "HIP103227": {
    "id": "HIP103227",
    "hip": 103227,
    "name": null,
    "ra": 313.70241509,
    "dec": -58.4540947,
    "magnitude": 3.67
  },
  "HIP103413": {
    "id": "HIP103413",
    "hip": 103413,
    "name": null,
    "ra": 314.29338184,
    "dec": 41.16719384,
    "magnitude": 3.94
  },
  "HIP104139": {
    "id": "HIP104139",
    "hip": 104139,
    "name": null,
    "ra": 316.48658082,
    "dec": -17.23271095,
    "magnitude": 4.08
  },
  "HIP104521": {
    "id": "HIP104521",
    "hip": 104521,
    "name": null,
    "ra": 317.58529617,
    "dec": 10.13194861,
    "magnitude": 4.7
  },
  "HIP104732": {
    "id": "HIP104732",
    "hip": 104732,
    "name": null,
    "ra": 318.23408977,
    "dec": 30.22708128,
    "magnitude": 3.21
  },
  "HIP104858": {
    "id": "HIP104858",
    "hip": 104858,
    "name": null,
    "ra": 318.61995883,
    "dec": 10.00771855,
    "magnitude": 4.47
  },
  "HIP104987": {
    "id": "HIP104987",
    "hip": 104987,
    "name": "Kitalpha",
    "ra": 318.95581976,
    "dec": 5.2480739,
    "magnitude": 3.92
  },
  "HIP105199": {
    "id": "HIP105199",
    "hip": 105199,
    "name": "Alderamin",
    "ra": 319.64408982,
    "dec": 62.58545529,
    "magnitude": 2.45
  },
  "HIP105319": {
    "id": "HIP105319",
    "hip": 105319,
    "name": null,
    "ra": 319.96618253,
    "dec": -53.44926434,
    "magnitude": 4.39
  },
  "HIP105858": {
    "id": "HIP105858",
    "hip": 105858,
    "name": null,
    "ra": 321.61038385,
    "dec": -65.36814438,
    "magnitude": 4.21
  },
  "HIP105881": {
    "id": "HIP105881",
    "hip": 105881,
    "name": null,
    "ra": 321.66678212,
    "dec": -22.41137838,
    "magnitude": 3.77
  },
  "HIP106032": {
    "id": "HIP106032",
    "hip": 106032,
    "name": "Alfirk",
    "ra": 322.16489595,
    "dec": 70.56069481,
    "magnitude": 3.23
  },
  "HIP106278": {
    "id": "HIP106278",
    "hip": 106278,
    "name": "Sadalsuud",
    "ra": 322.88966951,
    "dec": -5.57115593,
    "magnitude": 2.9
  },
  "HIP106723": {
    "id": "HIP106723",
    "hip": 106723,
    "name": null,
    "ra": 324.27009487,
    "dec": -19.46601352,
    "magnitude": 4.51
  },
  "HIP106985": {
    "id": "HIP106985",
    "hip": 106985,
    "name": "Nashira",
    "ra": 325.02225935,
    "dec": -16.66225343,
    "magnitude": 3.69
  },
  "HIP107089": {
    "id": "HIP107089",
    "hip": 107089,
    "name": null,
    "ra": 325.36863801,
    "dec": -77.38946215,
    "magnitude": 3.73
  },
  "HIP107259": {
    "id": "HIP107259",
    "hip": 107259,
    "name": null,
    "ra": 325.87689561,
    "dec": 58.78005308,
    "magnitude": 4.23
  },
  "HIP107315": {
    "id": "HIP107315",
    "hip": 107315,
    "name": "Enif",
    "ra": 326.04641808,
    "dec": 9.87500791,
    "magnitude": 2.38
  },
  "HIP107354": {
    "id": "HIP107354",
    "hip": 107354,
    "name": null,
    "ra": 326.16126755,
    "dec": 25.64500284,
    "magnitude": 4.14
  },
  "HIP107380": {
    "id": "HIP107380",
    "hip": 107380,
    "name": null,
    "ra": 326.2366159,
    "dec": -33.02555306,
    "magnitude": 4.35
  },
  "HIP107556": {
    "id": "HIP107556",
    "hip": 107556,
    "name": "Deneb Algedi",
    "ra": 326.75952199,
    "dec": -16.12656595,
    "magnitude": 2.85
  },
  "HIP107608": {
    "id": "HIP107608",
    "hip": 107608,
    "name": null,
    "ra": 326.93405546,
    "dec": -30.89830582,
    "magnitude": 5.02
  },
  "HIP108085": {
    "id": "HIP108085",
    "hip": 108085,
    "name": "Aldhanab",
    "ra": 328.48189202,
    "dec": -37.3648229,
    "magnitude": 3
  },
  "HIP108431": {
    "id": "HIP108431",
    "hip": 108431,
    "name": null,
    "ra": 329.47929577,
    "dec": -54.9925666,
    "magnitude": 4.4
  },
  "HIP109074": {
    "id": "HIP109074",
    "hip": 109074,
    "name": "Sadalmelik",
    "ra": 331.44593869,
    "dec": -0.31982656,
    "magnitude": 2.95
  },
  "HIP109111": {
    "id": "HIP109111",
    "hip": 109111,
    "name": null,
    "ra": 331.52876518,
    "dec": -39.54304903,
    "magnitude": 4.47
  },
  "HIP109139": {
    "id": "HIP109139",
    "hip": 109139,
    "name": null,
    "ra": 331.60918894,
    "dec": -13.86954013,
    "magnitude": 4.29
  },
  "HIP109176": {
    "id": "HIP109176",
    "hip": 109176,
    "name": null,
    "ra": 331.75197729,
    "dec": 25.3450461,
    "magnitude": 3.77
  },
  "HIP109268": {
    "id": "HIP109268",
    "hip": 109268,
    "name": "Alnair",
    "ra": 332.05781838,
    "dec": -46.96061593,
    "magnitude": 1.73
  },
  "HIP109285": {
    "id": "HIP109285",
    "hip": 109285,
    "name": null,
    "ra": 332.0956383,
    "dec": -32.98839827,
    "magnitude": 4.5
  },
  "HIP109410": {
    "id": "HIP109410",
    "hip": 109410,
    "name": null,
    "ra": 332.49688603,
    "dec": 33.17826747,
    "magnitude": 4.28
  },
  "HIP109427": {
    "id": "HIP109427",
    "hip": 109427,
    "name": "Biham",
    "ra": 332.54924902,
    "dec": 6.197789,
    "magnitude": 3.52
  },
  "HIP109492": {
    "id": "HIP109492",
    "hip": 109492,
    "name": null,
    "ra": 332.71359131,
    "dec": 58.20124992,
    "magnitude": 3.39
  },
  "HIP109754": {
    "id": "HIP109754",
    "hip": 109754,
    "name": null,
    "ra": 333.46958944,
    "dec": 39.71488928,
    "magnitude": 4.5
  },
  "HIP109857": {
    "id": "HIP109857",
    "hip": 109857,
    "name": null,
    "ra": 333.75699582,
    "dec": 57.04346522,
    "magnitude": 4.18
  },
  "HIP109937": {
    "id": "HIP109937",
    "hip": 109937,
    "name": null,
    "ra": 333.9923757,
    "dec": 37.74873483,
    "magnitude": 4.14
  },
  "HIP110003": {
    "id": "HIP110003",
    "hip": 110003,
    "name": "Ancha",
    "ra": 334.20819329,
    "dec": -7.78323706,
    "magnitude": 4.17
  },
  "HIP110130": {
    "id": "HIP110130",
    "hip": 110130,
    "name": null,
    "ra": 334.62574257,
    "dec": -60.25949486,
    "magnitude": 2.87
  },
  "HIP110351": {
    "id": "HIP110351",
    "hip": 110351,
    "name": null,
    "ra": 335.25636792,
    "dec": 46.53656484,
    "magnitude": 4.55
  },
  "HIP110395": {
    "id": "HIP110395",
    "hip": 110395,
    "name": "Sadachbia",
    "ra": 335.41374983,
    "dec": -1.38735315,
    "magnitude": 3.86
  },
  "HIP110538": {
    "id": "HIP110538",
    "hip": 110538,
    "name": null,
    "ra": 335.89015172,
    "dec": 52.22949951,
    "magnitude": 4.42
  },
  "HIP110609": {
    "id": "HIP110609",
    "hip": 110609,
    "name": null,
    "ra": 336.1291488,
    "dec": 49.47640074,
    "magnitude": 4.55
  },
  "HIP110672": {
    "id": "HIP110672",
    "hip": 110672,
    "name": null,
    "ra": 336.31921857,
    "dec": 1.37739245,
    "magnitude": 4.8
  },
  "HIP110838": {
    "id": "HIP110838",
    "hip": 110838,
    "name": null,
    "ra": 336.83280453,
    "dec": -64.96637927,
    "magnitude": 4.51
  },
  "HIP110960": {
    "id": "HIP110960",
    "hip": 110960,
    "name": null,
    "ra": 337.20750231,
    "dec": -0.02006304,
    "magnitude": 3.65
  },
  "HIP110991": {
    "id": "HIP110991",
    "hip": 110991,
    "name": null,
    "ra": 337.29269975,
    "dec": 58.4151899,
    "magnitude": 4.07
  },
  "HIP110997": {
    "id": "HIP110997",
    "hip": 110997,
    "name": null,
    "ra": 337.31730866,
    "dec": -43.49555433,
    "magnitude": 3.97
  },
  "HIP111022": {
    "id": "HIP111022",
    "hip": 111022,
    "name": null,
    "ra": 337.38259473,
    "dec": 47.70689488,
    "magnitude": 4.34
  },
  "HIP111104": {
    "id": "HIP111104",
    "hip": 111104,
    "name": null,
    "ra": 337.62192333,
    "dec": 43.12338985,
    "magnitude": 4.52
  },
  "HIP111169": {
    "id": "HIP111169",
    "hip": 111169,
    "name": null,
    "ra": 337.82239898,
    "dec": 50.28244976,
    "magnitude": 3.76
  },
  "HIP111188": {
    "id": "HIP111188",
    "hip": 111188,
    "name": null,
    "ra": 337.87620651,
    "dec": -32.34602798,
    "magnitude": 4.29
  },
  "HIP111497": {
    "id": "HIP111497",
    "hip": 111497,
    "name": null,
    "ra": 338.83887054,
    "dec": -0.11736123,
    "magnitude": 4.04
  },
  "HIP111944": {
    "id": "HIP111944",
    "hip": 111944,
    "name": null,
    "ra": 340.12825981,
    "dec": 44.27628068,
    "magnitude": 4.5
  },
  "HIP111954": {
    "id": "HIP111954",
    "hip": 111954,
    "name": null,
    "ra": 340.16385653,
    "dec": -27.0436148,
    "magnitude": 4.18
  },
  "HIP112029": {
    "id": "HIP112029",
    "hip": 112029,
    "name": "Homam",
    "ra": 340.36531181,
    "dec": 10.83139111,
    "magnitude": 3.41
  },
  "HIP112122": {
    "id": "HIP112122",
    "hip": 112122,
    "name": "Tiaki",
    "ra": 340.66639531,
    "dec": -46.88456594,
    "magnitude": 2.07
  },
  "HIP112158": {
    "id": "HIP112158",
    "hip": 112158,
    "name": "Matar",
    "ra": 340.75053573,
    "dec": 30.22130866,
    "magnitude": 2.93
  },
  "HIP112405": {
    "id": "HIP112405",
    "hip": 112405,
    "name": null,
    "ra": 341.51551393,
    "dec": -81.38161731,
    "magnitude": 4.13
  },
  "HIP112440": {
    "id": "HIP112440",
    "hip": 112440,
    "name": null,
    "ra": 341.63267663,
    "dec": 23.56567939,
    "magnitude": 3.97
  },
  "HIP112623": {
    "id": "HIP112623",
    "hip": 112623,
    "name": null,
    "ra": 342.13832136,
    "dec": -51.31670354,
    "magnitude": 3.49
  },
  "HIP112716": {
    "id": "HIP112716",
    "hip": 112716,
    "name": null,
    "ra": 342.39795761,
    "dec": -13.59253756,
    "magnitude": 4.05
  },
  "HIP112724": {
    "id": "HIP112724",
    "hip": 112724,
    "name": null,
    "ra": 342.42046735,
    "dec": 66.20071089,
    "magnitude": 3.5
  },
  "HIP112748": {
    "id": "HIP112748",
    "hip": 112748,
    "name": "Sadalbari",
    "ra": 342.5004181,
    "dec": 24.60168486,
    "magnitude": 3.51
  },
  "HIP112948": {
    "id": "HIP112948",
    "hip": 112948,
    "name": null,
    "ra": 343.13149128,
    "dec": -32.87545019,
    "magnitude": 4.46
  },
  "HIP112961": {
    "id": "HIP112961",
    "hip": 112961,
    "name": null,
    "ra": 343.15360192,
    "dec": -7.57967878,
    "magnitude": 3.73
  },
  "HIP113136": {
    "id": "HIP113136",
    "hip": 113136,
    "name": "Skat",
    "ra": 343.6626635,
    "dec": -15.82075994,
    "magnitude": 3.27
  },
  "HIP113246": {
    "id": "HIP113246",
    "hip": 113246,
    "name": null,
    "ra": 343.98705005,
    "dec": -32.53970196,
    "magnitude": 4.2
  },
  "HIP113368": {
    "id": "HIP113368",
    "hip": 113368,
    "name": "Fomalhaut",
    "ra": 344.41177323,
    "dec": -29.62183701,
    "magnitude": 1.17
  },
  "HIP113638": {
    "id": "HIP113638",
    "hip": 113638,
    "name": null,
    "ra": 345.22030979,
    "dec": -52.75410562,
    "magnitude": 4.11
  },
  "HIP113726": {
    "id": "HIP113726",
    "hip": 113726,
    "name": null,
    "ra": 345.48019377,
    "dec": 42.32597866,
    "magnitude": 3.62
  },
  "HIP113881": {
    "id": "HIP113881",
    "hip": 113881,
    "name": "Scheat",
    "ra": 345.94305575,
    "dec": 28.08245462,
    "magnitude": 2.44
  },
  "HIP113963": {
    "id": "HIP113963",
    "hip": 113963,
    "name": "Markab",
    "ra": 346.1900702,
    "dec": 15.20536786,
    "magnitude": 2.49
  },
  "HIP114341": {
    "id": "HIP114341",
    "hip": 114341,
    "name": null,
    "ra": 347.36150879,
    "dec": -21.17248555,
    "magnitude": 3.68
  },
  "HIP114724": {
    "id": "HIP114724",
    "hip": 114724,
    "name": null,
    "ra": 348.58055219,
    "dec": -6.0485268,
    "magnitude": 4.22
  },
  "HIP114971": {
    "id": "HIP114971",
    "hip": 114971,
    "name": null,
    "ra": 349.28955677,
    "dec": 3.28224524,
    "magnitude": 3.7
  },
  "HIP114996": {
    "id": "HIP114996",
    "hip": 114996,
    "name": null,
    "ra": 349.35755018,
    "dec": -58.23592762,
    "magnitude": 3.99
  },
  "HIP115033": {
    "id": "HIP115033",
    "hip": 115033,
    "name": null,
    "ra": 349.47584844,
    "dec": -9.1824899,
    "magnitude": 4.41
  },
  "HIP115102": {
    "id": "HIP115102",
    "hip": 115102,
    "name": null,
    "ra": 349.70594501,
    "dec": -32.53183574,
    "magnitude": 4.41
  },
  "HIP115438": {
    "id": "HIP115438",
    "hip": 115438,
    "name": null,
    "ra": 350.7429228,
    "dec": -20.10034505,
    "magnitude": 3.96
  },
  "HIP115738": {
    "id": "HIP115738",
    "hip": 115738,
    "name": null,
    "ra": 351.73293881,
    "dec": 1.25583758,
    "magnitude": 4.95
  },
  "HIP115830": {
    "id": "HIP115830",
    "hip": 115830,
    "name": null,
    "ra": 351.99236589,
    "dec": 6.37909727,
    "magnitude": 4.27
  },
  "HIP116231": {
    "id": "HIP116231",
    "hip": 116231,
    "name": null,
    "ra": 353.2424506,
    "dec": -37.81835895,
    "magnitude": 4.38
  },
  "HIP116584": {
    "id": "HIP116584",
    "hip": 116584,
    "name": null,
    "ra": 354.3904487,
    "dec": 46.45917621,
    "magnitude": 3.81
  },
  "HIP116631": {
    "id": "HIP116631",
    "hip": 116631,
    "name": null,
    "ra": 354.53407969,
    "dec": 43.2680761,
    "magnitude": 4.29
  },
  "HIP116727": {
    "id": "HIP116727",
    "hip": 116727,
    "name": "Errai",
    "ra": 354.83742516,
    "dec": 77.63196681,
    "magnitude": 3.21
  },
  "HIP116771": {
    "id": "HIP116771",
    "hip": 116771,
    "name": null,
    "ra": 354.98675133,
    "dec": 5.62735374,
    "magnitude": 4.13
  },
  "HIP116805": {
    "id": "HIP116805",
    "hip": 116805,
    "name": null,
    "ra": 355.10184089,
    "dec": 44.33397776,
    "magnitude": 4.15
  },
  "HIP116928": {
    "id": "HIP116928",
    "hip": 116928,
    "name": null,
    "ra": 355.51200741,
    "dec": 1.7804172,
    "magnitude": 4.49
  },
  "HIP117452": {
    "id": "HIP117452",
    "hip": 117452,
    "name": null,
    "ra": 357.23116631,
    "dec": -28.1300148,
    "magnitude": 4.59
  },
  "HIP118268": {
    "id": "HIP118268",
    "hip": 118268,
    "name": null,
    "ra": 359.82750994,
    "dec": 6.86359373,
    "magnitude": 4.03
  },
  "HIP118322": {
    "id": "HIP118322",
    "hip": 118322,
    "name": null,
    "ra": 359.97879195,
    "dec": -65.57707774,
    "magnitude": 4.49
  }
};
  const CONSTELLATION_DATA = {
  "And": {
    "id": "And",
    "name": "Andromeda",
    "nameRu": "Андромеда",
    "nameLa": "Andromeda",
    "stars": [
      "HIP677",
      "HIP3092",
      "HIP5447",
      "HIP9640",
      "HIP113726",
      "HIP116631",
      "HIP116805",
      "HIP116584",
      "HIP2912",
      "HIP4436",
      "HIP3881",
      "HIP5434",
      "HIP7607",
      "HIP3031",
      "HIP3693",
      "HIP4463"
    ],
    "lines": [
      [
        "HIP677",
        "HIP3092"
      ],
      [
        "HIP3092",
        "HIP5447"
      ],
      [
        "HIP5447",
        "HIP9640"
      ],
      [
        "HIP113726",
        "HIP116631"
      ],
      [
        "HIP116631",
        "HIP116805"
      ],
      [
        "HIP116805",
        "HIP116584"
      ],
      [
        "HIP116631",
        "HIP2912"
      ],
      [
        "HIP2912",
        "HIP3092"
      ],
      [
        "HIP2912",
        "HIP5447"
      ],
      [
        "HIP5447",
        "HIP4436"
      ],
      [
        "HIP4436",
        "HIP3881"
      ],
      [
        "HIP3881",
        "HIP5434"
      ],
      [
        "HIP5434",
        "HIP7607"
      ],
      [
        "HIP3092",
        "HIP3031"
      ],
      [
        "HIP3031",
        "HIP3693"
      ],
      [
        "HIP3693",
        "HIP4463"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP677": {
          "x": 99.3,
          "y": 145.5
        },
        "HIP3092": {
          "x": 75.4,
          "y": 139.8
        },
        "HIP5447": {
          "x": 53.9,
          "y": 122.1
        },
        "HIP9640": {
          "x": 20,
          "y": 92.1
        },
        "HIP113726": {
          "x": 140,
          "y": 90.9
        },
        "HIP116631": {
          "x": 115,
          "y": 93.1
        },
        "HIP116805": {
          "x": 113,
          "y": 89.6
        },
        "HIP116584": {
          "x": 113.6,
          "y": 81.7
        },
        "HIP2912": {
          "x": 77.2,
          "y": 129.7
        },
        "HIP4436": {
          "x": 63.7,
          "y": 112.7
        },
        "HIP3881": {
          "x": 68.8,
          "y": 103.9
        },
        "HIP5434": {
          "x": 57.7,
          "y": 81.2
        },
        "HIP7607": {
          "x": 41.3,
          "y": 73.5
        },
        "HIP3031": {
          "x": 75.9,
          "y": 145.3
        },
        "HIP3693": {
          "x": 68.6,
          "y": 163.5
        },
        "HIP4463": {
          "x": 60.4,
          "y": 166.5
        }
      }
    }
  },
  "Ant": {
    "id": "Ant",
    "name": "Antlia",
    "nameRu": "Насос",
    "nameLa": "Antlia",
    "stars": [
      "HIP53502",
      "HIP51172",
      "HIP46515"
    ],
    "lines": [
      [
        "HIP53502",
        "HIP51172"
      ],
      [
        "HIP51172",
        "HIP46515"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP53502": {
          "x": 20,
          "y": 141.9
        },
        "HIP51172": {
          "x": 59.2,
          "y": 98.1
        },
        "HIP46515": {
          "x": 140,
          "y": 135.3
        }
      }
    }
  },
  "Aps": {
    "id": "Aps",
    "name": "Apus",
    "nameRu": "Райская Птица",
    "nameLa": "Apus",
    "stars": [
      "HIP72370",
      "HIP81065",
      "HIP80047",
      "HIP81852"
    ],
    "lines": [
      [
        "HIP72370",
        "HIP81065"
      ],
      [
        "HIP80047",
        "HIP81852"
      ],
      [
        "HIP81852",
        "HIP81065"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP72370": {
          "x": 140,
          "y": 141.7
        },
        "HIP81065": {
          "x": 34.2,
          "y": 126.2
        },
        "HIP80047": {
          "x": 47.4,
          "y": 120.8
        },
        "HIP81852": {
          "x": 20,
          "y": 98.3
        }
      }
    }
  },
  "Aql": {
    "id": "Aql",
    "name": "Aquila",
    "nameRu": "Орёл",
    "nameLa": "Aquila",
    "stars": [
      "HIP98036",
      "HIP97649",
      "HIP97278",
      "HIP95501",
      "HIP93805",
      "HIP93747",
      "HIP97804",
      "HIP99473",
      "HIP93244",
      "HIP93429",
      "HIP96468"
    ],
    "lines": [
      [
        "HIP98036",
        "HIP97649"
      ],
      [
        "HIP97649",
        "HIP97278"
      ],
      [
        "HIP97278",
        "HIP95501"
      ],
      [
        "HIP95501",
        "HIP93805"
      ],
      [
        "HIP93805",
        "HIP95501"
      ],
      [
        "HIP95501",
        "HIP93747"
      ],
      [
        "HIP93747",
        "HIP95501"
      ],
      [
        "HIP95501",
        "HIP97804"
      ],
      [
        "HIP97804",
        "HIP99473"
      ],
      [
        "HIP93244",
        "HIP93747"
      ],
      [
        "HIP93805",
        "HIP93429"
      ],
      [
        "HIP99473",
        "HIP96468"
      ],
      [
        "HIP96468",
        "HIP93805"
      ],
      [
        "HIP93805",
        "HIP93747"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP98036": {
          "x": 47.7,
          "y": 108.6
        },
        "HIP97649": {
          "x": 55.4,
          "y": 92.1
        },
        "HIP97278": {
          "x": 62.9,
          "y": 80.4
        },
        "HIP95501": {
          "x": 97.4,
          "y": 130.8
        },
        "HIP93805": {
          "x": 130.1,
          "y": 184.9
        },
        "HIP93747": {
          "x": 130.4,
          "y": 57.8
        },
        "HIP97804": {
          "x": 52.2,
          "y": 144.9
        },
        "HIP99473": {
          "x": 20,
          "y": 157.2
        },
        "HIP93244": {
          "x": 140,
          "y": 49.1
        },
        "HIP93429": {
          "x": 138,
          "y": 190.9
        },
        "HIP96468": {
          "x": 78.6,
          "y": 160.3
        }
      }
    }
  },
  "Aqr": {
    "id": "Aqr",
    "name": "Aquarius",
    "nameRu": "Водолей",
    "nameLa": "Aquarius",
    "stars": [
      "HIP102618",
      "HIP106278",
      "HIP109074",
      "HIP110395",
      "HIP110960",
      "HIP111497",
      "HIP110672",
      "HIP109139",
      "HIP110003",
      "HIP112961",
      "HIP114724",
      "HIP115033",
      "HIP115438",
      "HIP114341",
      "HIP113136",
      "HIP112716"
    ],
    "lines": [
      [
        "HIP102618",
        "HIP106278"
      ],
      [
        "HIP106278",
        "HIP109074"
      ],
      [
        "HIP109074",
        "HIP110395"
      ],
      [
        "HIP110395",
        "HIP110960"
      ],
      [
        "HIP110960",
        "HIP111497"
      ],
      [
        "HIP111497",
        "HIP110960"
      ],
      [
        "HIP110960",
        "HIP110672"
      ],
      [
        "HIP110672",
        "HIP109074"
      ],
      [
        "HIP109139",
        "HIP106278"
      ],
      [
        "HIP106278",
        "HIP109074"
      ],
      [
        "HIP109074",
        "HIP110003"
      ],
      [
        "HIP110003",
        "HIP112961"
      ],
      [
        "HIP112961",
        "HIP114724"
      ],
      [
        "HIP114724",
        "HIP115033"
      ],
      [
        "HIP115033",
        "HIP115438"
      ],
      [
        "HIP115438",
        "HIP115033"
      ],
      [
        "HIP115033",
        "HIP114341"
      ],
      [
        "HIP114341",
        "HIP115033"
      ],
      [
        "HIP115033",
        "HIP113136"
      ],
      [
        "HIP113136",
        "HIP112716"
      ],
      [
        "HIP112716",
        "HIP112961"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP102618": {
          "x": 140,
          "y": 121.3
        },
        "HIP106278": {
          "x": 103.5,
          "y": 107
        },
        "HIP109074": {
          "x": 77.2,
          "y": 90.5
        },
        "HIP110395": {
          "x": 65.1,
          "y": 93.7
        },
        "HIP110960": {
          "x": 59.7,
          "y": 89.5
        },
        "HIP111497": {
          "x": 54.7,
          "y": 89.8
        },
        "HIP110672": {
          "x": 62.4,
          "y": 85.2
        },
        "HIP109139": {
          "x": 76.1,
          "y": 131.6
        },
        "HIP110003": {
          "x": 68.6,
          "y": 113.1
        },
        "HIP112961": {
          "x": 41.9,
          "y": 112.5
        },
        "HIP114724": {
          "x": 25.3,
          "y": 108.1
        },
        "HIP115033": {
          "x": 22.8,
          "y": 117.8
        },
        "HIP115438": {
          "x": 20,
          "y": 152
        },
        "HIP114341": {
          "x": 30.2,
          "y": 154.8
        },
        "HIP113136": {
          "x": 40.7,
          "y": 137.5
        },
        "HIP112716": {
          "x": 44.4,
          "y": 130.6
        }
      }
    }
  },
  "Ara": {
    "id": "Ara",
    "name": "Ara",
    "nameRu": "Жертвенник",
    "nameLa": "Ara",
    "stars": [
      "HIP85267",
      "HIP85727",
      "HIP82363",
      "HIP83081",
      "HIP83153",
      "HIP85792",
      "HIP88714",
      "HIP85258"
    ],
    "lines": [
      [
        "HIP85267",
        "HIP85727"
      ],
      [
        "HIP85727",
        "HIP82363"
      ],
      [
        "HIP82363",
        "HIP83081"
      ],
      [
        "HIP83081",
        "HIP83153"
      ],
      [
        "HIP83153",
        "HIP85792"
      ],
      [
        "HIP85792",
        "HIP88714"
      ],
      [
        "HIP88714",
        "HIP85792"
      ],
      [
        "HIP85792",
        "HIP85258"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP85267": {
          "x": 91.1,
          "y": 131.4
        },
        "HIP85727": {
          "x": 84.3,
          "y": 177.3
        },
        "HIP82363": {
          "x": 140,
          "y": 162.3
        },
        "HIP83081": {
          "x": 130.7,
          "y": 128.7
        },
        "HIP83153": {
          "x": 131.7,
          "y": 98.7
        },
        "HIP85792": {
          "x": 79.2,
          "y": 62.7
        },
        "HIP88714": {
          "x": 20,
          "y": 70.4
        },
        "HIP85258": {
          "x": 91.1,
          "y": 122.4
        }
      }
    }
  },
  "Ari": {
    "id": "Ari",
    "name": "Aries",
    "nameRu": "Овен",
    "nameLa": "Aries",
    "stars": [
      "HIP8832",
      "HIP8903",
      "HIP9884",
      "HIP13209"
    ],
    "lines": [
      [
        "HIP8832",
        "HIP8903"
      ],
      [
        "HIP8903",
        "HIP9884"
      ],
      [
        "HIP9884",
        "HIP13209"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP8832": {
          "x": 140,
          "y": 158.5
        },
        "HIP8903": {
          "x": 137.2,
          "y": 144.4
        },
        "HIP9884": {
          "x": 109.7,
          "y": 120.1
        },
        "HIP13209": {
          "x": 20,
          "y": 81.5
        }
      }
    }
  },
  "Aur": {
    "id": "Aur",
    "name": "Auriga",
    "nameRu": "Возничий",
    "nameLa": "Auriga",
    "stars": [
      "HIP25428",
      "HIP23015",
      "HIP23767",
      "HIP24608",
      "HIP28360",
      "HIP28380",
      "HIP23453",
      "HIP23416",
      "HIP28358"
    ],
    "lines": [
      [
        "HIP25428",
        "HIP23015"
      ],
      [
        "HIP23015",
        "HIP23767"
      ],
      [
        "HIP23767",
        "HIP24608"
      ],
      [
        "HIP24608",
        "HIP28360"
      ],
      [
        "HIP28360",
        "HIP28380"
      ],
      [
        "HIP28380",
        "HIP25428"
      ],
      [
        "HIP23767",
        "HIP23453"
      ],
      [
        "HIP23453",
        "HIP23416"
      ],
      [
        "HIP23416",
        "HIP24608"
      ],
      [
        "HIP24608",
        "HIP28358"
      ],
      [
        "HIP28358",
        "HIP28360"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP25428": {
          "x": 81.6,
          "y": 220
        },
        "HIP23015": {
          "x": 128.7,
          "y": 182.9
        },
        "HIP23767": {
          "x": 110.2,
          "y": 122.3
        },
        "HIP24608": {
          "x": 94.9,
          "y": 86.7
        },
        "HIP28360": {
          "x": 37.6,
          "y": 92.3
        },
        "HIP28380": {
          "x": 31.3,
          "y": 150.9
        },
        "HIP23453": {
          "x": 116,
          "y": 123.1
        },
        "HIP23416": {
          "x": 115.4,
          "y": 102.3
        },
        "HIP28358": {
          "x": 44.9,
          "y": 20
        }
      }
    }
  },
  "Boo": {
    "id": "Boo",
    "name": "Boötes",
    "nameRu": "Волопас",
    "nameLa": "Boötes",
    "stars": [
      "HIP69673",
      "HIP72105",
      "HIP74666",
      "HIP73555",
      "HIP71075",
      "HIP71053",
      "HIP67927",
      "HIP67275",
      "HIP71795",
      "HIP69732",
      "HIP70497",
      "HIP69483"
    ],
    "lines": [
      [
        "HIP69673",
        "HIP72105"
      ],
      [
        "HIP72105",
        "HIP74666"
      ],
      [
        "HIP74666",
        "HIP73555"
      ],
      [
        "HIP73555",
        "HIP71075"
      ],
      [
        "HIP71075",
        "HIP71053"
      ],
      [
        "HIP71053",
        "HIP69673"
      ],
      [
        "HIP69673",
        "HIP67927"
      ],
      [
        "HIP67927",
        "HIP67275"
      ],
      [
        "HIP69673",
        "HIP71795"
      ],
      [
        "HIP71075",
        "HIP69732"
      ],
      [
        "HIP69732",
        "HIP70497"
      ],
      [
        "HIP70497",
        "HIP69483"
      ],
      [
        "HIP69483",
        "HIP69732"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP69673": {
          "x": 94.8,
          "y": 190.1
        },
        "HIP72105": {
          "x": 60.5,
          "y": 148.9
        },
        "HIP74666": {
          "x": 29.1,
          "y": 114.7
        },
        "HIP73555": {
          "x": 46.6,
          "y": 80
        },
        "HIP71075": {
          "x": 75.6,
          "y": 92.2
        },
        "HIP71053": {
          "x": 75.5,
          "y": 132.5
        },
        "HIP67927": {
          "x": 121,
          "y": 193.5
        },
        "HIP67275": {
          "x": 130.9,
          "y": 198.1
        },
        "HIP71795": {
          "x": 62.6,
          "y": 220
        },
        "HIP69732": {
          "x": 90.2,
          "y": 51.5
        },
        "HIP70497": {
          "x": 82,
          "y": 20
        },
        "HIP69483": {
          "x": 91.7,
          "y": 20
        }
      }
    }
  },
  "CMa": {
    "id": "CMa",
    "name": "Canis Major",
    "nameRu": "Большой Пёс",
    "nameLa": "Canis Major",
    "stars": [
      "HIP30324",
      "HIP32349",
      "HIP34444",
      "HIP33579",
      "HIP35904",
      "HIP31592",
      "HIP33152",
      "HIP33347",
      "HIP34045",
      "HIP33160"
    ],
    "lines": [
      [
        "HIP30324",
        "HIP32349"
      ],
      [
        "HIP32349",
        "HIP34444"
      ],
      [
        "HIP34444",
        "HIP33579"
      ],
      [
        "HIP33579",
        "HIP34444"
      ],
      [
        "HIP34444",
        "HIP35904"
      ],
      [
        "HIP30324",
        "HIP31592"
      ],
      [
        "HIP31592",
        "HIP33152"
      ],
      [
        "HIP33152",
        "HIP33579"
      ],
      [
        "HIP32349",
        "HIP33347"
      ],
      [
        "HIP33347",
        "HIP34045"
      ],
      [
        "HIP34045",
        "HIP33160"
      ],
      [
        "HIP33160",
        "HIP33347"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP30324": {
          "x": 140,
          "y": 97.4
        },
        "HIP32349": {
          "x": 94.5,
          "y": 85.6
        },
        "HIP34444": {
          "x": 49,
          "y": 168.2
        },
        "HIP33579": {
          "x": 67.8,
          "y": 190
        },
        "HIP35904": {
          "x": 20,
          "y": 194.7
        },
        "HIP31592": {
          "x": 111.2,
          "y": 107.5
        },
        "HIP33152": {
          "x": 76.2,
          "y": 148.9
        },
        "HIP33347": {
          "x": 72.1,
          "y": 88.4
        },
        "HIP34045": {
          "x": 56.5,
          "y": 76.4
        },
        "HIP33160": {
          "x": 76.1,
          "y": 45.3
        }
      }
    }
  },
  "CMi": {
    "id": "CMi",
    "name": "Canis Minor",
    "nameRu": "Малый Пёс",
    "nameLa": "Canis Minor",
    "stars": [
      "HIP37279",
      "HIP36188"
    ],
    "lines": [
      [
        "HIP37279",
        "HIP36188"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP37279": {
          "x": 20,
          "y": 180.9
        },
        "HIP36188": {
          "x": 140,
          "y": 59.1
        }
      }
    }
  },
  "CVn": {
    "id": "CVn",
    "name": "Canes Venatici",
    "nameRu": "Гончие Псы",
    "nameLa": "Canes Venatici",
    "stars": [
      "HIP63125",
      "HIP61317"
    ],
    "lines": [
      [
        "HIP63125",
        "HIP61317"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP63125": {
          "x": 20,
          "y": 162.7
        },
        "HIP61317": {
          "x": 140,
          "y": 77.3
        }
      }
    }
  },
  "Cae": {
    "id": "Cae",
    "name": "Caelum",
    "nameRu": "Резец",
    "nameLa": "Caelum",
    "stars": [
      "HIP23595",
      "HIP21861",
      "HIP21770",
      "HIP21060"
    ],
    "lines": [
      [
        "HIP23595",
        "HIP21861"
      ],
      [
        "HIP21861",
        "HIP21770"
      ],
      [
        "HIP21770",
        "HIP21060"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP23595": {
          "x": 20,
          "y": 32.5
        },
        "HIP21861": {
          "x": 104.3,
          "y": 61.6
        },
        "HIP21770": {
          "x": 108.7,
          "y": 149.1
        },
        "HIP21060": {
          "x": 140,
          "y": 207.5
        }
      }
    }
  },
  "Cam": {
    "id": "Cam",
    "name": "Camelopardalis",
    "nameRu": "Жираф",
    "nameLa": "Camelopardalis",
    "stars": [
      "HIP23040",
      "HIP23522",
      "HIP22783",
      "HIP29997",
      "HIP33694",
      "HIP17959",
      "HIP17884",
      "HIP16228"
    ],
    "lines": [
      [
        "HIP23040",
        "HIP23522"
      ],
      [
        "HIP23522",
        "HIP22783"
      ],
      [
        "HIP22783",
        "HIP29997"
      ],
      [
        "HIP29997",
        "HIP33694"
      ],
      [
        "HIP33694",
        "HIP29997"
      ],
      [
        "HIP29997",
        "HIP22783"
      ],
      [
        "HIP22783",
        "HIP17959"
      ],
      [
        "HIP17959",
        "HIP17884"
      ],
      [
        "HIP17884",
        "HIP16228"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP23040": {
          "x": 63.2,
          "y": 207.2
        },
        "HIP23522": {
          "x": 60.2,
          "y": 160.3
        },
        "HIP22783": {
          "x": 69.3,
          "y": 120.6
        },
        "HIP29997": {
          "x": 20,
          "y": 90
        },
        "HIP33694": {
          "x": 24.8,
          "y": 32.8
        },
        "HIP17959": {
          "x": 104.9,
          "y": 83.3
        },
        "HIP17884": {
          "x": 114.2,
          "y": 121.8
        },
        "HIP16228": {
          "x": 140,
          "y": 154.6
        }
      }
    }
  },
  "Cap": {
    "id": "Cap",
    "name": "Capricornus",
    "nameRu": "Козерог",
    "nameLa": "Capricornus",
    "stars": [
      "HIP100064",
      "HIP100345",
      "HIP102485",
      "HIP102978",
      "HIP105881",
      "HIP106723",
      "HIP107556",
      "HIP106985",
      "HIP104139"
    ],
    "lines": [
      [
        "HIP100064",
        "HIP100345"
      ],
      [
        "HIP100345",
        "HIP102485"
      ],
      [
        "HIP102485",
        "HIP102978"
      ],
      [
        "HIP102978",
        "HIP105881"
      ],
      [
        "HIP105881",
        "HIP106723"
      ],
      [
        "HIP106723",
        "HIP107556"
      ],
      [
        "HIP107556",
        "HIP106985"
      ],
      [
        "HIP106985",
        "HIP104139"
      ],
      [
        "HIP104139",
        "HIP100064"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP100064": {
          "x": 140,
          "y": 81
        },
        "HIP100345": {
          "x": 135,
          "y": 93.4
        },
        "HIP102485": {
          "x": 99.4,
          "y": 150
        },
        "HIP102978": {
          "x": 92.1,
          "y": 159
        },
        "HIP105881": {
          "x": 48.3,
          "y": 134.2
        },
        "HIP106723": {
          "x": 34.2,
          "y": 118.5
        },
        "HIP107556": {
          "x": 20,
          "y": 100.7
        },
        "HIP106985": {
          "x": 29.5,
          "y": 103.2
        },
        "HIP104139": {
          "x": 74.7,
          "y": 105.4
        }
      }
    }
  },
  "Car": {
    "id": "Car",
    "name": "Carina",
    "nameRu": "Киль",
    "nameLa": "Carina",
    "stars": [
      "HIP30438",
      "HIP45238",
      "HIP50099",
      "HIP52419",
      "HIP51576",
      "HIP50371",
      "HIP45556",
      "HIP42913",
      "HIP53253",
      "HIP54301",
      "HIP54751",
      "HIP54463",
      "HIP41037",
      "HIP38827",
      "HIP39953"
    ],
    "lines": [
      [
        "HIP30438",
        "HIP45238"
      ],
      [
        "HIP45238",
        "HIP50099"
      ],
      [
        "HIP50099",
        "HIP52419"
      ],
      [
        "HIP52419",
        "HIP51576"
      ],
      [
        "HIP51576",
        "HIP50371"
      ],
      [
        "HIP50371",
        "HIP45556"
      ],
      [
        "HIP45556",
        "HIP42913"
      ],
      [
        "HIP51576",
        "HIP53253"
      ],
      [
        "HIP52419",
        "HIP54301"
      ],
      [
        "HIP54301",
        "HIP54751"
      ],
      [
        "HIP54751",
        "HIP54463"
      ],
      [
        "HIP54463",
        "HIP53253"
      ],
      [
        "HIP45556",
        "HIP41037"
      ],
      [
        "HIP41037",
        "HIP38827"
      ],
      [
        "HIP38827",
        "HIP39953"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP30438": {
          "x": 140,
          "y": 127.8
        },
        "HIP45238": {
          "x": 61.5,
          "y": 149.9
        },
        "HIP50099": {
          "x": 46.1,
          "y": 151.7
        },
        "HIP52419": {
          "x": 34.1,
          "y": 137.2
        },
        "HIP51576": {
          "x": 35.6,
          "y": 128.5
        },
        "HIP50371": {
          "x": 40.6,
          "y": 126.3
        },
        "HIP45556": {
          "x": 62.1,
          "y": 118.9
        },
        "HIP42913": {
          "x": 76.6,
          "y": 106.8
        },
        "HIP53253": {
          "x": 25.5,
          "y": 122.5
        },
        "HIP54301": {
          "x": 24.6,
          "y": 134.2
        },
        "HIP54751": {
          "x": 20.1,
          "y": 129.2
        },
        "HIP54463": {
          "x": 20,
          "y": 124.8
        },
        "HIP41037": {
          "x": 82.4,
          "y": 122.7
        },
        "HIP38827": {
          "x": 98.9,
          "y": 107
        },
        "HIP39953": {
          "x": 98.7,
          "y": 88.3
        }
      }
    }
  },
  "Cas": {
    "id": "Cas",
    "name": "Cassiopeia",
    "nameRu": "Кассиопея",
    "nameLa": "Cassiopeia",
    "stars": [
      "HIP746",
      "HIP3179",
      "HIP4427",
      "HIP6686",
      "HIP8886"
    ],
    "lines": [
      [
        "HIP746",
        "HIP3179"
      ],
      [
        "HIP3179",
        "HIP4427"
      ],
      [
        "HIP4427",
        "HIP6686"
      ],
      [
        "HIP6686",
        "HIP8886"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP746": {
          "x": 140,
          "y": 126.9
        },
        "HIP3179": {
          "x": 103.4,
          "y": 157
        },
        "HIP4427": {
          "x": 81.5,
          "y": 117.7
        },
        "HIP6686": {
          "x": 47,
          "y": 120.7
        },
        "HIP8886": {
          "x": 20,
          "y": 83
        }
      }
    }
  },
  "Cen": {
    "id": "Cen",
    "name": "Centaurus",
    "nameRu": "Центавр",
    "nameLa": "Centaurus",
    "stars": [
      "HIP61932",
      "HIP66657",
      "HIP68702",
      "HIP71683",
      "HIP68002",
      "HIP68282",
      "HIP68245",
      "HIP71352",
      "HIP68862",
      "HIP70090",
      "HIP68933",
      "HIP67464",
      "HIP55425",
      "HIP59196",
      "HIP60823",
      "HIP59449",
      "HIP56243",
      "HIP65936",
      "HIP65109",
      "HIP61789",
      "HIP73334"
    ],
    "lines": [
      [
        "HIP61932",
        "HIP66657"
      ],
      [
        "HIP66657",
        "HIP68702"
      ],
      [
        "HIP68702",
        "HIP71683"
      ],
      [
        "HIP71683",
        "HIP68702"
      ],
      [
        "HIP68702",
        "HIP66657"
      ],
      [
        "HIP66657",
        "HIP68002"
      ],
      [
        "HIP68002",
        "HIP61932"
      ],
      [
        "HIP61932",
        "HIP68002"
      ],
      [
        "HIP68002",
        "HIP68282"
      ],
      [
        "HIP68282",
        "HIP68245"
      ],
      [
        "HIP68245",
        "HIP71352"
      ],
      [
        "HIP71352",
        "HIP68245"
      ],
      [
        "HIP68245",
        "HIP68862"
      ],
      [
        "HIP68862",
        "HIP70090"
      ],
      [
        "HIP70090",
        "HIP68933"
      ],
      [
        "HIP68933",
        "HIP67464"
      ],
      [
        "HIP67464",
        "HIP68002"
      ],
      [
        "HIP55425",
        "HIP59196"
      ],
      [
        "HIP59196",
        "HIP60823"
      ],
      [
        "HIP60823",
        "HIP61932"
      ],
      [
        "HIP61932",
        "HIP60823"
      ],
      [
        "HIP60823",
        "HIP59449"
      ],
      [
        "HIP59449",
        "HIP56243"
      ],
      [
        "HIP67464",
        "HIP65936"
      ],
      [
        "HIP65936",
        "HIP65109"
      ],
      [
        "HIP65109",
        "HIP61789"
      ],
      [
        "HIP71352",
        "HIP73334"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP61932": {
          "x": 103,
          "y": 119.1
        },
        "HIP66657": {
          "x": 71.4,
          "y": 132.2
        },
        "HIP68702": {
          "x": 62,
          "y": 156.8
        },
        "HIP71683": {
          "x": 47.2,
          "y": 161.5
        },
        "HIP68002": {
          "x": 61.8,
          "y": 112
        },
        "HIP68282": {
          "x": 59.3,
          "y": 103.8
        },
        "HIP68245": {
          "x": 58.7,
          "y": 94.7
        },
        "HIP71352": {
          "x": 35.2,
          "y": 98.2
        },
        "HIP68862": {
          "x": 53.4,
          "y": 92
        },
        "HIP70090": {
          "x": 42.3,
          "y": 82
        },
        "HIP68933": {
          "x": 51,
          "y": 75.6
        },
        "HIP67464": {
          "x": 64,
          "y": 92.9
        },
        "HIP55425": {
          "x": 140,
          "y": 150.6
        },
        "HIP59196": {
          "x": 119.8,
          "y": 128.9
        },
        "HIP60823": {
          "x": 109.6,
          "y": 124.6
        },
        "HIP59449": {
          "x": 116.6,
          "y": 133.9
        },
        "HIP56243": {
          "x": 127.8,
          "y": 164.4
        },
        "HIP65936": {
          "x": 75.6,
          "y": 84.8
        },
        "HIP65109": {
          "x": 82.7,
          "y": 75.6
        },
        "HIP61789": {
          "x": 108.8,
          "y": 89.1
        },
        "HIP73334": {
          "x": 20,
          "y": 101.5
        }
      }
    }
  },
  "Cep": {
    "id": "Cep",
    "name": "Cepheus",
    "nameRu": "Цефей",
    "nameLa": "Cepheus",
    "stars": [
      "HIP102422",
      "HIP105199",
      "HIP106032",
      "HIP112724",
      "HIP116727",
      "HIP110991",
      "HIP109492",
      "HIP109857",
      "HIP107259",
      "HIP101093"
    ],
    "lines": [
      [
        "HIP102422",
        "HIP105199"
      ],
      [
        "HIP105199",
        "HIP106032"
      ],
      [
        "HIP106032",
        "HIP112724"
      ],
      [
        "HIP112724",
        "HIP106032"
      ],
      [
        "HIP106032",
        "HIP116727"
      ],
      [
        "HIP116727",
        "HIP112724"
      ],
      [
        "HIP112724",
        "HIP110991"
      ],
      [
        "HIP110991",
        "HIP109492"
      ],
      [
        "HIP109492",
        "HIP109857"
      ],
      [
        "HIP109857",
        "HIP107259"
      ],
      [
        "HIP107259",
        "HIP105199"
      ],
      [
        "HIP101093",
        "HIP102422"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP102422": {
          "x": 128.4,
          "y": 163.5
        },
        "HIP105199": {
          "x": 96.6,
          "y": 163.4
        },
        "HIP106032": {
          "x": 82,
          "y": 100.7
        },
        "HIP112724": {
          "x": 20,
          "y": 130.6
        },
        "HIP116727": {
          "x": 21,
          "y": 31.6
        },
        "HIP110991": {
          "x": 26.8,
          "y": 195.6
        },
        "HIP109492": {
          "x": 45.8,
          "y": 199.4
        },
        "HIP109857": {
          "x": 40.5,
          "y": 208.4
        },
        "HIP107259": {
          "x": 74.6,
          "y": 195.5
        },
        "HIP101093": {
          "x": 140,
          "y": 150.5
        }
      }
    }
  },
  "Cet": {
    "id": "Cet",
    "name": "Cetus",
    "nameRu": "Кит",
    "nameLa": "Cetus",
    "stars": [
      "HIP12706",
      "HIP14135",
      "HIP13954",
      "HIP12828",
      "HIP11484",
      "HIP12387",
      "HIP10826",
      "HIP8645",
      "HIP8102",
      "HIP3419",
      "HIP1562",
      "HIP5364",
      "HIP6537"
    ],
    "lines": [
      [
        "HIP12706",
        "HIP14135"
      ],
      [
        "HIP14135",
        "HIP13954"
      ],
      [
        "HIP13954",
        "HIP12828"
      ],
      [
        "HIP12828",
        "HIP11484"
      ],
      [
        "HIP11484",
        "HIP12706"
      ],
      [
        "HIP12706",
        "HIP12387"
      ],
      [
        "HIP12387",
        "HIP10826"
      ],
      [
        "HIP10826",
        "HIP8645"
      ],
      [
        "HIP8645",
        "HIP8102"
      ],
      [
        "HIP8102",
        "HIP3419"
      ],
      [
        "HIP3419",
        "HIP1562"
      ],
      [
        "HIP1562",
        "HIP5364"
      ],
      [
        "HIP5364",
        "HIP6537"
      ],
      [
        "HIP6537",
        "HIP8645"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP12706": {
          "x": 34.1,
          "y": 98.2
        },
        "HIP14135": {
          "x": 20,
          "y": 95.6
        },
        "HIP13954": {
          "x": 21.7,
          "y": 81.2
        },
        "HIP12828": {
          "x": 32.7,
          "y": 78
        },
        "HIP11484": {
          "x": 44.9,
          "y": 83.2
        },
        "HIP12387": {
          "x": 37,
          "y": 106.6
        },
        "HIP10826": {
          "x": 51.4,
          "y": 115.9
        },
        "HIP8645": {
          "x": 70.9,
          "y": 136.7
        },
        "HIP8102": {
          "x": 76,
          "y": 153
        },
        "HIP3419": {
          "x": 119.8,
          "y": 162
        },
        "HIP1562": {
          "x": 140,
          "y": 135
        },
        "HIP5364": {
          "x": 101.4,
          "y": 137
        },
        "HIP6537": {
          "x": 90.3,
          "y": 130.9
        }
      }
    }
  },
  "Cha": {
    "id": "Cha",
    "name": "Chamaeleon",
    "nameRu": "Хамелеон",
    "nameLa": "Chamaeleon",
    "stars": [
      "HIP40702",
      "HIP51839",
      "HIP52633",
      "HIP60000",
      "HIP58484"
    ],
    "lines": [
      [
        "HIP40702",
        "HIP51839"
      ],
      [
        "HIP51839",
        "HIP52633"
      ],
      [
        "HIP52633",
        "HIP60000"
      ],
      [
        "HIP60000",
        "HIP58484"
      ],
      [
        "HIP58484",
        "HIP51839"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP40702": {
          "x": 140,
          "y": 118.3
        },
        "HIP51839": {
          "x": 66.8,
          "y": 110.4
        },
        "HIP52633": {
          "x": 61.8,
          "y": 129.6
        },
        "HIP60000": {
          "x": 20,
          "y": 126.1
        },
        "HIP58484": {
          "x": 24.6,
          "y": 112.6
        }
      }
    }
  },
  "Cir": {
    "id": "Cir",
    "name": "Circinus",
    "nameRu": "Циркуль",
    "nameLa": "Circinus",
    "stars": [
      "HIP74824",
      "HIP71908",
      "HIP75323"
    ],
    "lines": [
      [
        "HIP74824",
        "HIP71908"
      ],
      [
        "HIP71908",
        "HIP75323"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP74824": {
          "x": 39,
          "y": 38.2
        },
        "HIP71908": {
          "x": 140,
          "y": 201.8
        },
        "HIP75323": {
          "x": 20,
          "y": 52.5
        }
      }
    }
  },
  "Cnc": {
    "id": "Cnc",
    "name": "Cancer",
    "nameRu": "Рак",
    "nameLa": "Cancer",
    "stars": [
      "HIP44066",
      "HIP42911",
      "HIP40526",
      "HIP42806",
      "HIP43103"
    ],
    "lines": [
      [
        "HIP44066",
        "HIP42911"
      ],
      [
        "HIP42911",
        "HIP40526"
      ],
      [
        "HIP40526",
        "HIP42911"
      ],
      [
        "HIP42911",
        "HIP42806"
      ],
      [
        "HIP42806",
        "HIP43103"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP44066": {
          "x": 27,
          "y": 192.7
        },
        "HIP42911": {
          "x": 61.8,
          "y": 128.9
        },
        "HIP40526": {
          "x": 133,
          "y": 220
        },
        "HIP42806": {
          "x": 65.2,
          "y": 95.3
        },
        "HIP43103": {
          "x": 57.6,
          "y": 20
        }
      }
    }
  },
  "Col": {
    "id": "Col",
    "name": "Columba",
    "nameRu": "Голубь",
    "nameLa": "Columba",
    "stars": [
      "HIP26634",
      "HIP27628",
      "HIP25859",
      "HIP28328",
      "HIP28199",
      "HIP30277"
    ],
    "lines": [
      [
        "HIP26634",
        "HIP27628"
      ],
      [
        "HIP25859",
        "HIP26634"
      ],
      [
        "HIP28328",
        "HIP27628"
      ],
      [
        "HIP27628",
        "HIP28199"
      ],
      [
        "HIP28199",
        "HIP30277"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP26634": {
          "x": 120.9,
          "y": 73
        },
        "HIP27628": {
          "x": 94.1,
          "y": 91.8
        },
        "HIP25859": {
          "x": 140,
          "y": 89.8
        },
        "HIP28328": {
          "x": 76.4,
          "y": 172.4
        },
        "HIP28199": {
          "x": 78.9,
          "y": 86.3
        },
        "HIP30277": {
          "x": 20,
          "y": 67.6
        }
      }
    }
  },
  "Com": {
    "id": "Com",
    "name": "Coma Berenices",
    "nameRu": "Волосы Вероники",
    "nameLa": "Coma Berenices",
    "stars": [
      "HIP64241",
      "HIP64394",
      "HIP60742"
    ],
    "lines": [
      [
        "HIP64241",
        "HIP64394"
      ],
      [
        "HIP64394",
        "HIP60742"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP64241": {
          "x": 22,
          "y": 186
        },
        "HIP64394": {
          "x": 20,
          "y": 60.5
        },
        "HIP60742": {
          "x": 140,
          "y": 54
        }
      }
    }
  },
  "CrA": {
    "id": "CrA",
    "name": "Corona Australis",
    "nameRu": "Южная Корона",
    "nameLa": "Corona Australis",
    "stars": [
      "HIP93825",
      "HIP94114",
      "HIP94160",
      "HIP94005",
      "HIP90982"
    ],
    "lines": [
      [
        "HIP93825",
        "HIP94114"
      ],
      [
        "HIP94114",
        "HIP94160"
      ],
      [
        "HIP94160",
        "HIP94005"
      ],
      [
        "HIP94005",
        "HIP90982"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP93825": {
          "x": 31.8,
          "y": 72
        },
        "HIP94114": {
          "x": 21.4,
          "y": 87
        },
        "HIP94160": {
          "x": 20,
          "y": 112.2
        },
        "HIP94005": {
          "x": 26.1,
          "y": 132.4
        },
        "HIP90982": {
          "x": 140,
          "y": 168
        }
      }
    }
  },
  "CrB": {
    "id": "CrB",
    "name": "Corona Borealis",
    "nameRu": "Северная Корона",
    "nameLa": "Corona Borealis",
    "stars": [
      "HIP76127",
      "HIP75695",
      "HIP76267",
      "HIP76952",
      "HIP77512",
      "HIP78159",
      "HIP78493"
    ],
    "lines": [
      [
        "HIP76127",
        "HIP75695"
      ],
      [
        "HIP75695",
        "HIP76267"
      ],
      [
        "HIP76267",
        "HIP76952"
      ],
      [
        "HIP76952",
        "HIP77512"
      ],
      [
        "HIP77512",
        "HIP78159"
      ],
      [
        "HIP78159",
        "HIP78493"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP76127": {
          "x": 120.9,
          "y": 76.4
        },
        "HIP75695": {
          "x": 140,
          "y": 112.9
        },
        "HIP76267": {
          "x": 116.2,
          "y": 152.8
        },
        "HIP76952": {
          "x": 86.7,
          "y": 159.9
        },
        "HIP77512": {
          "x": 61.5,
          "y": 163.6
        },
        "HIP78159": {
          "x": 32.4,
          "y": 149.7
        },
        "HIP78493": {
          "x": 20,
          "y": 100.5
        }
      }
    }
  },
  "Crt": {
    "id": "Crt",
    "name": "Crater",
    "nameRu": "Чаша",
    "nameLa": "Crater",
    "stars": [
      "HIP53740",
      "HIP54682",
      "HIP55705",
      "HIP57283",
      "HIP58188",
      "HIP55282",
      "HIP55687",
      "HIP56633"
    ],
    "lines": [
      [
        "HIP53740",
        "HIP54682"
      ],
      [
        "HIP54682",
        "HIP55705"
      ],
      [
        "HIP55705",
        "HIP57283"
      ],
      [
        "HIP57283",
        "HIP58188"
      ],
      [
        "HIP58188",
        "HIP57283"
      ],
      [
        "HIP57283",
        "HIP55705"
      ],
      [
        "HIP55705",
        "HIP55282"
      ],
      [
        "HIP55282",
        "HIP55687"
      ],
      [
        "HIP55687",
        "HIP56633"
      ],
      [
        "HIP56633",
        "HIP55687"
      ],
      [
        "HIP55687",
        "HIP55282"
      ],
      [
        "HIP55282",
        "HIP53740"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP53740": {
          "x": 140,
          "y": 138.6
        },
        "HIP54682": {
          "x": 113.9,
          "y": 178.5
        },
        "HIP55705": {
          "x": 86.6,
          "y": 132
        },
        "HIP57283": {
          "x": 44.4,
          "y": 138.4
        },
        "HIP58188": {
          "x": 20,
          "y": 128.3
        },
        "HIP55282": {
          "x": 98.6,
          "y": 106.1
        },
        "HIP55687": {
          "x": 87.4,
          "y": 71
        },
        "HIP56633": {
          "x": 60.7,
          "y": 61.5
        }
      }
    }
  },
  "Cru": {
    "id": "Cru",
    "name": "Crux",
    "nameRu": "Южный Крест",
    "nameLa": "Crux",
    "stars": [
      "HIP60718",
      "HIP61084",
      "HIP62434",
      "HIP59747"
    ],
    "lines": [
      [
        "HIP60718",
        "HIP61084"
      ],
      [
        "HIP62434",
        "HIP59747"
      ],
      [
        "HIP62434",
        "HIP59747"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP60718": {
          "x": 95.5,
          "y": 206.4
        },
        "HIP61084": {
          "x": 79.9,
          "y": 33.6
        },
        "HIP62434": {
          "x": 20,
          "y": 110
        },
        "HIP59747": {
          "x": 140,
          "y": 82.4
        }
      }
    }
  },
  "Crv": {
    "id": "Crv",
    "name": "Corvus",
    "nameRu": "Ворон",
    "nameLa": "Corvus",
    "stars": [
      "HIP60965",
      "HIP59803",
      "HIP59316",
      "HIP61359",
      "HIP59199"
    ],
    "lines": [
      [
        "HIP60965",
        "HIP59803"
      ],
      [
        "HIP59803",
        "HIP59316"
      ],
      [
        "HIP59316",
        "HIP61359"
      ],
      [
        "HIP61359",
        "HIP60965"
      ],
      [
        "HIP59316",
        "HIP59199"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP60965": {
          "x": 38.8,
          "y": 36.9
        },
        "HIP59803": {
          "x": 106.9,
          "y": 57.4
        },
        "HIP59316": {
          "x": 132.8,
          "y": 160.3
        },
        "HIP61359": {
          "x": 20,
          "y": 176.5
        },
        "HIP59199": {
          "x": 140,
          "y": 203.1
        }
      }
    }
  },
  "Cyg": {
    "id": "Cyg",
    "name": "Cygnus",
    "nameRu": "Лебедь",
    "nameLa": "Cygnus",
    "stars": [
      "HIP102098",
      "HIP100453",
      "HIP102488",
      "HIP95947",
      "HIP97165",
      "HIP95853",
      "HIP94779",
      "HIP99848",
      "HIP103413",
      "HIP104732"
    ],
    "lines": [
      [
        "HIP102098",
        "HIP100453"
      ],
      [
        "HIP100453",
        "HIP102488"
      ],
      [
        "HIP102488",
        "HIP100453"
      ],
      [
        "HIP100453",
        "HIP95947"
      ],
      [
        "HIP95947",
        "HIP100453"
      ],
      [
        "HIP100453",
        "HIP97165"
      ],
      [
        "HIP97165",
        "HIP95853"
      ],
      [
        "HIP95853",
        "HIP94779"
      ],
      [
        "HIP94779",
        "HIP95853"
      ],
      [
        "HIP95853",
        "HIP99848"
      ],
      [
        "HIP99848",
        "HIP102098"
      ],
      [
        "HIP102098",
        "HIP103413"
      ],
      [
        "HIP103413",
        "HIP104732"
      ],
      [
        "HIP104732",
        "HIP102488"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP102098": {
          "x": 62.6,
          "y": 98.5
        },
        "HIP100453": {
          "x": 79.8,
          "y": 125.5
        },
        "HIP102488": {
          "x": 53,
          "y": 157.3
        },
        "HIP95947": {
          "x": 140,
          "y": 188.4
        },
        "HIP97165": {
          "x": 114.5,
          "y": 98.8
        },
        "HIP95853": {
          "x": 123.8,
          "y": 62.3
        },
        "HIP94779": {
          "x": 132.7,
          "y": 51.6
        },
        "HIP99848": {
          "x": 86.4,
          "y": 86.7
        },
        "HIP103413": {
          "x": 45.5,
          "y": 118.4
        },
        "HIP104732": {
          "x": 20,
          "y": 174.4
        }
      }
    }
  },
  "Del": {
    "id": "Del",
    "name": "Delphinus",
    "nameRu": "Дельфин",
    "nameLa": "Delphinus",
    "stars": [
      "HIP101421",
      "HIP101769",
      "HIP101958",
      "HIP102532",
      "HIP102281"
    ],
    "lines": [
      [
        "HIP101421",
        "HIP101769"
      ],
      [
        "HIP101769",
        "HIP101958"
      ],
      [
        "HIP101958",
        "HIP102532"
      ],
      [
        "HIP102532",
        "HIP102281"
      ],
      [
        "HIP102281",
        "HIP101769"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP101421": {
          "x": 140,
          "y": 208.6
        },
        "HIP101769": {
          "x": 100.6,
          "y": 87.8
        },
        "HIP101958": {
          "x": 82,
          "y": 39.4
        },
        "HIP102532": {
          "x": 20,
          "y": 31.4
        },
        "HIP102281": {
          "x": 48.1,
          "y": 70.1
        }
      }
    }
  },
  "Dor": {
    "id": "Dor",
    "name": "Dorado",
    "nameRu": "Золотая Рыба",
    "nameLa": "Dorado",
    "stars": [
      "HIP19893",
      "HIP21281",
      "HIP23693",
      "HIP26069",
      "HIP27100",
      "HIP27890"
    ],
    "lines": [
      [
        "HIP19893",
        "HIP21281"
      ],
      [
        "HIP21281",
        "HIP23693"
      ],
      [
        "HIP23693",
        "HIP26069"
      ],
      [
        "HIP26069",
        "HIP21281"
      ],
      [
        "HIP21281",
        "HIP26069"
      ],
      [
        "HIP26069",
        "HIP27100"
      ],
      [
        "HIP27100",
        "HIP27890"
      ],
      [
        "HIP27890",
        "HIP26069"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP19893": {
          "x": 140,
          "y": 57.1
        },
        "HIP21281": {
          "x": 110.6,
          "y": 85.8
        },
        "HIP23693": {
          "x": 69.7,
          "y": 105.4
        },
        "HIP26069": {
          "x": 40.3,
          "y": 152.2
        },
        "HIP27100": {
          "x": 33,
          "y": 182.9
        },
        "HIP27890": {
          "x": 20,
          "y": 160.7
        }
      }
    }
  },
  "Dra": {
    "id": "Dra",
    "name": "Draco",
    "nameRu": "Дракон",
    "nameLa": "Draco",
    "stars": [
      "HIP56211",
      "HIP61281",
      "HIP68756",
      "HIP75458",
      "HIP78527",
      "HIP80331",
      "HIP83895",
      "HIP89908",
      "HIP89937",
      "HIP94376",
      "HIP97433",
      "HIP87585",
      "HIP85829",
      "HIP85670",
      "HIP87833"
    ],
    "lines": [
      [
        "HIP56211",
        "HIP61281"
      ],
      [
        "HIP61281",
        "HIP68756"
      ],
      [
        "HIP68756",
        "HIP75458"
      ],
      [
        "HIP75458",
        "HIP78527"
      ],
      [
        "HIP78527",
        "HIP80331"
      ],
      [
        "HIP80331",
        "HIP83895"
      ],
      [
        "HIP83895",
        "HIP89908"
      ],
      [
        "HIP89908",
        "HIP89937"
      ],
      [
        "HIP89937",
        "HIP89908"
      ],
      [
        "HIP89908",
        "HIP94376"
      ],
      [
        "HIP94376",
        "HIP97433"
      ],
      [
        "HIP97433",
        "HIP94376"
      ],
      [
        "HIP94376",
        "HIP87585"
      ],
      [
        "HIP87585",
        "HIP85829"
      ],
      [
        "HIP85829",
        "HIP85670"
      ],
      [
        "HIP85670",
        "HIP87833"
      ],
      [
        "HIP87833",
        "HIP87585"
      ],
      [
        "HIP87585",
        "HIP94376"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP56211": {
          "x": 140,
          "y": 63.8
        },
        "HIP61281": {
          "x": 129.5,
          "y": 82.5
        },
        "HIP68756": {
          "x": 122.2,
          "y": 118.4
        },
        "HIP75458": {
          "x": 101.9,
          "y": 149.4
        },
        "HIP78527": {
          "x": 86.7,
          "y": 154.6
        },
        "HIP80331": {
          "x": 76.2,
          "y": 146.1
        },
        "HIP83895": {
          "x": 59.8,
          "y": 132.6
        },
        "HIP89908": {
          "x": 42.8,
          "y": 109.9
        },
        "HIP89937": {
          "x": 44.4,
          "y": 105.5
        },
        "HIP94376": {
          "x": 23.5,
          "y": 113.6
        },
        "HIP97433": {
          "x": 20,
          "y": 99.9
        },
        "HIP87585": {
          "x": 37.4,
          "y": 158.5
        },
        "HIP85829": {
          "x": 45.9,
          "y": 166.1
        },
        "HIP85670": {
          "x": 45.2,
          "y": 176.1
        },
        "HIP87833": {
          "x": 31,
          "y": 176.2
        }
      }
    }
  },
  "Equ": {
    "id": "Equ",
    "name": "Equuleus",
    "nameRu": "Малый Конь",
    "nameLa": "Equuleus",
    "stars": [
      "HIP104987",
      "HIP104858",
      "HIP104521"
    ],
    "lines": [
      [
        "HIP104987",
        "HIP104858"
      ],
      [
        "HIP104858",
        "HIP104521"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP104987": {
          "x": 52.2,
          "y": 220
        },
        "HIP104858": {
          "x": 66.1,
          "y": 25.1
        },
        "HIP104521": {
          "x": 107.8,
          "y": 20
        }
      }
    }
  },
  "Eri": {
    "id": "Eri",
    "name": "Eridanus",
    "nameRu": "Эридан",
    "nameLa": "Eridanus",
    "stars": [
      "HIP23875",
      "HIP22109",
      "HIP21444",
      "HIP19587",
      "HIP18543",
      "HIP17593",
      "HIP17378",
      "HIP16537",
      "HIP13701",
      "HIP12770",
      "HIP12843",
      "HIP14146",
      "HIP15474",
      "HIP16611",
      "HIP17651",
      "HIP18216",
      "HIP18673",
      "HIP21248",
      "HIP21393",
      "HIP20535",
      "HIP20042",
      "HIP17874",
      "HIP16870",
      "HIP15510",
      "HIP13847",
      "HIP12486",
      "HIP12413",
      "HIP11407",
      "HIP9007",
      "HIP7588"
    ],
    "lines": [
      [
        "HIP23875",
        "HIP22109"
      ],
      [
        "HIP22109",
        "HIP21444"
      ],
      [
        "HIP21444",
        "HIP19587"
      ],
      [
        "HIP19587",
        "HIP18543"
      ],
      [
        "HIP18543",
        "HIP17593"
      ],
      [
        "HIP17593",
        "HIP17378"
      ],
      [
        "HIP17378",
        "HIP16537"
      ],
      [
        "HIP16537",
        "HIP13701"
      ],
      [
        "HIP13701",
        "HIP12770"
      ],
      [
        "HIP12770",
        "HIP12770"
      ],
      [
        "HIP12770",
        "HIP12843"
      ],
      [
        "HIP12843",
        "HIP14146"
      ],
      [
        "HIP14146",
        "HIP15474"
      ],
      [
        "HIP15474",
        "HIP16611"
      ],
      [
        "HIP16611",
        "HIP17651"
      ],
      [
        "HIP17651",
        "HIP18216"
      ],
      [
        "HIP18216",
        "HIP18673"
      ],
      [
        "HIP18673",
        "HIP21248"
      ],
      [
        "HIP21248",
        "HIP21393"
      ],
      [
        "HIP21393",
        "HIP20535"
      ],
      [
        "HIP20535",
        "HIP20042"
      ],
      [
        "HIP20042",
        "HIP17874"
      ],
      [
        "HIP17874",
        "HIP17874"
      ],
      [
        "HIP17874",
        "HIP16870"
      ],
      [
        "HIP16870",
        "HIP15510"
      ],
      [
        "HIP15510",
        "HIP13847"
      ],
      [
        "HIP13847",
        "HIP12486"
      ],
      [
        "HIP12486",
        "HIP12413"
      ],
      [
        "HIP12413",
        "HIP11407"
      ],
      [
        "HIP11407",
        "HIP9007"
      ],
      [
        "HIP9007",
        "HIP7588"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP23875": {
          "x": 20,
          "y": 41.3
        },
        "HIP22109": {
          "x": 37.1,
          "y": 34.8
        },
        "HIP21444": {
          "x": 44.3,
          "y": 35
        },
        "HIP19587": {
          "x": 63.4,
          "y": 45.5
        },
        "HIP18543": {
          "x": 74.1,
          "y": 64.8
        },
        "HIP17593": {
          "x": 81.9,
          "y": 60.7
        },
        "HIP17378": {
          "x": 83.8,
          "y": 54
        },
        "HIP16537": {
          "x": 90.9,
          "y": 53.1
        },
        "HIP13701": {
          "x": 116.5,
          "y": 51.9
        },
        "HIP12770": {
          "x": 123.8,
          "y": 66.7
        },
        "HIP12843": {
          "x": 121.7,
          "y": 79.9
        },
        "HIP14146": {
          "x": 109.4,
          "y": 92.9
        },
        "HIP15474": {
          "x": 99,
          "y": 87.4
        },
        "HIP16611": {
          "x": 90.1,
          "y": 86.9
        },
        "HIP17651": {
          "x": 82,
          "y": 91.3
        },
        "HIP18216": {
          "x": 77.9,
          "y": 95
        },
        "HIP18673": {
          "x": 74,
          "y": 93.6
        },
        "HIP21248": {
          "x": 54.7,
          "y": 110.7
        },
        "HIP21393": {
          "x": 53.7,
          "y": 113
        },
        "HIP20535": {
          "x": 61.5,
          "y": 121.7
        },
        "HIP20042": {
          "x": 64.9,
          "y": 120.7
        },
        "HIP17874": {
          "x": 81.2,
          "y": 126.3
        },
        "HIP16870": {
          "x": 87.9,
          "y": 137.6
        },
        "HIP15510": {
          "x": 96.7,
          "y": 145.9
        },
        "HIP13847": {
          "x": 108.5,
          "y": 138.9
        },
        "HIP12486": {
          "x": 118.1,
          "y": 138.9
        },
        "HIP12413": {
          "x": 117.6,
          "y": 147.8
        },
        "HIP11407": {
          "x": 122.3,
          "y": 163.9
        },
        "HIP9007": {
          "x": 135.8,
          "y": 181.4
        },
        "HIP7588": {
          "x": 140,
          "y": 205.2
        }
      }
    }
  },
  "For": {
    "id": "For",
    "name": "Fornax",
    "nameRu": "Печь",
    "nameLa": "Fornax",
    "stars": [
      "HIP14879",
      "HIP13147",
      "HIP9677"
    ],
    "lines": [
      [
        "HIP14879",
        "HIP13147"
      ],
      [
        "HIP13147",
        "HIP9677"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP14879": {
          "x": 20,
          "y": 107
        },
        "HIP13147": {
          "x": 61.3,
          "y": 133
        },
        "HIP9677": {
          "x": 140,
          "y": 110.4
        }
      }
    }
  },
  "Gem": {
    "id": "Gem",
    "name": "Gemini",
    "nameRu": "Близнецы",
    "nameLa": "Gemini",
    "stars": [
      "HIP32362",
      "HIP35350",
      "HIP35550",
      "HIP34088",
      "HIP31681",
      "HIP36962",
      "HIP37740",
      "HIP37826",
      "HIP36046",
      "HIP34693",
      "HIP36850",
      "HIP33018",
      "HIP32246",
      "HIP30883",
      "HIP30343",
      "HIP29655",
      "HIP28734"
    ],
    "lines": [
      [
        "HIP32362",
        "HIP35350"
      ],
      [
        "HIP35350",
        "HIP35550"
      ],
      [
        "HIP35550",
        "HIP34088"
      ],
      [
        "HIP34088",
        "HIP31681"
      ],
      [
        "HIP31681",
        "HIP34088"
      ],
      [
        "HIP34088",
        "HIP35550"
      ],
      [
        "HIP35550",
        "HIP36962"
      ],
      [
        "HIP36962",
        "HIP37740"
      ],
      [
        "HIP37740",
        "HIP36962"
      ],
      [
        "HIP36962",
        "HIP37826"
      ],
      [
        "HIP37826",
        "HIP36962"
      ],
      [
        "HIP36962",
        "HIP36046"
      ],
      [
        "HIP36046",
        "HIP34693"
      ],
      [
        "HIP34693",
        "HIP36850"
      ],
      [
        "HIP36850",
        "HIP34693"
      ],
      [
        "HIP34693",
        "HIP33018"
      ],
      [
        "HIP33018",
        "HIP34693"
      ],
      [
        "HIP34693",
        "HIP32246"
      ],
      [
        "HIP32246",
        "HIP30883"
      ],
      [
        "HIP30883",
        "HIP32246"
      ],
      [
        "HIP32246",
        "HIP30343"
      ],
      [
        "HIP30343",
        "HIP29655"
      ],
      [
        "HIP29655",
        "HIP28734"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP32362": {
          "x": 91.6,
          "y": 175
        },
        "HIP35350": {
          "x": 50.1,
          "y": 155.5
        },
        "HIP35550": {
          "x": 48.6,
          "y": 127.1
        },
        "HIP34088": {
          "x": 67.8,
          "y": 134.8
        },
        "HIP31681": {
          "x": 100.6,
          "y": 156.1
        },
        "HIP36962": {
          "x": 31.1,
          "y": 100.6
        },
        "HIP37740": {
          "x": 20,
          "y": 112.9
        },
        "HIP37826": {
          "x": 20.5,
          "y": 93.8
        },
        "HIP36046": {
          "x": 43.2,
          "y": 96.6
        },
        "HIP34693": {
          "x": 60.2,
          "y": 84.5
        },
        "HIP36850": {
          "x": 34.3,
          "y": 74.5
        },
        "HIP33018": {
          "x": 80.6,
          "y": 65
        },
        "HIP32246": {
          "x": 91.5,
          "y": 110.9
        },
        "HIP30883": {
          "x": 110.6,
          "y": 135.7
        },
        "HIP30343": {
          "x": 117.2,
          "y": 123.3
        },
        "HIP29655": {
          "x": 127.1,
          "y": 122.7
        },
        "HIP28734": {
          "x": 140,
          "y": 117.6
        }
      }
    }
  },
  "Gru": {
    "id": "Gru",
    "name": "Grus",
    "nameRu": "Журавль",
    "nameLa": "Grus",
    "stars": [
      "HIP108085",
      "HIP109111",
      "HIP110997",
      "HIP109268",
      "HIP112122",
      "HIP112623",
      "HIP113638"
    ],
    "lines": [
      [
        "HIP108085",
        "HIP109111"
      ],
      [
        "HIP109111",
        "HIP110997"
      ],
      [
        "HIP110997",
        "HIP109268"
      ],
      [
        "HIP109268",
        "HIP112122"
      ],
      [
        "HIP112122",
        "HIP110997"
      ],
      [
        "HIP110997",
        "HIP112122"
      ],
      [
        "HIP112122",
        "HIP112623"
      ],
      [
        "HIP112623",
        "HIP113638"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP108085": {
          "x": 140,
          "y": 40.5
        },
        "HIP109111": {
          "x": 113.5,
          "y": 61.4
        },
        "HIP110997": {
          "x": 68.1,
          "y": 101.1
        },
        "HIP109268": {
          "x": 105.3,
          "y": 137.3
        },
        "HIP112122": {
          "x": 45.2,
          "y": 136.5
        },
        "HIP112623": {
          "x": 38.2,
          "y": 182.7
        },
        "HIP113638": {
          "x": 20,
          "y": 199.5
        }
      }
    }
  },
  "Her": {
    "id": "Her",
    "name": "Hercules",
    "nameRu": "Геркулес",
    "nameLa": "Hercules",
    "stars": [
      "HIP84379",
      "HIP84345",
      "HIP80816",
      "HIP80170",
      "HIP81693",
      "HIP83207",
      "HIP81833",
      "HIP81126",
      "HIP79992",
      "HIP84380",
      "HIP85112",
      "HIP87808",
      "HIP86414",
      "HIP85693",
      "HIP86974",
      "HIP87933",
      "HIP88794",
      "HIP77760",
      "HIP79101",
      "HIP80463",
      "HIP81008"
    ],
    "lines": [
      [
        "HIP84379",
        "HIP84345"
      ],
      [
        "HIP84345",
        "HIP80816"
      ],
      [
        "HIP80816",
        "HIP80170"
      ],
      [
        "HIP80170",
        "HIP80816"
      ],
      [
        "HIP80816",
        "HIP81693"
      ],
      [
        "HIP81693",
        "HIP83207"
      ],
      [
        "HIP83207",
        "HIP81693"
      ],
      [
        "HIP81693",
        "HIP81833"
      ],
      [
        "HIP81833",
        "HIP81126"
      ],
      [
        "HIP81126",
        "HIP79992"
      ],
      [
        "HIP79992",
        "HIP81126"
      ],
      [
        "HIP81126",
        "HIP81833"
      ],
      [
        "HIP81833",
        "HIP84380"
      ],
      [
        "HIP84380",
        "HIP85112"
      ],
      [
        "HIP85112",
        "HIP87808"
      ],
      [
        "HIP87808",
        "HIP86414"
      ],
      [
        "HIP86414",
        "HIP87808"
      ],
      [
        "HIP87808",
        "HIP85112"
      ],
      [
        "HIP85112",
        "HIP84380"
      ],
      [
        "HIP84380",
        "HIP83207"
      ],
      [
        "HIP83207",
        "HIP84379"
      ],
      [
        "HIP84379",
        "HIP85693"
      ],
      [
        "HIP85693",
        "HIP86974"
      ],
      [
        "HIP86974",
        "HIP87933"
      ],
      [
        "HIP87933",
        "HIP88794"
      ],
      [
        "HIP77760",
        "HIP79101"
      ],
      [
        "HIP79101",
        "HIP79992"
      ],
      [
        "HIP80170",
        "HIP80463"
      ],
      [
        "HIP80463",
        "HIP81008"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP84379": {
          "x": 70.2,
          "y": 137.7
        },
        "HIP84345": {
          "x": 69.1,
          "y": 184.8
        },
        "HIP80816": {
          "x": 115.4,
          "y": 151.8
        },
        "HIP80170": {
          "x": 125,
          "y": 161.8
        },
        "HIP81693": {
          "x": 102.1,
          "y": 108.2
        },
        "HIP83207": {
          "x": 84.6,
          "y": 111.5
        },
        "HIP81833": {
          "x": 99.2,
          "y": 76.5
        },
        "HIP81126": {
          "x": 105.7,
          "y": 60.5
        },
        "HIP79992": {
          "x": 115.8,
          "y": 41.6
        },
        "HIP84380": {
          "x": 71.8,
          "y": 85.9
        },
        "HIP85112": {
          "x": 64.4,
          "y": 84.1
        },
        "HIP87808": {
          "x": 35.9,
          "y": 80.7
        },
        "HIP86414": {
          "x": 54.1,
          "y": 43.4
        },
        "HIP85693": {
          "x": 55,
          "y": 131.5
        },
        "HIP86974": {
          "x": 40.2,
          "y": 123.3
        },
        "HIP87933": {
          "x": 29.9,
          "y": 115.5
        },
        "HIP88794": {
          "x": 20,
          "y": 116.4
        },
        "HIP77760": {
          "x": 140,
          "y": 55.5
        },
        "HIP79101": {
          "x": 125.2,
          "y": 46.6
        },
        "HIP80463": {
          "x": 123.2,
          "y": 185.8
        },
        "HIP81008": {
          "x": 116,
          "y": 198.4
        }
      }
    }
  },
  "Hor": {
    "id": "Hor",
    "name": "Horologium",
    "nameRu": "Часы",
    "nameLa": "Horologium",
    "stars": [
      "HIP19747",
      "HIP12653",
      "HIP12225",
      "HIP12484",
      "HIP14240",
      "HIP13884"
    ],
    "lines": [
      [
        "HIP19747",
        "HIP12653"
      ],
      [
        "HIP12653",
        "HIP12225"
      ],
      [
        "HIP12225",
        "HIP12484"
      ],
      [
        "HIP12484",
        "HIP14240"
      ],
      [
        "HIP14240",
        "HIP13884"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP19747": {
          "x": 20,
          "y": 48.1
        },
        "HIP12653": {
          "x": 135.6,
          "y": 100
        },
        "HIP12225": {
          "x": 140,
          "y": 112.6
        },
        "HIP12484": {
          "x": 135.3,
          "y": 126.2
        },
        "HIP14240": {
          "x": 112,
          "y": 161.2
        },
        "HIP13884": {
          "x": 115.5,
          "y": 191.9
        }
      }
    }
  },
  "Hya": {
    "id": "Hya",
    "name": "Hydra",
    "nameRu": "Гидра",
    "nameLa": "Hydra",
    "stars": [
      "HIP43234",
      "HIP42799",
      "HIP42402",
      "HIP42313",
      "HIP43109",
      "HIP43813",
      "HIP45336",
      "HIP47431",
      "HIP46390",
      "HIP48356",
      "HIP49402",
      "HIP49841",
      "HIP51069",
      "HIP52943",
      "HIP53740",
      "HIP54682",
      "HIP56343",
      "HIP57936",
      "HIP64962",
      "HIP68895",
      "HIP72571"
    ],
    "lines": [
      [
        "HIP43234",
        "HIP42799"
      ],
      [
        "HIP42799",
        "HIP42402"
      ],
      [
        "HIP42402",
        "HIP42313"
      ],
      [
        "HIP42313",
        "HIP43109"
      ],
      [
        "HIP43109",
        "HIP43813"
      ],
      [
        "HIP43813",
        "HIP45336"
      ],
      [
        "HIP45336",
        "HIP47431"
      ],
      [
        "HIP47431",
        "HIP46390"
      ],
      [
        "HIP46390",
        "HIP48356"
      ],
      [
        "HIP48356",
        "HIP49402"
      ],
      [
        "HIP49402",
        "HIP49841"
      ],
      [
        "HIP49841",
        "HIP51069"
      ],
      [
        "HIP51069",
        "HIP52943"
      ],
      [
        "HIP52943",
        "HIP53740"
      ],
      [
        "HIP54682",
        "HIP56343"
      ],
      [
        "HIP56343",
        "HIP57936"
      ],
      [
        "HIP57936",
        "HIP64962"
      ],
      [
        "HIP64962",
        "HIP68895"
      ],
      [
        "HIP68895",
        "HIP72571"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP43234": {
          "x": 137,
          "y": 89.5
        },
        "HIP42799": {
          "x": 138.2,
          "y": 91.9
        },
        "HIP42402": {
          "x": 139.4,
          "y": 92
        },
        "HIP42313": {
          "x": 140,
          "y": 89.5
        },
        "HIP43109": {
          "x": 137.5,
          "y": 88.8
        },
        "HIP43813": {
          "x": 135.2,
          "y": 89.4
        },
        "HIP45336": {
          "x": 130.1,
          "y": 93.2
        },
        "HIP47431": {
          "x": 123.9,
          "y": 96.5
        },
        "HIP46390": {
          "x": 126.4,
          "y": 103.3
        },
        "HIP48356": {
          "x": 120.9,
          "y": 108.6
        },
        "HIP49402": {
          "x": 118,
          "y": 107
        },
        "HIP49841": {
          "x": 116.9,
          "y": 106.4
        },
        "HIP51069": {
          "x": 113.6,
          "y": 110.3
        },
        "HIP52943": {
          "x": 108.6,
          "y": 109.8
        },
        "HIP53740": {
          "x": 106.5,
          "y": 111.8
        },
        "HIP54682": {
          "x": 104.2,
          "y": 116.1
        },
        "HIP56343": {
          "x": 100.1,
          "y": 125.4
        },
        "HIP57936": {
          "x": 96,
          "y": 128.4
        },
        "HIP64962": {
          "x": 70.1,
          "y": 123.3
        },
        "HIP68895": {
          "x": 50.3,
          "y": 135.2
        },
        "HIP72571": {
          "x": 20,
          "y": 151.2
        }
      }
    }
  },
  "Hyi": {
    "id": "Hyi",
    "name": "Hydrus",
    "nameRu": "Малая Змея",
    "nameLa": "Hydrus",
    "stars": [
      "HIP2021",
      "HIP17678",
      "HIP11001",
      "HIP9236"
    ],
    "lines": [
      [
        "HIP2021",
        "HIP17678"
      ],
      [
        "HIP17678",
        "HIP11001"
      ],
      [
        "HIP11001",
        "HIP9236"
      ],
      [
        "HIP9236",
        "HIP2021"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP2021": {
          "x": 140,
          "y": 204.9
        },
        "HIP17678": {
          "x": 20,
          "y": 174.4
        },
        "HIP11001": {
          "x": 74.1,
          "y": 106.2
        },
        "HIP9236": {
          "x": 98.8,
          "y": 35.1
        }
      }
    }
  },
  "Ind": {
    "id": "Ind",
    "name": "Indus",
    "nameRu": "Индеец",
    "nameLa": "Indus",
    "stars": [
      "HIP103227",
      "HIP102333",
      "HIP101772",
      "HIP105319",
      "HIP108431"
    ],
    "lines": [
      [
        "HIP103227",
        "HIP102333"
      ],
      [
        "HIP102333",
        "HIP101772"
      ],
      [
        "HIP101772",
        "HIP105319"
      ],
      [
        "HIP105319",
        "HIP108431"
      ],
      [
        "HIP108431",
        "HIP103227"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP103227": {
          "x": 107.1,
          "y": 173.7
        },
        "HIP102333": {
          "x": 125.8,
          "y": 110.8
        },
        "HIP101772": {
          "x": 140,
          "y": 66.3
        },
        "HIP105319": {
          "x": 72.6,
          "y": 125
        },
        "HIP108431": {
          "x": 20,
          "y": 146.4
        }
      }
    }
  },
  "LMi": {
    "id": "LMi",
    "name": "Leo Minor",
    "nameRu": "Малый Лев",
    "nameLa": "Leo Minor",
    "stars": [
      "HIP46952",
      "HIP49593",
      "HIP51233",
      "HIP53229",
      "HIP51056"
    ],
    "lines": [
      [
        "HIP46952",
        "HIP49593"
      ],
      [
        "HIP49593",
        "HIP51233"
      ],
      [
        "HIP51233",
        "HIP53229"
      ],
      [
        "HIP53229",
        "HIP51056"
      ],
      [
        "HIP51056",
        "HIP49593"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP46952": {
          "x": 140,
          "y": 108.6
        },
        "HIP49593": {
          "x": 90.3,
          "y": 120.6
        },
        "HIP51233": {
          "x": 59.6,
          "y": 109.8
        },
        "HIP53229": {
          "x": 20,
          "y": 126.1
        },
        "HIP51056": {
          "x": 62.1,
          "y": 131.4
        }
      }
    }
  },
  "Lac": {
    "id": "Lac",
    "name": "Lacerta",
    "nameRu": "Ящерица",
    "nameLa": "Lacerta",
    "stars": [
      "HIP111022",
      "HIP111169",
      "HIP110538",
      "HIP110609",
      "HIP110351",
      "HIP111104",
      "HIP111944",
      "HIP109754",
      "HIP109937"
    ],
    "lines": [
      [
        "HIP111022",
        "HIP111169"
      ],
      [
        "HIP111169",
        "HIP110538"
      ],
      [
        "HIP110538",
        "HIP110609"
      ],
      [
        "HIP110609",
        "HIP111022"
      ],
      [
        "HIP111022",
        "HIP110351"
      ],
      [
        "HIP110351",
        "HIP111104"
      ],
      [
        "HIP111104",
        "HIP111944"
      ],
      [
        "HIP111944",
        "HIP111104"
      ],
      [
        "HIP111104",
        "HIP111944"
      ],
      [
        "HIP111944",
        "HIP111022"
      ],
      [
        "HIP111022",
        "HIP111944"
      ],
      [
        "HIP111944",
        "HIP111104"
      ],
      [
        "HIP111104",
        "HIP109754"
      ],
      [
        "HIP109754",
        "HIP109937"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP111022": {
          "x": 73.7,
          "y": 82.5
        },
        "HIP111169": {
          "x": 70.3,
          "y": 46.9
        },
        "HIP110538": {
          "x": 87.2,
          "y": 20
        },
        "HIP110609": {
          "x": 85.3,
          "y": 58.2
        },
        "HIP110351": {
          "x": 93.6,
          "y": 98.7
        },
        "HIP111104": {
          "x": 70.5,
          "y": 145.6
        },
        "HIP111944": {
          "x": 46,
          "y": 129
        },
        "HIP109754": {
          "x": 114,
          "y": 192.4
        },
        "HIP109937": {
          "x": 109.2,
          "y": 220
        }
      }
    }
  },
  "Leo": {
    "id": "Leo",
    "name": "Leo",
    "nameRu": "Лев",
    "nameLa": "Leo",
    "stars": [
      "HIP49669",
      "HIP49583",
      "HIP50583",
      "HIP50335",
      "HIP48455",
      "HIP47908",
      "HIP54872",
      "HIP57632",
      "HIP54879",
      "HIP46146",
      "HIP46750",
      "HIP55642",
      "HIP55434"
    ],
    "lines": [
      [
        "HIP49669",
        "HIP49583"
      ],
      [
        "HIP49583",
        "HIP50583"
      ],
      [
        "HIP50583",
        "HIP50335"
      ],
      [
        "HIP50335",
        "HIP48455"
      ],
      [
        "HIP48455",
        "HIP47908"
      ],
      [
        "HIP50583",
        "HIP54872"
      ],
      [
        "HIP54872",
        "HIP57632"
      ],
      [
        "HIP57632",
        "HIP54879"
      ],
      [
        "HIP54879",
        "HIP54872"
      ],
      [
        "HIP54872",
        "HIP54879"
      ],
      [
        "HIP54879",
        "HIP49583"
      ],
      [
        "HIP48455",
        "HIP46146"
      ],
      [
        "HIP46146",
        "HIP46750"
      ],
      [
        "HIP46750",
        "HIP47908"
      ],
      [
        "HIP47908",
        "HIP49583"
      ],
      [
        "HIP54879",
        "HIP55642"
      ],
      [
        "HIP55642",
        "HIP55434"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP49669": {
          "x": 106.5,
          "y": 135.8
        },
        "HIP49583": {
          "x": 106.8,
          "y": 119.1
        },
        "HIP50583": {
          "x": 96.2,
          "y": 108.8
        },
        "HIP50335": {
          "x": 98.6,
          "y": 96.4
        },
        "HIP48455": {
          "x": 117.3,
          "y": 86.5
        },
        "HIP47908": {
          "x": 123.3,
          "y": 93.9
        },
        "HIP54872": {
          "x": 52.3,
          "y": 105.4
        },
        "HIP57632": {
          "x": 20,
          "y": 124.1
        },
        "HIP54879": {
          "x": 51.1,
          "y": 123.1
        },
        "HIP46146": {
          "x": 140,
          "y": 83.5
        },
        "HIP46750": {
          "x": 135.1,
          "y": 95.7
        },
        "HIP55642": {
          "x": 41.5,
          "y": 140
        },
        "HIP55434": {
          "x": 42.8,
          "y": 156.5
        }
      }
    }
  },
  "Lep": {
    "id": "Lep",
    "name": "Lepus",
    "nameRu": "Заяц",
    "nameLa": "Lepus",
    "stars": [
      "HIP23685",
      "HIP24305",
      "HIP25985",
      "HIP25606",
      "HIP24845",
      "HIP24327",
      "HIP27072",
      "HIP27654",
      "HIP28910",
      "HIP28103",
      "HIP27288"
    ],
    "lines": [
      [
        "HIP23685",
        "HIP24305"
      ],
      [
        "HIP24305",
        "HIP25985"
      ],
      [
        "HIP25985",
        "HIP25606"
      ],
      [
        "HIP25606",
        "HIP23685"
      ],
      [
        "HIP24845",
        "HIP24305"
      ],
      [
        "HIP24305",
        "HIP24327"
      ],
      [
        "HIP25606",
        "HIP27072"
      ],
      [
        "HIP27072",
        "HIP27654"
      ],
      [
        "HIP27654",
        "HIP28910"
      ],
      [
        "HIP28910",
        "HIP28103"
      ],
      [
        "HIP28103",
        "HIP27288"
      ],
      [
        "HIP27288",
        "HIP25985"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP23685": {
          "x": 140,
          "y": 159.6
        },
        "HIP24305": {
          "x": 126.9,
          "y": 107.6
        },
        "HIP25985": {
          "x": 87.3,
          "y": 120.5
        },
        "HIP25606": {
          "x": 96,
          "y": 144.9
        },
        "HIP24845": {
          "x": 114.1,
          "y": 82.1
        },
        "HIP24327": {
          "x": 127.1,
          "y": 80.4
        },
        "HIP27072": {
          "x": 64.7,
          "y": 159.1
        },
        "HIP27654": {
          "x": 51.2,
          "y": 146.3
        },
        "HIP28910": {
          "x": 20,
          "y": 97.7
        },
        "HIP28103": {
          "x": 39.6,
          "y": 90.7
        },
        "HIP27288": {
          "x": 58.8,
          "y": 95.7
        }
      }
    }
  },
  "Lib": {
    "id": "Lib",
    "name": "Libra",
    "nameRu": "Весы",
    "nameLa": "Libra",
    "stars": [
      "HIP72622",
      "HIP74785",
      "HIP73714",
      "HIP76333",
      "HIP76470",
      "HIP76600"
    ],
    "lines": [
      [
        "HIP72622",
        "HIP74785"
      ],
      [
        "HIP72622",
        "HIP73714"
      ],
      [
        "HIP74785",
        "HIP76333"
      ],
      [
        "HIP76333",
        "HIP72622"
      ],
      [
        "HIP72622",
        "HIP76333"
      ],
      [
        "HIP76333",
        "HIP76470"
      ],
      [
        "HIP76470",
        "HIP76600"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP72622": {
          "x": 133.9,
          "y": 86.9
        },
        "HIP74785": {
          "x": 73.1,
          "y": 20
        },
        "HIP73714": {
          "x": 100.7,
          "y": 175.6
        },
        "HIP76333": {
          "x": 29.3,
          "y": 73.8
        },
        "HIP76470": {
          "x": 29.1,
          "y": 203.6
        },
        "HIP76600": {
          "x": 26.1,
          "y": 220
        }
      }
    }
  },
  "Lup": {
    "id": "Lup",
    "name": "Lupus",
    "nameRu": "Волк",
    "nameLa": "Lupus",
    "stars": [
      "HIP71860",
      "HIP74395",
      "HIP75264",
      "HIP76297",
      "HIP75141",
      "HIP73273",
      "HIP78384",
      "HIP75177",
      "HIP77634"
    ],
    "lines": [
      [
        "HIP71860",
        "HIP74395"
      ],
      [
        "HIP74395",
        "HIP75264"
      ],
      [
        "HIP75264",
        "HIP76297"
      ],
      [
        "HIP76297",
        "HIP75141"
      ],
      [
        "HIP75141",
        "HIP73273"
      ],
      [
        "HIP73273",
        "HIP75141"
      ],
      [
        "HIP75141",
        "HIP76297"
      ],
      [
        "HIP76297",
        "HIP78384"
      ],
      [
        "HIP78384",
        "HIP75177"
      ],
      [
        "HIP75177",
        "HIP77634"
      ],
      [
        "HIP77634",
        "HIP78384"
      ],
      [
        "HIP78384",
        "HIP74395"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP71860": {
          "x": 140,
          "y": 161.1
        },
        "HIP74395": {
          "x": 95.1,
          "y": 197.7
        },
        "HIP75264": {
          "x": 81.7,
          "y": 134.2
        },
        "HIP76297": {
          "x": 62.1,
          "y": 104.9
        },
        "HIP75141": {
          "x": 83.9,
          "y": 100.3
        },
        "HIP73273": {
          "x": 118.8,
          "y": 122.6
        },
        "HIP78384": {
          "x": 20,
          "y": 84.3
        },
        "HIP75177": {
          "x": 83.5,
          "y": 63.3
        },
        "HIP77634": {
          "x": 32,
          "y": 42.3
        }
      }
    }
  },
  "Lyn": {
    "id": "Lyn",
    "name": "Lynx",
    "nameRu": "Рысь",
    "nameLa": "Lynx",
    "stars": [
      "HIP45860",
      "HIP45688",
      "HIP44700",
      "HIP44248",
      "HIP41075",
      "HIP36145",
      "HIP33449",
      "HIP30060"
    ],
    "lines": [
      [
        "HIP45860",
        "HIP45688"
      ],
      [
        "HIP45688",
        "HIP44700"
      ],
      [
        "HIP44700",
        "HIP44248"
      ],
      [
        "HIP44248",
        "HIP41075"
      ],
      [
        "HIP41075",
        "HIP36145"
      ],
      [
        "HIP36145",
        "HIP33449"
      ],
      [
        "HIP33449",
        "HIP30060"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP45860": {
          "x": 20,
          "y": 179.6
        },
        "HIP45688": {
          "x": 23.8,
          "y": 169.3
        },
        "HIP44700": {
          "x": 35.4,
          "y": 163.5
        },
        "HIP44248": {
          "x": 42,
          "y": 149.8
        },
        "HIP41075": {
          "x": 71.7,
          "y": 145.3
        },
        "HIP36145": {
          "x": 110.3,
          "y": 116
        },
        "HIP33449": {
          "x": 119.6,
          "y": 71.9
        },
        "HIP30060": {
          "x": 140,
          "y": 60.4
        }
      }
    }
  },
  "Lyr": {
    "id": "Lyr",
    "name": "Lyra",
    "nameRu": "Лира",
    "nameLa": "Lyra",
    "stars": [
      "HIP91262",
      "HIP91919",
      "HIP91971",
      "HIP92791",
      "HIP93194",
      "HIP92420"
    ],
    "lines": [
      [
        "HIP91262",
        "HIP91919"
      ],
      [
        "HIP91919",
        "HIP91971"
      ],
      [
        "HIP91971",
        "HIP91262"
      ],
      [
        "HIP91262",
        "HIP91971"
      ],
      [
        "HIP91971",
        "HIP92791"
      ],
      [
        "HIP92791",
        "HIP93194"
      ],
      [
        "HIP93194",
        "HIP92420"
      ],
      [
        "HIP92420",
        "HIP91971"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP91262": {
          "x": 140,
          "y": 49.4
        },
        "HIP91919": {
          "x": 100.9,
          "y": 26.3
        },
        "HIP91971": {
          "x": 99.2,
          "y": 81.9
        },
        "HIP92791": {
          "x": 47,
          "y": 100.8
        },
        "HIP93194": {
          "x": 20,
          "y": 213.7
        },
        "HIP92420": {
          "x": 70.4,
          "y": 196.3
        }
      }
    }
  },
  "Men": {
    "id": "Men",
    "name": "Mensa",
    "nameRu": "Столовая Гора",
    "nameLa": "Mensa",
    "stars": [
      "HIP29271",
      "HIP23467"
    ],
    "lines": [
      [
        "HIP29271",
        "HIP23467"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP29271": {
          "x": 20,
          "y": 162.9
        },
        "HIP23467": {
          "x": 140,
          "y": 77.1
        }
      }
    }
  },
  "Mic": {
    "id": "Mic",
    "name": "Microscopium",
    "nameRu": "Микроскоп",
    "nameLa": "Microscopium",
    "stars": [
      "HIP102831",
      "HIP102989"
    ],
    "lines": [
      [
        "HIP102831",
        "HIP102989"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP102831": {
          "x": 140,
          "y": 206.1
        },
        "HIP102989": {
          "x": 20,
          "y": 33.9
        }
      }
    }
  },
  "Mon": {
    "id": "Mon",
    "name": "Monoceros",
    "nameRu": "Единорог",
    "nameLa": "Monoceros",
    "stars": [
      "HIP31978",
      "HIP31216",
      "HIP30419",
      "HIP32578",
      "HIP34769",
      "HIP30867",
      "HIP29651",
      "HIP39863",
      "HIP37447"
    ],
    "lines": [
      [
        "HIP31978",
        "HIP31216"
      ],
      [
        "HIP31216",
        "HIP30419"
      ],
      [
        "HIP30419",
        "HIP30419"
      ],
      [
        "HIP30419",
        "HIP32578"
      ],
      [
        "HIP32578",
        "HIP31216"
      ],
      [
        "HIP31216",
        "HIP32578"
      ],
      [
        "HIP32578",
        "HIP34769"
      ],
      [
        "HIP34769",
        "HIP30867"
      ],
      [
        "HIP30867",
        "HIP29651"
      ],
      [
        "HIP29651",
        "HIP30867"
      ],
      [
        "HIP30867",
        "HIP34769"
      ],
      [
        "HIP34769",
        "HIP39863"
      ],
      [
        "HIP39863",
        "HIP37447"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP31978": {
          "x": 112.8,
          "y": 79.2
        },
        "HIP31216": {
          "x": 121.1,
          "y": 89.9
        },
        "HIP30419": {
          "x": 130.7,
          "y": 101.3
        },
        "HIP32578": {
          "x": 105.7,
          "y": 110.4
        },
        "HIP34769": {
          "x": 81,
          "y": 122.4
        },
        "HIP30867": {
          "x": 125.4,
          "y": 149.6
        },
        "HIP29651": {
          "x": 140,
          "y": 146.6
        },
        "HIP39863": {
          "x": 20,
          "y": 133.3
        },
        "HIP37447": {
          "x": 50.2,
          "y": 160.8
        }
      }
    }
  },
  "Mus": {
    "id": "Mus",
    "name": "Musca",
    "nameRu": "Муха",
    "nameLa": "Musca",
    "stars": [
      "HIP57363",
      "HIP59929",
      "HIP61585",
      "HIP62322",
      "HIP63613",
      "HIP61199"
    ],
    "lines": [
      [
        "HIP57363",
        "HIP59929"
      ],
      [
        "HIP59929",
        "HIP61585"
      ],
      [
        "HIP61585",
        "HIP62322"
      ],
      [
        "HIP62322",
        "HIP63613"
      ],
      [
        "HIP63613",
        "HIP61199"
      ],
      [
        "HIP61199",
        "HIP61585"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP57363": {
          "x": 140,
          "y": 76.2
        },
        "HIP59929": {
          "x": 84.3,
          "y": 91.6
        },
        "HIP61585": {
          "x": 53,
          "y": 111.8
        },
        "HIP62322": {
          "x": 37.6,
          "y": 94.8
        },
        "HIP63613": {
          "x": 20,
          "y": 156.8
        },
        "HIP61199": {
          "x": 61.1,
          "y": 163.8
        }
      }
    }
  },
  "Nor": {
    "id": "Nor",
    "name": "Norma",
    "nameRu": "Наугольник",
    "nameLa": "Norma",
    "stars": [
      "HIP78639",
      "HIP80000",
      "HIP80582",
      "HIP78914"
    ],
    "lines": [
      [
        "HIP78639",
        "HIP80000"
      ],
      [
        "HIP80000",
        "HIP80582"
      ],
      [
        "HIP80582",
        "HIP78914"
      ],
      [
        "HIP78914",
        "HIP78639"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP78639": {
          "x": 140,
          "y": 167.8
        },
        "HIP80000": {
          "x": 58.8,
          "y": 194.9
        },
        "HIP80582": {
          "x": 20,
          "y": 117.7
        },
        "HIP78914": {
          "x": 126.9,
          "y": 45.1
        }
      }
    }
  },
  "Oct": {
    "id": "Oct",
    "name": "Octans",
    "nameRu": "Октант",
    "nameLa": "Octans",
    "stars": [
      "HIP70638",
      "HIP107089",
      "HIP112405"
    ],
    "lines": [
      [
        "HIP70638",
        "HIP107089"
      ],
      [
        "HIP107089",
        "HIP112405"
      ],
      [
        "HIP112405",
        "HIP70638"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP70638": {
          "x": 140,
          "y": 197.8
        },
        "HIP107089": {
          "x": 38,
          "y": 42.2
        },
        "HIP112405": {
          "x": 20,
          "y": 97.4
        }
      }
    }
  },
  "Oph": {
    "id": "Oph",
    "name": "Ophiuchus",
    "nameRu": "Змееносец",
    "nameLa": "Ophiuchus",
    "stars": [
      "HIP86032",
      "HIP83000",
      "HIP80883",
      "HIP79593",
      "HIP79882",
      "HIP80628",
      "HIP81377",
      "HIP84012",
      "HIP86742",
      "HIP87108",
      "HIP88048",
      "HIP84970",
      "HIP85423",
      "HIP80894",
      "HIP80569",
      "HIP80343",
      "HIP80473"
    ],
    "lines": [
      [
        "HIP86032",
        "HIP83000"
      ],
      [
        "HIP83000",
        "HIP80883"
      ],
      [
        "HIP80883",
        "HIP79593"
      ],
      [
        "HIP79593",
        "HIP79882"
      ],
      [
        "HIP79882",
        "HIP80628"
      ],
      [
        "HIP80628",
        "HIP81377"
      ],
      [
        "HIP81377",
        "HIP80628"
      ],
      [
        "HIP80628",
        "HIP79882"
      ],
      [
        "HIP79882",
        "HIP79593"
      ],
      [
        "HIP79593",
        "HIP80883"
      ],
      [
        "HIP80883",
        "HIP83000"
      ],
      [
        "HIP83000",
        "HIP81377"
      ],
      [
        "HIP81377",
        "HIP84012"
      ],
      [
        "HIP84012",
        "HIP86742"
      ],
      [
        "HIP86742",
        "HIP87108"
      ],
      [
        "HIP87108",
        "HIP88048"
      ],
      [
        "HIP88048",
        "HIP87108"
      ],
      [
        "HIP87108",
        "HIP86742"
      ],
      [
        "HIP86742",
        "HIP86032"
      ],
      [
        "HIP84012",
        "HIP84970"
      ],
      [
        "HIP84970",
        "HIP85423"
      ],
      [
        "HIP81377",
        "HIP80894"
      ],
      [
        "HIP80894",
        "HIP80569"
      ],
      [
        "HIP80569",
        "HIP80343"
      ],
      [
        "HIP80343",
        "HIP80473"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP86032": {
          "x": 45.9,
          "y": 20
        },
        "HIP83000": {
          "x": 90,
          "y": 37
        },
        "HIP80883": {
          "x": 120.5,
          "y": 72.2
        },
        "HIP79593": {
          "x": 138.9,
          "y": 98.4
        },
        "HIP79882": {
          "x": 134.2,
          "y": 102.9
        },
        "HIP80628": {
          "x": 123.1,
          "y": 119.3
        },
        "HIP81377": {
          "x": 112.6,
          "y": 128.9
        },
        "HIP84012": {
          "x": 76.4,
          "y": 152
        },
        "HIP86742": {
          "x": 36.9,
          "y": 59.8
        },
        "HIP87108": {
          "x": 32,
          "y": 68.6
        },
        "HIP88048": {
          "x": 21.1,
          "y": 126.9
        },
        "HIP84970": {
          "x": 64.5,
          "y": 195.5
        },
        "HIP85423": {
          "x": 59.4,
          "y": 220
        },
        "HIP80894": {
          "x": 118.7,
          "y": 156.3
        },
        "HIP80569": {
          "x": 123,
          "y": 164.9
        },
        "HIP80343": {
          "x": 126,
          "y": 172.3
        },
        "HIP80473": {
          "x": 124.1,
          "y": 188.3
        }
      }
    }
  },
  "Ori": {
    "id": "Ori",
    "name": "Orion",
    "nameRu": "Орион",
    "nameLa": "Orion",
    "stars": [
      "HIP27989",
      "HIP26727",
      "HIP27366",
      "HIP26311",
      "HIP25930",
      "HIP25336",
      "HIP25281",
      "HIP24436",
      "HIP26207",
      "HIP23607",
      "HIP22957",
      "HIP22845",
      "HIP22509",
      "HIP22449",
      "HIP22549",
      "HIP22797",
      "HIP23123",
      "HIP28614",
      "HIP29038",
      "HIP29426",
      "HIP28716",
      "HIP27913"
    ],
    "lines": [
      [
        "HIP27989",
        "HIP26727"
      ],
      [
        "HIP26727",
        "HIP27366"
      ],
      [
        "HIP27366",
        "HIP26727"
      ],
      [
        "HIP26727",
        "HIP26311"
      ],
      [
        "HIP26311",
        "HIP25930"
      ],
      [
        "HIP25930",
        "HIP25336"
      ],
      [
        "HIP25336",
        "HIP25930"
      ],
      [
        "HIP25930",
        "HIP25281"
      ],
      [
        "HIP25281",
        "HIP24436"
      ],
      [
        "HIP27989",
        "HIP25336"
      ],
      [
        "HIP25336",
        "HIP26207"
      ],
      [
        "HIP26207",
        "HIP26207"
      ],
      [
        "HIP26207",
        "HIP27989"
      ],
      [
        "HIP23607",
        "HIP22957"
      ],
      [
        "HIP22957",
        "HIP22845"
      ],
      [
        "HIP22845",
        "HIP22509"
      ],
      [
        "HIP22509",
        "HIP22449"
      ],
      [
        "HIP22449",
        "HIP25336"
      ],
      [
        "HIP25336",
        "HIP22449"
      ],
      [
        "HIP22449",
        "HIP22549"
      ],
      [
        "HIP22549",
        "HIP22797"
      ],
      [
        "HIP22797",
        "HIP23123"
      ],
      [
        "HIP27989",
        "HIP28614"
      ],
      [
        "HIP28614",
        "HIP29038"
      ],
      [
        "HIP29426",
        "HIP28716"
      ],
      [
        "HIP28716",
        "HIP27913"
      ],
      [
        "HIP27913",
        "HIP29038"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP27989": {
          "x": 44.1,
          "y": 107.1
        },
        "HIP26727": {
          "x": 64.9,
          "y": 162.7
        },
        "HIP27366": {
          "x": 54,
          "y": 210.6
        },
        "HIP26311": {
          "x": 71.7,
          "y": 158.3
        },
        "HIP25930": {
          "x": 78,
          "y": 152.9
        },
        "HIP25336": {
          "x": 88.1,
          "y": 113.6
        },
        "HIP25281": {
          "x": 89.1,
          "y": 165.4
        },
        "HIP24436": {
          "x": 104.1,
          "y": 201.1
        },
        "HIP26207": {
          "x": 73.6,
          "y": 92.5
        },
        "HIP23607": {
          "x": 117.6,
          "y": 59.6
        },
        "HIP22957": {
          "x": 129.7,
          "y": 70.6
        },
        "HIP22845": {
          "x": 132.2,
          "y": 90.7
        },
        "HIP22509": {
          "x": 138.6,
          "y": 98
        },
        "HIP22449": {
          "x": 140,
          "y": 109.5
        },
        "HIP22549": {
          "x": 138.1,
          "y": 117.6
        },
        "HIP22797": {
          "x": 133.9,
          "y": 136.5
        },
        "HIP23123": {
          "x": 127.5,
          "y": 140.8
        },
        "HIP28614": {
          "x": 33.7,
          "y": 93.5
        },
        "HIP29038": {
          "x": 26.6,
          "y": 62.5
        },
        "HIP29426": {
          "x": 20,
          "y": 65.6
        },
        "HIP28716": {
          "x": 32.6,
          "y": 29.6
        },
        "HIP27913": {
          "x": 46.4,
          "y": 29.4
        }
      }
    }
  },
  "Pav": {
    "id": "Pav",
    "name": "Pavo",
    "nameRu": "Павлин",
    "nameLa": "Pavo",
    "stars": [
      "HIP100751",
      "HIP99240",
      "HIP102395",
      "HIP105858",
      "HIP91792",
      "HIP98495",
      "HIP93015",
      "HIP88866",
      "HIP86929",
      "HIP90098",
      "HIP92609"
    ],
    "lines": [
      [
        "HIP100751",
        "HIP99240"
      ],
      [
        "HIP99240",
        "HIP102395"
      ],
      [
        "HIP100751",
        "HIP105858"
      ],
      [
        "HIP105858",
        "HIP102395"
      ],
      [
        "HIP91792",
        "HIP99240"
      ],
      [
        "HIP99240",
        "HIP98495"
      ],
      [
        "HIP98495",
        "HIP99240"
      ],
      [
        "HIP99240",
        "HIP93015"
      ],
      [
        "HIP93015",
        "HIP88866"
      ],
      [
        "HIP88866",
        "HIP86929"
      ],
      [
        "HIP86929",
        "HIP88866"
      ],
      [
        "HIP88866",
        "HIP90098"
      ],
      [
        "HIP90098",
        "HIP92609"
      ],
      [
        "HIP92609",
        "HIP99240"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP100751": {
          "x": 40.7,
          "y": 79.1
        },
        "HIP99240": {
          "x": 61.9,
          "y": 126.3
        },
        "HIP102395": {
          "x": 43,
          "y": 131.2
        },
        "HIP105858": {
          "x": 20,
          "y": 136.1
        },
        "HIP91792": {
          "x": 102.7,
          "y": 153.4
        },
        "HIP98495": {
          "x": 71.3,
          "y": 160.9
        },
        "HIP93015": {
          "x": 99.3,
          "y": 130.6
        },
        "HIP88866": {
          "x": 129.3,
          "y": 117.6
        },
        "HIP86929": {
          "x": 140,
          "y": 127.4
        },
        "HIP90098": {
          "x": 123.7,
          "y": 104.1
        },
        "HIP92609": {
          "x": 105.2,
          "y": 104.4
        }
      }
    }
  },
  "Peg": {
    "id": "Peg",
    "name": "Pegasus",
    "nameRu": "Пегас",
    "nameLa": "Pegasus",
    "stars": [
      "HIP109410",
      "HIP112158",
      "HIP113881",
      "HIP112748",
      "HIP112440",
      "HIP109176",
      "HIP107354",
      "HIP677",
      "HIP113963",
      "HIP1067",
      "HIP107315",
      "HIP109427",
      "HIP112029"
    ],
    "lines": [
      [
        "HIP109410",
        "HIP112158"
      ],
      [
        "HIP112158",
        "HIP113881"
      ],
      [
        "HIP113881",
        "HIP112748"
      ],
      [
        "HIP112748",
        "HIP112440"
      ],
      [
        "HIP112440",
        "HIP109176"
      ],
      [
        "HIP109176",
        "HIP107354"
      ],
      [
        "HIP677",
        "HIP113881"
      ],
      [
        "HIP113881",
        "HIP113963"
      ],
      [
        "HIP113963",
        "HIP1067"
      ],
      [
        "HIP1067",
        "HIP677"
      ],
      [
        "HIP107315",
        "HIP109427"
      ],
      [
        "HIP109427",
        "HIP112029"
      ],
      [
        "HIP112029",
        "HIP113963"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP109410": {
          "x": 114.7,
          "y": 76.2
        },
        "HIP112158": {
          "x": 92.3,
          "y": 86.8
        },
        "HIP113881": {
          "x": 77.7,
          "y": 93.3
        },
        "HIP112748": {
          "x": 87.3,
          "y": 104.7
        },
        "HIP112440": {
          "x": 89.8,
          "y": 108
        },
        "HIP109176": {
          "x": 118.2,
          "y": 101.4
        },
        "HIP107354": {
          "x": 134.6,
          "y": 99
        },
        "HIP677": {
          "x": 30.9,
          "y": 84.8
        },
        "HIP113963": {
          "x": 75.6,
          "y": 134.2
        },
        "HIP1067": {
          "x": 20,
          "y": 130.7
        },
        "HIP107315": {
          "x": 140,
          "y": 150.6
        },
        "HIP109427": {
          "x": 119.2,
          "y": 163.8
        },
        "HIP112029": {
          "x": 93.6,
          "y": 148.6
        }
      }
    }
  },
  "Per": {
    "id": "Per",
    "name": "Perseus",
    "nameRu": "Персей",
    "nameLa": "Perseus",
    "stars": [
      "HIP17448",
      "HIP18246",
      "HIP18614",
      "HIP18532",
      "HIP17358",
      "HIP15863",
      "HIP14328",
      "HIP13268",
      "HIP13531",
      "HIP14632",
      "HIP14668",
      "HIP14576",
      "HIP14354",
      "HIP19343",
      "HIP19812",
      "HIP20070",
      "HIP19167",
      "HIP12777",
      "HIP8068"
    ],
    "lines": [
      [
        "HIP17448",
        "HIP18246"
      ],
      [
        "HIP18246",
        "HIP18614"
      ],
      [
        "HIP18614",
        "HIP18532"
      ],
      [
        "HIP18532",
        "HIP17358"
      ],
      [
        "HIP17358",
        "HIP15863"
      ],
      [
        "HIP15863",
        "HIP14328"
      ],
      [
        "HIP14328",
        "HIP13268"
      ],
      [
        "HIP13268",
        "HIP13531"
      ],
      [
        "HIP13531",
        "HIP14328"
      ],
      [
        "HIP14328",
        "HIP13531"
      ],
      [
        "HIP13531",
        "HIP14632"
      ],
      [
        "HIP14632",
        "HIP15863"
      ],
      [
        "HIP15863",
        "HIP14632"
      ],
      [
        "HIP14632",
        "HIP14668"
      ],
      [
        "HIP14668",
        "HIP14576"
      ],
      [
        "HIP14576",
        "HIP18532"
      ],
      [
        "HIP18532",
        "HIP14576"
      ],
      [
        "HIP14576",
        "HIP14354"
      ],
      [
        "HIP17358",
        "HIP19343"
      ],
      [
        "HIP19343",
        "HIP19812"
      ],
      [
        "HIP19812",
        "HIP20070"
      ],
      [
        "HIP20070",
        "HIP19167"
      ],
      [
        "HIP14632",
        "HIP12777"
      ],
      [
        "HIP12777",
        "HIP8068"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP17448": {
          "x": 41.8,
          "y": 177.9
        },
        "HIP18246": {
          "x": 31.3,
          "y": 179.5
        },
        "HIP18614": {
          "x": 28.1,
          "y": 159.3
        },
        "HIP18532": {
          "x": 31.2,
          "y": 138.5
        },
        "HIP17358": {
          "x": 46.9,
          "y": 101.7
        },
        "HIP15863": {
          "x": 61.9,
          "y": 91.9
        },
        "HIP14328": {
          "x": 75.8,
          "y": 73.4
        },
        "HIP13268": {
          "x": 84.6,
          "y": 60.5
        },
        "HIP13531": {
          "x": 83.8,
          "y": 76.3
        },
        "HIP14632": {
          "x": 73.9,
          "y": 92.6
        },
        "HIP14668": {
          "x": 74.9,
          "y": 115.7
        },
        "HIP14576": {
          "x": 77.2,
          "y": 134.5
        },
        "HIP14354": {
          "x": 80.7,
          "y": 144.7
        },
        "HIP19343": {
          "x": 25.8,
          "y": 100.1
        },
        "HIP19812": {
          "x": 21.2,
          "y": 96
        },
        "HIP20070": {
          "x": 20,
          "y": 86.5
        },
        "HIP19167": {
          "x": 29.1,
          "y": 87.6
        },
        "HIP12777": {
          "x": 93.7,
          "y": 92.4
        },
        "HIP8068": {
          "x": 140,
          "y": 73.3
        }
      }
    }
  },
  "Phe": {
    "id": "Phe",
    "name": "Phoenix",
    "nameRu": "Феникс",
    "nameLa": "Phoenix",
    "stars": [
      "HIP2081",
      "HIP5165",
      "HIP6867",
      "HIP765",
      "HIP5348",
      "HIP7083"
    ],
    "lines": [
      [
        "HIP2081",
        "HIP5165"
      ],
      [
        "HIP5165",
        "HIP6867"
      ],
      [
        "HIP2081",
        "HIP765"
      ],
      [
        "HIP765",
        "HIP5165"
      ],
      [
        "HIP5165",
        "HIP5348"
      ],
      [
        "HIP5348",
        "HIP7083"
      ],
      [
        "HIP7083",
        "HIP6867"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP2081": {
          "x": 117.7,
          "y": 65.5
        },
        "HIP5165": {
          "x": 55.6,
          "y": 101.2
        },
        "HIP6867": {
          "x": 20,
          "y": 74.1
        },
        "HIP765": {
          "x": 140,
          "y": 98.1
        },
        "HIP5348": {
          "x": 54.7,
          "y": 174.5
        },
        "HIP7083": {
          "x": 20.8,
          "y": 123.7
        }
      }
    }
  },
  "Pic": {
    "id": "Pic",
    "name": "Pictor",
    "nameRu": "Живописец",
    "nameLa": "Pictor",
    "stars": [
      "HIP32607",
      "HIP27530",
      "HIP27321"
    ],
    "lines": [
      [
        "HIP32607",
        "HIP27530"
      ],
      [
        "HIP27530",
        "HIP27321"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP32607": {
          "x": 20,
          "y": 205.3
        },
        "HIP27530": {
          "x": 129.5,
          "y": 112
        },
        "HIP27321": {
          "x": 140,
          "y": 34.7
        }
      }
    }
  },
  "PsA": {
    "id": "PsA",
    "name": "Piscis Austrinus",
    "nameRu": "Южная Рыба",
    "nameLa": "Piscis Austrinus",
    "stars": [
      "HIP113368",
      "HIP113246",
      "HIP112948",
      "HIP111188",
      "HIP109285",
      "HIP107380",
      "HIP107608",
      "HIP111954"
    ],
    "lines": [
      [
        "HIP113368",
        "HIP113246"
      ],
      [
        "HIP113246",
        "HIP112948"
      ],
      [
        "HIP112948",
        "HIP111188"
      ],
      [
        "HIP111188",
        "HIP109285"
      ],
      [
        "HIP109285",
        "HIP107380"
      ],
      [
        "HIP107380",
        "HIP107608"
      ],
      [
        "HIP107608",
        "HIP109285"
      ],
      [
        "HIP109285",
        "HIP111954"
      ],
      [
        "HIP111954",
        "HIP113368"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP113368": {
          "x": 20,
          "y": 116.6
        },
        "HIP113246": {
          "x": 24.3,
          "y": 139
        },
        "HIP112948": {
          "x": 30.1,
          "y": 141.2
        },
        "HIP111188": {
          "x": 64.2,
          "y": 136
        },
        "HIP109285": {
          "x": 101.7,
          "y": 141.6
        },
        "HIP107380": {
          "x": 140,
          "y": 144.7
        },
        "HIP107608": {
          "x": 136.9,
          "y": 127.8
        },
        "HIP111954": {
          "x": 48.1,
          "y": 95.3
        }
      }
    }
  },
  "Psc": {
    "id": "Psc",
    "name": "Pisces",
    "nameRu": "Рыбы",
    "nameLa": "Pisces",
    "stars": [
      "HIP5742",
      "HIP6193",
      "HIP5586",
      "HIP7097",
      "HIP8198",
      "HIP9487",
      "HIP7884",
      "HIP4906",
      "HIP3786",
      "HIP118268",
      "HIP116771",
      "HIP115830",
      "HIP114971",
      "HIP115738",
      "HIP116928"
    ],
    "lines": [
      [
        "HIP5742",
        "HIP6193"
      ],
      [
        "HIP6193",
        "HIP5586"
      ],
      [
        "HIP5586",
        "HIP5742"
      ],
      [
        "HIP5742",
        "HIP7097"
      ],
      [
        "HIP7097",
        "HIP8198"
      ],
      [
        "HIP8198",
        "HIP9487"
      ],
      [
        "HIP9487",
        "HIP7884"
      ],
      [
        "HIP7884",
        "HIP4906"
      ],
      [
        "HIP4906",
        "HIP3786"
      ],
      [
        "HIP3786",
        "HIP118268"
      ],
      [
        "HIP118268",
        "HIP116771"
      ],
      [
        "HIP116771",
        "HIP115830"
      ],
      [
        "HIP115830",
        "HIP114971"
      ],
      [
        "HIP114971",
        "HIP115738"
      ],
      [
        "HIP115738",
        "HIP116928"
      ],
      [
        "HIP116928",
        "HIP116771"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP5742": {
          "x": 57.8,
          "y": 95.3
        },
        "HIP6193": {
          "x": 54.2,
          "y": 87
        },
        "HIP5586": {
          "x": 59.6,
          "y": 78.6
        },
        "HIP7097": {
          "x": 44.8,
          "y": 121.3
        },
        "HIP8198": {
          "x": 33.9,
          "y": 138.4
        },
        "HIP9487": {
          "x": 20,
          "y": 156.7
        },
        "HIP7884": {
          "x": 36.3,
          "y": 149.1
        },
        "HIP4906": {
          "x": 64,
          "y": 142.9
        },
        "HIP3786": {
          "x": 73.8,
          "y": 143.8
        },
        "HIP118268": {
          "x": 108,
          "y": 145.5
        },
        "HIP116771": {
          "x": 122.2,
          "y": 148.7
        },
        "HIP115830": {
          "x": 131,
          "y": 146.3
        },
        "HIP114971": {
          "x": 140,
          "y": 155.2
        },
        "HIP115738": {
          "x": 132.7,
          "y": 161.4
        },
        "HIP116928": {
          "x": 121.2,
          "y": 159.9
        }
      }
    }
  },
  "Pup": {
    "id": "Pup",
    "name": "Puppis",
    "nameRu": "Корма",
    "nameLa": "Puppis",
    "stars": [
      "HIP39953",
      "HIP39429",
      "HIP39757",
      "HIP38170",
      "HIP37229",
      "HIP36917",
      "HIP35264",
      "HIP31685",
      "HIP30438",
      "HIP37677",
      "HIP38070"
    ],
    "lines": [
      [
        "HIP39953",
        "HIP39429"
      ],
      [
        "HIP39429",
        "HIP39757"
      ],
      [
        "HIP39757",
        "HIP38170"
      ],
      [
        "HIP38170",
        "HIP37229"
      ],
      [
        "HIP37229",
        "HIP36917"
      ],
      [
        "HIP36917",
        "HIP35264"
      ],
      [
        "HIP35264",
        "HIP31685"
      ],
      [
        "HIP31685",
        "HIP30438"
      ],
      [
        "HIP36917",
        "HIP37677"
      ],
      [
        "HIP37677",
        "HIP38070"
      ],
      [
        "HIP38070",
        "HIP38170"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP39953": {
          "x": 29.4,
          "y": 172.3
        },
        "HIP39429": {
          "x": 32.7,
          "y": 123.7
        },
        "HIP39757": {
          "x": 20,
          "y": 23.2
        },
        "HIP38170": {
          "x": 47.1,
          "y": 25.8
        },
        "HIP37229": {
          "x": 62.5,
          "y": 38.2
        },
        "HIP36917": {
          "x": 67.4,
          "y": 48.3
        },
        "HIP35264": {
          "x": 90.4,
          "y": 104.5
        },
        "HIP31685": {
          "x": 135.3,
          "y": 149.2
        },
        "HIP30438": {
          "x": 140,
          "y": 216.8
        },
        "HIP37677": {
          "x": 55.7,
          "y": 52.1
        },
        "HIP38070": {
          "x": 49.1,
          "y": 32.8
        }
      }
    }
  },
  "Pyx": {
    "id": "Pyx",
    "name": "Pyxis",
    "nameRu": "Компас",
    "nameLa": "Pyxis",
    "stars": [
      "HIP39429",
      "HIP42515",
      "HIP42828",
      "HIP43409"
    ],
    "lines": [
      [
        "HIP39429",
        "HIP42515"
      ],
      [
        "HIP42515",
        "HIP42828"
      ],
      [
        "HIP42828",
        "HIP43409"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP39429": {
          "x": 140,
          "y": 199.2
        },
        "HIP42515": {
          "x": 50.4,
          "y": 136.4
        },
        "HIP42828": {
          "x": 40.9,
          "y": 109.7
        },
        "HIP43409": {
          "x": 20,
          "y": 40.8
        }
      }
    }
  },
  "Ret": {
    "id": "Ret",
    "name": "Reticulum",
    "nameRu": "Сетка",
    "nameLa": "Reticulum",
    "stars": [
      "HIP19780",
      "HIP17440",
      "HIP18597",
      "HIP19921"
    ],
    "lines": [
      [
        "HIP19780",
        "HIP17440"
      ],
      [
        "HIP17440",
        "HIP18597"
      ],
      [
        "HIP18597",
        "HIP19921"
      ],
      [
        "HIP19921",
        "HIP19780"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP19780": {
          "x": 32.6,
          "y": 132.4
        },
        "HIP17440": {
          "x": 140,
          "y": 210.1
        },
        "HIP18597": {
          "x": 92.1,
          "y": 97.1
        },
        "HIP19921": {
          "x": 20,
          "y": 29.9
        }
      }
    }
  },
  "Scl": {
    "id": "Scl",
    "name": "Sculptor",
    "nameRu": "Скульптор",
    "nameLa": "Sculptor",
    "stars": [
      "HIP4577",
      "HIP117452",
      "HIP115102",
      "HIP116231"
    ],
    "lines": [
      [
        "HIP4577",
        "HIP117452"
      ],
      [
        "HIP117452",
        "HIP115102"
      ],
      [
        "HIP115102",
        "HIP116231"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP4577": {
          "x": 20,
          "y": 104.9
        },
        "HIP117452": {
          "x": 105.2,
          "y": 92.9
        },
        "HIP115102": {
          "x": 140,
          "y": 119
        },
        "HIP116231": {
          "x": 121.8,
          "y": 147.1
        }
      }
    }
  },
  "Sco": {
    "id": "Sco",
    "name": "Scorpius",
    "nameRu": "Скорпион",
    "nameLa": "Scorpius",
    "stars": [
      "HIP78820",
      "HIP78401",
      "HIP78265",
      "HIP80112",
      "HIP80763",
      "HIP81266",
      "HIP82396",
      "HIP82514",
      "HIP82729",
      "HIP84143",
      "HIP86228",
      "HIP87073",
      "HIP86670",
      "HIP85696",
      "HIP85927",
      "HIP87261",
      "HIP79374",
      "HIP78104"
    ],
    "lines": [
      [
        "HIP78820",
        "HIP78401"
      ],
      [
        "HIP78401",
        "HIP78265"
      ],
      [
        "HIP78265",
        "HIP78401"
      ],
      [
        "HIP78401",
        "HIP80112"
      ],
      [
        "HIP80112",
        "HIP80763"
      ],
      [
        "HIP80763",
        "HIP81266"
      ],
      [
        "HIP81266",
        "HIP82396"
      ],
      [
        "HIP82396",
        "HIP82514"
      ],
      [
        "HIP82514",
        "HIP82729"
      ],
      [
        "HIP82729",
        "HIP84143"
      ],
      [
        "HIP84143",
        "HIP86228"
      ],
      [
        "HIP86228",
        "HIP87073"
      ],
      [
        "HIP87073",
        "HIP86670"
      ],
      [
        "HIP86670",
        "HIP85696"
      ],
      [
        "HIP85696",
        "HIP85927"
      ],
      [
        "HIP85927",
        "HIP87261"
      ],
      [
        "HIP78820",
        "HIP79374"
      ],
      [
        "HIP78265",
        "HIP78104"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP78820": {
          "x": 135.4,
          "y": 61.2
        },
        "HIP78401": {
          "x": 140,
          "y": 76.6
        },
        "HIP78265": {
          "x": 139.6,
          "y": 95
        },
        "HIP80112": {
          "x": 113.9,
          "y": 90.4
        },
        "HIP80763": {
          "x": 104.2,
          "y": 94.2
        },
        "HIP81266": {
          "x": 96.6,
          "y": 103.1
        },
        "HIP82396": {
          "x": 80.8,
          "y": 133.5
        },
        "HIP82514": {
          "x": 79.1,
          "y": 152.5
        },
        "HIP82729": {
          "x": 76.7,
          "y": 174.6
        },
        "HIP84143": {
          "x": 60.4,
          "y": 179.8
        },
        "HIP86228": {
          "x": 36.6,
          "y": 181.2
        },
        "HIP87073": {
          "x": 24.6,
          "y": 167.9
        },
        "HIP86670": {
          "x": 29,
          "y": 161.4
        },
        "HIP85696": {
          "x": 39.8,
          "y": 151
        },
        "HIP85927": {
          "x": 36.8,
          "y": 150.4
        },
        "HIP87261": {
          "x": 20,
          "y": 152.4
        },
        "HIP79374": {
          "x": 127.4,
          "y": 58.8
        },
        "HIP78104": {
          "x": 139.9,
          "y": 111.2
        }
      }
    }
  },
  "Sct": {
    "id": "Sct",
    "name": "Scutum",
    "nameRu": "Щит",
    "nameLa": "Scutum",
    "stars": [
      "HIP92175",
      "HIP91117",
      "HIP90595",
      "HIP91726"
    ],
    "lines": [
      [
        "HIP92175",
        "HIP91117"
      ],
      [
        "HIP91117",
        "HIP90595"
      ],
      [
        "HIP90595",
        "HIP91726"
      ],
      [
        "HIP91726",
        "HIP92175"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP92175": {
          "x": 35,
          "y": 20
        },
        "HIP91117": {
          "x": 95.6,
          "y": 91.1
        },
        "HIP90595": {
          "x": 125,
          "y": 220
        },
        "HIP91726": {
          "x": 60.1,
          "y": 107.5
        }
      }
    }
  },
  "Ser": {
    "id": "Ser",
    "name": "Serpens",
    "nameRu": "Змея",
    "nameLa": "Serpens",
    "stars": [
      "HIP77233",
      "HIP78072",
      "HIP77450",
      "HIP76852",
      "HIP76276",
      "HIP77070",
      "HIP77622",
      "HIP77516",
      "HIP79593",
      "HIP84012",
      "HIP86263",
      "HIP88048",
      "HIP89962",
      "HIP92946"
    ],
    "lines": [
      [
        "HIP77233",
        "HIP78072"
      ],
      [
        "HIP78072",
        "HIP77450"
      ],
      [
        "HIP77450",
        "HIP76852"
      ],
      [
        "HIP76852",
        "HIP77233"
      ],
      [
        "HIP77233",
        "HIP76276"
      ],
      [
        "HIP76276",
        "HIP77070"
      ],
      [
        "HIP77070",
        "HIP77622"
      ],
      [
        "HIP77622",
        "HIP77516"
      ],
      [
        "HIP77516",
        "HIP79593"
      ],
      [
        "HIP84012",
        "HIP86263"
      ],
      [
        "HIP86263",
        "HIP88048"
      ],
      [
        "HIP88048",
        "HIP89962"
      ],
      [
        "HIP89962",
        "HIP92946"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP77233": {
          "x": 133.4,
          "y": 89.8
        },
        "HIP78072": {
          "x": 127.7,
          "y": 89.6
        },
        "HIP77450": {
          "x": 131.9,
          "y": 83.6
        },
        "HIP76852": {
          "x": 135.9,
          "y": 79.6
        },
        "HIP76276": {
          "x": 140,
          "y": 100.7
        },
        "HIP77070": {
          "x": 134.7,
          "y": 110.1
        },
        "HIP77622": {
          "x": 131.1,
          "y": 114.5
        },
        "HIP77516": {
          "x": 132,
          "y": 132
        },
        "HIP79593": {
          "x": 118.3,
          "y": 132.4
        },
        "HIP84012": {
          "x": 87.4,
          "y": 160.3
        },
        "HIP86263": {
          "x": 71.8,
          "y": 160.4
        },
        "HIP88048": {
          "x": 59,
          "y": 147.4
        },
        "HIP89962": {
          "x": 45,
          "y": 131.4
        },
        "HIP92946": {
          "x": 20,
          "y": 113.3
        }
      }
    }
  },
  "Sex": {
    "id": "Sex",
    "name": "Sextans",
    "nameRu": "Секстант",
    "nameLa": "Sextans",
    "stars": [
      "HIP48437",
      "HIP49641",
      "HIP51437",
      "HIP51362"
    ],
    "lines": [
      [
        "HIP48437",
        "HIP49641"
      ],
      [
        "HIP49641",
        "HIP51437"
      ],
      [
        "HIP51437",
        "HIP51362"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP48437": {
          "x": 140,
          "y": 169.5
        },
        "HIP49641": {
          "x": 91.2,
          "y": 70.5
        },
        "HIP51437": {
          "x": 20,
          "y": 73.9
        },
        "HIP51362": {
          "x": 22.7,
          "y": 100.7
        }
      }
    }
  },
  "Sge": {
    "id": "Sge",
    "name": "Sagitta",
    "nameRu": "Стрела",
    "nameLa": "Sagitta",
    "stars": [
      "HIP98337",
      "HIP97365",
      "HIP96757",
      "HIP96837"
    ],
    "lines": [
      [
        "HIP98337",
        "HIP97365"
      ],
      [
        "HIP97365",
        "HIP96757"
      ],
      [
        "HIP96757",
        "HIP97365"
      ],
      [
        "HIP97365",
        "HIP96837"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP98337": {
          "x": 20,
          "y": 92.3
        },
        "HIP97365": {
          "x": 92.9,
          "y": 119
        },
        "HIP96757": {
          "x": 140,
          "y": 133
        },
        "HIP96837": {
          "x": 134,
          "y": 147.7
        }
      }
    }
  },
  "Sgr": {
    "id": "Sgr",
    "name": "Sagittarius",
    "nameRu": "Стрелец",
    "nameLa": "Sagittarius",
    "stars": [
      "HIP90185",
      "HIP88635",
      "HIP89931",
      "HIP90496",
      "HIP92041",
      "HIP92855",
      "HIP93864",
      "HIP93506",
      "HIP89642",
      "HIP89341",
      "HIP95168",
      "HIP94141",
      "HIP93683",
      "HIP93085"
    ],
    "lines": [
      [
        "HIP90185",
        "HIP88635"
      ],
      [
        "HIP88635",
        "HIP89931"
      ],
      [
        "HIP89931",
        "HIP90185"
      ],
      [
        "HIP90185",
        "HIP89931"
      ],
      [
        "HIP89931",
        "HIP90496"
      ],
      [
        "HIP90496",
        "HIP92041"
      ],
      [
        "HIP92041",
        "HIP89931"
      ],
      [
        "HIP89931",
        "HIP92041"
      ],
      [
        "HIP92041",
        "HIP92855"
      ],
      [
        "HIP92855",
        "HIP93864"
      ],
      [
        "HIP93864",
        "HIP93506"
      ],
      [
        "HIP93506",
        "HIP92041"
      ],
      [
        "HIP92041",
        "HIP93506"
      ],
      [
        "HIP93506",
        "HIP90185"
      ],
      [
        "HIP90185",
        "HIP89642"
      ],
      [
        "HIP90496",
        "HIP89341"
      ],
      [
        "HIP95168",
        "HIP94141"
      ],
      [
        "HIP94141",
        "HIP93683"
      ],
      [
        "HIP93683",
        "HIP93085"
      ],
      [
        "HIP93085",
        "HIP94141"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP90185": {
          "x": 111.3,
          "y": 168.2
        },
        "HIP88635": {
          "x": 140,
          "y": 142.4
        },
        "HIP89931": {
          "x": 117.3,
          "y": 136.7
        },
        "HIP90496": {
          "x": 107.8,
          "y": 105.8
        },
        "HIP92041": {
          "x": 80.3,
          "y": 116.2
        },
        "HIP92855": {
          "x": 65.4,
          "y": 111.6
        },
        "HIP93864": {
          "x": 47.8,
          "y": 121.7
        },
        "HIP93506": {
          "x": 54.9,
          "y": 136.7
        },
        "HIP89642": {
          "x": 119.8,
          "y": 185.6
        },
        "HIP89341": {
          "x": 131.9,
          "y": 76.5
        },
        "HIP95168": {
          "x": 20,
          "y": 54.4
        },
        "HIP94141": {
          "x": 41.1,
          "y": 75.8
        },
        "HIP93683": {
          "x": 49.6,
          "y": 80.5
        },
        "HIP93085": {
          "x": 60.7,
          "y": 75.8
        }
      }
    }
  },
  "Tau": {
    "id": "Tau",
    "name": "Taurus",
    "nameRu": "Телец",
    "nameLa": "Taurus",
    "stars": [
      "HIP26451",
      "HIP21421",
      "HIP20894",
      "HIP20205",
      "HIP20455",
      "HIP20889",
      "HIP25428",
      "HIP16083",
      "HIP18907",
      "HIP15900",
      "HIP16852",
      "HIP18724"
    ],
    "lines": [
      [
        "HIP26451",
        "HIP21421"
      ],
      [
        "HIP21421",
        "HIP20894"
      ],
      [
        "HIP20894",
        "HIP20205"
      ],
      [
        "HIP20205",
        "HIP20455"
      ],
      [
        "HIP20455",
        "HIP20889"
      ],
      [
        "HIP20889",
        "HIP25428"
      ],
      [
        "HIP16083",
        "HIP18907"
      ],
      [
        "HIP15900",
        "HIP16852"
      ],
      [
        "HIP20205",
        "HIP18724"
      ],
      [
        "HIP18724",
        "HIP16083"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP26451": {
          "x": 20,
          "y": 93.2
        },
        "HIP21421": {
          "x": 75.1,
          "y": 114.6
        },
        "HIP20894": {
          "x": 81.5,
          "y": 117.1
        },
        "HIP20205": {
          "x": 89.3,
          "y": 118
        },
        "HIP20455": {
          "x": 86.6,
          "y": 111
        },
        "HIP20889": {
          "x": 81.7,
          "y": 104.9
        },
        "HIP25428": {
          "x": 32.9,
          "y": 65.2
        },
        "HIP16083": {
          "x": 137.6,
          "y": 138.8
        },
        "HIP18907": {
          "x": 104.6,
          "y": 153.5
        },
        "HIP15900": {
          "x": 140,
          "y": 141.3
        },
        "HIP16852": {
          "x": 130.1,
          "y": 174.8
        },
        "HIP18724": {
          "x": 106.4,
          "y": 129.4
        }
      }
    }
  },
  "Tel": {
    "id": "Tel",
    "name": "Telescopium",
    "nameRu": "Телескоп",
    "nameLa": "Telescopium",
    "stars": [
      "HIP89112",
      "HIP90422",
      "HIP90568"
    ],
    "lines": [
      [
        "HIP89112",
        "HIP90422"
      ],
      [
        "HIP90422",
        "HIP90568"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP89112": {
          "x": 140,
          "y": 58.2
        },
        "HIP90422": {
          "x": 30.3,
          "y": 57.7
        },
        "HIP90568": {
          "x": 20,
          "y": 182.3
        }
      }
    }
  },
  "TrA": {
    "id": "TrA",
    "name": "Triangulum Australe",
    "nameRu": "Южный Треугольник",
    "nameLa": "Triangulum Australe",
    "stars": [
      "HIP82273",
      "HIP77952",
      "HIP76440",
      "HIP74946"
    ],
    "lines": [
      [
        "HIP82273",
        "HIP77952"
      ],
      [
        "HIP77952",
        "HIP76440"
      ],
      [
        "HIP76440",
        "HIP74946"
      ],
      [
        "HIP74946",
        "HIP82273"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP82273": {
          "x": 20,
          "y": 165.8
        },
        "HIP77952": {
          "x": 90.7,
          "y": 74.2
        },
        "HIP76440": {
          "x": 118.4,
          "y": 118.2
        },
        "HIP74946": {
          "x": 140,
          "y": 156
        }
      }
    }
  },
  "Tri": {
    "id": "Tri",
    "name": "Triangulum",
    "nameRu": "Треугольник",
    "nameLa": "Triangulum",
    "stars": [
      "HIP8796",
      "HIP10064",
      "HIP10670"
    ],
    "lines": [
      [
        "HIP8796",
        "HIP10064"
      ],
      [
        "HIP10064",
        "HIP10670"
      ],
      [
        "HIP10670",
        "HIP8796"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP8796": {
          "x": 140,
          "y": 182.4
        },
        "HIP10064": {
          "x": 57.7,
          "y": 57.6
        },
        "HIP10670": {
          "x": 20,
          "y": 83.5
        }
      }
    }
  },
  "Tuc": {
    "id": "Tuc",
    "name": "Tucana",
    "nameRu": "Тукан",
    "nameLa": "Tucana",
    "stars": [
      "HIP2484",
      "HIP1599",
      "HIP118322",
      "HIP110838",
      "HIP110130",
      "HIP114996"
    ],
    "lines": [
      [
        "HIP2484",
        "HIP1599"
      ],
      [
        "HIP1599",
        "HIP118322"
      ],
      [
        "HIP118322",
        "HIP110838"
      ],
      [
        "HIP110838",
        "HIP110130"
      ],
      [
        "HIP110130",
        "HIP114996"
      ],
      [
        "HIP114996",
        "HIP2484"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP2484": {
          "x": 20,
          "y": 134
        },
        "HIP1599": {
          "x": 32.8,
          "y": 146.2
        },
        "HIP118322": {
          "x": 49.6,
          "y": 148.7
        },
        "HIP110838": {
          "x": 123.3,
          "y": 148.2
        },
        "HIP110130": {
          "x": 140,
          "y": 115.1
        },
        "HIP114996": {
          "x": 85.2,
          "y": 91.3
        }
      }
    }
  },
  "UMa": {
    "id": "UMa",
    "name": "Ursa Major",
    "nameRu": "Большая Медведица",
    "nameLa": "Ursa Major",
    "stars": [
      "HIP58001",
      "HIP57399",
      "HIP54539",
      "HIP50801",
      "HIP50372",
      "HIP55219",
      "HIP55203",
      "HIP59774",
      "HIP54061",
      "HIP53910",
      "HIP62956",
      "HIP65378",
      "HIP67301",
      "HIP46733",
      "HIP48319",
      "HIP41704",
      "HIP46853",
      "HIP44471",
      "HIP44127"
    ],
    "lines": [
      [
        "HIP58001",
        "HIP57399"
      ],
      [
        "HIP57399",
        "HIP54539"
      ],
      [
        "HIP54539",
        "HIP50801"
      ],
      [
        "HIP50801",
        "HIP50372"
      ],
      [
        "HIP50372",
        "HIP50801"
      ],
      [
        "HIP50801",
        "HIP54539"
      ],
      [
        "HIP54539",
        "HIP57399"
      ],
      [
        "HIP57399",
        "HIP55219"
      ],
      [
        "HIP55219",
        "HIP55203"
      ],
      [
        "HIP59774",
        "HIP54061"
      ],
      [
        "HIP54061",
        "HIP53910"
      ],
      [
        "HIP53910",
        "HIP58001"
      ],
      [
        "HIP58001",
        "HIP59774"
      ],
      [
        "HIP59774",
        "HIP62956"
      ],
      [
        "HIP62956",
        "HIP65378"
      ],
      [
        "HIP65378",
        "HIP67301"
      ],
      [
        "HIP54061",
        "HIP46733"
      ],
      [
        "HIP46733",
        "HIP48319"
      ],
      [
        "HIP48319",
        "HIP46733"
      ],
      [
        "HIP46733",
        "HIP41704"
      ],
      [
        "HIP41704",
        "HIP48319"
      ],
      [
        "HIP48319",
        "HIP53910"
      ],
      [
        "HIP53910",
        "HIP48319"
      ],
      [
        "HIP48319",
        "HIP46853"
      ],
      [
        "HIP46853",
        "HIP44471"
      ],
      [
        "HIP44471",
        "HIP44127"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP58001": {
          "x": 69.4,
          "y": 104.7
        },
        "HIP57399": {
          "x": 69.8,
          "y": 119.9
        },
        "HIP54539": {
          "x": 84.8,
          "y": 129.7
        },
        "HIP50801": {
          "x": 106.9,
          "y": 136.5
        },
        "HIP50372": {
          "x": 108.9,
          "y": 132.6
        },
        "HIP55219": {
          "x": 78.6,
          "y": 159.6
        },
        "HIP55203": {
          "x": 78.5,
          "y": 164
        },
        "HIP59774": {
          "x": 63.7,
          "y": 94.6
        },
        "HIP54061": {
          "x": 88.3,
          "y": 86.5
        },
        "HIP53910": {
          "x": 88.7,
          "y": 100
        },
        "HIP62956": {
          "x": 49.5,
          "y": 92.4
        },
        "HIP65378": {
          "x": 37.7,
          "y": 89.5
        },
        "HIP67301": {
          "x": 20,
          "y": 97
        },
        "HIP46733": {
          "x": 114.7,
          "y": 78.9
        },
        "HIP48319": {
          "x": 111.6,
          "y": 90.7
        },
        "HIP41704": {
          "x": 135,
          "y": 76
        },
        "HIP46853": {
          "x": 122.9,
          "y": 107
        },
        "HIP44471": {
          "x": 139,
          "y": 113.9
        },
        "HIP44127": {
          "x": 140,
          "y": 111
        }
      }
    }
  },
  "UMi": {
    "id": "UMi",
    "name": "Ursa Minor",
    "nameRu": "Малая Медведица",
    "nameLa": "Ursa Minor",
    "stars": [
      "HIP11767",
      "HIP85822",
      "HIP82080",
      "HIP77055",
      "HIP79822",
      "HIP75097",
      "HIP72607"
    ],
    "lines": [
      [
        "HIP11767",
        "HIP85822"
      ],
      [
        "HIP85822",
        "HIP82080"
      ],
      [
        "HIP82080",
        "HIP77055"
      ],
      [
        "HIP77055",
        "HIP79822"
      ],
      [
        "HIP79822",
        "HIP75097"
      ],
      [
        "HIP75097",
        "HIP72607"
      ],
      [
        "HIP72607",
        "HIP77055"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP11767": {
          "x": 68.6,
          "y": 20
        },
        "HIP85822": {
          "x": 54.8,
          "y": 60.6
        },
        "HIP82080": {
          "x": 49.3,
          "y": 109.9
        },
        "HIP77055": {
          "x": 72.1,
          "y": 157.6
        },
        "HIP79822": {
          "x": 50.5,
          "y": 177.8
        },
        "HIP75097": {
          "x": 91.9,
          "y": 220
        },
        "HIP72607": {
          "x": 110.7,
          "y": 191.6
        }
      }
    }
  },
  "Vel": {
    "id": "Vel",
    "name": "Vela",
    "nameRu": "Паруса",
    "nameLa": "Vela",
    "stars": [
      "HIP42913",
      "HIP39953",
      "HIP44816",
      "HIP46651",
      "HIP50191",
      "HIP52727",
      "HIP48774",
      "HIP45941"
    ],
    "lines": [
      [
        "HIP42913",
        "HIP39953"
      ],
      [
        "HIP39953",
        "HIP44816"
      ],
      [
        "HIP44816",
        "HIP46651"
      ],
      [
        "HIP46651",
        "HIP50191"
      ],
      [
        "HIP50191",
        "HIP52727"
      ],
      [
        "HIP52727",
        "HIP48774"
      ],
      [
        "HIP48774",
        "HIP45941"
      ],
      [
        "HIP45941",
        "HIP42913"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP42913": {
          "x": 107.4,
          "y": 153.9
        },
        "HIP39953": {
          "x": 140,
          "y": 125.9
        },
        "HIP44816": {
          "x": 95.6,
          "y": 100.4
        },
        "HIP46651": {
          "x": 76.6,
          "y": 86.1
        },
        "HIP50191": {
          "x": 39,
          "y": 96.4
        },
        "HIP52727": {
          "x": 20,
          "y": 134.7
        },
        "HIP48774": {
          "x": 59.5,
          "y": 151.7
        },
        "HIP45941": {
          "x": 82.5,
          "y": 153
        }
      }
    }
  },
  "Vir": {
    "id": "Vir",
    "name": "Virgo",
    "nameRu": "Дева",
    "nameLa": "Virgo",
    "stars": [
      "HIP60129",
      "HIP58948",
      "HIP57380",
      "HIP57757",
      "HIP61941",
      "HIP63090",
      "HIP63608",
      "HIP64238",
      "HIP65474",
      "HIP66249",
      "HIP68520",
      "HIP72220",
      "HIP69701",
      "HIP71957"
    ],
    "lines": [
      [
        "HIP60129",
        "HIP58948"
      ],
      [
        "HIP58948",
        "HIP57380"
      ],
      [
        "HIP57380",
        "HIP57757"
      ],
      [
        "HIP57757",
        "HIP60129"
      ],
      [
        "HIP60129",
        "HIP61941"
      ],
      [
        "HIP61941",
        "HIP63090"
      ],
      [
        "HIP63090",
        "HIP63608"
      ],
      [
        "HIP63608",
        "HIP63090"
      ],
      [
        "HIP63090",
        "HIP61941"
      ],
      [
        "HIP61941",
        "HIP64238"
      ],
      [
        "HIP64238",
        "HIP65474"
      ],
      [
        "HIP65474",
        "HIP64238"
      ],
      [
        "HIP64238",
        "HIP61941"
      ],
      [
        "HIP61941",
        "HIP66249"
      ],
      [
        "HIP66249",
        "HIP68520"
      ],
      [
        "HIP68520",
        "HIP72220"
      ],
      [
        "HIP72220",
        "HIP68520"
      ],
      [
        "HIP68520",
        "HIP66249"
      ],
      [
        "HIP66249",
        "HIP69701"
      ],
      [
        "HIP69701",
        "HIP71957"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP60129": {
          "x": 116.5,
          "y": 121.4
        },
        "HIP58948": {
          "x": 126.4,
          "y": 96.6
        },
        "HIP57380": {
          "x": 140,
          "y": 101.9
        },
        "HIP57757": {
          "x": 136.5,
          "y": 115
        },
        "HIP61941": {
          "x": 102.3,
          "y": 123.4
        },
        "HIP63090": {
          "x": 93.4,
          "y": 111.1
        },
        "HIP63608": {
          "x": 89.3,
          "y": 91.7
        },
        "HIP64238": {
          "x": 84.4,
          "y": 133.7
        },
        "HIP65474": {
          "x": 74.8,
          "y": 148.3
        },
        "HIP66249": {
          "x": 68.7,
          "y": 121.2
        },
        "HIP68520": {
          "x": 51.3,
          "y": 115.7
        },
        "HIP72220": {
          "x": 20,
          "y": 114.5
        },
        "HIP69701": {
          "x": 41.6,
          "y": 135.5
        },
        "HIP71957": {
          "x": 22.3,
          "y": 135.2
        }
      }
    }
  },
  "Vol": {
    "id": "Vol",
    "name": "Volans",
    "nameRu": "Летучая Рыба",
    "nameLa": "Volans",
    "stars": [
      "HIP44382",
      "HIP41312",
      "HIP39794",
      "HIP35228",
      "HIP34481"
    ],
    "lines": [
      [
        "HIP44382",
        "HIP41312"
      ],
      [
        "HIP41312",
        "HIP39794"
      ],
      [
        "HIP39794",
        "HIP35228"
      ],
      [
        "HIP35228",
        "HIP34481"
      ],
      [
        "HIP34481",
        "HIP39794"
      ],
      [
        "HIP39794",
        "HIP44382"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP44382": {
          "x": 20,
          "y": 102.6
        },
        "HIP41312": {
          "x": 61.6,
          "y": 92.6
        },
        "HIP39794": {
          "x": 83,
          "y": 120
        },
        "HIP35228": {
          "x": 137.8,
          "y": 116.9
        },
        "HIP34481": {
          "x": 140,
          "y": 147.4
        }
      }
    }
  },
  "Vul": {
    "id": "Vul",
    "name": "Vulpecula",
    "nameRu": "Лисичка",
    "nameLa": "Vulpecula",
    "stars": [
      "HIP95771",
      "HIP97886"
    ],
    "lines": [
      [
        "HIP95771",
        "HIP97886"
      ]
    ],
    "display": {
      "width": 160,
      "height": 240,
      "stars": {
        "HIP95771": {
          "x": 140,
          "y": 113.8
        },
        "HIP97886": {
          "x": 20,
          "y": 126.2
        }
      }
    }
  }
};
  const STAR_REWARD_POOL = [
  "HIP32349",
  "HIP30438",
  "HIP69673",
  "HIP71683",
  "HIP91262",
  "HIP24608",
  "HIP24436",
  "HIP37279",
  "HIP7588",
  "HIP97649",
  "HIP60718",
  "HIP21421",
  "HIP65474",
  "HIP80763",
  "HIP37826",
  "HIP113368",
  "HIP102098",
  "HIP49669",
  "HIP109268",
  "HIP39953",
  "HIP62956",
  "HIP15863",
  "HIP90185",
  "HIP82273",
  "HIP100751",
  "HIP11767",
  "HIP46390",
  "HIP9884",
  "HIP3419",
  "HIP5447",
  "HIP677",
  "HIP86032",
  "HIP4427",
  "HIP39429",
  "HIP76267",
  "HIP87833",
  "HIP71860",
  "HIP2081",
  "HIP84012",
  "HIP105199",
  "HIP59803",
  "HIP25985",
  "HIP74785",
  "HIP26634",
  "HIP61585",
  "HIP80816",
  "HIP2021",
  "HIP85258",
  "HIP107556",
  "HIP110130",
  "HIP63125",
  "HIP106278",
  "HIP10064",
  "HIP101772",
  "HIP45860",
  "HIP71908",
  "HIP32607",
  "HIP21281",
  "HIP19780",
  "HIP90422",
  "HIP98337",
  "HIP40526",
  "HIP55282",
  "HIP7097",
  "HIP101769",
  "HIP107089",
  "HIP111169",
  "HIP30867",
  "HIP41312",
  "HIP53229",
  "HIP14879",
  "HIP72370",
  "HIP19747",
  "HIP91117",
  "HIP104987",
  "HIP80000",
  "HIP23522",
  "HIP40702",
  "HIP94160",
  "HIP64394",
  "HIP51172",
  "HIP4577",
  "HIP21770",
  "HIP95771",
  "HIP49641",
  "HIP102831",
  "HIP29271",
  "HIP33579",
  "HIP45238",
  "HIP72105",
  "HIP68702",
  "HIP93194",
  "HIP25428",
  "HIP27989",
  "HIP36188",
  "HIP23875",
  "HIP97278",
  "HIP62434",
  "HIP61941",
  "HIP85927",
  "HIP36850",
  "HIP111954",
  "HIP100453",
  "HIP50583",
  "HIP112122",
  "HIP42913",
  "HIP54061",
  "HIP14576",
  "HIP92855",
  "HIP77952",
  "HIP102395",
  "HIP72607",
  "HIP64962",
  "HIP8903",
  "HIP14135",
  "HIP107315",
  "HIP3179",
  "HIP42828",
  "HIP75695",
  "HIP80331",
  "HIP73273",
  "HIP5165",
  "HIP77070",
  "HIP116727",
  "HIP61359",
  "HIP25606",
  "HIP72622",
  "HIP27628",
  "HIP62322",
  "HIP84345",
  "HIP9236",
  "HIP85792",
  "HIP100345",
  "HIP114996",
  "HIP61317",
  "HIP109074",
  "HIP8796",
  "HIP103227",
  "HIP45688",
  "HIP74824",
  "HIP27321",
  "HIP26069",
  "HIP17440",
  "HIP90568",
  "HIP97365",
  "HIP42911",
  "HIP55705",
  "HIP114971",
  "HIP101958",
  "HIP112405",
  "HIP109937",
  "HIP37447",
  "HIP34481",
  "HIP51233",
  "HIP13147",
  "HIP81065",
  "HIP13884",
  "HIP92175",
  "HIP104858",
  "HIP80582",
  "HIP16228",
  "HIP51839",
  "HIP94114",
  "HIP64241",
  "HIP46515",
  "HIP116231",
  "HIP23595",
  "HIP97886",
  "HIP48437",
  "HIP102989",
  "HIP23467",
  "HIP34444",
  "HIP67927",
  "HIP68933",
  "HIP92420",
  "HIP28360",
  "HIP25336",
  "HIP13847",
  "HIP93747",
  "HIP61084",
  "HIP26451",
  "HIP63608",
  "HIP86228",
  "HIP31681",
  "HIP113246",
  "HIP102488",
  "HIP57632",
  "HIP108085",
  "HIP44816",
  "HIP67301",
  "HIP18246",
  "HIP93506",
  "HIP74946",
  "HIP99240",
  "HIP75097",
  "HIP43813",
  "HIP13209",
  "HIP5364",
  "HIP9640",
  "HIP113881",
  "HIP81377",
  "HIP746",
  "HIP42515",
  "HIP76952",
  "HIP85670",
  "HIP76297",
  "HIP6867",
  "HIP79593",
  "HIP106032",
  "HIP60965",
  "HIP23685",
  "HIP73714",
  "HIP30277",
  "HIP63613",
  "HIP81693",
  "HIP17678",
  "HIP83081",
  "HIP100064",
  "HIP1599",
  "HIP113136",
  "HIP10670",
  "HIP105319",
  "HIP44248",
  "HIP75323",
  "HIP27530",
  "HIP19893",
  "HIP19921",
  "HIP89112",
  "HIP96757",
  "HIP43103",
  "HIP53740",
  "HIP9487",
  "HIP101421",
  "HIP70638",
  "HIP111022",
  "HIP29651",
  "HIP35228",
  "HIP49593",
  "HIP9677",
  "HIP81852",
  "HIP14240",
  "HIP90595",
  "HIP104521",
  "HIP78639",
  "HIP22783",
  "HIP60000",
  "HIP93825",
  "HIP60742",
  "HIP53502",
  "HIP115102",
  "HIP21861",
  "HIP51437",
  "HIP30324",
  "HIP41037",
  "HIP35264",
  "HIP71075",
  "HIP61932",
  "HIP92791",
  "HIP28380",
  "HIP26311",
  "HIP18543",
  "HIP99473",
  "HIP59747",
  "HIP20894",
  "HIP66249",
  "HIP78401",
  "HIP30343",
  "HIP111188",
  "HIP97165",
  "HIP54872",
  "HIP112623",
  "HIP45941",
  "HIP65378",
  "HIP18532",
  "HIP89931",
  "HIP76440",
  "HIP86929",
  "HIP82080",
  "HIP52943",
  "HIP8832",
  "HIP12706",
  "HIP3092",
  "HIP113963",
  "HIP6686",
  "HIP43409",
  "HIP76127",
  "HIP94376",
  "HIP75141",
  "HIP765",
  "HIP89962",
  "HIP109492",
  "HIP59316",
  "HIP24305",
  "HIP76470",
  "HIP25859",
  "HIP57363",
  "HIP84379",
  "HIP11001",
  "HIP85267",
  "HIP106985",
  "HIP2484",
  "HIP110960",
  "HIP108431",
  "HIP41075",
  "HIP27100",
  "HIP18597",
  "HIP96837",
  "HIP44066",
  "HIP54682",
  "HIP118268",
  "HIP102532",
  "HIP110538",
  "HIP34769",
  "HIP44382",
  "HIP46952",
  "HIP80047",
  "HIP12484",
  "HIP91726",
  "HIP78914",
  "HIP17884",
  "HIP52633",
  "HIP94005",
  "HIP117452",
  "HIP21060",
  "HIP51362",
  "HIP35904",
  "HIP39757",
  "HIP74666",
  "HIP66657",
  "HIP91971",
  "HIP23015",
  "HIP26727",
  "HIP17378",
  "HIP95501",
  "HIP18724",
  "HIP63090",
  "HIP82396",
  "HIP32246",
  "HIP107380",
  "HIP95947",
  "HIP47908",
  "HIP110997",
  "HIP52727",
  "HIP53910",
  "HIP14328",
  "HIP90496",
  "HIP98495",
  "HIP77055",
  "HIP68895",
  "HIP8102",
  "HIP7607",
  "HIP1067",
  "HIP86742",
  "HIP8886",
  "HIP78159",
  "HIP83895",
  "HIP75264",
  "HIP7083",
  "HIP88048",
  "HIP102422",
  "HIP59199",
  "HIP27288",
  "HIP76600",
  "HIP28328",
  "HIP61199",
  "HIP84380",
  "HIP85727",
  "HIP105881",
  "HIP118322",
  "HIP114341",
  "HIP102333",
  "HIP33449",
  "HIP27890",
  "HIP42806",
  "HIP56633",
  "HIP116771",
  "HIP102281",
  "HIP109754",
  "HIP39863",
  "HIP39794",
  "HIP51056",
  "HIP12225",
  "HIP23040",
  "HIP58484",
  "HIP90982",
  "HIP33152",
  "HIP45556",
  "HIP31685",
  "HIP73555",
  "HIP71352",
  "HIP91919",
  "HIP23416",
  "HIP27366",
  "HIP20042",
  "HIP93805",
  "HIP20889",
  "HIP57757",
  "HIP86670",
  "HIP29655",
  "HIP112948",
  "HIP104732",
  "HIP54879",
  "HIP113638",
  "HIP48774",
  "HIP58001",
  "HIP17358",
  "HIP94141",
  "HIP91792",
  "HIP85822",
  "HIP43109",
  "HIP1562",
  "HIP113726",
  "HIP112158",
  "HIP83000",
  "HIP77512",
  "HIP75458",
  "HIP74395",
  "HIP5348",
  "HIP77516",
  "HIP112724",
  "HIP27072",
  "HIP76333",
  "HIP28199",
  "HIP59929",
  "HIP86974",
  "HIP88714",
  "HIP104139",
  "HIP110838",
  "HIP112961",
  "HIP30060",
  "HIP23693",
  "HIP57283",
  "HIP8198",
  "HIP111944",
  "HIP30419",
  "HIP12653",
  "HIP33694",
  "HIP31592",
  "HIP52419",
  "HIP38170",
  "HIP71053",
  "HIP68002",
  "HIP23767",
  "HIP25930",
  "HIP9007",
  "HIP98036",
  "HIP15900",
  "HIP72220",
  "HIP78820",
  "HIP32362",
  "HIP109285",
  "HIP95853",
  "HIP50335",
  "HIP109111",
  "HIP46651",
  "HIP54539",
  "HIP14354",
  "HIP88635",
  "HIP105858",
  "HIP79822",
  "HIP56343",
  "HIP6537",
  "HIP116584",
  "HIP112029",
  "HIP79882",
  "HIP78493",
  "HIP89937",
  "HIP78384",
  "HIP86263",
  "HIP110991",
  "HIP28103",
  "HIP81833",
  "HIP82363",
  "HIP102978",
  "HIP102618",
  "HIP44700",
  "HIP55687",
  "HIP115830",
  "HIP111104",
  "HIP31216",
  "HIP17959",
  "HIP33160",
  "HIP50099",
  "HIP37229",
  "HIP71795",
  "HIP59196",
  "HIP23453",
  "HIP22449",
  "HIP15474",
  "HIP97804",
  "HIP20205",
  "HIP71957",
  "HIP85696",
  "HIP35550",
  "HIP107608",
  "HIP94779",
  "HIP49583",
  "HIP50191",
  "HIP50801",
  "HIP13268",
  "HIP89642",
  "HIP92609",
  "HIP49841",
  "HIP8645",
  "HIP4436",
  "HIP112748",
  "HIP84970",
  "HIP68756",
  "HIP75177",
  "HIP77233",
  "HIP109857",
  "HIP27654",
  "HIP87933",
  "HIP83153",
  "HIP102485",
  "HIP110395",
  "HIP36145",
  "HIP58188",
  "HIP4906",
  "HIP110351",
  "HIP32578",
  "HIP29997",
  "HIP34045",
  "HIP51576",
  "HIP37677",
  "HIP70497",
  "HIP65109",
  "HIP28358",
  "HIP25281",
  "HIP16537",
  "HIP93244",
  "HIP16083",
  "HIP60129",
  "HIP81266",
  "HIP37740",
  "HIP103413",
  "HIP48455",
  "HIP44127",
  "HIP14668",
  "HIP92041",
  "HIP88866",
  "HIP51069",
  "HIP12387",
  "HIP3693",
  "HIP109427",
  "HIP87585",
  "HIP77634",
  "HIP77622",
  "HIP101093",
  "HIP24845",
  "HIP80170",
  "HIP106723",
  "HIP115438",
  "HIP3786",
  "HIP110609",
  "HIP31978",
  "HIP33347",
  "HIP50371",
  "HIP38070",
  "HIP69732",
  "HIP73334",
  "HIP26207",
  "HIP21393",
  "HIP93429",
  "HIP20455",
  "HIP57380",
  "HIP78265",
  "HIP35350",
  "HIP99848",
  "HIP55642",
  "HIP46853",
  "HIP17448",
  "HIP93864",
  "HIP90098",
  "HIP45336",
  "HIP12828",
  "HIP116805",
  "HIP109176",
  "HIP87108",
  "HIP56211",
  "HIP76276",
  "HIP107259",
  "HIP24327",
  "HIP86414",
  "HIP111497",
  "HIP7884",
  "HIP38827",
  "HIP36917",
  "HIP67275",
  "HIP67464",
  "HIP22549",
  "HIP13701",
  "HIP96468",
  "HIP18907",
  "HIP69701",
  "HIP80112",
  "HIP33018",
  "HIP55434",
  "HIP59774",
  "HIP13531",
  "HIP93085",
  "HIP93015",
  "HIP47431",
  "HIP11484",
  "HIP5434",
  "HIP112440",
  "HIP80883",
  "HIP97433",
  "HIP78072",
  "HIP28910",
  "HIP88794",
  "HIP112716",
  "HIP116928",
  "HIP53253",
  "HIP69483",
  "HIP68245",
  "HIP22797",
  "HIP21444",
  "HIP16852",
  "HIP58948",
  "HIP87073",
  "HIP36046",
  "HIP46750",
  "HIP41704",
  "HIP19343",
  "HIP93683",
  "HIP13954",
  "HIP116631",
  "HIP107354",
  "HIP80569",
  "HIP61281",
  "HIP77450",
  "HIP87808",
  "HIP110003",
  "HIP5586",
  "HIP54463",
  "HIP68282",
  "HIP22957",
  "HIP20535",
  "HIP68520",
  "HIP82514",
  "HIP34088",
  "HIP46146",
  "HIP50372",
  "HIP18614",
  "HIP89341",
  "HIP48356",
  "HIP10826",
  "HIP2912",
  "HIP109410",
  "HIP85423",
  "HIP78527",
  "HIP76852",
  "HIP79992",
  "HIP114724",
  "HIP5742",
  "HIP54751",
  "HIP55425",
  "HIP28614",
  "HIP22109",
  "HIP64238",
  "HIP87261",
  "HIP36962",
  "HIP55219",
  "HIP8068",
  "HIP95168",
  "HIP42313",
  "HIP3031",
  "HIP80894",
  "HIP89908",
  "HIP92946",
  "HIP83207",
  "HIP109139",
  "HIP6193",
  "HIP54301",
  "HIP65936",
  "HIP22509",
  "HIP19587",
  "HIP84143",
  "HIP30883",
  "HIP44471",
  "HIP14632",
  "HIP57936",
  "HIP4463",
  "HIP80343",
  "HIP85829",
  "HIP85112",
  "HIP115033",
  "HIP115738",
  "HIP60823",
  "HIP27913",
  "HIP14146",
  "HIP82729",
  "HIP28734",
  "HIP46733",
  "HIP12777",
  "HIP42799",
  "HIP3881",
  "HIP80473",
  "HIP81126",
  "HIP110672",
  "HIP59449",
  "HIP29038",
  "HIP12486",
  "HIP78104",
  "HIP34693",
  "HIP57399",
  "HIP19812",
  "HIP43234",
  "HIP80628",
  "HIP79101",
  "HIP70090",
  "HIP29426",
  "HIP17874",
  "HIP79374",
  "HIP48319",
  "HIP19167",
  "HIP72571",
  "HIP85693",
  "HIP68862",
  "HIP23123",
  "HIP17651",
  "HIP55203",
  "HIP20070",
  "HIP42402",
  "HIP80463",
  "HIP61789",
  "HIP22845",
  "HIP11407",
  "HIP77760",
  "HIP56243",
  "HIP28716",
  "HIP12770",
  "HIP49402",
  "HIP81008",
  "HIP23607",
  "HIP15510",
  "HIP16611",
  "HIP17593",
  "HIP12843",
  "HIP21248",
  "HIP16870",
  "HIP18673",
  "HIP18216",
  "HIP12413"
];

  Object.assign(window, { STAR_DATA, CONSTELLATION_DATA, STAR_REWARD_POOL });
})();

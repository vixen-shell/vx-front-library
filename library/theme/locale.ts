import 'dayjs/locale'

export const dayjsLocaleImporters: Record<string, () => Promise<any>> = {
    af: () => import('dayjs/locale/af'),
    am: () => import('dayjs/locale/am'),
    'ar-dz': () => import('dayjs/locale/ar-dz'),
    'ar-iq': () => import('dayjs/locale/ar-iq'),
    'ar-kw': () => import('dayjs/locale/ar-kw'),
    'ar-ly': () => import('dayjs/locale/ar-ly'),
    'ar-ma': () => import('dayjs/locale/ar-ma'),
    'ar-sa': () => import('dayjs/locale/ar-sa'),
    'ar-tn': () => import('dayjs/locale/ar-tn'),
    ar: () => import('dayjs/locale/ar'),
    az: () => import('dayjs/locale/az'),
    be: () => import('dayjs/locale/be'),
    bg: () => import('dayjs/locale/bg'),
    bi: () => import('dayjs/locale/bi'),
    bm: () => import('dayjs/locale/bm'),
    'bn-bd': () => import('dayjs/locale/bn-bd'),
    bn: () => import('dayjs/locale/bn'),
    bo: () => import('dayjs/locale/bo'),
    br: () => import('dayjs/locale/br'),
    bs: () => import('dayjs/locale/bs'),
    ca: () => import('dayjs/locale/ca'),
    cs: () => import('dayjs/locale/cs'),
    cv: () => import('dayjs/locale/cv'),
    cy: () => import('dayjs/locale/cy'),
    'de-at': () => import('dayjs/locale/de-at'),
    da: () => import('dayjs/locale/da'),
    'de-ch': () => import('dayjs/locale/de-ch'),
    de: () => import('dayjs/locale/de'),
    dv: () => import('dayjs/locale/dv'),
    el: () => import('dayjs/locale/el'),
    'en-au': () => import('dayjs/locale/en-au'),
    'en-ca': () => import('dayjs/locale/en-ca'),
    'en-gb': () => import('dayjs/locale/en-gb'),
    'en-ie': () => import('dayjs/locale/en-ie'),
    'en-il': () => import('dayjs/locale/en-il'),
    'en-in': () => import('dayjs/locale/en-in'),
    'en-nz': () => import('dayjs/locale/en-nz'),
    'en-sg': () => import('dayjs/locale/en-sg'),
    'en-tt': () => import('dayjs/locale/en-tt'),
    eo: () => import('dayjs/locale/eo'),
    en: () => import('dayjs/locale/en'),
    'es-do': () => import('dayjs/locale/es-do'),
    'es-mx': () => import('dayjs/locale/es-mx'),
    'es-pr': () => import('dayjs/locale/es-pr'),
    'es-us': () => import('dayjs/locale/es-us'),
    et: () => import('dayjs/locale/et'),
    es: () => import('dayjs/locale/es'),
    eu: () => import('dayjs/locale/eu'),
    fa: () => import('dayjs/locale/fa'),
    fo: () => import('dayjs/locale/fo'),
    fi: () => import('dayjs/locale/fi'),
    'fr-ca': () => import('dayjs/locale/fr-ca'),
    'fr-ch': () => import('dayjs/locale/fr-ch'),
    fr: () => import('dayjs/locale/fr'),
    fy: () => import('dayjs/locale/fy'),
    ga: () => import('dayjs/locale/ga'),
    gd: () => import('dayjs/locale/gd'),
    'gom-latn': () => import('dayjs/locale/gom-latn'),
    gl: () => import('dayjs/locale/gl'),
    gu: () => import('dayjs/locale/gu'),
    he: () => import('dayjs/locale/he'),
    hi: () => import('dayjs/locale/hi'),
    hr: () => import('dayjs/locale/hr'),
    hu: () => import('dayjs/locale/hu'),
    ht: () => import('dayjs/locale/ht'),
    'hy-am': () => import('dayjs/locale/hy-am'),
    id: () => import('dayjs/locale/id'),
    is: () => import('dayjs/locale/is'),
    'it-ch': () => import('dayjs/locale/it-ch'),
    it: () => import('dayjs/locale/it'),
    ja: () => import('dayjs/locale/ja'),
    jv: () => import('dayjs/locale/jv'),
    ka: () => import('dayjs/locale/ka'),
    kk: () => import('dayjs/locale/kk'),
    km: () => import('dayjs/locale/km'),
    kn: () => import('dayjs/locale/kn'),
    ko: () => import('dayjs/locale/ko'),
    ku: () => import('dayjs/locale/ku'),
    ky: () => import('dayjs/locale/ky'),
    lb: () => import('dayjs/locale/lb'),
    lo: () => import('dayjs/locale/lo'),
    lt: () => import('dayjs/locale/lt'),
    lv: () => import('dayjs/locale/lv'),
    me: () => import('dayjs/locale/me'),
    mi: () => import('dayjs/locale/mi'),
    mk: () => import('dayjs/locale/mk'),
    ml: () => import('dayjs/locale/ml'),
    mn: () => import('dayjs/locale/mn'),
    mr: () => import('dayjs/locale/mr'),
    'ms-my': () => import('dayjs/locale/ms-my'),
    ms: () => import('dayjs/locale/ms'),
    mt: () => import('dayjs/locale/mt'),
    my: () => import('dayjs/locale/my'),
    nb: () => import('dayjs/locale/nb'),
    ne: () => import('dayjs/locale/ne'),
    'nl-be': () => import('dayjs/locale/nl-be'),
    nl: () => import('dayjs/locale/nl'),
    pl: () => import('dayjs/locale/pl'),
    'pt-br': () => import('dayjs/locale/pt-br'),
    pt: () => import('dayjs/locale/pt'),
    rn: () => import('dayjs/locale/rn'),
    ro: () => import('dayjs/locale/ro'),
    ru: () => import('dayjs/locale/ru'),
    rw: () => import('dayjs/locale/rw'),
    sd: () => import('dayjs/locale/sd'),
    se: () => import('dayjs/locale/se'),
    si: () => import('dayjs/locale/si'),
    sk: () => import('dayjs/locale/sk'),
    sl: () => import('dayjs/locale/sl'),
    sq: () => import('dayjs/locale/sq'),
    'sr-cyrl': () => import('dayjs/locale/sr-cyrl'),
    ss: () => import('dayjs/locale/ss'),
    'sv-fi': () => import('dayjs/locale/sv-fi'),
    sr: () => import('dayjs/locale/sr'),
    sv: () => import('dayjs/locale/sv'),
    sw: () => import('dayjs/locale/sw'),
    ta: () => import('dayjs/locale/ta'),
    te: () => import('dayjs/locale/te'),
    tet: () => import('dayjs/locale/tet'),
    tg: () => import('dayjs/locale/tg'),
    th: () => import('dayjs/locale/th'),
    tk: () => import('dayjs/locale/tk'),
    'tl-ph': () => import('dayjs/locale/tl-ph'),
    tlh: () => import('dayjs/locale/tlh'),
    tr: () => import('dayjs/locale/tr'),
    tzl: () => import('dayjs/locale/tzl'),
    'tzm-latn': () => import('dayjs/locale/tzm-latn'),
    tzm: () => import('dayjs/locale/tzm'),
    'ug-cn': () => import('dayjs/locale/ug-cn'),
    uk: () => import('dayjs/locale/uk'),
    ur: () => import('dayjs/locale/ur'),
    'uz-latn': () => import('dayjs/locale/uz-latn'),
    uz: () => import('dayjs/locale/uz'),
    vi: () => import('dayjs/locale/vi'),
    'x-pseudo': () => import('dayjs/locale/x-pseudo'),
    yo: () => import('dayjs/locale/yo'),
    zh: () => import('dayjs/locale/zh'),
    'zh-cn': () => import('dayjs/locale/zh-cn'),
    'zh-hk': () => import('dayjs/locale/zh-hk'),
    'zh-tw': () => import('dayjs/locale/zh-tw'),
}

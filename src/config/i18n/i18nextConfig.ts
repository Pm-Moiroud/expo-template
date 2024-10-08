import type { InitOptions } from 'i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { LangCode } from './utils'

import authEn from '~config/i18n/locales/en/auth.json'
import commonEn from '~config/i18n/locales/en/common.json'
import authFr from '~config/i18n/locales/fr/auth.json'
import commonFr from '~config/i18n/locales/fr/common.json'

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
  },
  fr: {
    common: commonFr,
    auth: authFr,
  },
} as const

i18n.use(initReactI18next).init<InitOptions>({
  debug: false,
  resources,
  ns: ['common', 'auth'],
  supportedLngs: [LangCode.en, LangCode.fr],
  cache: {
    enabled: true,
  },
  defaultNS: 'auth',
  lng: LangCode.fr,
  fallbackLng: LangCode.fr,
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
})

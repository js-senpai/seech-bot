import I18n from 'telegraf-i18n'

function initLocalesEngine(path, defaultLanguage = 'ua') {
	return new I18n({
		directory: path,
		defaultLanguage: defaultLanguage,
		defaultLanguageOnMissing: true
	})
}

export { initLocalesEngine }

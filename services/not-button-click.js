function notButtonClick(texts, text, button) {
	return text !== texts.t(`buttons.${button}`)
}

export { notButtonClick }

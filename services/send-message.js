function sendMessage(text, extra = {},disableWebPreview = true,type = 'message') {
	return this.telegram.sendMessage(
		extra.userId || this.chat.id,
		text,
		Object.assign(extra, {
			parse_mode: 'HTML',
			disable_web_page_preview: disableWebPreview
		})
	)
}

export { sendMessage }

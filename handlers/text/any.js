async function handleAnyTextMessage(ctx) {
	await ctx.textTemplate('errors.unknown')
}

export { handleAnyTextMessage }

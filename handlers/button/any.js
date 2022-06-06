async function handleAnyButtonClick(ctx) {
	await ctx.popupTemplate('errors.unknown')
}

export { handleAnyButtonClick }

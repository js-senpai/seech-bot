import { buildKeyboard } from '../../helpers/keyboard.js'

async function handleRemoveTicketClick(ctx, next) {
	const [command, ticketId] = ctx.callbackQuery.data.split('_')
	let complete = false
	if (!command.startsWith('remove')) {
		if (!command.startsWith('complete')) {
			return await next()
		} else {
			complete = true
		}
	}
	const checkUser = await ctx.getUser()
	if(!checkUser || !checkUser.phone){
		return await ctx.textTemplate(
			'input.personalDataProcessing',
			{},
			buildKeyboard(ctx.i18n, {
				name: 'personalDataProcessing',
				columns: 2
			})
		)
	}
	const ticket = await ctx.db.Ticket.getOne(ticketId)
	if (!ticket) {
		await ctx.popupTemplate('errors.ticketNotFound')
	} else {
		const own = ticket.authorId === ctx.from.id
		const user = await ctx.getUser()
		if (complete) {
			let shouldDelete
			if (own) {
				await ticket.updateData({
					active: false,
					waitingForReview: true
				})
				await ctx.popupTemplate(`responses.completed`)
				// shouldDelete = !ticket.sale
				// if (!shouldDelete) {
				// 	const buyers = await ctx.db.User.countDocuments({
				// 		basket: {
				// 			id: ticket._id
				// 		}
				// 	})
				// 	shouldDelete = !buyers
				// }
			} else {
				if (ticket.waitingForReview) {
					const target = await ctx.db.User.getOne(ticket.authorId)
					if (target) {
						await user.updateData({
							state: `review`
						})
						// await ctx.textTemplate(
						// 	`input.${target.name ? 'review' : 'reviewNoName'}`,
						// 	{ name: target.name },
						// 	buildKeyboard(ctx.i18n, {
						// 		name: 'review',
						// 		columns: 2,
						// 		data: {
						// 			authorId: ticket.authorId,
						// 			mutual: true
						// 		}
						// 	})
						// )
						await ctx.reply(
							ctx.i18n.t('reviewSeller.text'),
							{
								reply_markup: {
									inline_keyboard: [
										[
											...Array.from({length: 5}, (_, s) => s + 1).flatMap((i) => ({
												text: ctx.i18n.t(`buttons.review.${i}`),
												callback_data: JSON.stringify({
													command: 'reviewBuyer',
													value: i,
													id: ticket.authorId
												})
											}))
										]
									]
								}
							}
						)
						await user.updateData({
							state: 'reviewSeller'
						})
						shouldDelete = true
					} else {
						await ctx.popupTemplate(`responses.completed`)
					}
				} else {
					await ctx.popupTemplate(`errors.notWaitingForReview`)
					return
				}
			}
			// if (shouldDelete) {
			// 	await ctx.db.Ticket.updateOne({ _id: ticketId }, { completed: true,active: false })
			// 	await ctx.db.User.updateMany(
			// 		{
			// 			basket: {
			// 				id: ticketId
			// 			}
			// 		},
			// 		{
			// 			$pull: {
			// 				basket: {
			// 					id: ticketId
			// 				}
			// 			}
			// 		}
			// 	)
			// }
		} else {
			if (own) {
				await ctx.db.User.updateMany(
					{
						basket: {
							id: ticketId
						}
					},
					{
						$pull: {
							basket: {
								id: ticketId
							}
						}
					}
				)
				await ctx.db.Ticket.updateOne({ _id: ticketId }, { deleted: true,active: false })
				await ctx.popupTemplate(`responses.deleted`)
			} else {
				await ticket.updateData({
					active: true
				})
				await user.updateData({
					$pull: {
						basket: {
							id: ticketId
						}
					}
				})
				await ctx.popupTemplate(`responses.removed`)
			}
		}
	}
	await ctx.editMessageReplyMarkup({})
}

export { handleRemoveTicketClick }

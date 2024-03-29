async function findRelatedTickets(Ticket, { weight, sale, culture, authorId }, region = '') {
	return await Ticket.aggregate([
		{
			// Search for customers in case of sale and vice versa
			$match: {
				culture,
				sale: !sale,
				active: true,
				waitingForReview: false,
				authorId: {
					$ne: authorId
				},
				deleted: false,
				completed: false
			}
		},
		{
			$addFields: {
				// Calculate weight suitability
				weightScore: {
					$cond: {
						if: {
							[sale ? '$gte' : '$lte']: ['$weight', weight]
						},
						then: 1, // Same score for all suitable
						else: {
							$subtract: ['$weight', weight]
						}
					}
				},
				// Calculate region suitability
				regionScore: {
					$cond: {
						if: {region},
						then: 1,
						else: 0
					}
				}
			}
		},
	])
}

export { findRelatedTickets }

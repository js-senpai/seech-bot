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
				}
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
		{
			// Sort to get results in expected priorities
			$sort: {
				weightScore: -1,
				date: -1,
				region: -1
			}
		},
	])
}

export { findRelatedTickets }

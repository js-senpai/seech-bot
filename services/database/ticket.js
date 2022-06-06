function getOneTicket(Ticket, id) {
	return Ticket.findOne({ _id: id })
}

function updateTicketData(Ticket, updates) {
	return Ticket.updateOne({ _id: this._id }, updates)
}

export { getOneTicket, updateTicketData }

import nc from 'node-schedule'

function schedule(minutes, func) {
	return nc.scheduleJob(
		new Date(Date.now() + minutes * 60 * 1000),
		async () => {
			try {
				await func()
			} catch (error) {
				console.warn(`Job failed: ${error}`)
			}
		}
	)
}

export { schedule }

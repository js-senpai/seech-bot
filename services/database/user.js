function getOneUser(User, userId) {
	return User.findOneAndUpdate(
		{ userId },
		{
			createdAt: new Date()
		},
		{
			new: true,
			upsert: true,
			setDefaultsOnInsert: true
		}
	)
}

function updateUserData(User, updates) {
	return User.findOneAndUpdate({ userId: this.userId }, updates, {
		new: true
	})
}

export { getOneUser, updateUserData }

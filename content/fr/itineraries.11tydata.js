module.exports = {
	eleventyComputed: {
		eleventyNavigation: {
			key: (data) => data?.lang[data?.page?.lang]?.navItineraries,
			order: 2,
		},
	},
};

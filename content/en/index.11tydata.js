module.exports = {
	layout: "layouts/base.njk",
	eleventyComputed: {
		eleventyNavigation: {
			key: (data) => data?.lang[data?.page?.lang]?.navContact,
			order: 3,
		},
	},
};

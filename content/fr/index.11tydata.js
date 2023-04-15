module.exports = {
	layout: "layouts/base.njk",
	eleventyComputed: {
		eleventyNavigation: {
			key: (data) => data?.lang[data?.page?.lang]?.navIndex,
			order: 1,
		},
	},
};

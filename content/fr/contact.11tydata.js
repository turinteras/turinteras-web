module.exports = {
	layout: "layouts/contact.njk",
	eleventyComputed: {
		eleventyNavigation: {
			key: (data) => data?.lang[data?.page?.lang]?.navContact,
			order: 3,
		},
	},
};

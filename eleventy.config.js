const { DateTime } = require("luxon");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { EleventyI18nPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});

	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "en",
	});

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	eleventyConfig.addWatchTarget("sass");
	eleventyConfig.setWatchThrottleWaitTime(300);

	// App plugins
	eleventyConfig.addPlugin(require("./eleventy.config.images.js"));

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(
			format || "dd LLLL yyyy"
		);
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
			"yyyy-LL-dd"
		);
	});

	eleventyConfig.addFilter("langFilter", function (collection, lang) {
		if (!lang) return collection;
		const filtered = collection.filter((c) => c.data.page.lang == lang);
		return filtered;
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	eleventyConfig.addCollection("sortedItineraries", function (collectionApi) {
		return collectionApi
			.getFilteredByTag("itineraries")
			.sort(function (a, b) {
				return (
					b.data.itineraryDate - a.data.itineraryDate ||
					b.date - a.date
				);
			});
	});

	// eleventyConfig.watchIgnores.add("**/*.css.map"); // breaks dev server browser auto refresh

	return {
		// Control which files Eleventy will process
		templateFormats: ["md", "njk", "html"],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content", // default: "."
			includes: "../_includes", // default: "_includes"
			data: "../_data", // default: "_data"
			output: "_site",
		},

		// If your site deploys to a subdirectory, change `pathPrefix`.
		pathPrefix: "/",
	};
};

const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = (eleventyConfig) => {
	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode(
		"image",
		async function imageShortcode(src, alt, className, id, widths, sizes) {
			let formats = ["avif", "webp", "auto"];
			//Avif is resource intensive
			//let formats = ["webp", "auto"];
			let file;
			if (src.startsWith("./")) {
				file = relativeToInputPath(this.page.inputPath, src);
			} else if (src.startsWith("/public/img/")) {
				file = src.substring(1);
			} else {
				file = src;
			}
			let metadata = await eleventyImage(file, {
				widths: widths || ["auto"],
				formats,
				outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
			});

			// _TODO loading=eager and fetchpriority=high
			let imageAttributes = {
				alt,
				sizes,
				loading: "lazy",
				decoding: "async",
			};
			if (className) {
				imageAttributes.class = className;
			}
			if (id) {
				imageAttributes.id = id;
			}
			return eleventyImage.generateHTML(metadata, imageAttributes);
		}
	);
};

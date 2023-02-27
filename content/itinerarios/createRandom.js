const fs = require("fs");

const n = 20;
const pathPrefix = "fakeitinerary";

const [createDate, itineraryDate] = (function () {
	let itineraryCreatedDate = new Date();
	itineraryCreatedDate.setDate(itineraryCreatedDate.getDate() - 14);
	return [
		function () {
			if (Math.random() > 0.2) {
				itineraryCreatedDate.setDate(
					itineraryCreatedDate.getDate() - (Math.random() * 7 + 1)
				);
			}
			return itineraryCreatedDate.toISOString().substring(0, 10);
		},
		function () {
			const itineraryDate = new Date(itineraryCreatedDate);
			itineraryDate.setDate(
				itineraryCreatedDate.getDate() + (Math.random() * 30 + 1)
			);
			return itineraryDate.toISOString().substring(0, 10);
		},
	];
})();

for (let i = n; i >= 1; i--) {
	const path = `${pathPrefix}${i}`;

	fs.readdirSync(".").forEach((file) => {
		if (file.startsWith(pathPrefix)) {
			console.log(`Deleting ${file}`);
			fs.rmSync(file, { recursive: true, force: true });
		}
	});

	fs.access(path, (error) => {
		if (error) {
			fs.mkdir(path, (error) => {
				if (error) {
					console.log(error);
				} else {
					console.log(`${path} : created`);
					fs.writeFileSync(
						`${path}/${path}.njk`,
						`\
---
title: Fake itinerary number ${i}
description: Description of fake itinerary number ${i}
date: ${createDate()}
itineraryDate: ${itineraryDate()}
---

<h1>
Itinerario número ${i}
</h1>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
sed do eiusmod tempor incididunt ut labore et dolore magna \
aliqua. Ut enim ad minim veniam, quis nostrud exercitation \
ullamco laboris nisi ut aliquip ex ea commodo consequat. \
Duis aute irure dolor in reprehenderit in voluptate velit \
esse cillum dolore eu fugiat nulla pariatur. Excepteur sint \
occaecat cupidatat non proident, sunt in culpa qui officia \
deserunt mollit anim id est laborum.
</p>
`
					);
					console.log(`${path}/${path} : created`);
				}
			});
		} else {
			console.log(`${path} : already exists`);
		}
	});
}

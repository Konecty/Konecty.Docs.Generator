var slugifyPath = require('slugify-path').default;
var path = require('path');

function slug(filePath, data, removeMDLink) {
	if (filePath.charAt(0) === path.sep) {
		filePath = filePath.substr(1);
	}
	
	var fileParts = filePath.split(path.sep);
	var totalParts = fileParts.length;

	var fileName = fileParts[totalParts - 1];

	if (fileName === 'README.md') {
		fileParts[totalParts - 1] = 'index.md';

		if (data !== undefined && !data.title) {
			var previousPart = 2;
			if (totalParts < 2) {
				previousPart = 1;
			}

			var title = fileParts[totalParts - previousPart].replace(new RegExp(`(^|\${path.sep})[0-9. ]+`, 'g'), '$1');

			if (title === 'index.md') {
				data.title = 'Konecty Docs';
			} else {
				data.title = 'Konecty Docs - ' + title;
			}
		}
	}

	for (var i = 0; i < totalParts; i++) {
		fileParts[i] = fileParts[i].replace(/^[0-9]+\. /, '');
		if (i + 1 === totalParts) {
			if (fileParts[i].match(/\.(md)$/) || fileParts[i].indexOf('.') === -1) {
				var lastDot = fileParts[i].lastIndexOf('.');
				if (lastDot > -1) {
					// console.log('name ->',fileParts[i].substr(0, lastDot));
					var extension = fileParts[i].substr(lastDot);
					if (extension === '.md' && !!removeMDLink) {
						extension = '';
					}

					fileParts[i] = slugifyPath(fileParts[i].substr(0, lastDot)) + extension;
				} else {
					fileParts[i] = slugifyPath(fileParts[i]);
				}
			} else if (!fileParts[i].match(/\.(jpg|png|gif|svg)$/)) {
				fileParts[i] = slugifyPath(fileParts[i]);
			}
		} else {
			fileParts[i] = slugifyPath(fileParts[i]);
		}
		// console.log('fileParts[i] ->',fileParts[i]);
	}

	return fileParts.join(path.sep);
}

module.exports = slug;

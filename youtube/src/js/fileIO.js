function readFile(fileName) {
	return new Promise(async (resolve) => {
		const response = await fetch('/data/' + fileName);
		const text = await response.text();
		resolve(text);
	});
}
function printLog(txt) {
	return new Promise((resolve) => {
		fetch('/printLog', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				fileName: getDate(),
				logMsg: txt
			})
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response error');
			}
			resolve(response);
		})
		.catch(error => {
			console.error('writeTextFile() : ', error);
		});
	});
}

function getDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export { readFile, printLog };
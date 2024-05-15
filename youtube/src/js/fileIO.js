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
			body: txt
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

export { readFile, printLog };
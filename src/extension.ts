// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import got from 'got';
const { window, workspace } = vscode;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "openjsfile" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('openjsfile', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const result = await window.showInputBox({
			value: 'https://iot.gtimg.com/cdn/explorer/100027536625/I5H4SIDAPI/f346e6c1e90fa1102fe7f5a10d4578b7.js:1:393748',
			placeHolder: 'For example: https://iot.gtimg.com/cdn/explorer/100027536625/I5H4SIDAPI/f346e6c1e90fa1102fe7f5a10d4578b7.js:1:393748',
			validateInput: text => {
				return /^https?:\/\/.+/.test(text) ? null : 'url 不正确';
			}
		});
		if (result) {
			const res = (/(.+)(:\d*)(:\d*)/).exec(result);
			console.log(res);
			const [_, url, row, col] = Array.from(res || []);
			const {body: data} = await got.get(url || result);

			const document = await workspace.openTextDocument({content: data, language: 'JavaScript'});
			const editor = await window.showTextDocument(document);
			if (!row) {
				return;
			}
			const position = new vscode.Position(Number(row.replace(':', '')) - 1, Number(col.replace(':', '')) - 1);

			editor.edit((build) => {
				build.insert(position, '/*🐛🐛🐛🐛===BUG===🐛🐛🐛🐛*/');
				editor.revealRange(new vscode.Range(position, position));
			});
		}

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

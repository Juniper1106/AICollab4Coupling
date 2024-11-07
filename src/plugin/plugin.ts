import * as Networker from "monorepo-networker";
import { initializeNetwork } from "@common/network/init";
import { NetworkSide } from "@common/network/sides";
import { NetworkMessages } from "@common/network/messages";

function debounce(func: (...args: any[]) => any, delay: number) {
	let timeoutId: number;
	return (...args: any[]) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

let lastSelection: readonly SceneNode[] = [];
const debouncedCommitOperation = debounce(commitOperation, 500);

async function getCanvasScreenshot() {
	const image = await figma.currentPage.exportAsync({
		format: 'PNG', // 可选择 PNG 或 JPG
		constraint: {
			type: 'HEIGHT', // 可选择 HEIGHT, WIDTH 或 SCALE
			value: 1024 // 缩放比例
		}
	});
	const base64Image = figma.base64Encode(image);
	return base64Image;
}

async function getSelectionScreenshot() {
	let selection : readonly SceneNode[] = figma.currentPage.selection;
	if (selection.length === 0) {
		console.log('no selection to capture');
		if (lastSelection.length === 0) {
			return null;
		} else if (figma.currentPage.children.includes(lastSelection[0])) {
			selection = lastSelection;
		} else {
			return null;
		}
	}
	const image = await selection[0].exportAsync({
		format: 'PNG', // 可选择 PNG 或 JPG
		constraint: {
			type: 'HEIGHT',
			value: 1024 // 缩放比例
		}
	});
	const base64Image = figma.base64Encode(image);
	return base64Image;
}

async function commitOperation(message: string, selection: readonly SceneNode[] = figma.currentPage.selection) {
	let canvasScreenshot = await getCanvasScreenshot();
	let selectionScreenshot = await getSelectionScreenshot();
	if (selectionScreenshot === null) {
		selectionScreenshot = canvasScreenshot;
	}
	const payload = {
		message: message,
		canvasScreenshot: canvasScreenshot,
		selectionScreenshot: selectionScreenshot,
		timeStamp: new Date().getTime()
	};
	await fetch(
	  'http://127.0.0.1:5010/save_operation',
	  {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	  }
	).then(
	  response => response.text()
	).then(
	  text => console.log(text)
	).catch(
	  error => console.error(error)
	)
}

async function bootstrap() {
	initializeNetwork(NetworkSide.PLUGIN);

	if (figma.editorType === "figma") {
		figma.showUI(__html__, {
			width: 320,
			height: 650,
			title: "My Figma Plugin!",
		});
	} else if (figma.editorType === "figjam") {
		figma.showUI(__html__, {
			width: 800,
			height: 650,
			title: "My FigJam Plugin!",
		});
	}

	console.log("Bootstrapped @", Networker.Side.current.getName());

	NetworkMessages.HELLO_UI.send({ text: "Hey there, UI!" });

	//载入字体
	await figma.loadFontAsync({ family: "Inter", style: "Regular" });
	
	//page切换
	figma.on('currentpagechange', async () => {
		const message = `用户切换至页面: ${figma.currentPage.name}`
		console.log(message);
		await commitOperation(message);
	});

	//选择改变
	figma.on('selectionchange', async () => {
		console.log('selction', figma.currentPage.selection);
		if (figma.currentPage.selection.length != 0) {
			lastSelection = figma.currentPage.selection;
		}
	});

	//文档改变
	figma.loadAllPagesAsync().then(() => {
		console.log('figma.currentPage', figma.currentPage);
		figma.on("documentchange", async (event) => {
			let message = "";
			for (const change of event.documentChanges) {
				switch (change.type) {
					case "CREATE":
						message = `用户创建${change.node.type}节点${change.node.id}`
						console.log(message);
						await commitOperation(message);
						break;

					case "DELETE":
						message = `用户删除${change.node.type}节点${change.node.id}`
						console.log(message);
						await commitOperation(message);
						break;

					case "PROPERTY_CHANGE":
						const props = change.properties.join(', ');
						message = `用户改变${change.node.type}节点${change.node.id}的属性: ${props}`
						console.log(message);
						debouncedCommitOperation(message, figma.currentPage.selection);
						break;
				}
			}
		});
	});
}

bootstrap();

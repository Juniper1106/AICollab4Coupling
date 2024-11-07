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

const debouncedCommitOperation = debounce(commitOperation, 1000);

async function getCanvasScreenshot() {
	const image = await figma.currentPage.exportAsync({
		format: 'PNG', // 可选择 PNG 或 JPG
		constraint: {
			type: 'WIDTH',
			value: 1024 // 缩放比例
		}
	});
	const base64Image = figma.base64Encode(image);
	return base64Image;
}

function getBBox(nodes: readonly SceneNode[]) {
	if (nodes.length === 0) {
		const { x, y, width, height } = figma.viewport.bounds;
		return [x, y, x+width, y+height];
	}
	let left = Number.POSITIVE_INFINITY;
	let upper = Number.POSITIVE_INFINITY;
	let right = Number.NEGATIVE_INFINITY;
	let lower = Number.NEGATIVE_INFINITY;
	nodes.forEach(node => {
		if (node.absoluteBoundingBox) {
			const x = node.absoluteBoundingBox.x;
			const y = node.absoluteBoundingBox.y;
			const width = node.absoluteBoundingBox.width;
			const height = node.absoluteBoundingBox.height;
			left = Math.min(left, x);
			upper = Math.min(upper, y);
			right = Math.max(right, x + width);
			lower = Math.max(lower, y + height);
		}
	});
	return [left, upper, right, lower];
}

function getRelativeBBox(canvasBBox: number[], selectionBBox: number[]) {
	let left = Math.max(canvasBBox[0], selectionBBox[0]) - canvasBBox[0];
	let upper = Math.max(canvasBBox[1], selectionBBox[1]) - canvasBBox[1];
	let right = Math.min(canvasBBox[2], selectionBBox[2]) - canvasBBox[0];
	let lower = Math.min(canvasBBox[3], selectionBBox[3]) - canvasBBox[1];
	const canvasWidth = canvasBBox[2] - canvasBBox[0];
	const canvasHeight = canvasBBox[3] - canvasBBox[1];
	if (left >= right || upper >= lower) {
		return [0, 0, 1, 1];
	}
	return [left/canvasWidth, upper/canvasHeight, right/canvasWidth, lower/canvasHeight];
}

async function commitOperation(message: string, selection: readonly SceneNode[] = figma.currentPage.selection) {
	const canvasScreenshot = await getCanvasScreenshot();
	const canvasBBox = getBBox(figma.currentPage.children);
	const selectionBBox = getBBox(selection);
	const relativeBBox = getRelativeBBox(canvasBBox, selectionBBox);
	console.log('canvasBBox', canvasBBox);
	console.log('selectionBBox', selectionBBox);
	console.log('relativeBBox', relativeBBox);
	const payload = {
		message: message,
		canvasScreenshot: canvasScreenshot,
		relativeBBox: relativeBBox,
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

// Commented out due to most of the functions not currently working.
import JwtDecode from 'jwt-decode';
import moment from 'moment';

import { TokenDto } from '@/interfaces/GlobalTypes';

// if (typeof(String.prototype.trim) === 'undefined') {
// 	String.prototype.trim = function() {
// 		return String(this).replace(/^\s+|\s+$/g, '');
// 	};
// }

// /**
//  * Sleep Promise after `time` milliseconds
//  *
//  * @param {number} time - Time to sleep
//  *
//  * @example
//  *      sleep(5000, console.log("Hello after 5 seconds"));
//  */
// export const sleep = (time: number): Promise<() => number> => {
// 	return new Promise((resolve) => setTimeout(resolve, time));
// };

/**
 * Truncate the last part of URL
 *
 * @param {string} url - URL string
 *
 * @example
 *      truncateURI("http://example.com/my/uri"); // "uri"
 */
export const truncateURI = (url: string): string | undefined => {
	return url.split('/').pop();
};

/**
 * Top offset of an element
 *
 * @param {HTMLElement} element - HTML element object
 */
export const getOffsetTop = (element: HTMLElement): number => {
	let offsetTop: number = 0;
	do {
		if (!isNaN(element.offsetTop)) {
			offsetTop += element.offsetTop;
		}
	} while (element === element.offsetParent);

	return offsetTop;
};

// /**
//  * Left offset of an element
//  *
//  * @param {HTMLElement} element - HTML element object
//  */
// export const getOffsetLeft = (element: HTMLElement): number => {
// 	let offsetLeft: number = 0;
// 	do {
// 		if (!isNaN(element.offsetLeft)) {
// 			offsetLeft += element.offsetLeft;
// 		}
// 	} while (element === element.offsetParent);

// 	return offsetLeft;
// };

/**
 * Get a bounding box for a text selection in an element.
 *
 * @param {Range} textPosition - Range selection element
 * @param {string} elementId - HTMLElement Id
 */
export const getTextPosition = (textPosition: any, textContainer: HTMLElement):
	{ top: number, bottom: number, left: number, right: number, width: number } => {
	const range: Range = document.createRange();
	const textContent: ChildNode = textContainer.childNodes.item(0);
	const containerRect: DOMRect | ClientRect = textContainer.getBoundingClientRect();

	range.setStart(textContent, textPosition.startOffset);
	range.setEnd(textContent, textPosition.endOffset);

	// These rects contain the client coordinates in top, left
	const rects: ClientRect = range.getClientRects()[0];

	return {
		top: rects.top - containerRect.top,
		bottom: rects.bottom - containerRect.top,
		left: rects.left - containerRect.left,
		right: rects.right - containerRect.left,
		width: rects.width,
	};
};

/**
 * Get a bounding box for a text position in an element.
 *
 * @param {number} offset - Offset
 * @param {number} elementId - HTMLElement Id
 */
export const getPointPosition = (offset: number, textContainer: HTMLElement):
	{ top: number, bottom: number, left: number, right: number, width: number }  => {
	const range: Range = document.createRange();
	const textContent: ChildNode = textContainer.childNodes.item(0);
	const containerRect: DOMRect | ClientRect = textContainer.getBoundingClientRect();
	range.setStart(textContent, offset);
	range.setEnd(textContent, offset);

	// These rects contain the client coordinates in top, left
	const rects: ClientRect = range.getClientRects()[0];

	return {
		top: rects.top - containerRect.top,
		bottom: rects.bottom - containerRect.top,
		left: rects.left - containerRect.left,
		right: rects.right - containerRect.left,
		width: rects.width,
	};
};


/**
 * Get the computed value of a style property for an element.
 *
 * @param {Element} element - HTMLElement
 * @param {string} styleProp - CSS style property of HTMLElement required
 * @returns {string} - CSS style property computed value
 *
 * @example
 * ```css
 * #myElement {
 *      width: 200px;
 *      height: 100px;
 * }
 * ```
 * getStyle(document.getElementById('myElement'), 'width'); // "200px"
 *
 */
export const getStyle = (element: Element, property: string): string => {
	// ToDo: Handle cross-browser cases if needed
	/*
	if (window.getComputedStyle) {
		const val = window.getComputedStyle(element).getPropertyValue(styleProp);
		if (!val) {
			if (document.defaultView) {
				return document.defaultView.getComputedStyle(element as Element, null)
					.getPropertyValue(styleProp);
			}
			return null;
		}
		return val;
	} else if (element.currentStyle) {
		return element.currentStyle[styleProp.encamel()];
	} */
	return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * ToDo: Add JSDoc and types
 */
export const getAnnotationRectPositions = (appellation: any, container: Element): any => {
	const lineHeight = parseInt(getStyle(container, 'line-height'), 10);
	const position = getTextPosition(appellation.position, container as HTMLElement);
	const endPoint = getPointPosition(appellation.position.endOffset, container as HTMLElement);

	let endPosition = {};
	const midLines = [];

	const nLines = 1 + (endPoint.bottom - position.bottom) / lineHeight;

	if (nLines > 1) { // The selection may span several lines.
		// clientLeft/clientWidth don't account for inner padding.
		let padding = parseInt(getStyle(container, 'padding'), 10);
		if (!padding) { // Firefox.
			padding = parseInt(getStyle(container, 'padding-left'), 10);
		}

		const left = container.clientLeft + padding;
		const width = container.clientWidth - (2 * padding);

		endPosition = { // This is the last line, running from
			top: endPoint.top, //  far left to the end of the
			left, //   selection.
			width: endPoint.right - left,
		};

		for (let k = 0; k < Math.max(0, nLines - 2); k++) {
			midLines.push({
				top: position.top + (k + 1) * lineHeight,
				left,
				width,
				height: lineHeight - 1,
			});
		}
	}

	return {
		...position,
		lineHeight,
		midLines,
		endPosition,
	};
};

/**
 * Clear selected text on the window, if any
 * Ref: https://stackoverflow.com/a/3169849
 */
export const clearMouseTextSelection = (): void => {
	if (window.getSelection !== null) {
		const sel: any = window.getSelection();
		if (sel !== null) {  // Chrome
			sel.empty();
		} else if (sel.removeAllRanges) {  // Firefox
			window.getSelection()!.removeAllRanges();
		}
	}
};

// /**
//  * Get Top position of DOM element
//  *
//  * @param elementId - ID of the DOM element
//  */
// export const getAbsoluteTop = (elementId: string): number | null => {
// 	const element: HTMLElement | null = document.getElementById(elementId);
// 	if (element === null || element.getClientRects().length === 0) {
// 		return null;
// 	}
// 	return element.getClientRects()[0].top + window.scrollY;
// };

export const getCreatorName = (creator: { id: number, username: string }) => {
	const decoded = JwtDecode<TokenDto>(localStorage.getItem('token') || '');
	if (creator.id === decoded.user_id) {
		return 'you';
	} else {
		return creator.username;
	}
};

/**
 * Formats ISODate string
 */
export const getFormattedDate = (isodate: string): string => {
	return moment(isodate).format('lll');
};

export default {
	truncateURI,
	getOffsetTop,
	getTextPosition,
	getPointPosition,
	getStyle,
	getAnnotationRectPositions,
	clearMouseTextSelection,
	getCreatorName,
	getFormattedDate,
};

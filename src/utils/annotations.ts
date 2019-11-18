import moment from 'moment';

if (typeof(String.prototype.trim) === 'undefined') {
	String.prototype.trim = function() {
		return String(this).replace(/^\s+|\s+$/g, '');
	};
}

/**
 * Sleep Promise after `time` milliseconds
 *
 * @param {number} time - Time to sleep
 *
 * @example
 *      sleep(5000, console.log("Hello after 5 seconds"));
 */
export const sleep = (time: number): Promise<() => number> => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

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

/**
 * Left offset of an element
 *
 * @param {HTMLElement} element - HTML element object
 */
export const getOffsetLeft = (element: HTMLElement): number => {
	let offsetLeft: number = 0;
	do {
		if (!isNaN(element.offsetLeft)) {
			offsetLeft += element.offsetLeft;
		}
	} while (element === element.offsetParent);

	return offsetLeft;
};

/**
 * Get a bounding box for a text selection in an element.
 *
 * @param {Range} textPosition - Range selection element
 * @param {string} elementId - HTMLElement Id
 */

 // FIXME: This does not work and needs to fixed.
export const getTextPosition = (textPosition: Range, elementId: string = 'text-content'):
	{ top: number, bottom: number, left: number, right: number, width: number } | null => {
	const range: Range = document.createRange();
	const textContainer: HTMLElement | null = document.getElementById(elementId);
	if (textContainer == null) {
		return null;
	}
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
export const getPointPosition = (offset: number, elementId: string = 'text-content'):
	{ top: number, bottom: number, left: number, right: number, width: number } | null => {
	const range: Range = document.createRange();

	const textContainer: HTMLElement | null = document.getElementById(elementId);
	if (textContainer == null) {
		return null;
	}
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
 * @param {string} elementId - ID of HTMLElement
 * @param {string} styleProp - CSS style property of HTMLElement required
 * @returns {string} - CSS style property value
 *
 * @example
 * ```css
 * #myElement {
 *      width: 200px;
 *      height: 100px;
 * }
 * ```
 * getStyle('myElement', 'width'); // "200px"
 *
 */
// FIXME: This does not work and needs to fixed.
export const getStyle = (elementId: string, styleProp: string): string | null => {
	const element: Element | null = document.getElementById(elementId) as Element;
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
	}
	return null;
};

export const clearMouseTextSelection = (): void => {
	if (window.getSelection && window.getSelection() !== null) {
		if (window.getSelection.empty) { // Chrome
			window.getSelection.empty();
		} else if (window.getSelection().removeAllRanges) { // Firefox
			 window.getSelection().removeAllRanges();
		}
	} else if (document.selection) { // IE?
		document.selection.empty();
	}
};

/**
 * Get Top position of DOM element
 *
 * @param elementId - ID of the DOM element
 */
export const getAbsoluteTop = (elementId: string): number | null => {
	const element: HTMLElement | null = document.getElementById(elementId);
	if (element === null || element.getClientRects().length === 0) {
		return null;
	}
	return element.getClientRects()[0].top + window.scrollY;
};

export const getCreatorName = (
	creator: { id: number, username: string },
	userId: number,
): string => {
	if (creator.id === userId) {
		return 'you';
	} else {
		return creator.username;
	}
};

/**
 * Formats ISODate string to eg: `4 November, 2019 at 15:03`
 */
export const getFormattedDate = (isodate: string): string => {
	return moment(isodate).format('D MMMM, YYYY \\at HH:mm');
};

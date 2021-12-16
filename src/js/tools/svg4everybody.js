const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
const webkitUA = /\bAppleWebKit\/(\d+)\b/;
const olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
const edgeUA = /\bEdge\/.(\d+)\b/;
// Checks whether iframed
const inIframe = window.top !== window.self;

if (
	newerIEUA.test(navigator.userAgent) ||
	(navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 ||
	(navigator.userAgent.match(webkitUA) || [])[1] < 537 ||
	(edgeUA.test(navigator.userAgent) && inIframe)
) {
	import(/* webpackChunkName: "svg4everybody" */ 'svg4everybody').then((svg) => {
		svg.default();
	});
}

export const readSlideHeights = (embla) =>
	embla.slideNodes().map((slideNode) => {
		//const slideInner = slideNode.querySelector('*');
		return slideNode.getBoundingClientRect().height;
	});

export const adaptContainerToSlide = (embla, slideHeights) => {
	const currentSlideHeight = slideHeights[embla.selectedScrollSnap()];
	embla.containerNode().style.height = `${currentSlideHeight}px`;
};

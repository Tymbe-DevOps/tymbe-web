// tooltip template

export const tooltipTemplate = (message) => {
	return `
		<button type="button" data-controller="Tooltip" data-action="click->Tooltip#showTooltip" class="tooltip has-error">
			<span class="icon-svg icon-svg--info" aria-hidden="true">
				<svg class="icon-svg__svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<use xlink:href="../img/bg/icons-svg.svg#icon-info" width="100%" height="100%" focusable="false"></use>
				</svg>
			</span>
			<span class="u-vhide"> Info </span>
			<span class="tooltip__content">
				<span class="tooltip__text">${message}</span>
			</span>
		</button>
	`;
};

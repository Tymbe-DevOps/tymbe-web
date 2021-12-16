.icon-svg {
	display: inline-block;
	vertical-align: middle;
	position: relative;
	width: <%= commonWidth %>px;
	&__svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		fill: currentColor;
		pointer-events: none;
		transform: translateZ(0);
	}
	&::before {
		content: '';
		display: block;
		padding-top: <%= commonPerc %>%;
	}

	<% _.each(withoutCommonWidth, function(glyph) { %>
	&--<%= glyph.name %> {
		width: <%= glyph.width %>px;
	} <% }); %>
	<% _.each(withoutCommonPerc, function(glyph) { %>
	&--<%= glyph.name %>::before {
		padding-top: <%= glyph.perc %>%;
	} <% }); %>

}

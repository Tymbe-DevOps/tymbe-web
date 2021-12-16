@font-face {
	font-family: '<%= fontName %>';
	src: url('<%= fontPath %><%= fontName %>.eot');
	src: url('<%= fontPath %><%= fontName %>.eot#iefix') format('embedded-opentype'),
		url('<%= fontPath %><%= fontName %>.ttf') format('truetype'),
		url('<%= fontPath %><%= fontName %>.woff') format('woff');
	font-weight: normal;
	font-style: normal;
}

%icon {
	font-family: '<%= fontName %>';
	speak: none;
	font-style: normal;
	font-weight: normal;
	font-variant: normal;
	text-transform: none;
	line-height: 1;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon {
	@extend %icon;
	display: inline-block;
	position: relative;
}

<% _.each(glyphs, function(glyph) { %>
$<%= className %>--<%= glyph.name %>: '\<%= glyph.code %>';
.<%= className %>--<%= glyph.name %>::before {
	content: $<%= className %>--<%= glyph.name %>;
}
<% }); %>

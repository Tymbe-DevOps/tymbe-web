export const MQ = (query) => {
	const { breakpointsVars = {}, rules = {} } = PROJECT_CONFIG;
	if (breakpointsVars[query] != null) return window.matchMedia(`(${breakpointsVars[query]})`).matches;
	if (rules[query] != null) return window.matchMedia(rules[query]).matches;
	return window.matchMedia(query).matches;
};

export const media = MQ;

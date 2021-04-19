export const atLocation = (pathname) => {
	cy.location().should((loc) => {
		expect(loc.pathname).to.eq(pathname)
	})
}

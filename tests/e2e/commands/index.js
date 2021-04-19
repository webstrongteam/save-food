Cypress.Commands.add(
	'e2eSelector',
	{ prevSubject: 'optional' },
	(subject, selectorName, globalContext) => {
		if (globalContext || !subject) {
			return cy.get(`[data-testid=${selectorName}]`)
		}
		return subject.find(`[data-testid=${selectorName}]`)
	},
)

Cypress.Commands.add('e2eContains', { prevSubject: 'optional' }, (subject, selectorName, value) => {
	if (!subject) {
		return cy.contains(`[data-testid=${selectorName}]`, value)
	}
	return cy.wrap(subject).contains(`[data-testid=${selectorName}]`, value)
})

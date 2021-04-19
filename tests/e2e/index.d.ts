declare namespace Cypress {
	interface Chainable {
		e2eSelector(selectorName: string, globalContext?: boolean): Chainable<Response>
		e2eContains(selectorName: string, value: string): Chainable<Response>
	}
}

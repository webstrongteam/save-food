import { atLocation } from '../helpers/location'

describe('test', () => {
	beforeEach(() => {
		cy.visit('/')
	})

	it('should change languages and go to food list', () => {
		atLocation('/')
		cy.e2eSelector('go-to-settings').click()
		cy.e2eSelector('open-lang-modal').click()
		cy.e2eSelector('set-pl-lang').click()
		cy.e2eSelector('btn-back').click()
		cy.wait(1000)
		cy.e2eSelector('go-to-food-list').eq(1).click()
	})
})

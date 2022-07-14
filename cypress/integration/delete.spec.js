describe('DELETE /characters/id', function(){

    const tochaHumana = {
        name: 'Jhonny Storm',
        alias: 'Tocha Humana',
        team: [
            'Quarteto Fantástico'
        ],
        active: true
    }

    context('Quando tenho um personagem cadastrado', function(){

        before(function(){
            cy.postCharacter(tochaHumana).then(function(response){
                Cypress.env('characterId', response.body.character_id)
            })
        })

        it('Deve remover o personagem pelo id', function(){
            const id = Cypress.env('characterId')
            cy.deleteCharacterById(id).then(function(response){
                expect(response.status).to.eql(204)
            })
        })

        it('Deve retornar 404 ao buscar por id não cadastrado', function(){
            const id = Cypress.env('characterId')
            cy.getCharacterById(id).then(function(response){
                expect(response.status).to.eql(404)
            })
        })
    })
})
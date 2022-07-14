

describe("GET /characters", function(){

    let characters = [
        {
            name: "Tony Stark",
            alias: "Homem de ferro",
            team: ["vingadores"],
            active: false
        },
        {
            name: "Wanda Maximoff",
            alias: "Feiticeira Escarlate",
            team: ["vingadores"],
            active: true
        },
        {
            name: "Peter Parker",
            alias: "Homem aranha",
            team: ["novos vingadores"],
            active: true
        }
    ]

    before(function(){
        cy.populateCharacters(characters)
    })

    it("Deve retornar uma lista de personagens", function(){
        cy.getCharacters().then((response)=>{
            expect(response.status).to.eql(200)
            expect(response.body).to.be.a('array')
            expect(response.body.length).greaterThan(0)
        })
    })

    it("Deve buscar personagem por nome", function(){
        cy.searchCharacter("Wanda").then((response)=>{
            expect(response.status).to.eql(200)
            expect(response.body.length).to.eql(1)
            expect(response.body[0].alias).to.eql("Feiticeira Escarlate")
            expect(response.body[0].team).to.eql(["vingadores"])
            expect(response.body[0].active).to.eql(true)
        })
    })

})

describe("GET /characters/id", function(){
    const hulk = {
        name: "Bruce Banner",
        alias: "Hulk",
        team: ['vingadores'],
        active: true
    }

    context("quando tenho um personagem já cadastrado", function(){
        before(function(){
            // Cadastrando o Hulk
            cy.postCharacter(hulk).then(function(response){
                Cypress.env('characterId', response.body.character_id)
            })

        })
        it("deve buscar personagem pelo id", function(){
            let id = Cypress.env('characterId') 
            cy.getCharacterById(id).then(function(response){
                expect(response.status).to.eql(200)
                expect(response.body.alias).to.eql('Hulk')
                expect(response.body.team[0]).to.eql('vingadores')
                expect(response.body.active).to.eql(true)
            })
        })
    })

    it("Deve retornar 404 ao buscar por id não cadastrado", function(){
        let id = '62cf1c6caed38c1b46008bbc'
        cy.getCharacterById(id).then(function(response){
            expect(response.status).to.eql(404)
        })
    })
})
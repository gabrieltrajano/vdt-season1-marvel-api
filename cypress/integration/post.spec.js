
describe('POST /characters', function(){

    it('Criando novo personagem', function(){
        const character = {
            name: "Natasha Romanova",
            alias: "Viúva Negra",
            team: ["vingadores"],
            active: false
        }

        cy.postCharacter(character).then(function(response){
            expect(response.status).to.eql(201)
            expect(response.body.character_id.length).to.eql(24)
        })

    })

    context('quando o personagem já existe', function(){

        const character = {
            name: "Logan",
            alias: "Wolverine",
            team: ["x-men"],
            active: false
        }

        before(function(){
            cy.postCharacter(character)
            .then(function(response){
                expect(response.status).to.eql(201)
            })
        })

        it('não deve cadastrar personagem com nome duplicado', function(){
            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql("Duplicate character")      
            })
        })
    })

    context('quando falta um campo obrigatório', function(){
        const massaCamposObrigatorios = [
            [ 
                {
                    alias: "Doutor Estranho",
                    team: ["vingadores"],
                    active: false
                },
                {
                    campo: "name"
                }
            ],
            [
                {
                    name: "Stephen Vincent Strange",
                    team: ["vingadores"],
                    active: false
                },
                {
                    campo: "alias"
                }
            ],
            [
                {
                    name: "Stephen Vincent Strange",
                    alias: "Doutor Estranho",
                    active: false
                },
                {
                    campo: "team"
                }
            ],
            [
                {
                    name: "Stephen Vincent Strange",
                    alias: "Doutor Estranho",
                    team: ["vingadores"]
                },
                {
                    campo: "active"
                }
            ]
        ]

        massaCamposObrigatorios.forEach((item) => {
            it(`não deve cadastrar sem o campo ${item[1].campo}`, () => {
                cy.postCharacter(item[0]).then((response) => {
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql(`"${item[1].campo}" is required`)
                })
            })
        })
    })
})
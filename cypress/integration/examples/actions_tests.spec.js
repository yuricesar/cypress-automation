describe('MyTestSuite', function(){
    beforeEach(() => {
        cy.visit('pages/toTest.html')
    })

    it('Título da página deve ser "Campo de Treinamento"', function(){
        cy.title().should('eq', 'Campo de Treinamento')
    })

    it('Botão "Clique Me!" deve ter valor "Clique Me!"', function(){
        cy.get('#buttonSimple').should('have.value', 'Clique Me!')
    })

    it('Botão "Clique Me!" deve ter valor "Obrigado!" após clicado', function(){
        cy.get('#buttonSimple').click()
        cy.get('#buttonSimple').should('have.value', 'Obrigado!')
    })

    it('Resultado deve ser "Status: Nao Cadastrado" ao entrar na página', function(){
        cy.get('#resultado').contains('Status: Nao cadastrado').should('be.visible')
    })

    it('Alerta de nome obrigatório deve aparecer caso nome seja vazio', function(){
        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('#elementosForm\\:cadastrar').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
        })
    })

    it('Alerta de nome obrigatório deve aparecer ao digitar apenas sobrenome', function(){
        cy.get('#elementosForm\\:sobrenome').type('Oliveira')

        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('#elementosForm\\:cadastrar').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
        })
    })

    it('Alerta de sobrenome obrigatório deve aparecer ao digitar apenas nome', function(){
        cy.get('#elementosForm\\:nome').type('Yuri')

        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('#elementosForm\\:cadastrar').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Sobrenome eh obrigatorio')
        })
    })

    it('Alerta sexo obrigatório deve aparecer caso não marcado', function(){
        cy.get('#elementosForm\\:nome').type('Yuri')
        cy.get('#elementosForm\\:sobrenome').type('Oliveira')
        cy.get('#elementosForm\\:comidaFavorita\\:0').check()
        cy.get('#elementosForm\\:escolaridade').select('Superior')
        cy.get('#elementosForm\\:esportes').select('Futebol')
        cy.get('#elementosForm\\:sugestoes').type('TESTANDO')

        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('#elementosForm\\:cadastrar').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Sexo eh obrigatorio')
        })
    })

    it('Alerta de confirmação vegetariano deve aparecer caso alguma outra opção seja selecionada', function(){
        cy.get('#elementosForm\\:nome').type('Yuri')
        cy.get('#elementosForm\\:sobrenome').type('Oliveira')
        cy.get('#elementosForm\\:sexo\\:0').check()
        cy.get('[type="checkbox"]').check(['carne', 'vegetariano'])
        cy.get('#elementosForm\\:escolaridade').select('Superior')
        cy.get('#elementosForm\\:esportes').select('Futebol')
        cy.get('#elementosForm\\:sugestoes').type('TESTANDO')

        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('#elementosForm\\:cadastrar').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Tem certeza que voce eh vegetariano?')
        })
    })

    it('Deve aparecer mensagem de confirmação e dados na página após cadastro', function(){
        cy.get('#elementosForm\\:nome').type('Yuri')
        cy.get('#elementosForm\\:sobrenome').type('Oliveira')
        cy.get('#elementosForm\\:sexo\\:0').check()
        cy.get('[type="checkbox"]').check(['pizza'])
        cy.get('#elementosForm\\:escolaridade').select('Superior')
        cy.get('#elementosForm\\:esportes').select('Futebol')
        cy.get('#elementosForm\\:sugestoes').type('TESTANDO')

        cy.get('#elementosForm\\:cadastrar').click()

        cy.wait(500)

        cy.get('#resultado > span').contains('Cadastrado!').should('be.visible')
        cy.get('#descNome').contains('Nome: Yuri').should('be.visible')
        cy.get('#descSobrenome').contains('Sobrenome: Oliveira').should('be.visible')
        cy.get('#descSexo').contains('Sexo: Masculino').should('be.visible')
        cy.get('#descComida').contains('Comida: Pizza').should('be.visible')
        cy.get('#descEscolaridade').contains('Escolaridade: superior').should('be.visible')
        cy.get('#descEsportes').contains('Esportes: Futebol').should('be.visible')
        cy.get('#descSugestoes').contains('Sugestoes: TESTANDO').should('be.visible')
        
    })

    it('Deve abrir popup', function(){
        cy.get('#buttonPopUpEasy').click()
    })

    it('Deve abrir popup do mal', function(){
        cy.get('#buttonPopUpHard').click()
    })

    it('Deve abrir input de resposta demorada e digitar nele', function(){
        cy.get('#buttonDelay').click()
        cy.wait(3000)
        cy.get('#novoCampo').type('TESTANDO')
    })

    it('Deve abrir alerta simples', function(){
        const stub = cy.stub()  
        cy.on('window:alert', stub)
        cy
        .get('#alert').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
        })  
    })

    it('Deve abrir "Confirm Simples" e alerta "Confirmado"', function(){
        const stub = cy.stub()

        stub.onFirstCall().returns(true)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy
        .get('#confirm').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Confirm Simples')
            expect(stub.getCall(1)).to.be.calledWith('Confirmado')
        })
    })

    it('Deve abrir "Confirm Simples" e alerta "Negado"', function(){
        const stub = cy.stub()

        stub.onFirstCall().returns(false)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy
        .get('#confirm').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Confirm Simples')
            expect(stub.getCall(1)).to.be.calledWith('Negado')
        })
    })

    it('Deve abrir prompt ao clicar no botão "Prompt"', function(){
        cy.visit('pages/toTest.html', {
            onBeforeLoad(win) {
                cy.stub(win, 'prompt')
            }
        })
        cy.get('#prompt').click()
        cy.window().its('prompt').should('be.called')
    })

    it('Deve abrir confirm e alert ao abrir prompt ao receber número', function(){
        cy.visit('pages/toTest.html', {
            onBeforeLoad(win) {
                cy.stub(win, 'prompt').returns('9999')
            }
        })

        const stub = cy.stub()

        stub.onFirstCall().returns(true)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy.get('#prompt').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Era 9999?')
            expect(stub.getCall(1)).to.be.calledWith(':D')
        })
    })

    it('Deve abrir confirm e alert ao abrir prompt ao receber string vazia', function(){
        cy.visit('pages/toTest.html', {
            onBeforeLoad(win) {
                cy.stub(win, 'prompt').returns('')
            }
        })

        const stub = cy.stub()

        stub.onFirstCall().returns(true)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy.get('#prompt').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Era ?')
            expect(stub.getCall(1)).to.be.calledWith(':D')
        })
    })

    it('Deve abrir confirm e alert ao abrir prompt ao receber null', function(){
        cy.visit('pages/toTest.html', {
            onBeforeLoad(win) {
                cy.stub(win, 'prompt').returns(null)
            }
        })

        const stub = cy.stub()

        stub.onCall().returns(false)
        stub.onFirstCall().returns(true)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy.get('#prompt').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Era null?')
            expect(stub.getCall(1)).to.be.calledWith(':D')
        })
    })

    it('Deve abrir confirm e alert ao abrir prompt e cancelar', function(){
        cy.visit('pages/toTest.html', {
            onBeforeLoad(win) {
                cy.stub(win, 'prompt').returns('9999')
            }
        })

        const stub = cy.stub()

        stub.onFirstCall().returns(false)
        stub.onSecondCall().returns(true)

        cy.on('window:confirm', stub)
        cy.on('window:alert', stub)

        cy.get('#prompt').click()
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Era 9999?')
            expect(stub.getCall(1)).to.be.calledWith(':(')
        })
    })

    it('Deve marcar todos checkboxes', function(){
        cy.get('[type="checkbox"]').check()
        cy.get('[type="checkbox"]').should('be.checked')

    })

    it('Deve desmarcar todos checkboxes', function(){
        cy.get('[type="checkbox"]').check()
        cy.get('[type="checkbox"]').uncheck()
        cy.get('[type="checkbox"]').should('not.be.checked')
    })

    it('Deve marcar todos radios', function(){
        cy.get('[type="radio"]').check()
        cy.get('[type="radio"]').should('be.checked')
    })

    it('Devem ser visíveis todos checkboxes na página', function(){
        cy.get('[type="checkbox"]').should('be.visible')
        //basicamente a mesma checagem pode ser utilizada com qualquer elemento da página
        //utilizei os checkboxes de exemplo
    })

    it('Deve abrir alerta de todos usuários da tabela ao clicar nos botões', function(){
        const stub = cy.stub()
        cy.on('window:alert', stub)
        cy
        .get('input[type=button]').get('[value="Clique aqui"]').click({ multiple: true })
        .then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Francisco')
            expect(stub.getCall(1)).to.be.calledWith('Maria')
            expect(stub.getCall(2)).to.be.calledWith('Usuario A')
            expect(stub.getCall(3)).to.be.calledWith('Doutorado')
            expect(stub.getCall(4)).to.be.calledWith('Usuario B')
        })  
    })

    it('Deve escrever e apagar em todos input text da tabela', function(){
        cy.get('#elementosForm\\:tableUsuarios > tbody > tr:nth-child(1) > td:nth-child(6) > input[type=text]').type('HAHAHAHA').clear()
        cy.get('#elementosForm\\:tableUsuarios > tbody > tr:nth-child(2) > td:nth-child(6) > input[type=text]').type('HAHAHAHA').clear()
        cy.get('#elementosForm\\:tableUsuarios > tbody > tr:nth-child(3) > td:nth-child(6) > input[type=text]').type('HAHAHAHA').clear()
        cy.get('#elementosForm\\:tableUsuarios > tbody > tr:nth-child(4) > td:nth-child(6) > input[type=text]').type('HAHAHAHA').clear()
        cy.get('#elementosForm\\:tableUsuarios > tbody > tr:nth-child(5) > td:nth-child(6) > input[type=text]').type('HAHAHAHA').clear()
    })

    it('Deve voltar página e aparecer mensagem "Voltou!"', function(){
        cy.get('body > center > a').click()
        cy.get('#resultado').contains('Voltou!').should('be.visible')
    })

    it('Deve conter "Usuario A" na tabela sem header', function(){
        cy.get('#tabelaSemJSF > tbody > tr:nth-child(2) > td:nth-child(1)').contains('Usuario A').should('be.visible')
        //outros itens pegos de maneira similar
    })

    it('Deve confirmar todas informações da segunda linha da tabela', function(){
        cy.contains('Francisco').parent('tr').within(() => { //para os demais itens só fazer a mesma coisa
            // todas pesquisas automaticamente roteadas de tr
            cy.get('td').eq(1).contains('Superior')
        })
    })

})

describe('Blog app', function() {

  const user = {
    name: "maco",
    username: "user1234",
    password: "password"
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })


  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrongusername')
      cy.get('#password').type('hardpassword')
      cy.get('#login-button').click()

      cy.get('.error').contains('Wrong username or password')
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
    })

    describe('When logged in', function() {

      beforeEach(function() {
        cy.login({ username: user.username, password: user.password })
        cy.visit('http://localhost:3000')
      })


      it('A blog can be created', function() {
        cy.reload()
        cy.contains('create new blog').click()
        cy.get('#title-input').type('test title')
        cy.get('#author-input').type('test author')
        cy.get('#url-input').type('test url')
        cy.get('#create-button').click()

        cy.get('.normal').contains("A new blog 'test title' by test author was added")
      })

      describe('with a created blog', function() {

        beforeEach(function() {
          cy.createBlog({ title: 'title1', author: 'author1', url: 'url1.com' })
          cy.createBlog({ title: 'title2', author: 'author2', url: 'url2.com' })
        })


        it('A blog can be liked', function() {
          cy.contains('view').click()
          cy.contains('like').click()
          console.log(`bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`)

          cy.get('.normal').contains("Updated blog 'title1' by author1")
        })

        it('User can delete own blog', function() {
          // ...
        })

        it('Blogs are ordered by likes', function() {
          // ...
        })

      })
    })
  })
})

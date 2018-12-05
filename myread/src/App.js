import React from "react";
import * as BooksAPI from "./component/BooksAPI";
import "./App.css";
import WantToRead from "./component/WantToRead.js";
import Read from "./component/Read.js";
import CurrentlyReading from "./component/CurrentlyReading.js";
import { Route } from "react-router-dom";
import SearchPage from "./component/SearchPage.js";
import { Link } from "react-router-dom";

class BooksApp extends React.Component {
  state = {
    books: [],
    isFetchSolved: false,
  };
  componentDidMount() {
    BooksAPI.getAll()
      .then(books => {
        this.setState({ books });
        this.setState({ isFetchSolved: true });
      })
      .catch(err => console.log(err));
  }
  reloadBooks() {
    if (window.confirm('Bookshelf updated do you want to reload?')) {
      window.location.reload()
    };
  }
  updateDatabaseBookShelf(event, book) {
    BooksAPI.update(book, event.target.value).then(() => {
        window.location.reload();
    }).catch(err => console.log(`Error occurred while changing shelf ${err}`));
  }
  
  render() {
    return this.state.isFetchSolved && (
      <div className="app">
        <Route
          path="/"
          exact
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <CurrentlyReading
                  handleSelection={this.updateDatabaseBookShelf}
                  books={this.state.books}
                />
                <WantToRead
                  handleSelection={this.updateDatabaseBookShelf}
                  books={this.state.books}
                />
                <Read
                  handleSelection={this.updateDatabaseBookShelf}
                  books={this.state.books}
                />
              </div>
              <div className="open-search">
                <Link to="/search">Add Book</Link>
              </div>
            </div>
          )}
        />
        <Route
          clickHandler={(book, read) => {
            BooksAPI.update(book, read);
            console.log(book);
          }}
          exact
          path="/search"
          component={SearchPage}
          library = {this.state.books}
        />
      </div>
    )
  }
}


 
export default BooksApp;
import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./../App.css";
import { Link } from "react-router-dom";

class SearchPage extends Component {
  state = {
    books: [],
    myShelfBooks: [],
    searchQuery: ""
  };
  APICallHistory = null;
  fetchHistory = [];
  storedBook = "none";
  getBooks = () => {
    clearTimeout(this.APICallHistory);
    if (this.state.searchQuery !== "none") {
      this.setState({ books: [] });
      this.APICallHistory = setTimeout(() => {
        this.fetchHistory.push(this.state.searchQuery);
        BooksAPI.search(this.state.searchQuery)
          .then(books => {
            BooksAPI.getAll()
              .then(b => {
                if (
                  this.fetchHistory[this.fetchHistory.length - 1] ===
                  this.state.searchQuery
                ) {
                  this.setState({ myShelfBooks: b });
                  this.setState({ books });
                }
              })
              .catch(err => alert(`Error Occurred when fetching books : ${err}`));
          })
          .catch(err => {
            console.log(err);
          });
      }, 100);
    }
  };
  handleSelection(event, book) {
    let shelf = event.target.value;
    BooksAPI.update(book, shelf)
      .then(() => {
        this.props.history.push("/");
        window.location.setState();
      })
      .catch(err => console.log(`Error while adding book: ${err}`));
  }
  handleChange(event) {
    this.setState({ searchQuery: event.target.value });
  }
  handleKeyUp(event) {
    if (event.which !== 8 && event.which !== 13) {
      if (event.target.value !== "") {
        this.getBooks();
      }
    }
    if (this.state.searchQuery === "") {
      this.setState({ books: {} });
    }
  }
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Back
          </Link>
          <div className="search-books-input-wrapper">
            <input
              autoFocus={true}
              className="input-field"
              onChange={this.handleChange.bind(this)}
              onKeyUp={this.handleKeyUp.bind(this)}
              type="text"
              placeholder="Search by title or author"
            />
          </div>
        </div>
        <div className="search-books-results">
          {this.state.books.length > 0 && (
            <ol className="books-grid">
              {this.state.books.map(book => {
                let url;
                book.imageLinks
                  ? (url = book.imageLinks.smallThumbnail)
                  : (url = "");
                return (
                  <li key={book.id}>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 193,
                            backgroundImage: `url(${url})`
                          }}
                        />
                        {/* option menu check mark function starts from here */}
                        <div className="book-shelf-changer">
                          {this.state.myShelfBooks.find(
                            item => item.id === book.id
                          ) !== undefined ? (
                            <div>
                              {this.state.myShelfBooks
                                .filter(item => {
                                  return item.id === book.id;
                                })
                                .map(item => {
                                  return (
                                    <select
                                      key={item.id}
                                      defaultValue="none"
                                      onChange={event => {
                                        this.handleSelection(event, book);
                                      }}
                                    >
                                      <option value="move" disabled>
                                        Move to...
                                      </option>
                                      <option value="currentlyReading">
                                        {item.shelf === "currentlyReading"
                                          ? "Currently Reading (added)"
                                          : "Currently Reading"}
                                      </option>
                                      <option value="wantToRead">
                                        {item.shelf === "wantToRead"
                                          ? "Want to Read (added)"
                                          : "Want to Read"}
                                      </option>
                                      <option value="read">
                                        {item.shelf === "read"
                                          ? "Read (added)"
                                          : "Read"}
                                      </option>
                                      <option value="none">None</option>
                                    </select>
                                  );
                                })}
                            </div>
                          ) : (
                            <select
                              defaultValue="move"
                              onChange={event => {
                                this.handleSelection(event, book);
                              }}
                            >
                              <option value="move" disabled>
                                Move to...
                              </option>
                              <option value="currentlyReading">
                                Currently Reading
                              </option>
                              <option value="wantToRead">Want to Read</option>
                              <option value="read">Read</option>
                              <option value="none">None (added)</option>
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {this.state.books.error && (
            <div
              style={{
                maxWidth: "400px",
                height: "auto",
                textAlign: "center",
                fontSize: "16px",
                margin: "auto"
              }}
            >
              <span style={{ color: "red", fontSize: "30px" }}>! 404 </span> No
              Books Found
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchPage;

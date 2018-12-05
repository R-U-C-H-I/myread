import React, { Component } from 'react';


class Read extends Component {
    books = this.props.books;

  render() {
    return (
      <div>
        <div className="bookshelf">
          <h2 className="bookshelf-title">Complete Reading</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
              {this.books.map(book => {
                if (book.shelf === "read") {
                  return (
                    <li key={book.id}>
                      <div className="book">
                        <div className="book-top">
                          <div
                            className="book-cover"
                            style={{
                              width: 128,
                              height: 193,
                              backgroundImage: `url(${
                                book.imageLinks.smallThumbnail
                              })`
                            }}
                          />
                          <div className="book-shelf-changer">
                            <select defaultValue={book.shelf} onChange={event => this.props.handleSelection(event, book)}>
                              <option value="move" disabled>
                                Move to...
                              </option>
                              <option value="currentlyReading">
                                Currently Reading
                              </option>
                              <option value="wantToRead">Want to Read</option>
                              <option value="read">Read (Added)</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                        </div>
                        <div className="book-title">{book.title}</div>
                        <div className="book-authors">{book.authors}</div>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

 
export default Read;
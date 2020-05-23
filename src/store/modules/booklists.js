import { booklistsCollection } from "@/firebaseConfig"
import firebase from "firebase";

const state = {
  booklists: [],
  booksInBooklist: [],
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y"
};

const getters = {
  getBooklists: state => state.booklists,
  getBooksInBooklist: state => state.booksInBooklist
};

const actions = {
  createBooklist({ dispatch, rootState }, name) {
    booklistsCollection
      .doc()
      .set({
        listName: name,
        userId: rootState.user.currentUser.uid,
        position: "",
        status: "",
        books: []
      })
      .then(() => {
        console.log("booklist created");
        dispatch("setBooklists");
      })
      .catch(err => {
        console.log(err);
      });
  },
  deleteBooklist({ dispatch }, id) {
    booklistsCollection
      .doc(id)
      .delete()
      .then(() => {
        console.log("booklist deleted");
        dispatch("setBooklists");
      })
      .catch(err => {
        console.log(err);
      });
  },
  setBooklists({ commit, rootState }) {
    let booklistArray = [];
    booklistsCollection
      .where("userId", "==", rootState.user.currentUser.uid)
      .get()
      .then(res => {
        res.docs.forEach(list => {
          booklistArray.push({
            listId: list.id,
            listName: list.data().listName,
            status: list.data().status,
            position: list.data().position,
            books: list.data().books
          })
        })
        console.log("setting booklistArray: ", booklistArray)
        commit("setBooklists", booklistArray);
      })
      .catch(err => {
        console.log(err);
      });
  },
  addBookToList({ dispatch }, properties) {
    console.log("properties of added book: ", properties)
    const comment = properties.comment;
    const listId = properties.selectedList.listId;
    const booklist = state.booklists.find(item => item.listId === listId);
    const number = booklist.books.length + 1;
    const newBook = {
      number: number, 
      bookId: properties.book.id,
      comment: comment
    };
    booklistsCollection
      .doc(listId)
      .update({
        books: firebase.firestore.FieldValue.arrayUnion(newBook)
      })
      .then(() => {
        dispatch("setBooklists");
      })
      .catch(err => {
        console.log(err);
      });
  },
  updateBookNumbers({ dispatch }, deletedBook) {
    const deletedNumber = deletedBook.number;
    const booklist = state.booklists.filter(item => item.listId === deletedBook.listId);
    const booksArray = booklist[0].books;
    let updatedBooklist = [];
    booksArray.forEach(book => {
      if(book.number > deletedNumber) {
        book.number --;
      }
      updatedBooklist.push(book);
    })
    console.log("updated list", updatedBooklist);
    booklistsCollection
      .doc(deletedBook.listId)
      .update({
        books: updatedBooklist
      })
      .then(() => {
        dispatch("setBooklists");
      })
      .catch(err => {
        console.log(err);
      });

    dispatch("setBooklists");
  },
  updateBookComment({ dispatch }, updatedBook) {
    const booklist = state.booklists.filter(item => item.listId === updatedBook.listId);
    const booksArray = booklist[0].books;
    let updatedBooklist = [];
    booksArray.forEach(book => {
      if(book.bookId === updatedBook.bookId) {
        book.comment = updatedBook.comment;
      }
      updatedBooklist.push(book);
    })
    console.log("updated list", updatedBooklist);
    booklistsCollection
      .doc(updatedBook.listId)
      .update({
        books: updatedBooklist
      })
      .then(() => {
        dispatch("setBooklists");
      })
      .catch(err => {
        console.log(err);
      });

    dispatch("setBooklists");
    setTimeout(() => {
      console.log("timeout");
      dispatch("setBooksInBooklist", updatedBook.listId);
    }, 1500);
  },

  setBooksInBooklist({ state, commit }, listId) {
    console.log("setBooksInBooklist listId: ", listId)
    const booklist = state.booklists.filter(item => item.listId === listId);
    const booksArray = booklist[0].books;
    console.log("booksArray: ", booksArray)
    let fetchedBooks = [];
    booksArray.forEach(book => {
      fetch(`https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${state.apiKey}`)
          .then(response => response.json())
          .then(data => {
            fetchedBooks.push(
              {
                number: book.number,
                bookId: book.bookId,
                comment: book.comment,
                details: data.volumeInfo
              }
            );
          })
          .catch(error => console.log(error))
    });
    console.log("fetched books to be set: ", fetchedBooks);
    commit("setBooksInBooklist", fetchedBooks);
  }
};

const mutations = {
  setBooklists( state, booklists ) {
    state.booklists = booklists;
  },
  setBooksInBooklist( state, fetchedBooks ) {
    console.log("setting state booksInBooklist", fetchedBooks);
    state.booksInBooklist = fetchedBooks;
    console.log("state.booksInBooklist: ", state.booksInBooklist);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
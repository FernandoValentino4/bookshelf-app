(() => {
  let books = [];

  function addBook(event) {
    event.preventDefault();

    const titleInput = document.getElementById("inputBookTitle");
    const authorInput = document.getElementById("inputBookAuthor");
    const yearInput = document.getElementById("inputBookYear");
    const isCompleteCheckbox = document.getElementById("inputBookIsComplete");

    const newBook = {
      id: +new Date(),
      title: titleInput.value,
      author: authorInput.value,
      year: parseInt(yearInput.value, 10),
      isComplete: isCompleteCheckbox.checked,
    };

    console.log(newBook);

    books.push(newBook);
    document.dispatchEvent(new Event("bookChanged"));

    Swal.fire({
      title: "Buku Ditambahkan!",
      text: "Buku berhasil ditambahkan ke rak.",
      icon: "success",
    });

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteCheckbox.checked = false;
  }

  function searchBooks(event) {
    event.preventDefault();

    const searchInput = document.getElementById("searchBookTitle");
    const query = searchInput.value;

    if (query) {
      const matchingBooks = books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase()));
      displayBooks(matchingBooks);
    } else {
      displayBooks(books);
    }
  }

  function markAsComplete(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        isComplete: true,
      };

      document.dispatchEvent(new Event("bookChanged"));

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Buku Selesai Dibaca!",
        text: "Selamat! Buku telah ditandai sebagai sudah selesai.",
        showConfirmButton: false,
        timer: 1700,
      });
    }
  }

  function markAsIncomplete(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        isComplete: false,
      };

      document.dispatchEvent(new Event("bookChanged"));

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Buku Belum Selesai Dibaca!",
        text: "Buku telah dikembalikan ke daftar belum selesai dibaca.",
        showConfirmButton: false,
        timer: 1700,
      });
    }
  }

  function removeBook(event) {
    const bookId = Number(event.target.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "darkgreen",
        cancelButtonColor: "darkred",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          books.splice(bookIndex, 1);
          document.dispatchEvent(new Event("bookChanged"));
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    }
  }

  function displayBooks(booksToDisplay) {
    const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
    const completeBookshelfList = document.querySelector("#completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of booksToDisplay) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");

      const titleHeading = document.createElement("h2");
      titleHeading.innerText = book.title;

      const authorParagraph = document.createElement("p");
      authorParagraph.innerText = "Penulis: " + book.author;

      const yearParagraph = document.createElement("p");
      yearParagraph.innerText = "Tahun: " + book.year;

      bookItem.appendChild(titleHeading);
      bookItem.appendChild(authorParagraph);
      bookItem.appendChild(yearParagraph);

      const actionDiv = document.createElement("div");
      actionDiv.classList.add("action");

      const completeButton = document.createElement("button");
      completeButton.id = book.id;
      completeButton.innerText = book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
      completeButton.classList.add("green");
      completeButton.addEventListener("click", book.isComplete ? markAsIncomplete : markAsComplete);

      const deleteButton = document.createElement("button");
      deleteButton.id = book.id;
      deleteButton.innerText = "Hapus buku";
      deleteButton.classList.add("red");
      deleteButton.addEventListener("click", removeBook);

      actionDiv.appendChild(completeButton);
      actionDiv.appendChild(deleteButton);

      bookItem.appendChild(actionDiv);

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadFromLocalStorage() {
    books = JSON.parse(localStorage.getItem("books")) || [];
    displayBooks(books);
  }

  window.addEventListener("load", () => {
    loadFromLocalStorage();

    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");

    inputBookForm.addEventListener("submit", addBook);
    searchBookForm.addEventListener("submit", searchBooks);

    document.addEventListener("bookChanged", () => {
      saveToLocalStorage();
      loadFromLocalStorage();
    });
  });
})();

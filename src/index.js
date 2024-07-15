let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys on page load
  fetchToys();

  // Function to fetch toys from the server
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(renderToy);
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Function to render a toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.toyId = toy.id;

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-toy-id="${toy.id}">Like ❤️</button>
    `;

    const likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      increaseLikes(toy);
    });

    toyCollection.appendChild(card);
  }

  // Handle form submission to create a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(toyForm);
    const name = formData.get("name");
    const image = formData.get("image");

    if (name && image) {
      createToy(name, image);
      toyForm.reset();
    } else {
      alert("Please enter both toy name and image URL.");
    }
  });

  // Function to create a new toy
  function createToy(name, image) {
    const formData = {
      name: name,
      image: image,
      likes: 0 // initialize likes to 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy); // render the newly created toy card
    })
    .catch(error => console.error("Error creating toy:", error));
  }

  // Function to increase likes of a toy
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      // Update toy's like count in the DOM
      const toyCard = document.querySelector(`.card[data-toy-id="${updatedToy.id}"]`);
      if (toyCard) {
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      }
    })
    .catch(error => console.error("Error updating likes:", error));
  }
});


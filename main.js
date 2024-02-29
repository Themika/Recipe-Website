import "./style.css";
const generateCard = async (response) => {
  for (let i = 0; i < 6; i++) {
    const result = response.data[i];

    const urlSlug = `https://tasty-co.p.rapidapi.com/recipes/detail?slug=${result.slug}`;
    const slugOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "", // use your own api key from rapidapi Tasty-Co
        "X-RapidAPI-Host": "tasty-co.p.rapidapi.com",
      },
    };

    try {
      const responseSlug = await fetch(urlSlug, slugOptions);
      const resultSlug = await responseSlug.json();

      // Generate unique IDs for pop-ups
      const popUpId = `popup${i}`;

      // Loop through instructions and concatenate them
      let instructionsHtml = "";
      resultSlug.data.recipe.instructions.forEach((instruction) => {
        instructionsHtml += `<p>${instruction.display_text}</p>`;
      });

      let ingredientsHtml = "";
      resultSlug.data.recipe.ingredient_sections.forEach(
        (ingredientSection) => {
          ingredientsHtml += `<h3>${ingredientSection.name}</h3>`;

          ingredientSection.ingredients.forEach((ingredient) => {
            ingredientsHtml += `<h4>${ingredient.name}</h4>`;
          });
        }
      );

      const foodCard = `
        <div class="card">
          <div class="left-side">
            <img src="${result.thumb_big}" id="productimage" alt="">
            <h2>${result.name}</h2>
            <button type="submit" class="btn" onclick="openPopUp('${popUpId}')">Read More</button>
            <div class="pop-up" id="${popUpId}">
              <header>
                <h3>Description</h3>
                <p>${resultSlug.data.recipe.description}</p>
              </header>
              <section>
                <h3>Ingredients</h3>
                ${ingredientsHtml}
              </section>
              <aside>
                <h3>Instructions</h3>
                ${instructionsHtml}
              </aside>
              <main>
                <img src="${resultSlug.data.recipe.thumb_big}">
              </main>
              <footer>
                <button onclick="closePopUp('${popUpId}')">Close</button>
              </footer>
            </div>
          </div>
        </div>
      `;

      document.getElementById("container").innerHTML += foodCard;
    } catch (error) {
      console.error(error);
    }
  }
};

const fetchData = async () => {
  const button = document.getElementById("q");
  const searchBar = document.getElementById("searchInput");

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const inputValue = searchBar.value.trim();
    if (inputValue !== "") {
      const url = `https://tasty-co.p.rapidapi.com/recipes/search?query=${inputValue}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "", // use your own api key from rapidapi Tasty-Co
          "X-RapidAPI-Host": "tasty-co.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        generateCard(result);
      } catch (error) {
        console.error(error);
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

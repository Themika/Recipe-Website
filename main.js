import "./style.css";

const generateCard = async (response) => {
  for (let i = 0; i < 6; i++) {
    const result = response.data[i];

    const urlSlug = `https://tasty-co.p.rapidapi.com/recipes/detail?slug=${result.slug}`;
    const slugOptions = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '21c98ce353msh2e77624f518ce0bp1fb9f3jsn84b6d813ebd7',
        'X-RapidAPI-Host': 'tasty-co.p.rapidapi.com'
      }
    };

    try {
      const responseSlug = await fetch(urlSlug, slugOptions);
      const resultSlug = await responseSlug.json();
      console.log(responseSlug);
      // Loop through instructions and concatenate them
      let instructionsHtml = '';
      resultSlug.data.recipe.instructions.forEach((instruction) => {
        instructionsHtml += `<p>${instruction.display_text}</p>`;
      });
      let ingredientsHtml = '';
      resultSlug.data.recipe.ingredient_sections.forEach((ingredientSection) => {
        ingredientsHtml += `<h3>${ingredientSection.name}</h3>`;
        
        ingredientSection.ingredients.forEach((ingredient) => {
          ingredientsHtml += `<h4>${ingredient.name}</h4>`;
        });
      });
      const foodCard = `
        <div class="card">
          <div class="left-side">
            <img src="${result.thumb_big}" id="productimage" alt="">
            <h2>${result.name}</h2>
            <button type="submit" class="btn" onclick="openPopUp()">Read More</button>
            <div class="pop-up" id="popup">
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
            <img src = "${resultSlug.data.recipe.thumb_big}">
            </main>
            <footer>
            <button onclick="closePopUp()">Close</button>
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
  const button = document.getElementById('q');

  button.addEventListener('click', async () => {
    const array = [];
    const searchBar = document.getElementById('searchBar');
    array.push(searchBar.value);
    array[0] = "banana"; // Not sure why you're setting this to "banana", please adjust as needed.

    if (array.length === 1) {
      const url = `https://tasty-co.p.rapidapi.com/recipes/search?query=${array[0]}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '21c98ce353msh2e77624f518ce0bp1fb9f3jsn84b6d813ebd7',
          'X-RapidAPI-Host': 'tasty-co.p.rapidapi.com'
        }
      };

      try {
        if (array.length === 1) {
          const response = await fetch(url, options);
          const result = await response.json();
          generateCard(result);
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});


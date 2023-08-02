let countries;
let Arraycountries = cb => {
  const xhr = new XMLHttpRequest();         // To display JSON data in the web browser, i serve the JSON data through an HTTP server
                                            //and fetch it using client-side JavaScript (e.g., AJAX) or load it directly in the HTML using a script tag.
  xhr.open("GET", "data/list.json");
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const cart = JSON.parse(xhr.responseText);
      cb(null, cart);
    } else {
      cb(new Error("Failed to fetch JSON data"));
    }
  };
  xhr.onerror = () => {
    cb(new Error("Failed to fetch JSON data"));
  };
  xhr.send();
};

Arraycountries((err, result) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  countries = result; // Assign the result to the countries variable

  const deleteIter = arr => {
    return Array.from(new Set(arr));
  };

  const mostSpokenLanguages = (arr, num) => {
    let total = arr
      .map((el) => el.languages)
      .join(", ")
      .split(",")
      .sort();

    const langs = deleteIter(total);

    const results = [];

    for (let index = 0; index < langs.length; index++) {
      let counter = 0;
      for (let j = 0; j < total.length; j++) {
        if (langs[index] == total[j]) {
          counter++;
        }
      }
      results.push({ name: langs[index], count: counter });
    }
    return results
      .sort(function(a, b) {
        if (a.count > b.count) return -1;
        if (a.count < b.count) return 1;
        return 0;
      })
      .slice(0, num);
  };

  let label = document.querySelector("label");
  let popButton = document.getElementById("pop");
  let lanButton = document.getElementById("lan");
  let container = document.querySelector(".container");
  let world = 0;
  let mostPop = countries.slice();
  mostPop = mostPop.sort((a, b) => b.population - a.population).slice(0, 10);

  for (const country of countries) {
    world += country.population;
  }

  let mostLan = mostSpokenLanguages(countries, 10);

  popButton.addEventListener("click", function() {
    label.textContent = "10 most country populated in the world";
    container.innerHTML = "";
    for (let country of mostPop) {
      container.innerHTML += `<p> ${country.name}</p>`;
      container.innerHTML += `<div style="width: ${((country.population * 100 * 5) / world).toFixed(2)}%"> </div>`;
      container.innerHTML += `<p> ${country.population.toLocaleString("en-US")}</p>`;
    }
  });

  lanButton.addEventListener("click", function() {
    label.textContent = "10 most spoken languages in the world";
    container.innerHTML = "";
    for (let lang of mostLan) {
      container.innerHTML += `<p> ${lang.name}</p>`;
      container.innerHTML += `<div style="background-color: rgb(255, 171, 36); width: ${((lang.count * 100) / 112).toFixed(2)}%"> </div>`;
      container.innerHTML += `<p> ${lang.count.toLocaleString("en-US")}</p>`;
    }
  });
});
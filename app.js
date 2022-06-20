/* Hello ! | 10€ | Voici un billet fictif pour te corrompre.

Non pardon, bienvenue dans ce magnifique JS (c'est faux)
 */


// Declaration des variables dont j'aurais besoin partout
const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
let goodAnswer = "";
let score = 0;
let allAnswers = [];
let step = 0;
const elements = {
  cocktailImg: document.querySelector(".cocktailImg"),
  cocktailName: document.querySelector(".cocktailName"),
  challengeResponses: document.querySelector(".challenge-responses"),
  challengeContainer: document.querySelector(".challenge-container"),
  scoreNumber: document.querySelectorAll(".score-number"),
  endContainer: document.querySelector(".end-container"),
  startContainer: document.querySelector(".start-container"),
  loader: document.querySelector(".loader"),
  startButton: document.querySelector(".start-container button"),
  descriptionButton : document.querySelector(".moreInfo"),
  description: document.querySelector('.cocktail-description')
};
// Initialisation
const init = () => {
  isGoodAnswer();
};
// Lorsque start se déclenche, on affiche le jeu
const start = () => {
  elements.startContainer.remove();
  elements.challengeContainer.classList.remove("hide");
};
// Création de la bonne réponse, async et await me servent à faire patienter mes fonctions pour éviter que certaines se déclenchent avant d'autre
// J'ai trouvé cette solution sur internet pour palier aux problèmes du tableau allAnswers qui était trié avant qu'il y contienne quelque chose, ce qui était quelque peu embêtant
const isGoodAnswer = () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then(async (cocktailInfos) => {
      await assignGoodAnswer(cocktailInfos);

      const answers = await getAnswers();


// La méthode map() crée un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant.
      answers.map((answer) => allAnswers.push(answer));
// Une fois que tout est récupéré et en place, on vire le loader, et on affiche le bouton pour lancer le jeu
      elements.loader.remove();
      elements.startButton.classList.remove("hide");
      elements.startButton.addEventListener("click", start, {
        once: true,
      });

      setRandomizeAnswersButtons();
    });
};
// On va chercher la bonne réponse dans le cocktailInfos, afin d'y afficher l'image et de stocker son nom
const assignGoodAnswer = async (cocktailInfos) => {
  goodAnswer = cocktailInfos.drinks[0].strDrink;
  elements.description.classList.add("hide");
  elements.cocktailImg.setAttribute(
    "src", cocktailInfos.drinks[0].strDrinkThumb
  );

  // Petit bouton pour montrer une description qui permet à l'utilisateur d'avoir un indice sur le nom
elements.descriptionButton.addEventListener('click', removeOrAdd = () => {
if (elements.description.classList.contains('hide')) {
  elements.description.classList.remove("hide");
  elements.description.textContent = cocktailInfos.drinks[0].strInstructions;
}
else{
  elements.description.classList.add("hide");
}

});


};

// Le plus dur, on setup les boutons avec la bonne réponse et trois autres

const setRandomizeAnswersButtons = () => {
  const selectedCocktails = [];

  for (let i = 0; i < 4; i++) {
    const selectedCocktail = getArrayRandomElement(allAnswers);
    const cocktailIndex = allAnswers.indexOf(selectedCocktail);
    allAnswers.splice(cocktailIndex, 1);
    selectedCocktails.push(selectedCocktail);
  }

  selectedCocktails.map((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.value = answer;
    button.addEventListener("click", () => checkAnswer(answer));
    elements.challengeResponses.appendChild(button);
  });
};
// Récupération des réponses pour pouvoir les mettre sur les boutons
const getAnswers = async () => {
  let answers = [goodAnswer];
  for (let index = 0; index < 3; index++) {
    await fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => answers.push(data.drinks[0].strDrink));
  }

  return answers;
};
// Mélange du tableau
const getArrayRandomElement = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};
// Vérif réponse choisie et bonne réponse, si ok on incrémente le score
const checkAnswer = (answer) => {
  if (step <= 10) {
    if (answer === goodAnswer) {
      score++;
      elements.scoreNumber.forEach(
        (scoreElement) => (scoreElement.textContent = score)
      );
    }

    resetChallenge();
    step++;
// Quand on est arrivé à 10 réponses, on affiche une section avec score final et possibilité de rejouer
    if (step === 10) {
      elements.endContainer.classList.remove("hide");
      elements.challengeContainer.classList.add("hide");
    }
  }
};
// On vide tout et on recommence !
const resetChallenge = () => {
  elements.challengeResponses.innerHTML = "";
  isGoodAnswer();
};

const nextChallenge = () => {
  step = 0;
  goodAnswer = "";
  score = 0;
  allAnswers = [];
  step = 0;

  elements.scoreNumber.forEach(
    (scoreElement) => (scoreElement.textContent = score)
  );
  elements.challengeContainer.classList.remove("hide");
  elements.endContainer.classList.add("hide");

  resetChallenge();
};


init();

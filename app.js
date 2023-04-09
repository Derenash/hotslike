// Function to generate a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random hero from the heroes array
function getRandomHero() {
  const randomIndex = getRandomInt(0, heroes.length - 1);
  return heroes[randomIndex];
}

function remove_from_list(list, value) {
  for(var i = 0; i < list.length; i++) {
    if(list[i] === value) {
      list.splice(i, 1);
      i--;
    }
  }
  return list;
}


function generateRandomString(usedHeroes) {
  let randomHero;

  // Generate a random hero until it is not in the usedHeroes array
  do {
    randomHero = getRandomHero();
  } while (usedHeroes.includes(randomHero));

  // Add the new hero to the usedHeroes array
  usedHeroes.push(randomHero);

  // Get the talents of the hero
  const heroTalents = heroes_talents[randomHero];

  // Generate a random number for each talent
  let randomNumbers = "";
  for (let i = 0; i < heroTalents.length; i++) {
    const maxTalentIndex = heroTalents[i].length;

    // Apply the talent limitations
    let chosenTalent;
    let invalidTalents = [];
    do {
      chosenTalent = getRandomInt(1, maxTalentIndex);
      console.log(randomNumbers)
      if (i === 6) {
        const Ultimate = randomNumbers[3];

        // Check for hero-specific limitations
        switch (randomHero) {
          case "fenix":
            if (Ultimate === "1") {
              invalidTalents = [1];
            }
            break;
          case "zeratul":
            if (Ultimate === "2") {
              invalidTalents = [1];
            }
            break;
          case "varian":
            invalidTalents = remove_from_list([1, 2, 3], parseInt(randomNumbers[1]));
            break;
          case "garrosh":
            invalidTalents = remove_from_list([1, 2], parseInt(Ultimate))
            if (randomNumbers[0] !== "3") {
              invalidTalents += 4;
            }
            break;
          default:
            if (randomHero !== "deathwing" && randomHero !== "tracer" && randomHero !== "maiev") {
              invalidTalents = remove_from_list([1, 2], parseInt(Ultimate));
            }
            break;
        }
      }
    } while ((chosenTalent > maxTalentIndex) || (invalidTalents.includes(chosenTalent)));

    randomNumbers += chosenTalent;
  }

  // Return the generated string
  return `[T${randomNumbers},${randomHero}]`;
}



// Event listener for the generate button
document.getElementById("generate-btn").addEventListener("click", () => {
  document.getElementById("random-hero").textContent = generateRandomString();
});

// Function to create a talent card element
function createTalentCard() {
  const card = document.createElement("div");
  card.className = "card";
  return card;
}

// Functions to get the image source of a talent or hero
function getImageSrc(talent) {
  return `heroes/abilitytalents/${talent}.png`;
}

function getHeroImageSrc(heroName) {
  return `heroes/heroportraits/ui_targetportrait_hero_${heroName}.png`;
}

// Function to display the images of a talent code on a card
function displayTalentImages(talentCode, card) {
  const heroName = talentCode.match(/(?<=,)[^\]]+/)[0];
  const talents = heroes_talents[heroName];
  const talentNumbers = talentCode.match(/\d+/g)[0];

  const talentCard = card;
  talentCard.innerHTML = "";

  // Create the first row of the card
  const firstRow = document.createElement("div");
  firstRow.className = "firstRow";
  talentCard.appendChild(firstRow);

  // Add the hero image
  const heroImg = document.createElement("img");
  heroImg.src = getHeroImageSrc(heroName);
  heroImg.alt = heroName;
  heroImg.className = "hero";
  firstRow.appendChild(heroImg);

  // Add the ultimate talent image
  const ult = talents[3][(parseInt(talentNumbers[3]) - 1)];
  const ultImg = document.createElement("img");
  ultImg.src = getImageSrc(ult);
  ultImg.alt = ult;
  ultImg.className = "ult";
  firstRow.appendChild(ultImg);

  // Create the container for the other talents
  const talentsContainer = document.createElement("div");
  talentsContainer.className = "talents";
  talentCard.appendChild(talentsContainer);

  // Add the other talent images
  for (let i = 0; i < talentNumbers.length; i++) {
    if (i === 3) {
      continue;
    }
    const talentIndex = parseInt(talentNumbers[i]) - 1;
    const talent = talents[i][talentIndex];
    const img = document.createElement("img");
    img.src = getImageSrc(talent);
    img.alt = talent;
    talentsContainer.appendChild(img);
  }
}


// Event listener for the generate button
document.getElementById("generate-btn").addEventListener("click", () => {
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = ""; // Clear previous cards

  const usedHeroes = [];

  // Generate 5 talent codes
  for (let i = 0; i < 5; i++) {
    const talentCode = generateRandomString(usedHeroes);
    const card = createTalentCard();
    displayTalentImages(talentCode, card);
    cardsContainer.appendChild(card);
  }
});
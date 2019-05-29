const baseURL = "https://api.pokemontcg.io/v1/cards"; //BASE_URL


//Generating DOM
// createNode == creatElement
//append = appendChild(child, parent)

const createTag = (nameOfTag, tagAttributes, content, parentTag) => {
    var tag = document.createElement(nameOfTag); //No Var

    //setting attributes for the tag.

    if (tagAttributes != null)
        for (let attribute in tagAttributes) {
            tag.setAttribute(attribute, tagAttributes[attribute]);
        }

    //setting content of the tag.

    if (content != null) {
        var node = document.createTextNode(content);
        tag.appendChild(node);
    }

    //appending newly created tag to its parent.

    var parent = document.getElementById(parentTag);
    parent.appendChild(tag);
}

class Pokedex {
    constructor(card_type) {

        this.card_type = card_type;
    }
    generateURL(name) {
        let typeID = "";
        if (this.card_type === "item") {
            typeID = "subtype";
        } else {
            typeID = "supertype";
        }
        return `${baseURL}?${typeID}=${this.card_type}&name=${name}`;

    }
    getCards(name) {
        //let completeURL = this.generateCompleteURL(name);
        return fetch(this.generateURL(name)).then(response => response.json());

    }
}

async function search(card_type, name_id) {
    let pokedex = new Pokedex(card_type);
    let name = document.getElementById(`${name_id}`).value;
    return await pokedex.getCards(name);
}

async function generateRequiredDetails(card_type, name_id) {
    let result = await search(card_type, name_id);
    console.log(result);
    let requiredDetails = [];
    result.cards.forEach(element => {
        let name = element.name;
        let card_id = element.id;
        let imageUrl = element.imageUrl;
        let requiredCardDetails = { name, card_id, imageUrl };
        requiredDetails.push(requiredCardDetails);
    });
    return requiredDetails;
}

function displayCards(card_type, name_id) {
    let cardDeckID = "cardsSection"
    document.getElementById(cardDeckID).innerHTML = "";
    let requiredDetails = generateRequiredDetails(card_type, name_id).then(requiredDetails => {
        for (let index in requiredDetails) {
            createTag(`div`, { "class": `card`, "id": `${index}` }, null, `cardsSection`);
            createTag(`img`, { "class": `card-img`, "src": `${requiredDetails[index].imageUrl}`, "alt": `${requiredDetails[index].name}` }, null, `${index}`);
            createTag(`div`, { "class": `card-body`, "id": `body${index}` }, null, `${index}`);
            createTag(`h4`, { "id": `card-name` }, `${requiredDetails[index].name}`, `body${index}`);
        }
    });
}
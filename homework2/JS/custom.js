const baseURL = "https://api.pokemontcg.io/v1/cards";

const createTag = (nameOfTag, tagAttributes, content, parentTag) => {
    var tag = document.createElement(nameOfTag);

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

class Fetcher {
    constructor(card_type) {

        this.card_type = card_type;
    }
    generateCompleteURL(name) {
        let typeID = "";
        if (this.card_type === "item") {
            typeID = "subtype";
        } else {
            typeID = "supertype";
        }
        let completeURL = `${baseURL}?${typeID}=${this.card_type}&name=${name}`;
        return completeURL;
    }
    getCards(name) {
        let completeURL = this.generateCompleteURL(name);
        let result = fetch(completeURL).then(response => response.json());
        return result;
    }
}

async function search(card_type, name_id) {
    let fetcher = new Fetcher(card_type);
    let name = document.getElementById(`${name_id}`).value;
    let result = await fetcher.getCards(name);
    return result;
    //console.log(result);
}

async function generateRequiredDetails(card_type, name_id) {
    let result = await search(card_type, name_id);
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

async function displayCards(card_type, name_id) {
    let cardDeckID = "cardsSection"
    document.getElementById(cardDeckID).innerHTML = "";
    let requiredDetails = await generateRequiredDetails(card_type, name_id).then(requiredDetails => {
        for (var index in requiredDetails) {
            createTag(`div`, { "class": `card`, "id": `${index}` }, null, `cardsSection`);
            createTag(`div`, { "class": `card-body`, "id": `body${index}` }, null, `${index}`);
            createTag(`img`, { "src": `${requiredDetails[index].imageUrl}`, "alt": `${requiredDetails[index].name}` }, null, `body${index}`);
            createTag(`div`, { "class": `card-footer`, "id": `footer${index}` }, null, `${index}`);
            createTag(`h4`, { "id": `card-name` }, `${requiredDetails[index].name}`, `footer${index}`);
        }
    });

}
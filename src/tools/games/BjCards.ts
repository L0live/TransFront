import { Engine, Scene, Vector3,
  StandardMaterial, Texture,
  AbstractMesh, AssetsManager
} from "@babylonjs/core";

type Card = {
  name: string;
  mesh: AbstractMesh;
};

export default class BjCards {

  private engine: Engine;
  private scene: Scene;
  private assetsManager: AssetsManager;
  private Cards: Card[] = [];
  private Deck: Card[] = [];
  private DiscardTray: Card[] = [];
  private Places: { [name: string]: {
    cards: Card[];
    position: Vector3;
    splitedCards?: Card[];
    rotation: Vector3;
    stackOffset: Vector3;
    splitOffset: Vector3;
  }} = {};

  constructor(numberOfDeck: number, engine: Engine, scene: Scene, assetsManager: AssetsManager) {
    this.engine = engine;
    this.scene = scene;
    this.assetsManager = assetsManager;

    const cardsPatterns = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const cardsNames = ["As", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

    for (let d = 0; d < numberOfDeck; d++) {
      cardsPatterns.forEach(pattern => {
        cardsNames.forEach(name => {
          this.createCard(name, pattern);
        });
      });
    }

    this.initPlaces();
  }

  private createCard(name: string, pattern: string) {
    // const cardFrontTexture = new Texture(`assets/${name}.png`, this.scene);
    const cardFrontTexture = new Texture(`assets/${pattern}/${name}.png`, this.scene);
    cardFrontTexture.vOffset = 0.04; // Adjust texture offset for better alignment
    const MatCardFront = new StandardMaterial(`MatCardFront_${name}_of_${pattern}`, this.scene);
    MatCardFront.hasTexture(cardFrontTexture);
    MatCardFront.diffuseTexture = cardFrontTexture;
    MatCardFront.emissiveTexture = cardFrontTexture;

    const taskCard = this.assetsManager.addContainerTask("loadGLB", "", "models/", "card.glb");

    let cardMesh: AbstractMesh;

    taskCard.onSuccess = (taskCard) => {
      taskCard.loadedContainer.addAllToScene();
      taskCard.loadedContainer.meshes.forEach(mesh => mesh.material = MatCardFront);
      cardMesh = taskCard.loadedContainer.meshes[0];

      // cardMesh.position = new Vector3(0, 1, 0);
      cardMesh.scaling = new Vector3(0.7, 0.8, 0.8);

      this.Cards.push({
        name: name,
        mesh: cardMesh
      });
    };

    taskCard.onError = (taskCard, message, exception) => {
      console.error(`Erreur de chargement des cartes :`, message, exception);
    };

    // this.assetsManager.load();
  }

  resetDeck(cards: Card[] = this.DiscardTray) {
    const position = new Vector3(-0.5, 1.04, 0.15);
    const rotation = new Vector3(0, 0, Math.PI-Math.PI / 3);
    const offset = new Vector3(-0.002, 0, 0);
    console.log(`Resetting deck with ${cards.length} cards.`);

    if (!cards.length)
      cards = this.Cards;

    console.log(`Resetting deck with ${cards.length} cards.`);

    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    this.Deck = [];

    // Fill the deck with the shuffled cards
    shuffledCards.forEach((cardData, index) => {
      const card = { ...cardData };
      this.moveCard(card, position.add(offset.scale(index)), rotation, true);
      this.Deck.push(card);
    });

    this.DiscardTray = [];
  }

  private initPlaces() {
    this.Places = {
      "dealer": {
        cards: [],
        position: new Vector3(0, 1, 0.32),
        rotation: new Vector3(-Math.PI, 0, Math.PI),
        stackOffset: new Vector3(0.02, 0.0001),
        splitOffset: new Vector3()
      },
      "p1": {
        cards: [],
        position: new Vector3(0.7, 1, 0.4),
        rotation: new Vector3(-Math.PI, Math.PI + Math.PI / 3, Math.PI),
        stackOffset: new Vector3(-0.007, 0.0001, -0.03),
        splitOffset: new Vector3(-0.03, 0, 0.05)
      },
      "p2": {
        cards: [],
        position: new Vector3(0.4, 1, 0.7),
        rotation: new Vector3(-Math.PI, Math.PI + Math.PI / 6, Math.PI),
        stackOffset: new Vector3(0.007, 0.0001, -0.03),
        splitOffset: new Vector3(-0.05, 0, 0.03)
      },
      "p3": {
        cards: [],
        position: new Vector3(0, 1, 0.8),
        rotation: new Vector3(-Math.PI, Math.PI, Math.PI),
        stackOffset: new Vector3(0.02, 0.0001, -0.02),
        splitOffset: new Vector3(-0.06)
      },
      "p4": {
        cards: [],
        position: new Vector3(-0.4, 1, 0.7),
        rotation: new Vector3(-Math.PI, Math.PI - Math.PI / 6, Math.PI),
        stackOffset: new Vector3(0.028, 0.0001, -0.008),
        splitOffset: new Vector3(-0.05, 0, -0.03)
      },
      "p5": {
        cards: [],
        position: new Vector3(-0.7, 1, 0.4),
        rotation: new Vector3(-Math.PI, Math.PI - Math.PI / 3, Math.PI),
        stackOffset: new Vector3(0.028, 0.0001, 0.008),
        splitOffset: new Vector3(-0.03, 0, -0.055)
      },
    };
  }

  // Step 1: Move from deck
  private dealStep1 = {position: new Vector3(-0.4, 1, 0.15), rotation: new Vector3(0, 0, Math.PI)};
  // Step 2: Move up
  private dealStep2 = {position : new Vector3(0, 1.25, 0.2), rotation: new Vector3(Math.PI / 2, Math.PI)};

  private async moveCard(card: Card, position: Vector3, rotation: Vector3, withoutSteps = false) {

    if (!withoutSteps) {
      this.moveCard(card, this.dealStep1.position, this.dealStep1.rotation, true);
      this.moveCard(card, this.dealStep2.position, this.dealStep2.rotation, true);
    }

    // const deltaTime = 10; // Approx. 60 FPS (16.67ms per frame)
    // const steps = Math.floor(timeTo / deltaTime);
    // const stepPosition = position.subtract(card.mesh.position).scale(1 / steps);
    // console.log('actual position: ', card.mesh.position, 'Position: ', position, 'stepPosition: ', stepPosition);
    // const stepRotation = rotation.subtract(card.mesh.rotation).scale(1 / steps);

    // for (let i = 1; i <= steps; i++) {
    //   setTimeout(() => {
    //     card.mesh.position = card.mesh.position.add(stepPosition);
    //     card.mesh.rotation = card.mesh.rotation.add(stepRotation);
    //   }, i * deltaTime);
    // }
    card.mesh.position = position;
    card.mesh.rotation = rotation;
  }

  beginDealingCards(placesName: string[]) {
    const dealingOrder = [...placesName, 'dealer', ...placesName, 'dealer'];

    dealingOrder.forEach(placeName => {
      const card = this.Deck.shift();
      if (card) {
        const place = this.Places[placeName];
        if (placeName == 'dealer') {
          if (!place.cards.length)
            this.moveCard(card, place.position.add(place.stackOffset), place.rotation);
          else
            this.moveCard(card, place.position.add(new Vector3(-place.stackOffset._x, 0.002)), place.rotation.add(new Vector3(0, 0, -Math.PI)));
        } else
          this.moveCard(card, place.position.add(place.stackOffset.scale(place.cards.length)), place.rotation);
        place.cards.push(card);
      }
    });
  }

  private discardTrayPosition = new Vector3(0, 0, 0);

  cleanPlaces() {
    Object.values(this.Places).forEach(place => {
      place.cards.forEach(card => {
        this.moveCard(card, this.discardTrayPosition, card.mesh.rotation, true);
        this.DiscardTray.push(card);
      });
      place.cards = [];
      place.splitedCards?.forEach(card => {
        this.moveCard(card, this.discardTrayPosition, card.mesh.rotation, true);
        this.DiscardTray.push(card);
      });
      place.splitedCards = undefined;
    });
  }

  dealPlace(placeName: string, onSplit = false) {
    const place = this.Places[placeName];
    if (!place) {
      console.error(`Unknown place: ${placeName}`);
      return;
    }

    const card = this.Deck.shift()!;

    if (!onSplit)
      this.moveCard(card, place.cards[place.cards.length - 1].mesh.position.add(place.stackOffset), place.rotation);
    else if (place.splitedCards)
      this.moveCard(card, place.splitedCards[place.splitedCards.length - 1].mesh.position.add(place.stackOffset), place.rotation);
    else
      console.error(`No splitedCards array for place: ${placeName}`);
    place.cards.push(card);

    // If deck is empty, refill it
    if (!this.Deck.length)
      this.resetDeck();
  }

  splitPlace(placeName: string) {
    const place = this.Places[placeName];
    if (!place) {
      console.error(`Unknown place: ${placeName}`);
      return;
    }
    if (place.cards.length < 2) {
      console.error(`Place ${placeName} cannot be split, it has ${place.cards.length} cards.`);
      return;
    }
    if (place.splitedCards) {
      console.error(`Place ${placeName} cannot be split, it already is.`);
      return;
    }

    place.splitedCards = [];
    const card = place.cards.pop()!;
    this.moveCard(card, place.cards[place.cards.length - 1].mesh.position.add(place.splitOffset), place.rotation, true);
    place.splitedCards.push(card);

    this.moveCard(place.cards[place.cards.length - 1], place.cards[place.cards.length - 1].mesh.position.add(place.splitOffset.scale(-1)), place.rotation, true);
  }
}
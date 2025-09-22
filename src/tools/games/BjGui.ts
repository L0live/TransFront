import { AdvancedDynamicTexture,
  Button, Control,
  Rectangle, TextBlock
} from "@babylonjs/gui";
import { Scene, Vector2
} from "@babylonjs/core";
import { navigate } from '../../router';

export default class BjGui {
  ui: AdvancedDynamicTexture;
  scene: Scene;
  width: number;
  height: number;

  sceneFunctions: any;

  bankAmount: number;
  totalBetAmount: number;

  playButton: Button;

  Bet: {
    button: Button;
    coinsButtons: { [name: string]: {
      button: Button;
      value: number;
      isActive: boolean;
    }};
    areas: { [place: string]: {
      place: string;
      selectBox: Rectangle;
      buttonCleanBet: Button;
      textBet: TextBlock;
      bet: number;
    }};
  };

  cardsInteractions: {
    stand: Button;
    hit: Button;
    doubleDown: Button;
    split: Button;
  };

  constructor(scene: Scene, width: number, height: number, sceneFunctions: any) {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.scene = scene;
    this.width = width;
    this.height = height;

    this.sceneFunctions = sceneFunctions;

    // TO DO: Backend request
    this.bankAmount = 5000;
    this.totalBetAmount = 0;

    // Play Button
    this.playButton = Button.CreateSimpleButton("playButton", "PLAY"); {
      this.playButton.width = this.resizeX(170) + "px";
      this.playButton.height = this.resizeY(70) + "px";
      this.playButton.fontSize = "32px";
      this.playButton.color = "black";
      this.playButton.cornerRadius = 15;
      this.playButton.thickness = 0;
      this.playButton.background = "white";
      this.playButton.alpha = 0.7;
      this.playButton.onPointerClickObservable.add(() => {
        this.playButton.isVisible = false;
        this.betGuiVisibility(true);
      });
      this.ui.addControl(this.playButton);
    }

    this.initConstGui();
    (this.ui.getControlByName("TotalBetLabel") as TextBlock).isVisible = false;

    this.Bet = {
      button: this.createBetButton(),
      coinsButtons: {
        "5": this.createCoinButton(5, new Vector2(-150, -165)),
        "10": this.createCoinButton(10, new Vector2(-90, -235)),
        "20": this.createCoinButton(20, new Vector2(0, -255)),
        "50": this.createCoinButton(50, new Vector2(90, -235)),
        "100": this.createCoinButton(100, new Vector2(150, -165))
      },
      areas: {
        "p1": this.createArea("p1"),
        "p2": this.createArea("p2"),
        "p3": this.createArea("p3"),
        "p4": this.createArea("p4"),
        "p5": this.createArea("p5")
      }
    };
    this.betGuiVisibility(false);

    this.cardsInteractions = this.initCardsInteractionGui();
    this.cardsInteractionsVisibility(false);
  }

  private resizeX(value: number): number {
    return value / 2540 * this.width;
  }

  private resizeY(value: number): number {
    return value / 1390 * this.height;
  }

  private initConstGui() {
    // Bank label
    const labelBank = new TextBlock("BankLabel");
    labelBank.text = `Bank: ${this.bankAmount} €`;
    labelBank.verticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    labelBank.horizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
    labelBank.left = this.resizeX(20);
    labelBank.width = this.resizeX(150) + "px";
    labelBank.height = this.resizeY(40) + "px";
    labelBank.color = "white";
    this.ui.addControl(labelBank);

    // Total Bet label
    const labelTotalBet = new TextBlock("TotalBetLabel");
    labelTotalBet.text = `Total Bet: ${this.totalBetAmount} €`;
    labelTotalBet.verticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    labelTotalBet.horizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
    labelTotalBet.left = this.resizeX(180);
    labelTotalBet.width = this.resizeX(180) + "px";
    labelTotalBet.height = this.resizeY(40) + "px";
    labelTotalBet.color = "white";
    this.ui.addControl(labelTotalBet);

    // Help Button
    const buttonHelp = Button.CreateSimpleButton("helpButton", "?");
    buttonHelp.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
    buttonHelp.verticalAlignment = Button.VERTICAL_ALIGNMENT_TOP;
    buttonHelp.top = this.resizeY(20);
    buttonHelp.left = this.resizeX(20);
    buttonHelp.width = this.resizeX(40) + "px";
    buttonHelp.height = this.resizeY(40) + "px";
    buttonHelp.fontSize = 24;
    buttonHelp.color = "white";
    buttonHelp.cornerRadius = 20;
    buttonHelp.thickness = 0;
    buttonHelp.background = "black";
    buttonHelp.onPointerEnterObservable.add(() => {
      buttonHelp.thickness = 0.5;
    });
    buttonHelp.onPointerOutObservable.add(() => {
      buttonHelp.thickness = 0;
    });
    buttonHelp.onPointerClickObservable.add(() => {
      // Pop-up help dialog
      const fontHelp = new Rectangle("helpFontBox");
      fontHelp.width = "100%";
      fontHelp.height = "100%";
      fontHelp.thickness = 0;
      fontHelp.background = "black";
      fontHelp.alpha = 0.1;
      const boxHelp = new Rectangle("helpBox");
      boxHelp.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
      boxHelp.verticalAlignment = Button.VERTICAL_ALIGNMENT_TOP;
      boxHelp.top = this.resizeY(70);
      boxHelp.left = this.resizeX(20);
      boxHelp.width = this.resizeX(650) + "px";
      boxHelp.height = this.resizeY(1050) + "px";
      boxHelp.color = "white";
      boxHelp.background = "black";
      boxHelp.alpha = 0.8;
      boxHelp.cornerRadius = 20;
      boxHelp.thickness = 0;
      const textTitleHelp = new TextBlock("helpTitleText", "🎲 Règles du Blackjack");
      textTitleHelp.parent = boxHelp;
      textTitleHelp.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      textTitleHelp.top = this.resizeY(20);
      textTitleHelp.color = "white";
      textTitleHelp.fontSize = 18;
      boxHelp.addControl(textTitleHelp);
      const textHelp = new TextBlock("helpText", "    🎯 Objectif du jeu \n \
Le but est de battre le croupier en ayant une main dont la valeur est la plus proche \n possible de 21, sans jamais dépasser ce chiffre. \n\n \
🃏 Valeur des cartes \n \
Cartes de 2 à 10 → valeur égale au chiffre. \n \
Figures (Valet, Dame, Roi) → 10 points. \n \
As → 1 ou 11 points (au choix du joueur, selon ce qui avantage la main). \n\n \
▶️ Déroulement d’une partie \n\n \
Mise : le joueur place sa mise. \n\n \
Distribution : \n \
Chaque joueur reçoit 2 cartes face visible. \n \
Le croupier reçoit 2 cartes : 1 face visible et 1 face cachée. \n\n \
Tour du joueur : \n \
Tirer (Hit) : demander une carte supplémentaire. \n \
Rester (Stand) : garder sa main et passer la main au croupier. \n \
Doubler (Double Down) : doubler la mise et recevoir une seule carte supplémentaire. \n \
Séparer (Split) : si les 2 cartes ont la même valeur, possibilité de séparer en 2 mains \n distinctes (chaque main joue séparément, avec une mise supplémentaire). \n\n \
Tour du croupier : \n \
Le croupier révèle sa carte cachée. \n \
Il doit tirer des cartes jusqu’à atteindre au moins 17 points. \n\n \
🏆 Résultats \n \
Si le joueur dépasse 21 → il perd immédiatement (Bust). \n \
Si le croupier dépasse 21 → le joueur gagne. \n \
Si la main du joueur est plus proche de 21 que celle du croupier → le joueur gagne. \n \
Si le joueur et le croupier ont la même valeur → égalité (Push), la mise est rendue. \n\n \
💎 Blackjack \n \
Un Blackjack est obtenu avec un As + une carte valant 10 dès la distribution initiale. \n \
Il bat toute autre combinaison, sauf un autre Blackjack (égalité). \n \
Gain classique : 1,5 fois la mise.");
      textHelp.parent = boxHelp;
      textHelp.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      textHelp.left = this.resizeX(20);
      textHelp.top = this.resizeY(20);
      textHelp.color = "white";
      textHelp.fontSize = 12;
      boxHelp.addControl(textHelp);
      fontHelp.onPointerClickObservable.add(() => {
        // Close the quit confirmation box
        this.ui.removeControl(fontHelp);
        this.ui.removeControl(boxHelp);
      });
      this.ui.addControl(fontHelp);
      this.ui.addControl(boxHelp);
    });
    this.ui.addControl(buttonHelp);

    // Quit Button
    const buttonQuit = Button.CreateSimpleButton("quitButton", "🚪");
    buttonQuit.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
    buttonQuit.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    buttonQuit.top = this.resizeY(-40);
    buttonQuit.left = this.resizeX(20);
    buttonQuit.width = this.resizeX(40) + "px";
    buttonQuit.height = this.resizeY(40) + "px";
    buttonQuit.fontSize = 24;
    buttonQuit.color = "white";
    buttonQuit.cornerRadius = 20;
    buttonQuit.thickness = 0;
    buttonQuit.background = "black";
    buttonQuit.onPointerEnterObservable.add(() => {
      buttonQuit.thickness = 0.5;
    });
    buttonQuit.onPointerOutObservable.add(() => {
      buttonQuit.thickness = 0;
    });
    buttonQuit.onPointerClickObservable.add(() => {
      // Pop-up confirmation dialog
      const fontQuit = new Rectangle("quitFontBox");
      fontQuit.width = "100%";
      fontQuit.height = "100%";
      fontQuit.thickness = 0;
      fontQuit.background = "black";
      fontQuit.alpha = 0.5;
      const boxQuit = new Rectangle("quitBox");
      boxQuit.width = this.resizeX(600) + "px";
      boxQuit.height = this.resizeY(300) + "px";
      boxQuit.color = "white";
      boxQuit.background = "black";
      boxQuit.alpha = 1;
      boxQuit.cornerRadius = 20;
      boxQuit.thickness = 0;
      const textQuit = new TextBlock("quitMessageText", "Are you sure you want to quit?");
      textQuit.color = "white";
      textQuit.top = this.resizeY(-50);
      textQuit.fontSize = 20;
      boxQuit.addControl(textQuit);
      const buttonQuitConfirmation = Button.CreateSimpleButton("quitConfirmationButton", "Quit");
      buttonQuitConfirmation.width = this.resizeX(100) + "px";
      buttonQuitConfirmation.height = this.resizeY(40) + "px";
      buttonQuitConfirmation.color = "grey";
      buttonQuitConfirmation.cornerRadius = 20;
      buttonQuitConfirmation.thickness = 1;
      buttonQuitConfirmation.background = "black";
      buttonQuitConfirmation.top = this.resizeY(50);
      buttonQuitConfirmation.onPointerEnterObservable.add(() => {
        buttonQuitConfirmation.color = "white"; // Change color on hover
      });
      buttonQuitConfirmation.onPointerOutObservable.add(() => {
        buttonQuitConfirmation.color = "grey"; // Change color back on hover out
      });
      buttonQuitConfirmation.onPointerClickObservable.add(() => {
        // Handle quit confirmation
        console.log("User confirmed quit");
        navigate("/"); // Redirect to home page
      });
      fontQuit.onPointerClickObservable.add(() => {
        // Close the quit confirmation box
        this.ui.removeControl(boxQuit);
        this.ui.removeControl(fontQuit);
      });
      boxQuit.addControl(buttonQuitConfirmation);
      // fontQuit.addControl(boxQuit);
      this.ui.addControl(fontQuit);
      this.ui.addControl(boxQuit);
    });
    this.ui.addControl(buttonQuit);

    // Volume button
    const buttonVolume = Button.CreateSimpleButton("volumeButton", "🔊");
    buttonVolume.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
    buttonVolume.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    buttonVolume.top = this.resizeY(-90);
    buttonVolume.left = this.resizeX(20);
    buttonVolume.width = this.resizeX(40) + "px";
    buttonVolume.height = this.resizeY(40) + "px";
    buttonVolume.fontSize = 24;
    buttonVolume.color = "white";
    buttonVolume.cornerRadius = 20;
    buttonVolume.thickness = 0;
    buttonVolume.background = "black";
    buttonVolume.onPointerEnterObservable.add(() => {
      buttonVolume.thickness = 0.5;
      // Can change volume with a slider 🔇​​🔈​🔉​🔊
    });
    buttonVolume.onPointerOutObservable.add(() => {
      buttonVolume.thickness = 0;
      // Hide the slider
    });
    buttonVolume.onPointerClickObservable.add(() => {
      // Mute or unmute the sound
      if (buttonVolume.textBlock) {
        if (buttonVolume.textBlock.text === "🔇") {
          buttonVolume.textBlock.text = "🔊";
        } else {
          buttonVolume.textBlock.text = "🔇";
        }
      }
    });
    this.ui.addControl(buttonVolume);
  }

  private createCoinButton(value: number, position: Vector2) {
    const button = Button.CreateImageOnlyButton(`coinButton${value}`, `assets/${value}.svg`);
    button.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    button.left = this.resizeX(position.x);
    button.top = this.resizeY(position.y);
    button.width = this.resizeX(70) + "px";
    button.height = this.resizeY(70) + "px";
    button.cornerRadius = 35;
    button.thickness = 0;
    button.color = "black";
    button.background = "white";
    button.fontSize = 24;

    button.onPointerEnterObservable.add(() => {
      button.thickness = 1;
      button.color = "white"; // Change color on hover
    });
    button.onPointerOutObservable.add(() => {
      if (this.Bet.coinsButtons[`${value}`].isActive)
        return;
      button.thickness = 0;
      button.color = "black"; // Change color back on hover out
    });
    button.onPointerClickObservable.add(() => {
      this.Bet.coinsButtons[`${value}`].isActive = !this.Bet.coinsButtons[`${value}`].isActive;
      if (this.Bet.coinsButtons[`${value}`].isActive) {
        Object.values(this.Bet.coinsButtons).forEach(coin => {
          if (coin.isActive && coin !== this.Bet.coinsButtons[`${value}`]) {
            coin.isActive = false;
            coin.button.thickness = 0;
            coin.button.color = "black";
          }
        });
      }
    });

    this.ui.addControl(button);
    return {
      button,
      value,
      isActive: false
    };
  }

  private createBetButton() {
    const button = Button.CreateSimpleButton("betButton", "BET");
    button.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    button.top = this.resizeY(-20);
    button.width = this.resizeX(210) + "px";
    button.height = this.resizeY(210) + "px";
    button.fontSize = 48;
    button.color = "black";
    button.cornerRadius = 100;
    button.thickness = 0;
    button.background = "white";
    button.alpha = 0.7;
    button.onPointerClickObservable.add(() => {
      console.log("Play Bet clicked");
      if (this.totalBetAmount === 0)
        return;
      this.bankAmount -= this.totalBetAmount;
      (this.ui.getControlByName("BankLabel") as TextBlock).text = `Bank: ${this.bankAmount} €`;

      Object.values(this.Bet.areas).forEach(area => {
        if (area.bet > 0) {
          this.sceneFunctions.addChoosenPlace(area.place);
          area.buttonCleanBet.isVisible = false;
        }
      });
      Object.values(this.Bet.coinsButtons).forEach(coin => {
        coin.isActive = false;
        coin.button.isVisible = false;
      });
      button.isVisible = false;

      this.cardsInteractionsVisibility(true);

      this.sceneFunctions.endOfBetting();
    });
    this.ui.addControl(button);

    return button;
  }
  
  private createArea(place: string) {
    
    const selectPlaceMesh = this.sceneFunctions.getSelectPlaceMesh(place);
    if (!selectPlaceMesh) {
      console.error(`Select place mesh for ${place} not found`);
      // return;
    }
    const selectableAreaAttachedUI = AdvancedDynamicTexture.CreateForMesh(selectPlaceMesh, this.resizeX(300), this.resizeY(300));

    const selectBox = new Rectangle("selectBox");
    selectBox.thickness = 0;
    selectBox.background = "green";
    selectBox.alpha = 0.2;
    selectBox.onPointerEnterObservable.add(() => {
      selectBox.background = "white";
      selectBox.alpha = 0.1;
    });
    selectBox.onPointerOutObservable.add(() => {
      selectBox.background = "green";
      selectBox.alpha = 0.2;
    });
    selectableAreaAttachedUI.addControl(selectBox);

    const coinPlaceMesh = this.sceneFunctions.getCoinPlaceMesh(place);
    if (!coinPlaceMesh) {
      console.error(`Coin place mesh for ${place} not found`);
      // return;
    }
    const coinAreaAttachedUI = AdvancedDynamicTexture.CreateForMesh(coinPlaceMesh, this.resizeX(300), this.resizeY(300));
  
    const textBet = new TextBlock(`textBetPlace${place}`);
    textBet.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    textBet.color = "white";
    textBet.fontSize = 46;
    textBet.isVisible = false;
    coinAreaAttachedUI.addControl(textBet);

    const buttonCleanBet = Button.CreateSimpleButton(`cleanBetPlace${place}`, "❌​​");
    buttonCleanBet.verticalAlignment = Button.VERTICAL_ALIGNMENT_TOP;
    buttonCleanBet.width = this.resizeX(80) + "px";
    buttonCleanBet.height = this.resizeY(80) + "px";
    buttonCleanBet.cornerRadius = 20;
    buttonCleanBet.thickness = 0;
    buttonCleanBet.background = "transparent";
    buttonCleanBet.fontSize = 36;
    buttonCleanBet.isVisible = false;
    buttonCleanBet.onPointerEnterObservable.add(() => {
      buttonCleanBet.background = "white";
      console.log("hover clean bet");
    });
    buttonCleanBet.onPointerOutObservable.add(() => {
      buttonCleanBet.background = "transparent";
    });
    coinAreaAttachedUI.addControl(buttonCleanBet);

    const area = {
      place,
      selectBox,
      buttonCleanBet,
      textBet,
      bet: 0,
    };
  
    selectBox.onPointerClickObservable.add(() => {
      let currentValue = 0;
      Object.values(this.Bet.coinsButtons).forEach(coin => {
        if (coin.isActive)
          currentValue = coin.value;
      });
      if (currentValue === 0)
        return;
      if (this.totalBetAmount + currentValue > this.bankAmount)
        return;
      if (area.bet == 0) {
        buttonCleanBet.isVisible = true;
        textBet.isVisible = true;
      }
      area.bet += currentValue;
      let matName = "5";
      if (area.bet >= 100) matName = "100";
      else if (area.bet >= 50) matName = "50";
      else if (area.bet >= 20) matName = "20";
      else if (area.bet >= 10) matName = "10";
      this.sceneFunctions.setCoinMaterial(area.place, matName);
      textBet.text = area.bet.toString();
      // this.sceneFunctions.setCameraToPlace(area.place);
      this.totalBetAmount += currentValue;
      (this.ui.getControlByName("TotalBetLabel") as TextBlock).text = `Total Bet: ${this.totalBetAmount} €`;
    });
    buttonCleanBet.onPointerClickObservable.add(() => {
      // this.sceneFunctions.setCameraToPlace("default");
      this.sceneFunctions.hideCoinMesh(area.place);
      this.totalBetAmount -= area.bet;
      (this.ui.getControlByName("TotalBetLabel") as TextBlock).text = `Total Bet: ${this.totalBetAmount} €`;
      area.bet = 0;
      buttonCleanBet.isVisible = false;
      textBet.isVisible = false;
    });

    return area;
  }

  private initCardsInteractionGui() {
    // Stand Button
    const stand = Button.CreateSimpleButton("standButton", "STAND");
    stand.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    stand.top = this.resizeY(-200);
    stand.left = this.resizeX(-100);
    stand.width = this.resizeX(170) + "px";
    stand.height = this.resizeY(80) + "px";
    stand.fontSize = "32px";
    stand.color = "black";
    stand.cornerRadius = 15;
    stand.thickness = 0;
    stand.background = "white";
    stand.alpha = 0.7;
    stand.onPointerClickObservable.add(() => {
      console.log("Player chose to STAND");
    });
    stand.isVisible = false;
    this.ui.addControl(stand);

    // Hit Button
    const hit = Button.CreateSimpleButton("hitButton", "HIT");
    hit.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    hit.top = this.resizeY(-200);
    hit.left = this.resizeX(100);
    hit.width = this.resizeX(170) + "px";
    hit.height = this.resizeY(80) + "px";
    hit.fontSize = "32px";
    hit.color = "black";
    hit.cornerRadius = 15;
    hit.thickness = 0;
    hit.background = "white";
    hit.alpha = 0.7;
    hit.onPointerClickObservable.add(() => {
      console.log("Player chose to HIT");
    });
    hit.isVisible = false;
    this.ui.addControl(hit);

    // Double Down Button
    const doubleDown = Button.CreateSimpleButton("doubleDownButton", "DOUBLE DOWN");
    doubleDown.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    doubleDown.top = this.resizeY(-90);
    doubleDown.left = this.resizeX(-100);
    doubleDown.width = this.resizeX(360) + "px";
    doubleDown.height = this.resizeY(80) + "px";
    doubleDown.fontSize = "32px";
    doubleDown.color = "black";
    doubleDown.cornerRadius = 15;
    doubleDown.thickness = 0;
    doubleDown.background = "white";
    doubleDown.alpha = 0.7;
    doubleDown.onPointerClickObservable.add(() => {
      console.log("Player chose to DOUBLE DOWN");
    });
    doubleDown.isVisible = false;
    this.ui.addControl(doubleDown);

    // Split Button
    const split = Button.CreateSimpleButton("splitButton", "SPLIT");
    split.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
    split.top = this.resizeY(-90);
    split.left = this.resizeX(195);
    split.width = this.resizeX(170) + "px";
    split.height = this.resizeY(80) + "px";
    split.fontSize = "32px";
    split.color = "black";
    split.cornerRadius = 15;
    split.thickness = 0;
    split.background = "white";
    split.alpha = 0.7;
    split.onPointerClickObservable.add(() => {
      console.log("Player chose to SPLIT");
    });
    split.isVisible = false;
    this.ui.addControl(split);

    return {stand, hit, doubleDown, split};
  }

  started(): boolean {
    return !this.playButton.isVisible;
  }

  constGuiVisibility(isVisible: boolean) {
    (this.ui.getControlByName("BankLabel") as TextBlock).isVisible = isVisible;
    (this.ui.getControlByName("TotalBetLabel") as TextBlock).isVisible = isVisible;
    (this.ui.getControlByName("helpButton") as Button).isVisible = isVisible;
    (this.ui.getControlByName("quitButton") as Button).isVisible = isVisible;
    (this.ui.getControlByName("volumeButton") as Button).isVisible = isVisible;
  }

  betGuiVisibility(isVisible: boolean) {
    this.Bet.button.isVisible = isVisible;
    Object.values(this.Bet.coinsButtons).forEach(button => {
      button.button.isVisible = isVisible;
    });
    Object.values(this.Bet.areas).forEach(area => {
      area.selectBox.isVisible = isVisible;
    });
  }

  cardsInteractionsVisibility(isVisible: boolean) {
    this.cardsInteractions.stand.isVisible = isVisible;
    this.cardsInteractions.hit.isVisible = isVisible;
    this.cardsInteractions.doubleDown.isVisible = isVisible;
    this.cardsInteractions.split.isVisible = isVisible;
  }
}
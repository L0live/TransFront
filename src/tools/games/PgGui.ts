import { AdvancedDynamicTexture, Button, Control, Rectangle, InputText, TextBlock } from "@babylonjs/gui";

export default class PgGui {
  ui: AdvancedDynamicTexture;
  playButton: Button;

  // score: {
  //   left: TextBlock,
  //   right: TextBlock,
  //   constHyphen: TextBlock
  // };

  // panel: {
  //   players: {
  //     player1: TextBlock,
  //     player2: TextBlock,
  //     constVS: TextBlock
  //   };
  //   winRate: {
  //     title: TextBlock,
  //     player1: TextBlock,
  //     player2: TextBlock,
  //     constHyphen: TextBlock
  //   };
  //   speed: {
  //     title: TextBlock,
  //     value: TextBlock,
  //     unit: TextBlock
  //   };
  // };

  constructor() {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Play Button
    this.playButton = Button.CreateSimpleButton("playButton", "PLAY"); {
      this.playButton.width = 136 + "px";
      this.playButton.height = 51 + "px";
      this.playButton.fontSize = 32 + "px";
      this.playButton.color = "black";
      this.playButton.cornerRadius = 15;
      this.playButton.thickness = 0;
      this.playButton.background = "white";
      this.playButton.alpha = 0.7;
      this.playButton.onPointerClickObservable.add(() => {
        this.playButton.isVisible = false;
      });
      this.ui.addControl(this.playButton);
    }

    // this.score = this.initScore();
    // this.panel = this.initPanel();
    // this.result = this.initResult();
  }

  started() {
    return !this.playButton.isVisible;
  }

  updateScore(scoreSide: "left" | "right", score: number) {
    // this.score[scoreSide];
    // text = score.toString();
  }

  updateSpeed(speed: number) {
    // this.panel.speed.value.text = speed.toString();
  }

  resultVisibility(visible: boolean) {
    this.playButton.isVisible = true;
  }

  // private initScore() {
  //   const hyphen = new TextBlock("constHyphen", "-");
  //   hyphen.color = "white";
  //   hyphen.fontSize = 48 + "px";
  //   hyphen.top = "20px";
  //   hyphen.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  //   hyphen.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  //   this.ui.addControl(hyphen);

  //   const leftScore = new TextBlock("leftScore", "0");
  //   leftScore.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //   leftScore.color = "white";
  //   leftScore.fontSize = 48 + "px";
  //   return {
  //     left: leftScore,
  //     right: rightScore,
  //     constHyphen: hyphen
  //   };
  // }

  // private initPanel() {
  //   // Side Panel
  //   const sidePanel = new Rectangle("sidePanel");
  //   sidePanel.width = "200px";
  //   sidePanel.height = "80%";
  //   sidePanel.background = "black";
  //   sidePanel.alpha = 0.5;
  //   sidePanel.thickness = 0;
  //   // sidePanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  //   sidePanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   this.ui.addControl(sidePanel);

  //   // Add buttons or other controls to the side panel
  // }

  // private initResult() {}
}
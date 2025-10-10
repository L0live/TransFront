import { AdvancedDynamicTexture,
  Button, Control, Rectangle,
  TextBlock, ScrollViewer
} from "@babylonjs/gui";
import { navigate } from "../../router";

export default class PgGui {
  hostPlayer: string;

  ui: AdvancedDynamicTexture;

  font: Rectangle;

  goBackPage: string = "";
  goBackButton: Button;

  menu: {
    title: TextBlock,
    local: Button,
    vsAI: Button,
    tournament: Button,
    watchAI: Button,
    quit: Button
  };

  tournament: {
    title: TextBlock,
    hostText: TextBlock,
    hostPlayer: TextBlock,
    selectSizeText: TextBlock,
    size4Text: TextBlock,
    size8Text: TextBlock,
    size16Text: TextBlock,
    addGuestButton: Button,
    addLoginButton: Button,
    numberOfAIText: TextBlock,
    playersScrollViewer: {
      scrollViewer: ScrollViewer,
      title: TextBlock,
      playersBlock: Rectangle,
      players: TextBlock[],
      isVisible: boolean
    },
    resetplayersButton: Button,
    launchButton: Button
  };

  pause: {
    title: TextBlock,
    resume: Button,
    restart: Button,
    menu: Button,
    quit: Button
  };

  startedType: string = "";

  score: {
    left: TextBlock,
    right: TextBlock,
    constHyphen: TextBlock
  };

  panel: {
    block: Rectangle,
    players: {
      block: Rectangle,
      player1: TextBlock,
      player2: TextBlock,
      constVS: TextBlock
    };
    winParts: {
      block: Rectangle,
      title: TextBlock,
      player1: TextBlock,
      player2: TextBlock,
      constHyphen: TextBlock
    };
    speed: {
      block: Rectangle,
      title: TextBlock,
      value: TextBlock,
      unit: TextBlock
    };
  };

  result: {
    title: TextBlock,
    player: TextBlock,
    wins: TextBlock,
    playAgain: Button,
    nextMatch: Button,
    menu: Button
  };

  constructor(hostPlayer: string) {
    this.hostPlayer = hostPlayer;

    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    this.panel = this.initPanel();
    this.score = this.initScore();

    const fontBlock = new Rectangle("fontBlock"); {
      fontBlock.background = "black";
      fontBlock.alpha = 0.5;
      this.ui.addControl(fontBlock);
    }
    this.font = fontBlock

    const goBackButton = Button.CreateSimpleButton("goBackButton", "← Go Back"); {
      goBackButton.width = 200 + "px";
      goBackButton.height = 60 + "px";
      goBackButton.top = "300px";
      goBackButton.left = "-50px";
      goBackButton.fontSize = 34 + "px";
      goBackButton.color = "white";
      goBackButton.thickness = 0;
      goBackButton.background = "transparent";
      goBackButton.alpha = 0.7;
      goBackButton.isVisible = false;
      goBackButton.onPointerEnterObservable.add(() => {
        goBackButton.color = "green";
        goBackButton.alpha = 1;
      });
      goBackButton.onPointerOutObservable.add(() => {
        goBackButton.color = "white";
        goBackButton.alpha = 0.7;
      });
      goBackButton.onPointerClickObservable.add(() => {
        this.goBack();
      });
      this.ui.addControl(goBackButton);
    }
    this.goBackButton = goBackButton;
    
    this.menu = this.initMenu();
    this.tournament = this.initTournament();
    this.pause = this.initPause();
    this.result = this.initResult();

    // this.menuVisibility(false);
    this.tournamentVisibility(false);
    this.pauseVisibility(false);
    this.resultVisibility(false);
  }

  started() {
    if (this.startedType !== "")
      return this.startedType;
    return null;
  }

  goBack() {
    this.resultVisibility(false);
    this.menuVisibility(false);
    this.pauseVisibility(false);
    this.tournamentVisibility(false);

    if (this.goBackPage == "menu") {
      this.goBackButton.isVisible = false;
      this.menuVisibility(true);
    } else if (this.goBackPage == "tournament") {
      this.tournamentVisibility(true);
    } else if (this.goBackPage == "pause") {
      this.goBackButton.isVisible = false;
      this.pauseVisibility(true);
    } else if (this.goBackPage == "result") {
      this.goBackButton.isVisible = false;
      this.resultVisibility(true);
    }
  }

  private initMenu() {
    const menuTitle = new TextBlock("menuTitle", "MENU"); {
      menuTitle.width = 450 + "px";
      menuTitle.height = 200 + "px";
      menuTitle.top = "-180px";
      menuTitle.fontSize = 132 + "px";
      menuTitle.color = "white";
      this.ui.addControl(menuTitle);
    }

    const playLocalButton = Button.CreateSimpleButton("playLocalButton", "Play vs Friend"); {
      playLocalButton.width = 250 + "px";
      playLocalButton.height = 60 + "px";
      playLocalButton.top = "-70px";
      playLocalButton.fontSize = 32 + "px";
      playLocalButton.color = "white";
      playLocalButton.thickness = 0;
      playLocalButton.background = "transparent";
      playLocalButton.alpha = 0.5;
      playLocalButton.onPointerEnterObservable.add(() => {
        playLocalButton.color = "purple";
        playLocalButton.alpha = 1;
      });
      playLocalButton.onPointerOutObservable.add(() => {
        playLocalButton.color = "white";
        playLocalButton.alpha = 0.5;
      });
      playLocalButton.onPointerClickObservable.add(() => {
        this.menuVisibility(false);

        // As Guest or Login temporarily
        this.startedType = "local";
      });
      this.ui.addControl(playLocalButton);
    }

    const playVSAIButton = Button.CreateSimpleButton("playVSAIButton", "Play vs AI"); {
      playVSAIButton.width = 250 + "px";
      playVSAIButton.height = 60 + "px";
      playVSAIButton.fontSize = 32 + "px";
      playVSAIButton.color = "white";
      playVSAIButton.thickness = 0;
      playVSAIButton.background = "transparent";
      playVSAIButton.alpha = 0.5;
      playVSAIButton.onPointerEnterObservable.add(() => {
        playVSAIButton.color = "purple";
        playVSAIButton.alpha = 1;
      });
      playVSAIButton.onPointerOutObservable.add(() => {
        playVSAIButton.color = "white";
        playVSAIButton.alpha = 0.5;
      });
      playVSAIButton.onPointerClickObservable.add(() => {
        this.menuVisibility(false);

        // AI level selection
        this.startedType = "vsAI";
      });
      this.ui.addControl(playVSAIButton);
    }

    const tournamentButton = Button.CreateSimpleButton("tournamentButton", "Tournament"); {
      tournamentButton.width = 250 + "px";
      tournamentButton.height = 60 + "px";
      tournamentButton.top = "70px";
      tournamentButton.fontSize = 32 + "px";
      tournamentButton.color = "white";
      tournamentButton.thickness = 0;
      tournamentButton.background = "transparent";
      tournamentButton.alpha = 0.5;
      tournamentButton.onPointerEnterObservable.add(() => {
        tournamentButton.color = "purple";
        tournamentButton.alpha = 1;
      });
      tournamentButton.onPointerOutObservable.add(() => {
        tournamentButton.color = "white";
        tournamentButton.alpha = 0.5;
      });
      tournamentButton.onPointerClickObservable.add(() => {
        this.menuVisibility(false);

        // Select tournament size (4, 8, 16)
        // add players as Guest or Login temporarily, the rest is AI (auto)
        this.goBackPage = "menu";
        this.goBackButton.isVisible = true;
        this.tournamentVisibility(true);
      });
      this.ui.addControl(tournamentButton);
    }

    const watchAIButton = Button.CreateSimpleButton("watchAIButton", "Watch AI"); {
      watchAIButton.width = 250 + "px";
      watchAIButton.height = 60 + "px";
      watchAIButton.top = "140px";
      watchAIButton.fontSize = 32 + "px";
      watchAIButton.color = "white";
      watchAIButton.thickness = 0;
      watchAIButton.background = "transparent";
      watchAIButton.alpha = 0.5;
      watchAIButton.onPointerEnterObservable.add(() => {
        watchAIButton.color = "purple";
        watchAIButton.alpha = 1;
      });
      watchAIButton.onPointerOutObservable.add(() => {
        watchAIButton.color = "white";
        watchAIButton.alpha = 0.5;
      });
      watchAIButton.onPointerClickObservable.add(() => {
        this.menuVisibility(false);

        // Select AI level (auto, easy, medium, hard) for each side
        this.startedType = "watchAI";
      });
      this.ui.addControl(watchAIButton);
    }

    const quitButton = Button.CreateSimpleButton("quitButton", "Quit"); {
      quitButton.width = 250 + "px";
      quitButton.height = 60 + "px";
      quitButton.top = "220px";
      quitButton.fontSize = 38 + "px";
      quitButton.color = "white";
      quitButton.cornerRadius = 20;
      quitButton.thickness = 0;
      quitButton.background = "transparent";
      quitButton.alpha = 0.7;
      quitButton.onPointerEnterObservable.add(() => {
        quitButton.color = "red";
      });
      quitButton.onPointerOutObservable.add(() => {
        quitButton.color = "white";
      });
      quitButton.onPointerClickObservable.add(() => {
        navigate("/select-game");
      });
      this.ui.addControl(quitButton);
    }

    return {
      title: menuTitle,
      local: playLocalButton,
      vsAI: playVSAIButton,
      tournament: tournamentButton,
      watchAI: watchAIButton,
      quit: quitButton
    };
  }

  menuVisibility(visible: boolean) {
    Object.values(this.menu).forEach((obj) => {
      obj.isVisible = visible;
    });
    this.font.isVisible = visible;
  }

  private initPause() {
    const pauseTitle = new TextBlock("pauseTitle", "PAUSE"); {
      pauseTitle.width = 450 + "px";
      pauseTitle.height = 180 + "px";
      pauseTitle.top = "-200px";
      pauseTitle.fontSize = 132 + "px";
      pauseTitle.color = "white";
      this.ui.addControl(pauseTitle);
    }
    
    const resumeButton = Button.CreateSimpleButton("resumeButton", "Resume"); {
      resumeButton.width = 250 + "px";
      resumeButton.height = 60 + "px";
      resumeButton.top = "-70px";
      resumeButton.fontSize = 32 + "px";
      resumeButton.color = "white";
      resumeButton.thickness = 0;
      resumeButton.background = "transparent";
      resumeButton.alpha = 0.5;
      resumeButton.onPointerEnterObservable.add(() => {
        resumeButton.color = "purple";
        resumeButton.alpha = 1;
      });
      resumeButton.onPointerOutObservable.add(() => {
        resumeButton.color = "white";
        resumeButton.alpha = 0.5;
      });
      resumeButton.onPointerClickObservable.add(() => {
        this.pauseVisibility(false);
      });
      this.ui.addControl(resumeButton);
    }
    
    const restartButton = Button.CreateSimpleButton("restartButton", "Restart"); {
      restartButton.width = 250 + "px";
      restartButton.height = 60 + "px";
      restartButton.fontSize = 32 + "px";
      restartButton.color = "white";
      restartButton.thickness = 0;
      restartButton.background = "transparent";
      restartButton.alpha = 0.5;
      restartButton.onPointerEnterObservable.add(() => {
        restartButton.color = "purple";
        restartButton.alpha = 1;
      });
      restartButton.onPointerOutObservable.add(() => {
        restartButton.color = "white";
        restartButton.alpha = 0.5;
      });
      restartButton.onPointerClickObservable.add(() => {
        this.startedType = "restart";
        this.pauseVisibility(false);
      });
      this.ui.addControl(restartButton);
    }

    const menuButton = Button.CreateSimpleButton("menuButton", "Menu"); {
      menuButton.width = 250 + "px";
      menuButton.height = 60 + "px";
      menuButton.top = "70px";
      menuButton.fontSize = 32 + "px";
      menuButton.color = "white";
      menuButton.thickness = 0;
      menuButton.background = "transparent";
      menuButton.alpha = 0.5;
      menuButton.onPointerEnterObservable.add(() => {
        menuButton.color = "purple";
        menuButton.alpha = 1;
      });
      menuButton.onPointerOutObservable.add(() => {
        menuButton.color = "white";
        menuButton.alpha = 0.5;
      });
      menuButton.onPointerClickObservable.add(() => {
        
        this.pauseVisibility(false);
        this.goBackPage = "pause";
        this.goBackButton.isVisible = true;
        this.menuVisibility(true);
      });
      this.ui.addControl(menuButton);
    }

    const quitButton = Button.CreateSimpleButton("quitButton", "Quit"); {
      quitButton.width = 250 + "px";
      quitButton.height = 60 + "px";
      quitButton.top = "150px";
      quitButton.fontSize = 38 + "px";
      quitButton.color = "white";
      quitButton.cornerRadius = 20;
      quitButton.thickness = 0;
      quitButton.background = "transparent";
      quitButton.alpha = 0.7;
      quitButton.onPointerEnterObservable.add(() => {
        quitButton.color = "red";
      });
      quitButton.onPointerOutObservable.add(() => {
        quitButton.color = "white";
      });
      quitButton.onPointerClickObservable.add(() => {
        navigate("/select-game");
      });
      this.ui.addControl(quitButton);
    }

    return {
      title: pauseTitle,
      resume: resumeButton,
      restart: restartButton,
      menu: menuButton,
      quit: quitButton
    }
  }

  pauseVisibility(visible: boolean) {
    Object.values(this.pause).forEach((obj) => {
      obj.isVisible = visible;
    });
    this.font.isVisible = visible;

    if (!visible && this.goBackPage == "pause" && this.goBackButton.isVisible) {
      this.goBackButton.isVisible = false;
      this.menuVisibility(false);
    }
  }

  isPaused() {
    if (this.pause.title.isVisible || (this.goBackPage == "pause" && this.goBackButton.isVisible))
      return true;
    return false;
  }

  private initTournament() {
    const tournamentTitle = new TextBlock("tournamentTitle", "TOURNAMENT"); {
      tournamentTitle.width = 600 + "px";
      tournamentTitle.height = 130 + "px";
      tournamentTitle.top = "-250px";
      tournamentTitle.fontSize = 72 + "px";
      tournamentTitle.color = "white";
      this.ui.addControl(tournamentTitle);
    }

    const hostText = new TextBlock("hostText", "Host:"); {
      hostText.width = 200 + "px";
      hostText.height = 60 + "px";
      hostText.top = "-150px";
      hostText.left = "-250px";
      hostText.fontSize = 32 + "px";
      hostText.color = "white";
      this.ui.addControl(hostText);
    }

    const hostPlayer = new TextBlock("hostPlayer", this.hostPlayer); {
      hostPlayer.width = 200 + "px";
      hostPlayer.height = 60 + "px";
      hostPlayer.top = "-150px";
      hostPlayer.left = "-125px";
      hostPlayer.fontSize = 42 + "px";
      hostPlayer.color = "purple";
      this.ui.addControl(hostPlayer);
    }

    const selectSizeText = new TextBlock("selectSizeText", "Select Size:"); {
      selectSizeText.width = 200 + "px";
      selectSizeText.height = 100 + "px";
      selectSizeText.top = "-150px";
      selectSizeText.left = "110px";
      selectSizeText.fontSize = 38 + "px";
      selectSizeText.color = "white";
      this.ui.addControl(selectSizeText);
    }

    const size4Text = new TextBlock("size4Text", "4 Players"); {
      size4Text.width = 200 + "px";
      size4Text.height = 60 + "px";
      size4Text.top = "-50px";
      size4Text.left = "110px";
      size4Text.fontSize = 32 + "px";
      size4Text.color = "white";
      size4Text.alpha = 0.5;
      size4Text.onPointerEnterObservable.add(() => {
        size4Text.alpha = 1;
      });
      size4Text.onPointerOutObservable.add(() => {
        size4Text.alpha = 0.5;
      });
      size4Text.onPointerClickObservable.add(() => {
        this.tournamentSwitchToPlayersSetting(4);
      });
      this.ui.addControl(size4Text);
    }

    const size8Text = new TextBlock("size8Text", "8 Players"); {
      size8Text.width = 200 + "px";
      size8Text.height = 60 + "px";
      size8Text.top = "25px";
      size8Text.left = "110px";
      size8Text.fontSize = 32 + "px";
      size8Text.color = "white";
      size8Text.alpha = 0.5;
      size8Text.onPointerEnterObservable.add(() => {
        size8Text.alpha = 1;
      });
      size8Text.onPointerOutObservable.add(() => {
        size8Text.alpha = 0.5;
      });
      size8Text.onPointerClickObservable.add(() => {
        this.tournamentSwitchToPlayersSetting(8);
      });
      this.ui.addControl(size8Text);
    }

    const size16Text = new TextBlock("size16Text", "16 Players"); {
      size16Text.width = 200 + "px";
      size16Text.height = 60 + "px";
      size16Text.top = "100px";
      size16Text.left = "110px";
      size16Text.fontSize = 32 + "px";
      size16Text.color = "white";
      size16Text.alpha = 0.5;
      size16Text.onPointerEnterObservable.add(() => {
        size16Text.alpha = 1;
      });
      size16Text.onPointerOutObservable.add(() => {
        size16Text.alpha = 0.5;
      });
      size16Text.onPointerClickObservable.add(() => {
        this.tournamentSwitchToPlayersSetting(16);
      });
      this.ui.addControl(size16Text);
    }

    const addLoginButton = Button.CreateSimpleButton("addLoginButton", "Add Login"); {
      addLoginButton.width = 200 + "px";
      addLoginButton.height = 60 + "px";
      addLoginButton.top = "-75px";
      addLoginButton.left = "-150px";
      addLoginButton.fontSize = 32 + "px";
      addLoginButton.color = "white";
      addLoginButton.thickness = 0;
      addLoginButton.background = "transparent";
      addLoginButton.alpha = 0.5;
      addLoginButton.onPointerEnterObservable.add(() => {
        addLoginButton.alpha = 1;
      });
      addLoginButton.onPointerOutObservable.add(() => {
        addLoginButton.alpha = 0.5;
      });
      addLoginButton.onPointerClickObservable.add(() => {
        // Add Login player
      });
      this.ui.addControl(addLoginButton);
    }

    const addGuestButton = Button.CreateSimpleButton("addGuestButton", "Add Guest"); {
      addGuestButton.width = 200 + "px";
      addGuestButton.height = 60 + "px";
      // addGuestButton.top = "25px";
      addGuestButton.left = "-150px";
      addGuestButton.fontSize = 32 + "px";
      addGuestButton.color = "white";
      addGuestButton.thickness = 0;
      addGuestButton.background = "transparent";
      addGuestButton.alpha = 0.5;
      addGuestButton.onPointerEnterObservable.add(() => {
        addGuestButton.alpha = 1;
      });
      addGuestButton.onPointerOutObservable.add(() => {
        addGuestButton.alpha = 0.5;
      });
      addGuestButton.onPointerClickObservable.add(() => {
        // Add Guest player
      });
      this.ui.addControl(addGuestButton);
    }

    const numberOfAIText = new TextBlock("numberOfAIText", "Number of AI: 0"); {
      numberOfAIText.width = 400 + "px";
      numberOfAIText.height = 100 + "px";
      numberOfAIText.top = "100px";
      numberOfAIText.fontSize = 28 + "px";
      numberOfAIText.color = "white";
      numberOfAIText.left = "-150px";
      numberOfAIText.alpha = 0.7;
      this.ui.addControl(numberOfAIText);
    }

    const playersScrollViewer = new ScrollViewer("playersScrollViewer"); {
      playersScrollViewer.width = 200 + "px";
      playersScrollViewer.height = 410 + "px";
      // playersScrollViewer.top = "0px";
      playersScrollViewer.left = "110px";
      playersScrollViewer.barSize = 5;
      playersScrollViewer.barColor = "white";
      playersScrollViewer.background = "transparent";
      playersScrollViewer.thickness = 0;
      this.ui.addControl(playersScrollViewer);
    }

    const playersTitle = new TextBlock("playersTitle", "Players:"); {
      playersTitle.parent = playersScrollViewer;
      playersTitle.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      playersTitle.width = "100%";
      playersTitle.height = "50px";
      playersTitle.top = "20px";
      playersTitle.fontSize = 38 + "px";
      playersTitle.color = "white";
      playersScrollViewer.addControl(playersTitle);
    }

    const playersBlock = new Rectangle("playersBlock"); {
      playersBlock.parent = playersScrollViewer;
      playersBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      playersBlock.width = "100%";
      // playersBlock.height = `${nbOfPlayers * 50 - 5}px`;
      playersBlock.top = "80px";
      playersBlock.left = "10px";
      playersBlock.color = "transparent";
      playersScrollViewer.addControl(playersBlock);
    }

    const resetplayersButton = Button.CreateSimpleButton("resetplayersButton", "Reset Players"); {
      resetplayersButton.width = 300 + "px";
      resetplayersButton.height = 70 + "px";
      resetplayersButton.top = "240px";
      resetplayersButton.left = "110px";
      resetplayersButton.fontSize = 24 + "px";
      resetplayersButton.color = "white";
      resetplayersButton.thickness = 0;
      resetplayersButton.background = "transparent";
      resetplayersButton.alpha = 0.7;
      resetplayersButton.onPointerEnterObservable.add(() => {
        resetplayersButton.alpha = 1;
      });
      resetplayersButton.onPointerOutObservable.add(() => {
        resetplayersButton.alpha = 0.7;
      });
      resetplayersButton.onPointerClickObservable.add(() => {
        // Reset 
        this.tournament.playersScrollViewer.players = [];
        this.tournament.playersScrollViewer.playersBlock.height = `0px`;
        this.tournament.playersScrollViewer.playersBlock.clearControls();
      });
      this.ui.addControl(resetplayersButton);
    }

    const launchButton = Button.CreateSimpleButton("launchButton", "Launch"); {
      launchButton.width = 300 + "px";
      launchButton.height = 70 + "px";
      launchButton.top = "200px";
      launchButton.left = "-100px";
      launchButton.fontSize = 42 + "px";
      launchButton.color = "white";
      launchButton.cornerRadius = 20;
      launchButton.thickness = 0;
      launchButton.background = "transparent";
      launchButton.alpha = 0.7;
      launchButton.onPointerEnterObservable.add(() => {
        launchButton.alpha = 1;
      });
      launchButton.onPointerOutObservable.add(() => {
        launchButton.alpha = 0.7;
      });
      launchButton.onPointerClickObservable.add(() => {
        // Start tournament
        this.goBackButton.isVisible = false;
        this.tournamentVisibility(false);
        this.startedType = "tournament";
      });
      this.ui.addControl(launchButton);
    }

    return {
      title: tournamentTitle,
      hostText: hostText,
      hostPlayer: hostPlayer,
      selectSizeText: selectSizeText,
      size4Text: size4Text,
      size8Text: size8Text,
      size16Text: size16Text,
      addGuestButton: addGuestButton,
      addLoginButton: addLoginButton,
      numberOfAIText: numberOfAIText,
      playersScrollViewer: {
        scrollViewer: playersScrollViewer,
        title: playersTitle,
        playersBlock: playersBlock,
        players: [],
        isVisible: false
      },
      resetplayersButton: resetplayersButton,
      launchButton: launchButton
    }
  }

  private tournamentSwitchToPlayersSetting(nbOfPlayers: number) {
    // Create Tournament back request

    // Hide size selection
    this.tournament.selectSizeText.isVisible = false;
    this.tournament.size4Text.isVisible = false;
    this.tournament.size8Text.isVisible = false;
    this.tournament.size16Text.isVisible = false;

    // Show players setting and Start button

    this.tournament.playersScrollViewer.players = [];
    this.tournament.playersScrollViewer.playersBlock.height = `${(nbOfPlayers - 1) * 55}px`;
    for (let i = 1; i < nbOfPlayers; i++) {
      const player = new TextBlock(`player${i}`, `Player${i}`); {
        player.parent = this.tournament.playersScrollViewer.playersBlock;
        player.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        // player.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        player.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        player.width = "100%";
        player.height = "50px";
        player.top = `${(i - 1) * 55}px`;
        player.fontSize = 32 + "px";
        player.color = "white";
        this.tournament.playersScrollViewer.playersBlock.addControl(player);
        this.tournament.playersScrollViewer.players.push(player);
      }
    }
    this.tournament.playersScrollViewer.scrollViewer.isVisible = true;
    this.tournament.addLoginButton.isVisible = true;
    this.tournament.addGuestButton.isVisible = true;
    this.tournament.numberOfAIText.text = `Number of AI: ${nbOfPlayers - 1}`;
    this.tournament.numberOfAIText.isVisible = true;
    this.tournament.resetplayersButton.isVisible = true;
    this.tournament.launchButton.isVisible = true;
  }

  tournamentVisibility(visible: boolean) {
    Object.values(this.tournament).forEach((obj) => {
      obj.isVisible = visible;
    });
    this.tournament.playersScrollViewer.scrollViewer.isVisible = visible;
    this.font.isVisible = visible;
    if (visible) {
      this.tournament.addLoginButton.isVisible = false;
      this.tournament.addGuestButton.isVisible = false;
      this.tournament.numberOfAIText.isVisible = false;
      this.tournament.playersScrollViewer.scrollViewer.isVisible = false;
      this.tournament.playersScrollViewer.isVisible = false;
      this.tournament.resetplayersButton.isVisible = false;
      this.tournament.launchButton.isVisible = false;
    }
  }

  updateScore(scoreSide: "left" | "right", score: number) {
    let scoreText = score.toString();
    if (scoreSide == "left")
      scoreText = scoreText.padEnd(2);
    this.score[scoreSide].text = scoreText;
  }

  updateSpeed(speed: number) {
    this.panel.speed.value.text = speed.toString().slice(0, 5);
    this.panel.speed.value.top = "10px";
  }

  showResult() {
    // update win parts
    if (this.score.left.text > this.score.right.text) {
      this.panel.winParts.player2.text = (parseInt(this.panel.winParts.player2.text) + 1).toString();
    } else {
      this.panel.winParts.player1.text = (parseInt(this.panel.winParts.player1.text) + 1).toString();
    }

    // reset score
    this.updateScore("left", 0);
    this.updateScore("right", 0);
    
    if (this.startedType != "watchAI") {
      this.startedType = "";
      this.resultVisibility(true);
      return;
    }
    this.startedType = "restart";
  }

  private initScore() {
    const hyphen = new TextBlock("constHyphen", "-");
    hyphen.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    hyphen.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    hyphen.top = "-350px";
    hyphen.color = "white";
    hyphen.fontSize = 72 + "px";
    hyphen.isVisible = false;
    this.ui.addControl(hyphen);

    const leftScore = new TextBlock("leftScore", "0".padEnd(2));
    leftScore.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
    leftScore.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    leftScore.top = "-350px";
    leftScore.left = "-1040px";
    leftScore.color = "white";
    leftScore.fontSize = 72 + "px";
    leftScore.isVisible = false;
    this.ui.addControl(leftScore);

    const rightScore = new TextBlock("rightScore", "0");
    rightScore.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
    rightScore.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    rightScore.top = "-350px";
    rightScore.left = "1040px";
    rightScore.color = "white";
    rightScore.fontSize = 72 + "px";
    rightScore.isVisible = false;
    this.ui.addControl(rightScore);

    return {
      left: leftScore,
      right: rightScore,
      constHyphen: hyphen
    };
  }

  scoreVisibility(visible: boolean) {
    this.score.left.isVisible = visible;
    this.score.right.isVisible = visible;
    this.score.constHyphen.isVisible = visible;
  }

  private initPanel() {
    // Side Panel
    const panelBlock = new Rectangle("panelBlock"); {
      panelBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      panelBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      panelBlock.width = "275px";
      panelBlock.height = "40%";
      panelBlock.background = "transparent";
      panelBlock.thickness = 0;
      panelBlock.isVisible = false;
    }

    const panelFontBlock = new Rectangle("panelFontBlock"); {
      panelFontBlock.parent = panelBlock;
      panelFontBlock.width = "100%";
      panelFontBlock.height = "100%";
      panelFontBlock.background = "black";
      panelFontBlock.alpha = 0.5;
      panelFontBlock.cornerRadiusZ = 20;
      panelFontBlock.thickness = 0;
      panelBlock.addControl(panelFontBlock);
    }
    
    const playersBlock = new Rectangle("playersBlock"); {
      playersBlock.parent = panelBlock;
      playersBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      playersBlock.width = "75%";
      playersBlock.height = "40%";
      playersBlock.top = "10px";
      playersBlock.thickness = 0;
    }

    const player1 = new TextBlock("player1", "Player1"); {
      player1.parent = playersBlock;
      player1.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      player1.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      player1.left = "10px";
      player1.top = "10px";
      player1.color = "purple";
      player1.fontSize = 42 + "px";
      player1.fontWeight = "bold";
      playersBlock.addControl(player1);
    }

    const constVS = new TextBlock("constVS", "VS"); {
      constVS.parent = playersBlock;
      constVS.color = "green";
      constVS.fontSize = 32 + "px";
      playersBlock.addControl(constVS);
    }

    const player2 = new TextBlock("player2", "Player2"); {
      player2.parent = playersBlock;
      player2.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
      player2.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
      player2.left = "-10px";
      player2.top = "-10px";
      player2.color = "purple";
      player2.fontSize = 42 + "px";
      player2.fontWeight = "bold";
      playersBlock.addControl(player2);
    }
    panelBlock.addControl(playersBlock);
    
    const winPartsBlock = new Rectangle("winPartsBlock"); {
      winPartsBlock.parent = panelBlock;
      winPartsBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      winPartsBlock.width = "75%";
      winPartsBlock.height = "30%";
      winPartsBlock.top = "180px";
      winPartsBlock.thickness = 0;
    }
    
    const title = new TextBlock("title", "Win Parts"); {
      title.parent = winPartsBlock;
      title.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      title.color = "green";
      title.fontSize = 32 + "px";
      title.fontWeight = "bold";
      winPartsBlock.addControl(title);
    }

    const p1 = new TextBlock("p1", "0"); {
      p1.parent = winPartsBlock;
      p1.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      p1.left = "20px";
      p1.top = "10px";
      p1.color = "purple";
      p1.fontSize = 28 + "px";
      winPartsBlock.addControl(p1);
    }

    const constHyphen = new TextBlock("constHyphen", "-"); {
      constHyphen.parent = winPartsBlock;
      constHyphen.top = "10px";
      constHyphen.color = "green";
      constHyphen.fontSize = 28 + "px";
      winPartsBlock.addControl(constHyphen);
    }

    const p2 = new TextBlock("p2", "0"); {
      p2.parent = winPartsBlock;
      p2.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
      p2.top = "10px";
      p2.left = "-20px";
      p2.color = "purple";
      p2.fontSize = 28 + "px";
      winPartsBlock.addControl(p2);
    }
    panelBlock.addControl(winPartsBlock);
    
    const speedBlock = new Rectangle("speedBlock"); {
      speedBlock.parent = panelBlock;
      speedBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      speedBlock.width = "75%";
      speedBlock.height = "30%";
      speedBlock.top = "290px";
      speedBlock.thickness = 0;
    }
    
    const speedTitle = new TextBlock("speedTitle", "Speed"); {
      speedTitle.parent = speedBlock;
      speedTitle.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
      speedTitle.color = "green";
      speedTitle.fontSize = 32 + "px";
      speedTitle.fontWeight = "bold";
      speedBlock.addControl(speedTitle);
    }

    const speedValue = new TextBlock("speedValue", "0.2"); {
      speedValue.parent = speedBlock;
      speedValue.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      speedValue.left = "40px";
      speedValue.top = "10px";
      speedValue.color = "purple";
      speedValue.fontSize = 28 + "px";
      speedBlock.addControl(speedValue);
    }

    const speedUnit = new TextBlock("speedUnit", "/frame"); {
      speedUnit.parent = speedBlock;
      speedUnit.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_RIGHT;
      speedUnit.top = "10px";
      speedUnit.left = "-10px";
      speedUnit.color = "green";
      speedUnit.fontSize = 28 + "px";
      speedBlock.addControl(speedUnit);
    }
    panelBlock.addControl(speedBlock);
    
    this.ui.addControl(panelBlock);

    return {
      block: panelBlock,
      players: {
        block: playersBlock,
        player1: player1,
        player2: player2,
        constVS: constVS
      },
      winParts: {
        block: winPartsBlock,
        title: title,
        player1: p1,
        player2: p2,
        constHyphen: constHyphen
      },
      speed: {
        block: speedBlock,
        title: speedTitle,
        value: speedValue,
        unit: speedUnit
      }
    }
  }

  panelVisibility(visible: boolean) {
    this.panel.block.isVisible = visible;
  }

  private initResult() {
    const resultTitle = new TextBlock("resultTitle", "RESULT"); {
      resultTitle.width = 500 + "px";
      resultTitle.height = 200 + "px";
      resultTitle.top = "-180px";
      resultTitle.fontSize = 132 + "px";
      resultTitle.color = "white";
      this.ui.addControl(resultTitle);
    }

    const playerText = new TextBlock("playerText", "Player"); {
      playerText.width = 300 + "px";
      playerText.height = 80 + "px";
      playerText.left = "-120px";
      playerText.color = "purple";
      playerText.fontSize = 52 + "px";
      this.ui.addControl(playerText);
    }

    const winsText = new TextBlock("winsText", "Wins"); {
      winsText.width = 300 + "px";
      winsText.height = 100 + "px";
      winsText.left = "100px";
      winsText.color = "green";
      winsText.fontSize = 82 + "px";
      winsText.fontWeight = "bold";
      this.ui.addControl(winsText);
    }

    const playAgainButton = Button.CreateSimpleButton("playAgainButton", "Play Again"); {
      playAgainButton.width = 300 + "px";
      playAgainButton.height = 60 + "px";
      playAgainButton.top = "100px";
      playAgainButton.fontSize = 42 + "px";
      playAgainButton.color = "white";
      playAgainButton.thickness = 0;
      playAgainButton.background = "transparent";
      playAgainButton.alpha = 0.5;
      playAgainButton.onPointerEnterObservable.add(() => {
        playAgainButton.color = "purple";
        playAgainButton.alpha = 1;
      });
      playAgainButton.onPointerOutObservable.add(() => {
        playAgainButton.color = "white";
        playAgainButton.alpha = 0.5;
      });
      playAgainButton.onPointerClickObservable.add(() => {
        this.resultVisibility(false);

        this.startedType = "restart";
        // this.startedType = this.oldStartedType;
      });
      this.ui.addControl(playAgainButton);
    }

    const nextMatchButton = Button.CreateSimpleButton("nextMatchButton", "Next Match"); {
      nextMatchButton.width = 300 + "px";
      nextMatchButton.height = 60 + "px";
      nextMatchButton.top = "100px";
      nextMatchButton.fontSize = 32 + "px";
      nextMatchButton.color = "white";
      nextMatchButton.thickness = 0;
      nextMatchButton.background = "transparent";
      nextMatchButton.alpha = 0.5;
      nextMatchButton.isVisible = false;
      nextMatchButton.onPointerEnterObservable.add(() => {
        nextMatchButton.color = "purple";
        nextMatchButton.alpha = 1;
      });
      nextMatchButton.onPointerOutObservable.add(() => {
        nextMatchButton.color = "white";
        nextMatchButton.alpha = 0.5;
      });
      nextMatchButton.onPointerClickObservable.add(() => {
        this.resultVisibility(false);
        
        // this.startedType = this.oldStartedType;
      });
      this.ui.addControl(nextMatchButton);
    }

    const menuButton = Button.CreateSimpleButton("menuButton", "Menu"); {
      menuButton.width = 300 + "px";
      menuButton.height = 60 + "px";
      menuButton.top = "170px";
      menuButton.fontSize = 32 + "px";
      menuButton.color = "white";
      menuButton.thickness = 0;
      menuButton.background = "transparent";
      menuButton.alpha = 0.5;
      menuButton.onPointerEnterObservable.add(() => {
        menuButton.color = "purple";
        menuButton.alpha = 1;
      });
      menuButton.onPointerOutObservable.add(() => {
        menuButton.color = "white";
        menuButton.alpha = 0.5;
      });
      menuButton.onPointerClickObservable.add(() => {
        this.resultVisibility(false);

        this.goBackPage = "result";
        this.menuVisibility(true);

      });
      this.ui.addControl(menuButton);
    }

    return {
      title: resultTitle,
      player: playerText,
      wins: winsText,
      playAgain: playAgainButton,
      nextMatch: nextMatchButton,
      menu: menuButton
    };
  }

  resultVisibility(visible: boolean) {
    Object.values(this.result).forEach((obj) => {
      obj.isVisible = visible;
    });
    this.font.isVisible = visible;
    if (visible) {
      if (this.startedType === "tournament") {
        this.result.playAgain.isVisible = false;
      } else {
        this.result.nextMatch.isVisible = false;
      }
      if (this.score.left.text > this.score.right.text) {
        this.result.player.text = this.panel.players.player1.text;
      } else {
        this.result.player.text = this.panel.players.player2.text;
      }
    }
  }
}
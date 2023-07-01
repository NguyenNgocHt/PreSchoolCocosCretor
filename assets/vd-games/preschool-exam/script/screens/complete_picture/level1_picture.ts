import { _decorator, Component, Node, Prefab, log, Sprite, tween, v3, Label } from "cc";
import VDBasePopup from "../../../../../vd-framework/ui/VDBasePopup";
import VDBaseScreen from "../../../../../vd-framework/ui/VDBaseScreen";
import VDScreenManager from "../../../../../vd-framework/ui/VDScreenManager";
import LocalDataManager from "../../common/LocalDataManager";
import { popup_next } from "../../popups/popup_next";
import { level_progress_bar } from "../../transiton/level_progress_bar";
import { changePosition, changeStatusButton, tweenChangeOpacity, tweenchangePositionAndBack } from "../../transiton/Transformation";
import { UIOpacity } from "cc";
const { ccclass, property } = _decorator;

@ccclass("level1_picture")
export class level1_picture extends Component {
  @property({ type: Node })
  itemQuestions: Node[] = [];
  @property({ type: Node })
  @property(Node)
  answer: Node = null;
  @property(Node)
  btnInstruction: Node = null;

  @property(level_progress_bar)
  levelBarUI: level_progress_bar = null;
  @property({type: Node})
  level: Node = null;
  @property({type: Node})
  fireWork: Node = null;

  private canPick = true;
  private levelNumber = 1;

  
  start() {
    this.startPlay();
  }

  startPlay() {
    this.levelNumber = Number(this.level.getComponent(Label).string);
    for (let i = 0; i < this.itemQuestions.length; i++) {
      this.itemQuestions[i].on("i-am-start", this.check_startPositon.bind(this));
      this.itemQuestions[i].on("i-am-moving", this.checkPosition.bind(this, i));
    }
  }
  check_startPositon() {
    log("check start");
  }

  checkPosition(i: number) {
    let questionP = this.itemQuestions[i].getWorldPosition();
    let answerP = this.answer.getWorldPosition();
    
    let dx = Math.abs(answerP.x - questionP.x);
    let dy = Math.abs(answerP.y - questionP.y);
    if (dx < 40 && dy < 40) {
      if (i == 0) {
        changePosition(this.itemQuestions[i], v3(answerP.x, answerP.y, 0), 2);
        this.hideQuestionAndHandleCorrect();
      } else {
        this.itemQuestions[i].emit('end-moving');
      }
    }
  }
  hideQuestionAndHandleCorrect(){
    this.itemQuestions[0].active = false;
    this.answer.getComponent(UIOpacity).opacity = 255;
    this.handleCorrect();
  }
  
  handleShowPopupNext(){
    this.fireWork.active = true;
    this.fireWork.setScale(v3(0.1, 0.1, 0));
    tween(this.fireWork)
    .to(3, {scale: v3(1, 1, 0)})
    .call(()=> {
        this.showPopupNext();
    })
    .call(()=>{
        this.fireWork.active = false;
    })
    .start();
  }
showPopupNext(){
    log("check", this.levelNumber);
    VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
        let popupWin = popup as popup_next;
        // dinh nghia finshedCallBack chua goi nó
        popupWin.finishedCallback = () => {
            let levelNext_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/complete_picture/level'+String(this.levelNumber+1), Prefab)!;
            VDScreenManager.instance.pushScreen(levelNext_screen, (screen: VDBaseScreen) => { }, true); 
            log(' Just Closed Popup !!!');
        };
    }, false, true, true);
}

  handleCorrect() {
    log("correct!");
    //cong kinh nghiem
    
    let obCheck = LocalDataManager.getObject("check", {});
    let currentLevel = obCheck.picture[this.levelNumber+1];
    if(!currentLevel) {
      this.levelBarUI.handleProgress();
      
    }
    obCheck.picture[this.levelNumber+1] = true;
    LocalDataManager.setObject("check", obCheck);
    this.handleShowPopupNext();
    // this.nextBtn.active = true;
  }
  handleWrong(){

  }
  onClickBtnNext(event: TouchEvent, data: any) {
    log("check number: ", data);
    let level2_screen = VDScreenManager.instance.assetBundle.get(
      "res/prefabs/screen/complete_picture/level" + String(data),
      Prefab
    )!;
    VDScreenManager.instance.pushScreen(
      level2_screen,
      (screen: VDBaseScreen) => {},
      true
    );
  }
  onClickBtnBack() {
    VDScreenManager.instance.popToRootScreen(true);
  }
  onClickInstruction() {
    let pTarget = this.answer.getWorldPosition();
    changeStatusButton(this.btnInstruction, true);
    tweenchangePositionAndBack(this.itemQuestions[0], v3(pTarget.x, pTarget.y, 0), 2, ()=>{
      changeStatusButton(this.btnInstruction, false);
    });
  }
  update(deltaTime: number) {}
}

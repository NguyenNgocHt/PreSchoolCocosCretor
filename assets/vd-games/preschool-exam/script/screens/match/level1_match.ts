import { _decorator, Component, Node, Prefab, log, Sprite, tween, v3, Label } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
import { changeStatusButton, tweenchangePositionAndBack } from '../../transiton/Transformation';
const { ccclass, property } = _decorator;

@ccclass('level1_match')
export class level1_match extends Component {

    @property({type: Node})
    itemQuestions: Node[] = [];
    @property({type: Node})
    itemAnswers: Node[] = [];
    @property({type: Node})
    nextBtn: Node = null;
    
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property({type: Node})
    level: Node = null;
    @property({type: Node})
    fireWork: Node = null;
    @property(Node)
    btnInstruction: Node = null;

    private listCheckDone = [];
    private canPick = true;
    private levelNumber = 1;
    private sum = 0;

    
    start() {
        let lev = this.level.getComponent(Label).string;
        this.levelNumber = Number(lev);
        this.startPlay();
    }

    startPlay(){
        if(this.canPick) {
            for(let i=0; i<this.itemQuestions.length; i++){
                this.listCheckDone.push(i);
                this.itemQuestions[i].on("i-am-start", this.check_startPositon.bind(this));
                let p = this.itemQuestions[i].getWorldPosition();
                this.itemQuestions[i].on("i-am-moving", this.checkPosition.bind(this, i));
            }
        }
    }
    check_startPositon(){
        log("check start");
    }

    checkPosition(i: number){
        let questionP = this.itemQuestions[i].getWorldPosition();
        // log("check i: ",i);
        
        for(let j = 0; j<this.itemAnswers.length; j++){
            let answerP = this.itemAnswers[j].getWorldPosition();
            let dx = Math.abs(answerP.x-questionP.x);
            let dy = Math.abs(answerP.y-questionP.y);
            if(dx<40 && dy<40){
                if(i==j){
                    this.itemQuestions[i].active = false;
                    let spriteA = this.itemAnswers[i].getComponent(Sprite);
                    let spriteQ = this.itemQuestions[i].getComponent(Sprite);
                    spriteA.color = spriteQ.color;
                    this.sum++;

                    let id = this.listCheckDone.indexOf(i);
                    this.listCheckDone.splice(id, 1);
                    if(this.sum == 3) {
                        this.handleCorrect();
                    }
                }else{
                    // xu ly khi keo sai
                    log("wrong!")
                }
            }
        }
    }

    handleCorrect(){
        log("correct!");
        //cong kinh nghiem
        
        let obCheck = LocalDataManager.getObject("check", {});
        let currentLevel = obCheck.match[this.levelNumber+1];
        if(!currentLevel) {
            this.levelBarUI.handleProgress();
            log("check level ", this.levelNumber+1);
        }
        obCheck.match[this.levelNumber+1] = true;
        LocalDataManager.setObject("check", obCheck);
        
        this.handleShowPopupNext();
        // this.nextBtn.active = true;
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
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
                log(' Just Closed Popup !!!');
            };
        }, false, true, true);
    }
    onClickBtnNext(event: TouchEvent, data: any) {
        log("check number: ", data)
        let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level'+String(data), Prefab)!;
        VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true);
        //
    }
    onClickBtnBack() {
        VDScreenManager.instance.popToRootScreen(true);
    }
    onClickInstruction() {
        for(let i=0; i<this.listCheckDone.length; i++){
            let id = this.listCheckDone[i];
            let pTarget = this.itemAnswers[id].getWorldPosition();
            changeStatusButton(this.btnInstruction, true);
            tweenchangePositionAndBack(this.itemQuestions[id], v3(pTarget.x, pTarget.y, 0), 2, ()=>{
            changeStatusButton(this.btnInstruction, false);
            });
            break;
        }
    }
    update(deltaTime: number) {
        
    }
}



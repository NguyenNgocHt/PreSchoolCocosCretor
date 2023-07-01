import { _decorator, Component, Node, Prefab, log, Sprite, tween, v3, Label, Vec3 } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
import { changeStatusButton, tweenchangePositionAndBack } from '../../transiton/Transformation';
import { UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('level2_picture')
export class level2_picture extends Component {

    @property({type: Node})
    itemAnswer: Node[] = [];
    @property({type: Node})
    itemQuestion: Node[] = [];
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
        this.startPlay();
    }

    startPlay(){
        this.levelNumber = Number(this.level.getComponent(Label).string);
        for(let i=0; i<this.itemAnswer.length; i++){
            this.itemAnswer[i].on("i-am-moving", this.checkMaxSize.bind(this, i));
            this.itemAnswer[i].on("i'm-end-moving", this.checkAnswer.bind(this, i));
        }
        for(let i=0; i<this.itemQuestion.length; i++){
            this.listCheckDone.push(i);
        }
    }
    checkMaxSize(i: number){
        let maxSize = this.node.getComponent(UITransform).contentSize;
        let answerP = this.itemAnswer[i].getWorldPosition();
        if(answerP.x >= maxSize.width-100 || answerP.y >= maxSize.height-50 || answerP.x<100 || answerP.y<20){
            this.itemAnswer[i].emit("return-prePosition");
        }
    }
    checkAnswer(i: number) {
        let answerP;
        let questionP;
        let dx;
        let dy;
        let idx;
        if(i<this.itemQuestion.length){
            answerP = this.itemAnswer[i].getWorldPosition();
            questionP = this.itemQuestion[i].getWorldPosition();
            dx = Math.abs(answerP.x-questionP.x);
            dy = Math.abs(answerP.y-questionP.y);
            if(dx<40 && dy<40){
                this.itemAnswer[i].active = false;
                this.sum++;
                idx = this.listCheckDone.indexOf(i);
                this.listCheckDone.splice(idx, 1);
                if(this.sum === this.itemQuestion.length) {
                    this.handleCorrect();
                }
            }else{
                log("wrong!");
                this.itemAnswer[i].emit("return-prePosition"); 
            }
        }else{
            this.itemAnswer[i].emit("return-prePosition");
        }
    }

    handleCorrect(){
        let obCheck = LocalDataManager.getObject("check", {});
        let currentLevel = obCheck.match[this.levelNumber+1];
        if(!currentLevel) {
            this.levelBarUI.handleProgress();
            
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
    onClickBtnBack() {
        VDScreenManager.instance.popToRootScreen(true);
    }
    onClickInstruction() {
        for(let i=0; i<this.listCheckDone.length; i++){
            let id = this.listCheckDone[i];
            let pTarget = this.itemQuestion[id].getWorldPosition();
            changeStatusButton(this.btnInstruction, true);
            tweenchangePositionAndBack(this.itemAnswer[id], v3(pTarget.x, pTarget.y, 0), 2, ()=>{
            changeStatusButton(this.btnInstruction, false);
            });
            break;
        }
        
    }

    update(deltaTime: number) {
        
    }
}



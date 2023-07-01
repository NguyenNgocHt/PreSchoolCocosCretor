import { _decorator, Component, Node, Prefab, log, Sprite, tween, v3, Label, Button, UIOpacity } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
import { ScaleFactor, scaleTo, scaleTo2 } from '../../transiton/Transformation';
const { ccclass, property } = _decorator;

@ccclass('level3_comp')
export class level3_comp extends Component {

    @property({type: Node})
    listQuestions: Node[] = [];
    @property({type: Node})
    listAnswers: Node[] = [];
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property({type: Node})
    level: Node = null;
    @property({type: Node})
    fireWork: Node = null;
    @property({type: Node})
    cryIcon: Node = null;

    private canPick = true;
    private levelNumber = 1;
    private sum = 0;
    private idItemSelected1 = null;
    private idItemSelected2 = null;
    private listCheckDone = [];
    
    start() {
        this.startPlay();
    }

    startPlay(){
        if(this.canPick) {
            this.levelNumber = Number(this.level.getComponent(Label).string);
            for(let i=0; i<this.listQuestions.length; i++){
                this.listCheckDone.push(i);
                this.listQuestions[i].on(Node.EventType.TOUCH_START, this.checkSelected1.bind(this, i));
                this.listAnswers[i].on(Node.EventType.TOUCH_START, this.checkSelected2.bind(this, i));
            }  
        }
    }
    onClickBtnBack() {
        VDScreenManager.instance.popToRootScreen(true);
    }
    onClickInstruction() {
        for(let i=0; i<this.listCheckDone.length; i++){
            let id = this.listCheckDone[i];
            scaleTo(this.listAnswers[id], ScaleFactor.SMALL_BY_0_5, ScaleFactor.EQUAL, 1);
            scaleTo(this.listQuestions[id], ScaleFactor.SMALL_BY_0_5, ScaleFactor.EQUAL, 1);
            break;
        }
    }
    checkSelected1(i: number){
        // khong the chon 2 cung mot the loai;
        if(this.idItemSelected1==null){
            this.idItemSelected1 = i;
            this.checkQuestion(i);
        }else if(i===this.idItemSelected1){
            this.idItemSelected1=null;
            this.cancelSelect1(i);
        }else{
            this.handleWrong();
            this.cancelSelect1(i);
            this.cancelSelect1(this.idItemSelected1);
            this.idItemSelected1=null;
        }
    }
    
    checkSelected2(i: number){
        if(this.idItemSelected2==null){
            this.idItemSelected2 = i;
            this.checkAnswer(i);
        }else if(i===this.idItemSelected2){
            this.idItemSelected2=null;
            this.cancelSelect2(i);
        }else{
            this.handleWrong();
            this.cancelSelect2(i);
            this.cancelSelect2(this.idItemSelected2);
            this.idItemSelected2=null;
        }
    }
    cancelSelect1(i: number){
        this.listQuestions[i].getComponent(Button).onEnable();
        this.listQuestions[i].getComponent(UIOpacity).opacity = 255;
    }
    cancelSelect2(i: number){
        this.listAnswers[i].getComponent(Button).onEnable();
        this.listAnswers[i].getComponent(UIOpacity).opacity = 255;
    }
    handleSelectedCorrect(i: number){
        var idx = this.listCheckDone.indexOf(i);
        if (idx > -1) {
            this.listCheckDone.splice(idx, 1);
        }
        this.listQuestions[i].active = false;
        this.listAnswers[i].active = false;
    }
    checkQuestion(i: number){
        this.listQuestions[i].getComponent(Button).onDisable();
        this.listQuestions[i].getComponent(UIOpacity).opacity = 100;
        if(this.idItemSelected2!=null){
            if(this.idItemSelected2===i){
                this.sum++;
                this.handleSelectedCorrect(i);
                if(this.sum===this.listAnswers.length){
                    this.handleCorrectAll();
                }
            }else{
                this.handleWrong();
                this.cancelSelect1(this.idItemSelected1);
                this.cancelSelect2(this.idItemSelected2);
            }
            this.idItemSelected1 = null;
            this.idItemSelected2 = null;
        }
    }
    checkAnswer(i: number){
        this.listAnswers[i].getComponent(Button).onDisable();
        this.listAnswers[i].getComponent(UIOpacity).opacity = 100;
        if(this.idItemSelected1!=null){
            if(this.idItemSelected1===i){
                this.sum++;
                this.handleSelectedCorrect(i);
                if(this.sum===this.listAnswers.length){
                    this.handleCorrectAll();
                }
            }else{
                this.handleWrong();
                this.cancelSelect1(this.idItemSelected1);
                this.cancelSelect2(this.idItemSelected2);
            }
            this.idItemSelected1 = null;
            this.idItemSelected2 = null;
        }
    }
    handleWrong(){
        this.cryIcon.active = true;
        this.cryIcon.setScale(v3(0.001, 0.001, 0));
        tween(this.cryIcon)
        .to(2, {scale: v3(0.08, 0.08, 0)})
        .call(()=>{
            this.cryIcon.active = false;
        })
        .start();
    }
    handleCorrectAll(){
        let obCheck = LocalDataManager.getObject("check", {});
        let currentLevel = obCheck.comparison[this.levelNumber+1];
        if(!currentLevel) {
            this.levelBarUI.handleProgress();
        }
        obCheck.comparison[this.levelNumber+1] = true;
        LocalDataManager.setObject("check", obCheck);
        this.handleShowPopupNext();
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
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
            };
        }, false, true, true);
    }

    update(deltaTime: number) {
        
    }
}



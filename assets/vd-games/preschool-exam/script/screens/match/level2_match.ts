import { _decorator, Component, Node, Prefab, log, Sprite, tween, v3, Label, Button, UIOpacity } from 'cc';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../../common/LocalDataManager';
import { popup_next } from '../../popups/popup_next';
import { level_progress_bar } from '../../transiton/level_progress_bar';
const { ccclass, property } = _decorator;

@ccclass('level2_match')
export class level2_match extends Component {

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
    btnInstruction: Node = null;

    private canPick = true;
    private levelNumber = 1;
    private sum = 0;
    private isTouchAnswers: Boolean[] = [];
    private isTouchQuestions: Boolean[] = [];
    private numberSelect = 0;
    private idItemSelected1 = null;
    private idItemSelected2 = null;
    private listCheckDone = [];


    
    start() {
        let lev = this.level.getComponent(Label).string;
        this.levelNumber = Number(lev);
        this.startPlay();
    }

    startPlay(){
        if(this.canPick) {
            for(let i=0; i<this.listQuestions.length; i++){
                this.listCheckDone.push(i);
                this.listQuestions[i].on(Node.EventType.TOUCH_START, this.checkSelected1.bind(this, i));
                this.listAnswers[i].on(Node.EventType.TOUCH_START, this.checkSelected2.bind(this, i));
            }  
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
            log("chon loai khac!");
            //chon node khac loai
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
            log("chon loai khac!");
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
        this.listQuestions[i].active = false;
        this.listAnswers[i].active = false;
        log("length arr: ", this.listAnswers.length);
        let id = this.listCheckDone.indexOf(i);
        this.listCheckDone.splice(id, 1);
    }
    checkQuestion(i: number){
        this.listQuestions[i].getComponent(Button).onDisable();
        this.listQuestions[i].getComponent(UIOpacity).opacity = 100;
        if(this.idItemSelected2!=null){
            if(this.idItemSelected2===i){
                log("select correct!");
                this.sum++;
                this.handleSelectedCorrect(i);
                if(this.sum===this.listAnswers.length){
                    //xu ly khi da tra loi dung het
                    this.handleCorrectAll();
                }
            }else{
                log("seclect wrong!");
                this.cancelSelect1(this.idItemSelected1);
                this.cancelSelect2(this.idItemSelected2);
            }
            this.idItemSelected1 = null;
            this.idItemSelected2 = null;
        }else{
            //chua chon cau tra loi
        }
    }
    checkAnswer(i: number){
        this.listAnswers[i].getComponent(Button).onDisable();
        this.listAnswers[i].getComponent(UIOpacity).opacity = 100;
        if(this.idItemSelected1!=null){
            if(this.idItemSelected1===i){
                log("select correct!");
                this.sum++;
                this.handleSelectedCorrect(i);
                if(this.sum===this.listAnswers.length){
                    //xu ly khi da tra loi dung het
                    this.handleCorrectAll();
                }else{
                    //chua tra loi dung het
                }
            }else{
                log("seclect wrong!");
                this.cancelSelect1(this.idItemSelected1);
                this.cancelSelect2(this.idItemSelected2);
            }
            this.idItemSelected1 = null;
            this.idItemSelected2 = null;
        }else{
            //chua chon cau tra loi
        }
    }

    handleCorrectAll(){
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
            
        }
    }
    update(deltaTime: number) {
        
    }
}



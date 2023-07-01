import { _decorator, Component, Node, Sprite, Color, log, Prefab, tween, v3, Label, Vec3, Button, UIOpacity } from 'cc';
import VDBaseScreen from '../../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../../vd-framework/ui/VDScreenManager';
import { ScaleFactor, scaleTo, scaleTo2, TimeFactor } from '../../transiton/Transformation';

import { level_progress_bar } from '../../transiton/level_progress_bar';
import LocalDataManager from '../../common/LocalDataManager';
import { handleFirework } from '../../common/handleFirework';
import { scaleAndHide } from '../../transiton/Transformation';
import VDBasePopup from '../../../../../vd-framework/ui/VDBasePopup';
import { popup_next } from '../../popups/popup_next';
const { ccclass, property } = _decorator;

@ccclass('level1_science')
export class level1_science extends Component {
    @property(Node)
    listAnswer: Node[] = [];
    @property(Node)
    @property({type: Node})
    fireWork: Node = null;
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property({type: Node})
    level: Node = null;

    public levelNumber = 1;
    public isShowPopup = false;
    private canPlay = true;
    private dem = 0;
    progressLevelBar?: level_progress_bar;

    onClickInstruction() {
        // this.notAnswer.getComponent(UIOpacity).opacity = 100;
    }
    onClickBack() {
        // VDScreenManager.instance.popScreen(true);
        //cach 2
        VDScreenManager.instance.popToRootScreen();
    }
    start() {
        let lev = this.level.getComponent(Label).string;
        this.levelNumber = Number(lev);
        this.startPlay();
    }

    startPlay() { 
        this.isShowPopup = false;
        if(this.canPlay){
            for(let i=0; i<this.listAnswer.length; i++) {
                this.listAnswer[i].on(Node.EventType.TOUCH_END, this.processCorrect.bind(this, i));
            }
        }
        
    }
    processCorrect(i:number){
        this.listAnswer[i].getComponent(UIOpacity).opacity = 255;
        this.listAnswer[i].setScale(v3(0.2, 0.2, 0));
        tween(this.listAnswer[i])
        .to(1, {scale: v3(1.5, 1.5, 0)})
        .start();

        this.dem++;
        log("check: ",this.dem, i);
        if(this.dem===this.listAnswer.length) {
            this.handleShowPopNext();
        }  
    }
    handleShowPopNext(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.science[this.levelNumber+1];
        if(this.levelBarUI){
            if(!checkDone) {
                this.levelBarUI.handleProgress();
                
            }
            ob.science[this.levelNumber+1] = true;
            LocalDataManager.setObject("check", ob);
        }
        this.canPlay = false;
        this.fireWork.active = true;
        //scaleAndHide(this.fireWork, v3(1, 1, 0), 3, this.showPopupNext);
        tween(this.fireWork)
        .to(3, {scale: v3(1, 1, 0)})
        .call(()=>{
            this.showPopupNext();
        })
        .call(()=>{
            this.fireWork.active = false;
        })
        .start();
    }
    update(deltaTime: number) {
        
    }
    // active popup next
    showPopupNext() {
        log("check", this.levelNumber);
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
            let popupWin = popup as popup_next;
            // dinh nghia finshedCallBack chua goi nó
            popupWin.finishedCallback = () => {
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
                log(' Just Closed Popup !!!');
            }; 
        }, false, true, true);   
    }
}



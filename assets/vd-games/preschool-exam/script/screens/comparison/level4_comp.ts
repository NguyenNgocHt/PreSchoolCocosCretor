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

@ccclass('level4_comp')
export class level4_comp extends Component {
    @property(Node)
    listAnswer: Node[] = [];
    @property(Node)
    fireWork: Node = null;
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property({type: Node})
    level: Node = null;
    @property({type: Node})
    pointer: Node = null;

    private listCheckDone = [];
    private levelNumber = 1;
    private canPlay = true;
    private dem = 0;
    
    start() {
        this.startPlay();
    }

    startPlay() {
        this.levelNumber = Number(this.level.getComponent(Label).string);
        for(let i=0; i<this.listAnswer.length; i++) {
            this.listCheckDone.push(i);
            this.listAnswer[i].on(Node.EventType.TOUCH_END, this.processCorrect.bind(this, i));
        }
    }
    processCorrect(i:number){
        var idx = this.listCheckDone.indexOf(i);
        if (idx > -1) {
            this.listAnswer[i].getComponent(UIOpacity).opacity = 255;
            this.listAnswer[i].setScale(v3(0.2, 0.2, 0));
            tween(this.listAnswer[i])
            .to(1, {scale: v3(1.5, 1.5, 0)})
            .start();
            this.dem++;
            log("check: ",this.dem, i);
            if(this.dem===this.listAnswer.length && this.canPlay) {
                this.handleShowPopNext();
            }
            this.listCheckDone.splice(idx, 1);
        }
    }
    handleShowPopNext(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.comparison[this.levelNumber+1];
        if(this.levelBarUI){
            if(!checkDone) {
                this.levelBarUI.handleProgress();
            }
            ob.comparison[this.levelNumber+1] = true;
            LocalDataManager.setObject("check", ob);
        }
        this.canPlay = false;
        this.fireWork.active = true;
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

    showPopupNext() {
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_next", (popup: VDBasePopup) => {
            let popupWin = popup as popup_next;
            popupWin.finishedCallback = () => {
                let level2_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level'+String(this.levelNumber+1), Prefab)!;
                VDScreenManager.instance.pushScreen(level2_screen, (screen: VDBaseScreen) => { }, true); 
            }; 
        }, false, true, true);   
    }
    onClickInstruction() {
        log("check id: ", this.listCheckDone);
        for(let i=0; i<this.listCheckDone.length; i++){
            let id = this.listCheckDone[i];
            let pItem = this.listAnswer[id].getWorldPosition();
            this.pointer.setWorldPosition(v3(pItem.x, pItem.y, 0));
            this.pointer.active = true;
            tween(this.pointer)
            .to(1, {scale: v3(1, 1, 0)})
            .call(()=>{
                this.pointer.active = false;
            })
            .start();
            break;
        }
    }
    onClickBackToMain() {
        VDScreenManager.instance.popToRootScreen();
    }
    update(deltaTime: number) {
        
    }
    
}



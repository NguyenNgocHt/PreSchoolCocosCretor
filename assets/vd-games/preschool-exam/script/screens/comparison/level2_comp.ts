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

@ccclass('level2_comp')
export class level2_comp extends Component {
    @property({type: Node})
    notAnswer: Node = null;
    @property({type: Node})
    smile: Node = null;
    @property({type: Node})
    cry: Node = null;
    @property({type: Node})
    fireWork: Node = null;
    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    // mac dinh item[0] chua dap an
    @property({type: Node})
    items: Node[] = [];
    @property(Node)
    level: Node = null;
    private listCheckSelected = [];
    public levelNumber = 1;
    private canPlay = true;
    private dem = 0;
    progressLevelBar?: level_progress_bar;
    start() {
        this.startPlay();
    }

    startPlay() {
        this.levelNumber = Number(this.level.getComponent(Label).string);
        for(let i=0; i<this.items.length; i++) {
            this.listCheckSelected.push(false);
            this.items[i].on(Node.EventType.TOUCH_END, this.checkAnswer.bind(this, i));
        }
    }
    checkAnswer(i: number){
        if(i!=0) {
            this.processCorrect(i);
        }else {
            this.processWrong();
        }
    }
    processCorrect(i:number){
        if(!this.listCheckSelected[i]){
            this.dem++;
            if(this.dem===this.items.length-1) {
                this.handleShowPopNext();
            }
            this.smile.active = true;
            this.smile.setScale( v3(0.1, 0.1, 0));
            scaleAndHide(this.smile, v3(0.6, 0.6, 0), 2);
            tween(this.items[i])
            .to(1, {scale: v3(1, 1, 0)})
            .to(1, {scale: v3(1.5, 1.5, 0)})
            .union()
            .repeat(2)
            .start();
            this.listCheckSelected[i] = true;
        }
        
    }
    processWrong(){
        this.cry.active = true;
        tween(this.cry)
        .to(1, {scale: v3(0.08, 0.08, 0)})
        .to(0.2, {scale: v3(0, 0, 0)})
        .start();
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

        let idRandom1 = Math.floor(Math.random()*(this.items.length-1)+1);
        let idRandom2 = Math.floor(Math.random()*(this.items.length-1)+1);
        while(idRandom2==idRandom1){
            idRandom2 = Math.floor(Math.random()*(this.items.length-1)+1);
        }
        log("check: ", idRandom1, idRandom2);
        scaleTo(this.items[idRandom1], ScaleFactor.SMALL_BY_0_5, ScaleFactor.BIG_BY_1_5, 0.5);
        scaleTo(this.items[idRandom2], ScaleFactor.SMALL_BY_0_5, ScaleFactor.BIG_BY_1_5, 0.5);
    }
    onClickBackToMain() {
        VDScreenManager.instance.popToRootScreen();
    }
    update(deltaTime: number) {
        
    }
    
}



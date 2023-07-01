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

@ccclass('level1_comp')
export class level1_comp extends Component {
    @property({type: Node})
    answer: Node = null;

    @property({type: Node})
    pointer: Node = null;
    @property({type: Node})
    smile: Node = null;
    @property({type: Node})
    cry: Node = null;
    @property({type: Node})
    fireWork: Node = null;

    @property(level_progress_bar)
    levelBarUI: level_progress_bar = null;
    @property(Node)
    level: Node = null;
    @property({type: Node})
    items: Node[] = [];

    // progressLevelBar?: level_progress_bar;
    private canPlay = true;
    public levelNumber = 1;

    start() {
        this.startPlay();
    }

    startPlay() { 
        this.levelNumber = Number(this.level.getComponent(Label).string);
        for(let i=0; i<this.items.length; i++) {
            this.items[i].on(Node.EventType.TOUCH_END, this.checkAnswer.bind(this, i));
        }
    }
    checkAnswer(i: number){
        if(this.canPlay){
            if(i==0) {
                this.processCorrect();
            }else {
                this.processWrong();
            }
        }
    }
    processCorrect(){
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
        .to(2, {scale: v3(1, 1, 0)})
        .call(()=>{
            this.showPopupNext();
        })
        .call(()=>{
            this.fireWork.active = false;
        })
        .start();
        this.smile.active = true;
        this.smile.setScale( v3(0.1, 0.1, 0));
        scaleAndHide(this.smile, v3(0.6, 0.6, 0), 2);
        scaleTo2(this.answer, v3(1.2, 1.2, 0), 3);
    }
    processWrong(){
        this.cry.active = true;
        tween(this.cry)
        .to(1, {scale: v3(0.08, 0.08, 0)})
        .to(0.2, {scale: v3(0, 0, 0)})
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
        scaleTo(this.answer, ScaleFactor.BIG_BY_2, ScaleFactor.SMALL_BY_0_5, TimeFactor.SLOW);
    }

    onClickBackToMain() {
        VDScreenManager.instance.popToRootScreen();
    }
    update(deltaTime: number) {
        
    }
    
}
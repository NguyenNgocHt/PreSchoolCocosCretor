import { _decorator, Component, Node, log, Prefab, Button, UIOpacity, Vec3, tween } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../common/LocalDataManager';
import { changePosition } from '../transiton/Transformation';
import { scaleTo2 } from '../transiton/Transformation';
import { ScaleFactor } from '../transiton/Transformation';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ex_RecognizationScreen')
export class ex_RecognizationScreen extends Component {
    @property(Node)
    listLevel: Node[] = [];
    @property(Node)
    listPositon: Node[] = [];

    @property(Node)
    btnNext: Node = null;
    @property(Node)
    btnBack: Node = null;
    private idLevelCurrent = 0;
    start(){
        this.canPlayLevel();
        let p = this.listPositon[2].getWorldPosition();
        this.listLevel[this.idLevelCurrent+1].setWorldPosition(v3(p.x, p.y, 0));
        scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.BIG_BY_1_2, 0.1);
    }
    canPlayLevel(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.science;
        //co the dung do dai cua listLevel or checkDone
        for(let i=0; i<this.listLevel.length; i++) {
            if(!checkDone[i+1]){
                // khong the choi
                let btnLevel = this.listLevel[i];
                let btn = btnLevel.getComponent(Button);
                btn.onDisable();
                btnLevel.getComponent(UIOpacity).opacity = 150;
            }else{
                //co the choi
            }
            
        }
    }
    onClickNext(){
       for(let i=0; i<this.listPositon.length-1; i++){
        let pDes = this.listPositon[i].getWorldPosition();
        changePosition(this.listLevel[this.idLevelCurrent+i], pDes, 0.3);
       }
       this.idLevelCurrent++;
       scaleTo2(this.listLevel[this.idLevelCurrent], ScaleFactor.EQUAL, 0.1);
       scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.BIG_BY_1_2, 0.1);
    }
    onClickBack(){
        for(let i=1; i<this.listPositon.length; i++){
            let pDes = this.listPositon[i].getWorldPosition();
            changePosition(this.listLevel[this.idLevelCurrent-1+i-1], pDes, 0.3);
        }
        scaleTo2(this.listLevel[this.idLevelCurrent+1], ScaleFactor.EQUAL, 0.1);
        scaleTo2(this.listLevel[this.idLevelCurrent], ScaleFactor.BIG_BY_1_2, 0.1);
        this.idLevelCurrent--;
    }
    onClickBackHome() {
        log(`onClickBtnBackToScreen1 1`);
        VDScreenManager.instance.popToRootScreen();
    }
    onClickBtnLevel1() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel2() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level2', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel3() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level3', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel4() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level4', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel5() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/science/level5', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }

    onDisablBtn(node: Node){
        node.getComponent(Button).onDisable();
        node.getComponent(UIOpacity).opacity = 100;
    }
    onEnableBtn(node: Node){
        node.getComponent(Button).onEnable();
        node.getComponent(UIOpacity).opacity = 255;
    }
    update(){
        this.handleEnAndDisBtn();
    }
    handleEnAndDisBtn(){
        if(this.idLevelCurrent!=this.listLevel.length-3){
            this.onEnableBtn(this.btnNext);
        }else{
            this.onDisablBtn(this.btnNext);
        }

        if(this.idLevelCurrent!=0) {
            this.onEnableBtn(this.btnBack);
        }else {
            this.onDisablBtn(this.btnBack);
        }
    }
}



import { _decorator, Component, Node, log, Prefab, Button, UIOpacity } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../common/LocalDataManager';
const { ccclass, property } = _decorator;

@ccclass('ex_Science')
export class ex_Science extends Component {
    @property(Node)
    listLevel: Node[] = [];
    start(){
        this.canPlayLevel();
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
}



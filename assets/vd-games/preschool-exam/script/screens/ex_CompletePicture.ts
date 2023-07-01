import { _decorator, Component, Node, log, Prefab, Button, UIOpacity } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../common/LocalDataManager';
const { ccclass, property } = _decorator;

@ccclass('ex_complete_picture')
export class ex_complete_picture extends Component {
    @property(Node)
    listLevel: Node[] = [];
    onClickBackHome() {
        VDScreenManager.instance.popToRootScreen();
    }
    onClickBtnLevel1() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/complete_picture/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel2() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/complete_picture/level2', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel3() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/complete_picture/level2', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    canPlayLevel(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.picture;
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
    start() {
        this.canPlayLevel();
    }


    update(deltaTime: number) {
        
    }
}



import { _decorator, Component, Node, Prefab, log, Button, UIOpacity } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import LocalDataManager from '../common/LocalDataManager';
const { ccclass, property } = _decorator;

@ccclass('ex_MatchScreen')
export class ex_MatchScreen extends Component {
    @property(Node)
    listLevel: Node[] = [];
    onClickBtnLevel1() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel2() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level2', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel3() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level3', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel4() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel5() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel6() {
        let level1_screen_match = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(level1_screen_match, (screen: VDBaseScreen) => { }, true);
    }
    onClickBackHome() {
        log(`onClickBtnBackToScreen1 1`);
        VDScreenManager.instance.popToRootScreen();
        // VDScreenManager.instance.popToScreen(dm_PlayScreen);
        // VDScreenManager.instance.popToScreen('dm_PlayScreen');
    }
    start() {
        this.canPlayLevel();
    }
    canPlayLevel(){
        let ob = LocalDataManager.getObject("check", {});
        let checkDone = ob.match;
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

    update(deltaTime: number) {
        
    }
}



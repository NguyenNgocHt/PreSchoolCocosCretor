import { _decorator, Component, Node, log, Prefab } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
const { ccclass, property } = _decorator;

@ccclass('ex_ComparisonScreen')
export class ex_ComparisonScreen extends Component {
    onClickBtnNext() {
        log(`onClickBtnNext`);
        // let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/level1', Prefab)!;
        // VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBackHome() {
        log(`onClickBtnBackToScreen1 1`);
        VDScreenManager.instance.popToRootScreen();
        // VDScreenManager.instance.popToScreen(dm_PlayScreen);
        // VDScreenManager.instance.popToScreen('dm_PlayScreen');
    }
    onClickBtnLevel1() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level1', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel2() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level2', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel3() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level3', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel4() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level4', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLevel5() {
        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison/level5', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
}



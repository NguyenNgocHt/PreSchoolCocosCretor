import { _decorator, Component, Node, log, Prefab, sys, Asset, AudioClip } from 'cc';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { ex_Director } from '../common/ex_Director';
import { ex_ComparisonScreen } from './ex_ComparisonScreen';
const { ccclass, property } = _decorator;



@ccclass('ex_MainScreen')
export class ex_MainScreen extends Component {
    onClickBtnComparison() {
        let comparison_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/comparison_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(comparison_screen, (screen: VDBaseScreen) => { }, true);
    }

    onClickBtnDraw() {
        let comparison_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/draw_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(comparison_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickBtnLogic() {
        let comparison_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/logic_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(comparison_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickMatchScreen() {
        let match_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/match_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(match_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickCompletePicture() {
        let complete_picture_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/picture_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(complete_picture_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickScience() {
        let recognize_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/recognize_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(recognize_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickEncode() {
        let encode_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/encode_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(encode_screen, (screen: VDBaseScreen) => { }, true);
    }
    onClickLanguage() {
        let encode_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/language_screen', Prefab)!;
        VDScreenManager.instance.pushScreen(encode_screen, (screen: VDBaseScreen) => { }, true);
    }
}



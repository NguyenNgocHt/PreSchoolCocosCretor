import { Prefab } from 'cc';
import { _decorator, Component, Node, log } from 'cc';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { dm_Director } from '../common/dm_Director';
const { ccclass, property } = _decorator;

@ccclass('dm_PlayScreen')
export class dm_PlayScreen extends VDBaseScreen {
    onClickBtnNext() {
        log(`onClickBtnNext`);

        let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/play_screen_2', Prefab)!;
        VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, true);
    }
}


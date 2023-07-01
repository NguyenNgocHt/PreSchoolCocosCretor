import { _decorator, Component, log, assetManager, Prefab } from 'cc';
import VDAsyncTaskMgr from '../../../vd-framework/async-task/VDAsyncTaskMgr';
import { VDAudioManager } from '../../../vd-framework/audio/VDAudioManager';
import VDScreenManager from '../../../vd-framework/ui/VDScreenManager';
import { dm_Config } from './common/dm_Config';
const { ccclass, property } = _decorator;

@ccclass('dm_Scene')
export class dm_Scene extends Component {
    onLoad() {
        log("@ dm_Scene: onLoad  !!!");
        let bundle = assetManager.getBundle("bundle_" + dm_Config.GAME_NAME);
        if (bundle) {
            this.node.addComponent(VDScreenManager);

            VDScreenManager.instance.assetBundle = bundle;
            VDScreenManager.instance.setupCommon();

            bundle.load("res/prefabs/screen/loading_screen", Prefab, (error, prefab) => {
                if (error) {
                    log(`bundle.load: ${error}`);
                }
                else {
                    log("load loading sucess")
                    // VDScreenManager.instance.initWithRootScreen(prefab);
                    VDScreenManager.instance.initWithRootScreen(prefab, (screen) => {
                        log('initWithRootScreen ' + screen.name + ' success!');
                    });
                }
            })
        }
    }

    onDestroy() {
        VDAudioManager.instance.destroy();
        VDAsyncTaskMgr.instance.stop();
    }

}


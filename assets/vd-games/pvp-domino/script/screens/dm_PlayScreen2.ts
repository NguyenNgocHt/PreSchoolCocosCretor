import { instantiate, sp } from 'cc';
import { Label, log, Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
const { ccclass, property } = _decorator;

@ccclass('dm_PlayScreen2')
export class dm_PlayScreen2 extends Component {

    @property(Label)
    lbPauseResumeMusic: Label = null!;

    isMusicPause: boolean = false;

    onClickBtnNext() {
        log(`onClickBtnNext`);

        let pfFxCloud = VDScreenManager.instance.assetBundle.get('res/prefabs/transition/transition_cloud', Prefab)!;
        let nodeCloud = instantiate(pfFxCloud);
        VDScreenManager.instance.showEffect(nodeCloud);

        let spineCloud = nodeCloud.getComponent(sp.Skeleton);
        let entry = spineCloud.setAnimation(0, 'transition_to_lucky', false);

        spineCloud.setTrackCompleteListener(entry, (x: any, ev: any) => {
            VDScreenManager.instance.removeAllEffects();
        });

        spineCloud.setTrackEventListener(entry, (x: any, ev: any) => {
            if (ev && ev.data && ev.data.name && ev.data.name == 'transition') {
                let play_screen = VDScreenManager.instance.assetBundle.get('res/prefabs/screen/play_screen_3', Prefab)!;
                VDScreenManager.instance.pushScreen(play_screen, (screen: VDBaseScreen) => { }, false);
            }
        });
    }

    onClickBtnPrevious() {
        log(`onClickBtnPrevious`);
        VDScreenManager.instance.popScreen(true);
    }

    //#region BGM
    onClickPlayBGM() {
        VDAudioManager.instance.playBGM('dm_bgm_main');
    }

    onClickPauseBGM() {
        this.isMusicPause = !this.isMusicPause;
        VDAudioManager.instance.isMutingMusic = this.isMusicPause;
        if (this.lbPauseResumeMusic) this.lbPauseResumeMusic.string = this.isMusicPause ? 'Resume' : 'Pause';
    }
    //#endregion

    //#region Clip
    onClickPlayClip() {
        VDAudioManager.instance.playClip('dm_bgm_win', false);
    }

    onClickStopClip() {
        VDAudioManager.instance.stopClip();
    }
    //#endregion

    //#region Effect
    onClickPlayEffect() {
        VDAudioManager.instance.playEffect('dm_sfx_appear', false);
    }

    onClickStopEffect() {
        VDAudioManager.instance.stopEffectByName('dm_sfx_appear');
    }
    //#endregion
}


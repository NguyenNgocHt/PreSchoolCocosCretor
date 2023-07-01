import { Label, log, Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
import VDBaseScreen from '../../../../vd-framework/ui/VDBaseScreen';
import VDScreenManager from '../../../../vd-framework/ui/VDScreenManager';
import { dm_Popup1 } from '../popups/dm_Popup1';
import { dm_PlayScreen } from './dm_PlayScreen';
const { ccclass, property } = _decorator;

@ccclass('dm_PlayScreen3')
export class dm_PlayScreen3 extends Component {

    @property(Label)
    lbNotify: Label = null!;

    onClickBtnBackToScreen1() {
        log(`onClickBtnBackToScreen1 1`);
        VDScreenManager.instance.popToRootScreen();
        // VDScreenManager.instance.popToScreen(dm_PlayScreen);
        // VDScreenManager.instance.popToScreen('dm_PlayScreen');
    }

    onClickBtnShowPopup() {
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_1", (popup: VDBasePopup) => {
            let popupWin = popup as dm_Popup1;
            popupWin.finishedCallback = () => {
                log(' Just Closed Popup !!!');
                this.lbNotify.string = 'Just Closed Popup! ';
                this.lbNotify && (this.lbNotify.node.active = true);
            };
        }, true, true, true);
    }

    onClickBtnShowTableView() {
        VDScreenManager.instance.showPopupFromPrefabName("res/prefabs/popup/popup_table_view", (popup: VDBasePopup) => {

        }, true, true, true);
    }
}


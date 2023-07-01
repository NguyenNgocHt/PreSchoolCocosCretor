
import { _decorator, Node, Label, log } from 'cc';
import { VDAudioManager } from '../../../../vd-framework/audio/VDAudioManager';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';

const { ccclass, property } = _decorator;

@ccclass('dm_PopupNotify')
export class dm_PopupNotify extends VDBasePopup {

    @property(Label)
    contentPopup: Label = null!;

    @property(Node)
    layoutNodeBtn: Node = null;

    @property(Node)
    btnYes: Node = null;

    @property(Node)
    btnNo: Node = null!;

    @property(Node)
    btnConfirm: Node = null!;

    btnYesCallback: any = null!;

    btnNoCallback: any = null!;

    btnConfirmCallback: any = null!;

    onLoad() {

    }

    disableAllBtn() {
        this.btnYes.active = false;
        this.btnNo.active = false;
        this.btnConfirm.active = false;
        this.layoutNodeBtn.active = false;
    }

    setupPopup(content: string, listCallback: VoidFunction[]) {
        log("listCallback   " + listCallback.length);
        this.contentPopup.string = content;
        this.disableAllBtn();

        if (listCallback.length == 2) {
            this.layoutNodeBtn.active = true;
            this.btnYes.active = true;
            this.btnNo.active = true;
            this.btnYesCallback = listCallback[0];
            this.btnNoCallback = listCallback[1];
        } else {
            if (listCallback.length == 1) {
                this.layoutNodeBtn.active = true;
                this.btnConfirm.active = true;
                this.btnConfirmCallback = listCallback[0];
            }
        }
    }

    onClickBtnYes() {
        log("onClickBtnYes")
        VDAudioManager.instance.playEffect("domi_sfx_click");
        if (this.btnYesCallback) {
            this.btnYesCallback();
        }
    }

    onClickBtnNo() {
        log("onClickBtnNo")
        VDAudioManager.instance.playEffect("domi_sfx_click");
        if (this.btnNoCallback) {
            this.btnNoCallback();
        }
    }

    onClickBtnConfirm() {
        log("onClickBtnConfirm")
        VDAudioManager.instance.playEffect("domi_sfx_click");
        if (this.btnConfirmCallback) {
            this.btnConfirmCallback();
        }
    }
}

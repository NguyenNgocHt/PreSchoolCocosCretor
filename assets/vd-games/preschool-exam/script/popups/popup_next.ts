import { _decorator, Component, Node } from 'cc';
import VDBasePopup from '../../../../vd-framework/ui/VDBasePopup';
const { ccclass, property } = _decorator;

@ccclass('popup_next')
export class popup_next extends VDBasePopup {

    finishedCallback: any = null;

    onClickBtnNext() {
        this.hide();
        this.finishedCallback && this.finishedCallback();
    }
}



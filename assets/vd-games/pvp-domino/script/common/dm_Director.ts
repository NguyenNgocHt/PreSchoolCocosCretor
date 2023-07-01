import { _decorator, Component, Node } from 'cc';
import { dm_PlayScreen } from '../screens/dm_PlayScreen';
const { ccclass, property } = _decorator;

@ccclass('dm_Director')
export class dm_Director extends Component {

    private static _instance: dm_Director = null!;

    public static get instance(): dm_Director {
        if (this._instance == null) {
            this._instance = new dm_Director();
        }

        return this._instance;
    }
    playScreen: dm_PlayScreen | null = null;
}


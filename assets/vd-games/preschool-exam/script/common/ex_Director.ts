import { _decorator, Component, Node } from 'cc';
import { ex_MainScreen } from '../screens/ex_MainScreen';
const { ccclass, property } = _decorator;

@ccclass('ex_Director')
export class ex_Director extends Component {
    private static _instance: ex_Director = null!;

    public static get instance(): ex_Director {
        if (this._instance == null) {
            this._instance = new ex_Director();
        }

        return this._instance;
    }
    playScreen: ex_MainScreen | null = null;
}


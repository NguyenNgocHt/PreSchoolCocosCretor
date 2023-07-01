import { _decorator, Component, Node, ProgressBar, Label, log } from 'cc';
import LocalDataManager from '../common/LocalDataManager';
const { ccclass, property } = _decorator;

@ccclass('level_progress_bar')
export class level_progress_bar extends Component {
    @property(ProgressBar)
    levelProgress: ProgressBar = null;
    @property(Label)
    levelLabel: Label = null;
    start() {
        this.levelProgress.progress = LocalDataManager.getNumber("percent", 0);
        this.levelLabel.string = LocalDataManager.getString("level", "1");
    }
    init(){
        this.levelProgress.progress = 0;
    }
    handleProgress(){
        let currentLevel = Number(this.levelLabel.string);
        if(currentLevel<=10 || currentLevel>=25){
            this.levelProgress.progress += 0.2;
        }else{
            this.levelProgress.progress += 1/7;
        }
        
        if(this.levelProgress.progress >= 0.95){
            this.levelProgress.progress = 0;
            this.levelLabel.string = String(currentLevel+1);
        }
        LocalDataManager.setNumber("percent", this.levelProgress.progress);
        LocalDataManager.setString("level", this.levelLabel.string);
    }

    update(deltaTime: number) {
        
    }
}



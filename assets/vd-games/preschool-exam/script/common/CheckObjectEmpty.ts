import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheckObjectEmpty')
export class CheckObjectEmpty extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}

export function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }



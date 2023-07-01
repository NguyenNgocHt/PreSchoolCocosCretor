import { _decorator, Component, Node, Prefab, log } from 'cc';
const { ccclass, property } = _decorator;

export class PrefabManager {
    private static ins: PrefabManager = null;

    static instance(): PrefabManager {
        if(!PrefabManager.ins){
            PrefabManager.ins = new PrefabManager();
        }
        return PrefabManager.ins;
    }

    private prefabMap: Map<string, Prefab> = null;
    private constructor(){
        this.prefabMap = new Map<string, Prefab>();
        log("prefab init");
    }

    loadPrefab(bundleName: string, prefabPath:string, cached: boolean, callback?: Function){
        const prefabKey = bundleName+'/'+prefabPath;
        let prefab = this.prefabMap.get(prefabKey);
        if(prefab){
            if(callback){
                callback(0, prefab);
            }
            return;
        }

        // BundleManager.instance()
    }
}



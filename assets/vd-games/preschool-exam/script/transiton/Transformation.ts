import { UIOpacity } from 'cc';
import { Sprite } from 'cc';
import { log } from 'cc';
import { Button, Color } from 'cc';
import { v3 } from 'cc';
import { _decorator, Component, Node, Vec3, tween } from 'cc';

export const ScaleFactor = {
    SMALL_BY_0_5: new Vec3(0.5, 0.5, 1),
    SMALL_BY_0_2: new Vec3(0.2, 0.2, 1),
    SMALL_BY_0_1: new Vec3(0.1, 0.1, 1),
    EQUAL: new Vec3(1, 1, 1),
    BIG_BY_1_2: new Vec3(1.2, 1.2, 1),
    BIG_BY_1_5: new Vec3(1.5, 1.5, 1),
    BIG_BY_2: new Vec3(2, 2, 1),
    BIG_BY_3: new Vec3(3, 3, 1),
}

export const TimeFactor = {
    QUICK: 0.1,
    MEDIUM: 0.3,
    SLOW: 0.5
}

export function scaleTo(node: Node, factor1: Vec3, factor2: Vec3, duration: number, callback?: Function) {
    tween(node)
    .to(duration, {scale: factor1})
    .to(duration, {scale: factor2})
    .to(duration, {scale: factor1})
    .to(duration, {scale: ScaleFactor.EQUAL})
    .repeat(1)
    .call(callback)
    .start();
}

export function scaleTo2(node: Node, factor, duration: number, callback?: Function) {
    tween(node)
    .to(duration, {scale: factor})
    .call(callback)
    .start();
}

export function scaleAndHide(node: Node, factor, duration: number, callback?: Function) {
    node.active = true;
    tween(node)
    .to(duration, {scale: factor})
    .call(()=>{
        node.active = false;
    })
    .call(callback)
    .start();
}

export function changePosition(node: Node, factor: Vec3, duration: number, callback?: Function) {
    tween(node)
    .to(duration, {worldPosition: factor}, { easing: 'linear' })
    .delay(2)
    .call(callback)
    .start();
}

export function tweenchangePositionAndBack(node: Node, factor: Vec3, duration: number, callback?: Function) {
    let pStart = node.getWorldPosition();
    tween(node)
    .to(duration, {worldPosition: factor}, { easing: 'linear' })
    .to(1, {worldPosition: v3(pStart.x, pStart.y, 0)})
    .call(callback)
    .start();
}

export function changeStatusButton(btn: Node, status: boolean){
    if(status){
        btn.getComponent(UIOpacity).opacity = 100;
        btn.getComponent(Button).onDisable();
    }else{
        btn.getComponent(UIOpacity).opacity = 255;
        btn.getComponent(Button).onEnable();
    }
}

export function tweenChangeOpacity(node: Node, opacity: number, callback?: Function){
    tween(node)
    .delay(0.01)
    .call(()=>{
        node.getComponent(UIOpacity).opacity = opacity;
    })
    .call(callback)
    .start();
}

export function tweenSetColorAndToDefault(nodeSrc: Node, nodeTarget: Node, delay: number, callback?: Function){
    const defaultColor = nodeTarget.getComponent(Sprite).color;
    tween(nodeTarget)
    .call(()=>{
        nodeTarget.getComponent(Sprite).color = nodeSrc.getComponent(Sprite).color;
    })
    .delay(delay)
    .call(()=>{
        // log("...default");
        nodeTarget.getComponent(Sprite).color = Color.WHITE;
    })
    .start();
}
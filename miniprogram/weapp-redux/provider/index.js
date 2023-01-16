
import isPlainObject from '../utils/isPlainObject';
const randomString = () => Math.random().toString(36).substring(7).split('').join('.');
const subscribeInit = (config, store, action, page) => {
  let { storeTypes = [], actionTypes = [] } = config;
  // 设置页面栈变量$store
  page.$store = store;
  // 设置监听
  if(storeTypes && storeTypes.length > 0){
    page.unsubscribe = store.subscribe(() => {
      let pageData = {};
      storeTypes.forEach(storeType => pageData[storeType] = (store.getState()[storeType] || {}));
      pageData = JSON.parse(JSON.stringify(pageData));
      page.setData(pageData);
    })
    // 初始化页面数据
    store.dispatch({type: `@@redux/INIT${randomString()}`});
  }
  if(action && isPlainObject(action)){
    // 将action设置为页面栈的$action变量
    page.$action = action;
    if(actionTypes && actionTypes.length > 0){
      actionTypes.forEach(actionType => {
        let currentAction = action[actionType];
        // 当前对象在action中存在
        if(currentAction){
          Object.keys(currentAction).forEach(key => {
            page[key] = currentAction[key];
          })
        }
      })
    }
  }
}
export default function Provider(store, action){
  if(!store && typeof store !== 'object'){
    throw new Error(`Expected the root store to be a object.`)
  }
  const originalPage = Page;
  const originalComponent = Component;
  Page = (config = {}) => {
    const { onLoad, onUnload } = config;
    config.onLoad = function(opts){
      // 监听全局状态数据变化
      subscribeInit(config, store, action, this);
      // 绑定页面生命周期
      onLoad && onLoad.call(this, opts);
    }
    config.onUnload = function(){
      onUnload && onUnload.call(this);
      // 页面卸载，取消订阅
      this.unsubscribe && this.unsubscribe();
    }
    originalPage(config);
  }
  Component = (config = {}) => {
    const { lifetimes = {}, attached:conattached, detached:condetached } = config;
    const { attached, detached } = lifetimes;
    config.lifetimes = {
      attached:function(){
        // 监听全局状态数据变化
        subscribeInit(config, store, action, this);
        // 绑定页面生命周期
        attached && attached.call(this);
        conattached && conattached.call(this);
      },
      detached:function(){
        detached && detached.call(this);
        condetached && condetached.call(this);
        // 组件卸载，取消订阅
        this.unsubscribe && this.unsubscribe();
      }
    }
    originalComponent(config);
  }
  return {
    Page,
    Component
  }
}
let app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'youngwind',
      age: 25
    },
    school: 'bupt',
    major: 'computer'
  }
});

class Vue {
  constructor (objOption) {
    this.el = objOption.el.slice(1)
    this.watcher = new Watcher()
    this.data = new Observer(objOption.data).data
    this.init()
  }
  init () {
    this.render()
  }
  render () {
    const template = this.getTemplate()
    const el = document.getElementById(this.el)
    el.innerHTML = this.transform(template)
  }
  transform (template) {
    const that = this
    const reg = /{{\s*((\w+.n?)+)\s*}}/g
    const transTemplate = template.replace(reg,function(match, $1) {
      const props = $1.trim().split('.')
      var data = that.data
      let i = 0
      do {         
        data = data[props[i]]
        i++
      } while (i !== props.length)
      return data
    })
    return transTemplate
  }
  getTemplate () {
    const el = document.getElementById(this.el)
    return el.innerHTML
  }
}

class Observer {
  constructor (obj, hasData = true) {
    if (hasData) {
      this.data = obj
      this.walk(obj)      
    } else {
      this.walk(obj)
    }

  }
  walk (obj) {
    for (let prop of Object.keys(obj)) {
      let val = obj[prop]
      if (typeof val === 'object') {
        new Observer(val, false)
      } else {
        this.definedReact(obj, prop, val)
      }
    }
  }
  definedReact (obj, prop, val) {
    Object.defineProperty(obj, prop, {
      get () {
        
        console.log(`访问了${prop},值为${val}`)
        return val
      },
      set (newVal) {
        if (newVal === val) {
          return;
        }
        if (typeof newVal === 'object') {
          new Observer(newVal, false)
        }
        console.log(`你设置了${prop},新的值为${newVal}`)
        val = newVal
      }
    })
  }
}

class Watcher {
  constructor () {
    this.objCollect = []
  }
  collect (obj) {
    this.objCollect.push(obj)
  }
  notify (target, prop, newVal) {
    this.objCollect.filter((obj) => {
      if (obj === target) {
        obj[prop] = newVal
      }
    })
  }

} 
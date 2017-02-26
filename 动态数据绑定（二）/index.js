const generateEventObj = () => ({
  eventsObj: {},
  on (event, fn) {
    if (!this.eventsObj[event]) {
      this.eventsObj[event] = []
    }
    this.eventsObj[event].push(fn)
  },
  emit () {
    const event = Array.prototype.shift.call(arguments)
    const fns = this.eventsObj[event]

    if (fns && fns.length) {
      for (let fn of fns) {
        fn.apply(this, arguments)
      }
    }
  }
})
const event = generateEventObj()

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
      // 普通对象直接调用
      // 对象递归调用
      if (typeof val === 'object') {
        new Observer(val, false)       
      } else {
        this.defineReactive(obj, prop, val)
      }
    }
  }

  defineReactive (target, prop, val) {
    Object.defineProperty(target, prop, {
      get () {
        console.log(`你访问了${prop}`)
        return val
      },
      set (newVal) {
        if (val === newVal) {
          return;
        }
        if (typeof newVal === 'object') {
          new Observer(newVal, false)
        }
        if (event.eventsObj[prop]) {
          event.emit(prop, newVal)
        }
        console.log(`你设置了${prop},新的值为${newVal}`)
        val = newVal
      }
    })
  }

  $watch (prop, cb) {
    event.on(prop, cb)
  }
}

const app = new Observer({
  name: {
    firstName: 'l',
    lastName: 'y'
  },
  age: 18
})

app.$watch('age', function(age) {
  console.log(`我们老了，现在${age}`)
})
app.$watch('firstName', function(name) {
  console.log(`我的新名字${name}`)
})

app.data.age = 10
app.data.name.firstName = 'haha'

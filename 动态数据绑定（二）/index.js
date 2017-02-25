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

class Observer {
  constructor (obj) {
    this.data = obj
    this.walk(obj)
    this.emitter = generateEventObj()
  }

  walk (obj) {
    for (let prop of Object.keys(obj)) {
      let val = obj[prop]
      if (typeof val === 'object') {
        new Observer(val)
      }
      this.defineReactive(this.data, prop, val)
    }
  }

  defineReactive (target, prop, val) {
    const that = this
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
          new Observer(newVal)
        }
        console.log(`你设置了${prop},新的值为${newVal}`)
        if (that.emitter.eventsObj[prop]) {
          that.emitter.emit(prop, newVal)
        }
        val = newVal
      }
    })
  }

  $watch (prop, cb) {
    this.emitter.on(prop, cb)
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
app.$watch('name', function(name) {
  console.log(`我的新名字${name}`)
})

app.data.age = 10
app.data.name.firstName = 'haha'

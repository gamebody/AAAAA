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

class mulitTree {
  constructor(obj) {
    this.data = obj
    this.rootNode = this.createNode('root')
    this.createTree()
  }

  createNode (propName) {
    return {
      propName,
      childs: [],
      parentNode: null
    }
  }
  createTree () {
    const that = this
    function walkObject (obj, parentNode) {
      for (let prop of Object.keys(obj)) {
        const val = obj[prop]
        const node = that.createNode(prop)
        node.parentNode = parentNode
        parentNode.childs.push(node)
        if (typeof val === 'object') {
          walkObject(val, node)
        }
      }
    }
    walkObject(this.data, this.rootNode)
  }
  findNode (propName) {
    let returnNode = null
    function wlak (parentNode) {
      for (let node of parentNode.childs) {
        if (node.propName === propName) {
          returnNode = node
        } 
        if (node.childs.length !== 0) {
          wlak(node)
        }
      }
    }
    wlak(this.rootNode)
    return returnNode
  }
}

const event = generateEventObj()
let tree = null

class Observer {
  constructor (obj, hasData = true) {
    if (hasData) {
      tree = new mulitTree(obj)
      this.data = obj
      this.walk(this.data)
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
    const that = this
    Object.defineProperty(target, prop, {
      get () {
        return val
      },
      set (newVal) {
        if (val === newVal) {
          return;
        }
        if (typeof newVal === 'object') {
          new Observer(newVal, false)
        }
        let node = tree.findNode(prop)
        if (node) {
          do {
            event.emit(node.propName, newVal)
            node = node.parentNode
          } while (node.parentNode);
        }
        val = newVal
      }
    })
  }

  $watch (prop, cb) {
    event.on(prop, cb)
  }
}

let app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: {
          a: '1',
          b: '2'
        }
    },
    age: 25
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName.a = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
